-- ============================================================
-- FUNDEDFRENS — Phase 4 Database Migration
-- Adds Robinhood Chain payment support alongside existing Solana flow.
-- Run AFTER migration_phase3.sql
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- 1. Add payment network identifier
--    Defaults to 'solana' so all existing orders keep working unchanged.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_network TEXT DEFAULT 'solana'
    CHECK (payment_network IN ('solana', 'robinhood'));

-- 2. Make sol_price_usd and required_sol nullable
--    Robinhood orders will have NULL here; all existing Solana rows already
--    have a value so this does not affect them.
ALTER TABLE public.orders
  ALTER COLUMN sol_price_usd DROP NOT NULL,
  ALTER COLUMN required_sol  DROP NOT NULL;

-- 3. ETH-specific columns (nullable — only populated for Robinhood orders)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS eth_price_usd      DECIMAL(10,4),
  ADD COLUMN IF NOT EXISTS required_eth       DECIMAL(18,8),
  ADD COLUMN IF NOT EXISTS tx_hash            TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS amount_received_eth DECIMAL(18,8);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_network ON public.orders(payment_network);
CREATE INDEX IF NOT EXISTS idx_orders_tx_hash         ON public.orders(tx_hash);

-- ============================================================
-- Done. Existing Solana rows are unaffected.
-- ============================================================
