import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, MailCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

import { AuthLayout } from '@/components/AuthLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const refFromUrl = new URLSearchParams(window.location.search).get('ref')?.toUpperCase() ?? '';

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', referralCode: refFromUrl },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            referred_by_code: data.referralCode?.toUpperCase() || null,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent you a verification link.">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border p-8 rounded-lg text-center shadow-lg"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2">Verification Sent</h3>
          <p className="text-muted-foreground mb-8 text-sm">
            Please click the link sent to your email to verify your identity and activate your account.
          </p>
          <Link href="/login" data-testid="link-back-login">
            <Button variant="outline" className="w-full font-mono uppercase tracking-wider">
              Return to Login
            </Button>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of traders on FundedFrens.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    {...field} 
                    className="bg-input/50 border-input font-mono"
                    data-testid="input-signup-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="bg-input/50 border-input font-mono"
                    data-testid="input-signup-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="bg-input/50 border-input font-mono"
                    data-testid="input-signup-confirm-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                  Referral Code
                  {!refFromUrl && <span className="normal-case font-sans font-normal">(Optional)</span>}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    {refFromUrl && (
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                    )}
                    <Input
                      placeholder="e.g. REF-XXXXXXXX"
                      {...field}
                      readOnly={!!refFromUrl}
                      className={`bg-input/50 border-input font-mono ${refFromUrl ? 'pl-9 text-primary border-primary/40 bg-primary/5 cursor-default select-all' : ''}`}
                      data-testid="input-signup-referral-code"
                    />
                  </div>
                </FormControl>
                {refFromUrl && (
                  <p className="text-xs text-primary/70 mt-1">✓ Referral code applied automatically</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full font-semibold mt-4 group relative overflow-hidden" 
            disabled={isLoading}
            data-testid="button-signup"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="relative z-10">Create Account</span>
            )}
            <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" data-testid="link-login">
              <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer font-medium">Log in</span>
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}
