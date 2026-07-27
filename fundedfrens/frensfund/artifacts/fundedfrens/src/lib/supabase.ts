import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Treasury Wallets ─────────────────────────────────────────────────────────
// Set VITE_TREASURY_WALLETS as a comma-separated list in your .env / Vercel environment variables
// e.g. VITE_TREASURY_WALLETS=wallet1,wallet2,wallet3
const _walletList = (import.meta.env.VITE_TREASURY_WALLETS as string | undefined)
  ?.split(',')
  .map(w => w.trim())
  .filter(Boolean) ?? [];

/** Pick a random treasury wallet for a new order. Never changes after order creation. */
export function pickTreasuryWallet(): string {
  if (_walletList.length === 0) return 'TREASURY_WALLET_NOT_CONFIGURED';
  return _walletList[Math.floor(Math.random() * _walletList.length)];
}

// ── Robinhood Chain Treasury Wallets ─────────────────────────────────────────
// Set VITE_RH_TREASURY_WALLETS as a comma-separated list of EVM addresses
// e.g. VITE_RH_TREASURY_WALLETS=0xWallet1,0xWallet2,0xWallet3
const _rhWalletList = (import.meta.env.VITE_RH_TREASURY_WALLETS as string | undefined)
  ?.split(',')
  .map(w => w.trim())
  .filter(Boolean) ?? [];

/** Pick a random Robinhood Chain treasury wallet for a new order. Never changes after order creation. */
export function pickRobinhoodTreasuryWallet(): string {
  if (_rhWalletList.length === 0) return 'RH_TREASURY_WALLET_NOT_CONFIGURED';
  return _rhWalletList[Math.floor(Math.random() * _rhWalletList.length)];
}

// ── Challenge Plans (hardcoded — not stored in DB) ──────────────────────────
export interface ChallengePlan {
  id: 'starter' | 'advanced' | 'professional';
  name: string;
  purchasePriceUsd: number;
  fundedValueUsd: number;
}

export const CHALLENGE_PLANS: ChallengePlan[] = [
  { id: 'starter',      name: 'Starter',      purchasePriceUsd: 15,  fundedValueUsd: 350   },
  { id: 'advanced',     name: 'Advanced',     purchasePriceUsd: 25,  fundedValueUsd: 1100  },
  { id: 'professional', name: 'Professional', purchasePriceUsd: 50,  fundedValueUsd: 3500  },
];

// ── Database Types ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string | null;
  payout_wallet: string | null;
  referral_code: string;
  telegram_link_code: string;
  telegram_id: string | null;
  telegram_linked: boolean;
  reliability_rating: number;
  challenge_status: 'none' | 'active' | 'passed' | 'failed' | 'approved';
  active_challenge_id: string | null;
  referred_by_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  challenge_plan: 'starter' | 'advanced' | 'professional';
  purchase_price_usd: number;
  payment_network: 'solana' | 'robinhood';
  // Solana-specific (null for Robinhood orders)
  sol_price_usd: number | null;
  required_sol: number | null;
  tx_signature: string | null;
  amount_received_sol: number | null;
  // Robinhood Chain-specific (null for Solana orders)
  eth_price_usd: number | null;
  required_eth: number | null;
  tx_hash: string | null;
  amount_received_eth: number | null;
  // Shared
  treasury_wallet: string;
  user_wallet: string;
  status: 'pending_payment' | 'confirmed' | 'expired' | 'failed';
  confirmed_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  order_id: string | null;
  challenge_plan: 'starter' | 'advanced' | 'professional';
  status: 'active' | 'passed' | 'failed' | 'approved';
  evaluation_period_days: number;
  trading_days: number;
  win_rate: number;
  drawdown: number;
  open_positions: number;
  challenge_progress: number;
  started_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_id: string;
  order_id: string;
  reward_usd: number;
  status: 'pending' | 'credited';
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Fetch live SOL/USD price from CoinGecko public API */
export async function fetchSolPrice(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { headers: { Accept: 'application/json' } }
    );
    const data = await res.json();
    return data?.solana?.usd ?? 0;
  } catch {
    return 0;
  }
}

/** Fetch live ETH/USD price from CoinGecko public API */
export async function fetchEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { headers: { Accept: 'application/json' } }
    );
    const data = await res.json();
    return data?.ethereum?.usd ?? 0;
  } catch {
    return 0;
  }
}

/** Calculate SOL amount needed to cover a USD price at a given SOL/USD rate */
export function usdToSol(usdAmount: number, solPriceUsd: number): number {
  if (!solPriceUsd) return 0;
  return parseFloat((usdAmount / solPriceUsd).toFixed(6));
}

/** Calculate ETH amount needed to cover a USD price at a given ETH/USD rate */
export function usdToEth(usdAmount: number, ethPriceUsd: number): number {
  if (!ethPriceUsd) return 0;
  return parseFloat((usdAmount / ethPriceUsd).toFixed(6));
}
