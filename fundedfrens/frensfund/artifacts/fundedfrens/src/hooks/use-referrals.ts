import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ReferralStats {
  successfulReferrals: number;
  pendingRewards: number;
  creditedRewards: number;
  totalEarnings: number;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  wallet_address: string;
  amount_usd: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function useReferrals() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<ReferralStats>({
    successfulReferrals: 0,
    pendingRewards: 0,
    creditedRewards: 0,
    totalEarnings: 0,
  });
  const [pendingWithdrawal, setPendingWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('reward_usd, status')
        .eq('referrer_id', user.id);

      if (rewards) {
        const credited = rewards.filter(r => r.status === 'credited');
        const pending = rewards.filter(r => r.status === 'pending');
        setStats({
          successfulReferrals: credited.length,
          pendingRewards: pending.reduce((s, r) => s + parseFloat(r.reward_usd), 0),
          creditedRewards: credited.reduce((s, r) => s + parseFloat(r.reward_usd), 0),
          totalEarnings: rewards.reduce((s, r) => s + parseFloat(r.reward_usd), 0),
        });
      }

      // Check for pending withdrawal
      const { data: withdrawal } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setPendingWithdrawal(withdrawal as WithdrawalRequest | null);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const requestWithdrawal = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user || !profile) return { success: false, error: 'Not authenticated' };
    if (stats.creditedRewards <= 0) return { success: false, error: 'No credited rewards available' };

    const walletAddress = profile.payout_wallet;
    if (!walletAddress) return { success: false, error: 'No payout wallet set' };

    if (pendingWithdrawal) return { success: false, error: 'A withdrawal request is already pending' };

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('withdrawal_requests').insert({
        user_id: user.id,
        wallet_address: walletAddress,
        amount_usd: stats.creditedRewards,
        status: 'pending',
      });

      if (error) throw error;
      await fetchStats();
      return { success: true };
    } catch (err: any) {
      console.error('Withdrawal request error:', err);
      return { success: false, error: err.message ?? 'Failed to submit withdrawal request' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { stats, isLoading, isSubmitting, pendingWithdrawal, requestWithdrawal };
}
