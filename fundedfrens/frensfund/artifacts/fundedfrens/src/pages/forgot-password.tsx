import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

import { AuthLayout } from '@/components/AuthLayout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Password reset link sent to your email.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="System Recovery" subtitle="Reset your access credentials.">
      {isSuccess ? (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-sm text-primary">
              If an account exists for that email, we've sent instructions to reset your password.
            </p>
          </div>
          <Link href="/login" data-testid="link-back-login">
            <Button variant="outline" className="w-full font-mono uppercase tracking-wider flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="trader@example.com" 
                      {...field} 
                      className="bg-input/50 border-input font-mono"
                      data-testid="input-forgot-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col gap-4 mt-2">
              <Button 
                type="submit" 
                className="w-full font-mono uppercase tracking-wider font-semibold" 
                disabled={isLoading}
                data-testid="button-reset"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Recovery Link'}
              </Button>
              <Link href="/login" data-testid="link-back-login-alt">
                <Button variant="ghost" className="w-full font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}
