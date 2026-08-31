-- ============================================================
-- FUNDEDFRENS — Phase 2 Database Migration
-- Run AFTER migration.sql (Phase 1)
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- 1. Add referred_by_code to profiles (optional, stores referrer's code at signup)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- 2. Update handle_new_user trigger to capture referral code from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_referral_code TEXT;
  new_telegram_code TEXT;
  code_exists BOOLEAN;
  ref_code TEXT;
BEGIN
  -- Generate unique referral code
  LOOP
    new_referral_code := 'REF-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_referral_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;

  -- Generate unique Telegram link code
  LOOP
    new_telegram_code := 'TG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE telegram_link_code = new_telegram_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;

  -- Extract referral code from signup metadata if provided
  ref_code := NEW.raw_user_meta_data->>'referred_by_code';

  -- Insert new profile
  INSERT INTO public.profiles (id, referral_code, telegram_link_code, referred_by_code)
  VALUES (NEW.id, new_referral_code, new_telegram_code, ref_code);

  -- Create welcome notification
  INSERT INTO public.notifications (user_id, type, message)
  VALUES (NEW.id, 'welcome', 'Welcome to FundedFrens! Your account has been created successfully.');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_plan TEXT NOT NULL CHECK (challenge_plan IN ('starter', 'advanced', 'professional')),
  purchase_price_usd DECIMAL(10,2) NOT NULL,
  sol_price_usd DECIMAL(10,4) NOT NULL,
  required_sol DECIMAL(12,6) NOT NULL,
  treasury_wallet TEXT NOT NULL,
  user_wallet TEXT NOT NULL,
  status TEXT DEFAULT 'pending_payment' NOT NULL
    CHECK (status IN ('pending_payment', 'confirmed', 'expired', 'failed')),
  tx_signature TEXT UNIQUE,
  amount_received_sol DECIMAL(12,6),
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Challenges table (demo challenge instances)
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  challenge_plan TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL
    CHECK (status IN ('active', 'passed', 'failed', 'approved')),
  evaluation_period_days INTEGER DEFAULT 21 NOT NULL,
  trading_days INTEGER DEFAULT 0 NOT NULL,
  win_rate DECIMAL(5,2) DEFAULT 0 NOT NULL,
  drawdown DECIMAL(5,2) DEFAULT 0 NOT NULL,
  open_positions INTEGER DEFAULT 0 NOT NULL,
  challenge_progress DECIMAL(5,2) DEFAULT 0 NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Referral rewards table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  reward_usd DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'credited')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(referred_id) -- Only one referral reward per referred user (first purchase only)
);

-- 6. challenges updated_at trigger
DROP TRIGGER IF EXISTS challenges_updated_at ON public.challenges;
CREATE TRIGGER challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 7. Enable RLS on new tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies — orders
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- 9. RLS policies — challenges
DROP POLICY IF EXISTS "Users can view own challenges" ON public.challenges;
CREATE POLICY "Users can view own challenges"
  ON public.challenges FOR SELECT
  USING (auth.uid() = user_id);

-- 10. RLS policies — referral_rewards
DROP POLICY IF EXISTS "Users can view own referral rewards" ON public.referral_rewards;
CREATE POLICY "Users can view own referral rewards"
  ON public.referral_rewards FOR SELECT
  USING (auth.uid() = referrer_id);

-- 11. Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON public.orders(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_tx_signature ON public.orders(tx_signature);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_id ON public.referral_rewards(referrer_id);

-- ============================================================
-- Done. Phase 2 tables, triggers, RLS policies, and indexes set.
-- ============================================================
