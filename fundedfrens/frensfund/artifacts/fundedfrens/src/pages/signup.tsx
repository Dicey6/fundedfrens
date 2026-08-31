import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Hash, Gift, ArrowRight, CheckCircle } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username is too long.'),
  referral_code: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref') || '';

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', username: '', referral_code: refCode },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            referral_code: data.referral_code || null,
          },
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Check your inbox" subtitle="One more step to complete your account.">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Confirmation email sent</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
            We sent a verification link to your email. Click it to activate your account and start trading.
          </p>
          <Button
            variant="outline"
            onClick={() => setLocation('/login')}
            className="font-mono uppercase tracking-wider rounded-xl border-border"
          >
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Start trading"
      subtitle="Create your FundedFrens account. No KYC required."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-signup">

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
                    placeholder="alpha_trader"
                    autoComplete="username"
                    {...field}
                    className="font-mono h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    data-testid="input-signup-username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                    className="font-mono h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
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
                <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    {...field}
                    className="font-mono h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    data-testid="input-signup-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referral_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Gift className="w-3 h-3" /> Referral Code <span className="text-muted-foreground/50">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a referral code"
                    autoComplete="off"
                    {...field}
                    className="font-mono h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    data-testid="input-signup-referral"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 font-semibold text-sm rounded-xl"
            data-testid="button-signup-submit"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account…</>
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground/60 font-mono leading-relaxed">
            By signing up you agree to our{' '}
            <a href="/terms" className="underline hover:text-muted-foreground">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-muted-foreground">Privacy Policy</a>.
          </p>
        </form>
      </Form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
