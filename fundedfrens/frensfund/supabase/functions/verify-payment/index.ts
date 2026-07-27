import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RPC = Deno.env.get('SOLANA_RPC_URL') ?? 'https://api.mainnet-beta.solana.com'
const LAMPORTS = 1_000_000_000
const TOLERANCE = 0.005
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

// ── Robinhood Chain (EVM) helpers ─────────────────────────────────────────────
async function evmRpc(rpcUrl: string, method: string, params: unknown[]) {
  const r = await fetch(rpcUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
  const d = await r.json()
  if (d.error) throw new Error(JSON.stringify(d.error))
  return d.result
}

async function findEthTx(rpcUrl: string, sender: string, receiver: string, expectedEth: number, fromTs: number, toTs: number, usedHashes: string[]) {
  const currentBlockHex: string = await evmRpc(rpcUrl, 'eth_blockNumber', [])
  const currentBlock = parseInt(currentBlockHex, 16)
  // Robinhood Chain (Arbitrum Orbit) ~0.25 s blocks; 10 000 blocks ≈ 41 min — covers 30-min window
  const fromBlockHex = '0x' + Math.max(0, currentBlock - 10_000).toString(16)
  const result = await evmRpc(rpcUrl, 'alchemy_getAssetTransfers', [{ fromBlock: fromBlockHex, toBlock: 'latest', fromAddress: sender, toAddress: receiver, category: ['external'], withMetadata: true, maxCount: '0x32' }])
  for (const t of (result?.transfers ?? [])) {
    if (usedHashes.includes(t.hash)) continue
    if (t.metadata?.blockTimestamp) {
      const bt = new Date(t.metadata.blockTimestamp).getTime()
      if (bt < fromTs || bt > toTs) continue
    }
    const value = parseFloat(t.value ?? '0')
    if (value >= expectedEth * (1 - TOLERANCE)) return { hash: t.hash, amountEth: value }
  }
  return null
}

async function rpc(method: string, params: unknown[]) {
  const r = await fetch(RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
  const d = await r.json()
  if (d.error) throw new Error(JSON.stringify(d.error))
  return d.result
}

async function findTx(sender: string, receiver: string, expectedSol: number, from: number, to: number, used: string[]) {
  const sigs = await rpc('getSignaturesForAddress', [sender, { limit: 30 }])
  if (!sigs?.length) return null
  for (const s of sigs) {
    if (used.includes(s.signature)) continue
    const t = (s.blockTime ?? 0) * 1000
    if (t < from || t > to) continue
    let tx: any
    try { tx = await rpc('getTransaction', [s.signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]) } catch { continue }
    if (!tx) continue
    const keys: string[] = (tx.transaction?.message?.accountKeys ?? []).map((k: any) => typeof k === 'string' ? k : k.pubkey)
    const ri = keys.indexOf(receiver)
    const si = keys.indexOf(sender)
    if (ri === -1 || si === -1) continue
    const pre: number[] = tx.meta?.preBalances ?? []
    const post: number[] = tx.meta?.postBalances ?? []
    const received = (post[ri] - pre[ri]) / LAMPORTS
    if (received >= expectedSol * (1 - TOLERANCE)) return { signature: s.signature, amountSol: received }
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { orderId } = await req.json()
    if (!orderId) return json({ error: 'orderId required' }, 400)

    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: order, error: oErr } = await sb.from('orders').select('*').eq('id', orderId).single()
    if (oErr || !order) return json({ error: 'Order not found' }, 404)
    if (order.status === 'confirmed') return json({ status: 'confirmed' })

    const now = Date.now()
    const expires = new Date(order.expires_at).getTime()

    if (now > expires && order.status === 'pending_payment') {
      await sb.from('orders').update({ status: 'expired' }).eq('id', orderId)
      return json({ status: 'expired' })
    }
    if (order.status !== 'pending_payment') return json({ status: order.status })

    // ── Route: Robinhood Chain ─────────────────────────────────────────────────
    if (order.payment_network === 'robinhood') {
      const rpcUrl = Deno.env.get('ROBINHOOD_RPC_URL')
      if (!rpcUrl) return json({ error: 'ROBINHOOD_RPC_URL not configured' }, 500)
      const { data: usedHashRows } = await sb.from('orders').select('tx_hash').not('tx_hash', 'is', null)
      const usedHashes: string[] = (usedHashRows ?? []).map((r: any) => r.tx_hash).filter(Boolean)
      const ethMatch = await findEthTx(rpcUrl, order.user_wallet, order.treasury_wallet, parseFloat(order.required_eth), new Date(order.created_at).getTime(), expires, usedHashes)
      if (!ethMatch) return json({ status: 'pending_payment' })
      await sb.from('orders').update({ status: 'confirmed', tx_hash: ethMatch.hash, amount_received_eth: ethMatch.amountEth, confirmed_at: new Date().toISOString() }).eq('id', orderId)
      const endsAt = new Date(Date.now() + 21 * 86_400_000).toISOString()
      const { data: rhChallenge } = await sb.from('challenges').insert({ user_id: order.user_id, order_id: orderId, challenge_plan: order.challenge_plan, status: 'active', evaluation_period_days: 21, ends_at: endsAt }).select().single()
      await sb.from('profiles').update({ challenge_status: 'active', active_challenge_id: rhChallenge?.id ?? null, payout_wallet: order.user_wallet }).eq('id', order.user_id)
      await sb.from('notifications').insert({ user_id: order.user_id, type: 'challenge_activated', message: `Your ${order.challenge_plan} challenge is now active! You have 21 days to prove your edge.` })
      const { data: rhExistingReward } = await sb.from('referral_rewards').select('id').eq('referred_id', order.user_id).maybeSingle()
      if (!rhExistingReward) {
        const { data: rhProfile } = await sb.from('profiles').select('referred_by_code').eq('id', order.user_id).single()
        if (rhProfile?.referred_by_code) {
          const { data: rhReferrer } = await sb.from('profiles').select('id').eq('referral_code', rhProfile.referred_by_code).neq('id', order.user_id).maybeSingle()
          if (rhReferrer) {
            const reward = parseFloat(order.purchase_price_usd) * 0.1
            await sb.from('referral_rewards').insert({ referrer_id: rhReferrer.id, referred_id: order.user_id, order_id: orderId, reward_usd: reward, status: 'credited' })
            await sb.from('notifications').insert({ user_id: rhReferrer.id, type: 'referral_earned', message: `You earned a $${reward.toFixed(2)} referral reward!` })
          }
        }
      }
      return json({ status: 'confirmed', challengeId: rhChallenge?.id })
    }
    // ── End Robinhood Route ────────────────────────────────────────────────────

    const { data: usedRows } = await sb.from('orders').select('tx_signature').not('tx_signature', 'is', null)
    const used: string[] = (usedRows ?? []).map((r: any) => r.tx_signature).filter(Boolean)

    const match = await findTx(order.user_wallet, order.treasury_wallet, parseFloat(order.required_sol), new Date(order.created_at).getTime(), expires, used)
    if (!match) return json({ status: 'pending_payment' })

    const confirmedAt = new Date().toISOString()
    await sb.from('orders').update({ status: 'confirmed', tx_signature: match.signature, amount_received_sol: match.amountSol, confirmed_at: confirmedAt }).eq('id', orderId)

    const endsAt = new Date(Date.now() + 21 * 86400000).toISOString()
    const { data: challenge } = await sb.from('challenges').insert({ user_id: order.user_id, order_id: orderId, challenge_plan: order.challenge_plan, status: 'active', evaluation_period_days: 21, ends_at: endsAt }).select().single()

    await sb.from('profiles').update({ challenge_status: 'active', active_challenge_id: challenge?.id ?? null, payout_wallet: order.user_wallet }).eq('id', order.user_id)
    await sb.from('notifications').insert({ user_id: order.user_id, type: 'challenge_activated', message: `Your ${order.challenge_plan} challenge is now active! You have 21 days to prove your edge.` })

    const { data: existingReward } = await sb.from('referral_rewards').select('id').eq('referred_id', order.user_id).maybeSingle()
    if (!existingReward) {
      const { data: profile } = await sb.from('profiles').select('referred_by_code').eq('id', order.user_id).single()
      if (profile?.referred_by_code) {
        const { data: referrer } = await sb.from('profiles').select('id').eq('referral_code', profile.referred_by_code).neq('id', order.user_id).maybeSingle()
        if (referrer) {
          const reward = parseFloat(order.purchase_price_usd) * 0.1
          await sb.from('referral_rewards').insert({ referrer_id: referrer.id, referred_id: order.user_id, order_id: orderId, reward_usd: reward, status: 'credited' })
          await sb.from('notifications').insert({ user_id: referrer.id, type: 'referral_earned', message: `You earned a $${reward.toFixed(2)} referral reward!` })
        }
      }
    }

    return json({ status: 'confirmed', challengeId: challenge?.id })
  } catch (err) {
    console.error('verify-payment error:', err)
    return json({ error: 'Internal server error' }, 500)
  }
})
