import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  User, Wallet, Mail, Hash, ShieldCheck,
  Smartphone, Loader2, Key, History, CheckCircle2, XCircle
} from 'lucide-react';
import { format } from 'date-fns';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username too long.'),
  payout_wallet: z.string().optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      payout_wallet: profile?.payout_wallet || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        payout_wallet: profile.payout_wallet || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          payout_wallet: data.payout_wallet || null,
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account details and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Identity Form */}
          <motion.div variants={item} className="md:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base">Identity</h2>
                  <p className="text-xs text-muted-foreground">Update your handle and payout destination</p>
                </div>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Hash className="w-3 h-3" /> Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="trader_alpha"
                              {...field}
                              className="font-mono bg-foreground/[0.02] border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl h-11"
                              data-testid="input-profile-username"
                            />
                          </FormControl>
                          <p className="text-[10px] font-mono text-muted-foreground">This name appears on leaderboards and certificates.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payout_wallet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Wallet className="w-3 h-3" /> Payout Wallet (ERC-20 / SOL)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0x... or Sol address"
                              {...field}
                              className="font-mono bg-foreground/[0.02] border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl h-11"
                              data-testid="input-profile-wallet"
                            />
                          </FormControl>
                          <p className="text-[10px] font-mono text-muted-foreground">Ensure this is a non-custodial wallet you control. Exchanges may reject smart contract transfers.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isUpdating || !form.formState.isDirty}
                        className="font-mono uppercase tracking-wider min-w-[140px] rounded-xl"
                        data-testid="button-save-profile"
                      >
                        {isUpdating ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</>
                        ) : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Security card */}
            <motion.div variants={item}>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-sm font-semibold">Security</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <div className="font-mono text-sm truncate bg-foreground/[0.03] border border-border p-2.5 rounded-lg">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                      <Key className="w-3 h-3" /> Account ID
                    </label>
                    <div className="font-mono text-[10px] text-muted-foreground truncate bg-foreground/[0.03] border border-border p-2.5 rounded-lg">
                      {profile?.id}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                      <History className="w-3 h-3" /> Joined
                    </label>
                    <div className="font-mono text-sm text-foreground bg-foreground/[0.03] border border-border p-2.5 rounded-lg">
                      {profile?.created_at ? format(new Date(profile.created_at), 'MMM dd, yyyy') : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status card */}
            <motion.div variants={item}>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-display text-sm font-semibold">Connections</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Telegram</p>
                    </div>
                    {profile?.telegram_linked ? (
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono uppercase tracking-wider">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground/60">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono uppercase tracking-wider">Offline</span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Reliability</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-foreground/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, profile?.reliability_rating ?? 0)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-sm">{profile?.reliability_rating ?? 0}<span className="text-muted-foreground text-xs">/100</span></span>
                    </div>
                  </div>

                  {profile?.challenge_status && profile.challenge_status !== 'none' && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Challenge</p>
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          profile.challenge_status === 'active' ? 'text-primary' :
                          profile.challenge_status === 'approved' ? 'text-emerald-500' :
                          profile.challenge_status === 'failed' ? 'text-red-400' : 'text-muted-foreground'
                        }`}>
                          {profile.challenge_status.replace('_', ' ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
