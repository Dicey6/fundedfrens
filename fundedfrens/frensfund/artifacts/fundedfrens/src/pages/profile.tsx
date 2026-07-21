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
  Smartphone, Loader2, Key, History
} from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username too long.'),
  payout_wallet: z.string().optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

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

  // Update form if profile loads later
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
      toast.success('Configuration updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Manage identity, payout routes, and security parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Identity Form (Left) */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-sidebar/50">
                <CardTitle className="font-display flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-primary" /> Identity Parameters
                </CardTitle>
                <CardDescription className="font-mono text-xs">Update your public handle and payout destination.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Hash className="w-3 h-3" /> Operator Handle
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="trader_alpha" 
                              {...field} 
                              className="font-mono bg-background border-input"
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
                            <Wallet className="w-3 h-3" /> Payout Destination (ERC-20 / SOL)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0x..." 
                              {...field} 
                              className="font-mono bg-background border-input"
                              data-testid="input-profile-wallet"
                            />
                          </FormControl>
                          <p className="text-[10px] font-mono text-muted-foreground">Ensure this is a non-custodial wallet you control. Exchanges may reject smart contract transfers.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isUpdating || !form.formState.isDirty}
                        className="font-mono uppercase tracking-wider min-w-[150px]"
                        data-testid="button-save-profile"
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Read-only Specs (Right) */}
          <div className="space-y-6 md:col-span-1">
            <motion.div variants={itemVariants}>
              <Card className="border-border bg-sidebar/50">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Security Clearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                      <Mail className="w-3 h-3" /> Registered Email
                    </label>
                    <div className="font-mono text-sm truncate bg-background p-2 rounded border border-border">
                      {user?.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                      <Key className="w-3 h-3" /> System ID
                    </label>
                    <div className="font-mono text-xs text-muted-foreground truncate bg-background p-2 rounded border border-border">
                      {profile?.id}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                      <History className="w-3 h-3" /> Account Initialization
                    </label>
                    <div className="font-mono text-sm text-foreground bg-background p-2 rounded border border-border">
                      {profile?.created_at ? format(new Date(profile.created_at), 'MMMM dd, yyyy HH:mm') : '—'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border bg-sidebar/50">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-accent" /> Telemetry Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-muted-foreground uppercase">Telegram Link</span>
                    {profile?.telegram_linked ? (
                      <Badge variant="outline" className="border-primary text-primary font-mono text-[10px]">Connected</Badge>
                    ) : (
                      <Badge variant="outline" className="border-destructive text-destructive font-mono text-[10px]">Offline</Badge>
                    )}
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-muted-foreground uppercase">Reliability</span>
                    <span className="font-mono font-bold">{profile?.reliability_rating}/100</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </DashboardLayout>
  );
}
