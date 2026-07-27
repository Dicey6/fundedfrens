import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TOLERANCE = 0.005 // 0.5 % — same as Solana verifier
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })

// ── EVM JSON-RPC helper ────────────────────────────────────────────────────────
async function rpc(rpcUrl: string, method: string, params: unknown[]) {
  const r = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const d = await r.json()
  if (d.error) throw new Error(JSON.stringify(d.error))
  return d.result
}

// ── Find a matching ETH transfer using Alchemy's asset-transfer API ───────────
// Robinhood Chain (Arbitrum Orbit) has ~0.25 s block times.
// 10 000 blocks ≈ 41 minutes — safely covers the 30-minute payment window.
async function findEthTx(
  rpcUrl: string,
  sender: string,
  receiver: string,
  expectedEth: number,
  fromTimestamp: number,
  toTimestamp: number,
  usedHashes: string[],
): Promise<{ hash: string; amountEth: number } | null> {
  const currentBlockHex: string = await rpc(rpcUrl, 'eth_blockNumber', [])
  const currentBlock = parseInt(currentBlockHex, 16)
  const fromBlock = Math.max(0, currentBlock - 10_000)
  const fromBlockHex = '0x' + fromBlock.toString(16)

  const result = await rpc(rpcUrl, 'alchemy_getAssetTransfers', [
    {
      fromBlock: fromBlockHex,
      toBlock: 'latest',
      fromAddress: sender,   // sender's wallet (user-declared)
      toAddress: receiver,   // treasury wallet
      category: ['external'],
      withMetadata: true,
      maxCount: '0x32',      // up to 50 transfers
    },
  ])

  const transfers: any[] = result?.transfers ?? []

  for (const t of transfers) {
    if (usedHashes.includes(t.hash)) continue

    // Validate block timestamp falls within the order's payment window
    if (t.metadata?.blockTimestamp) {
      const blockTime = new Date(t.metadata.blockTimestamp).getTime()
      if (blockTime < fromTimestamp || blockTime > toTimestamp) continue
    }

    const value = parseFloat(t.value ?? '0')
    if (value >= expectedEth * (1 - TOLERANCE)) {
      return { hash: t.hash, amountEth: value }
    }
  }

  return null
}

// ── Main handler ───────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { orderId } = await req.json()
    if (!orderId) return json({ error: 'orderId required' }, 400)

    const rpcUrl = Deno.env.get('ROBINHOOD_RPC_URL')
    if (!rpcUrl) return json({ error: 'ROBINHOOD_RPC_URL not configured' }, 500)

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: order, error: oErr } = await sb
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (oErr || !order) return json({ error: 'Order not found' }, 404)

    if (order.payment_network !== 'robinhood')
      return json({ error: 'Not a Robinhood Chain order' }, 400)

    if (order.status === 'confirmed') return json({ status: 'confirmed' })

    const now = Date.now()
    const expires = new Date(order.expires_at).getTime()

    if (now > expires && order.status === 'pending_payment') {
      await sb.from('orders').update({ status: 'expired' }).eq('id', orderId)
      return json({ status: 'expired' })
    }
    if (order.status !== 'pending_payment') return json({ status: order.status })

    // Collect all used tx hashes for replay protection
    const { data: usedRows } = await sb
      .from('orders')
      .select('tx_hash')
      .not('tx_hash', 'is', null)
    const usedHashes: string[] = (usedRows ?? [])
      .map((r: any) => r.tx_hash)
      .filter(Boolean)

    const match = await findEthTx(
      rpcUrl,
      order.user_wallet,
      order.treasury_wallet,
      parseFloat(order.required_eth),
      new Date(order.created_at).getTime(),
      expires,
      usedHashes,
    )

    if (!match) return json({ status: 'pending_payment' })

    // ── Confirm order ──────────────────────────────────────────────────────────
    const confirmedAt = new Date().toISOString()
    await sb
      .from('orders')
      .update({
        status: 'confirmed',
        tx_hash: match.hash,
        amount_received_eth: match.amountEth,
        confirmed_at: confirmedAt,
      })
      .eq('id', orderId)

    // ── Activate challenge (21-day evaluation) ────────────────────────────────
    const endsAt = new Date(Date.now() + 21 * 86_400_000).toISOString()
    const { data: challenge } = await sb
      .from('challenges')
      .insert({
        user_id: order.user_id,
        order_id: orderId,
        challenge_plan: order.challenge_plan,
        status: 'active',
        evaluation_period_days: 21,
        ends_at: endsAt,
      })
      .select()
      .single()

    await sb
      .from('profiles')
      .update({
        challenge_status: 'active',
        active_challenge_id: challenge?.id ?? null,
        payout_wallet: order.user_wallet,
      })
      .eq('id', order.user_id)

    await sb.from('notifications').insert({
      user_id: order.user_id,
      type: 'challenge_activated',
      message: `Your ${order.challenge_plan} challenge is now active! You have 21 days to prove your edge.`,
    })

    // ── Referral reward (identical logic to Solana verifier) ──────────────────
    const { data: existingReward } = await sb
      .from('referral_rewards')
      .select('id')
      .eq('referred_id', order.user_id)
      .maybeSingle()

    if (!existingReward) {
      const { data: profile } = await sb
        .from('profiles')
        .select('referred_by_code')
        .eq('id', order.user_id)
        .single()

      if (profile?.referred_by_code) {
        const { data: referrer } = await sb
          .from('profiles')
          .select('id')
          .eq('referral_code', profile.referred_by_code)
          .neq('id', order.user_id)
          .maybeSingle()

        if (referrer) {
          const reward = parseFloat(order.purchase_price_usd) * 0.1
          await sb.from('referral_rewards').insert({
            referrer_id: referrer.id,
            referred_id: order.user_id,
            order_id: orderId,
            reward_usd: reward,
            status: 'credited',
          })
          await sb.from('notifications').insert({
            user_id: referrer.id,
            type: 'referral_earned',
            message: `You earned a $${reward.toFixed(2)} referral reward!`,
          })
        }
      }
    }

    return json({ status: 'confirmed', challengeId: challenge?.id })
  } catch (err) {
    console.error('verify-robinhood error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})
