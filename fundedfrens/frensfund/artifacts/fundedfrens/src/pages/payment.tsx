import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Order } from '@/lib/supabase';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Clock, ShieldCheck, AlertCircle, Loader2, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage() {
  const { orderId } = useParams();
  const [, setLocation] = useLocation();
  const { user, refreshProfile } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(true);
  const [isManualChecking, setIsManualChecking] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchOrder = async () => {
      if (!user || !orderId) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (mounted) {
          setOrder(data as Order);
          if (data.status !== 'pending_payment') {
            setIsPolling(false);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load order details');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => { mounted = false; };
  }, [user, orderId]);

  useEffect(() => {
    if (!order || order.status !== 'pending_payment') return;

    const calculateTimeLeft = () => {
      const expiresAt = new Date(order.expires_at).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === 0) {
        setIsPolling(false);
        setOrder(prev => prev ? { ...prev, status: 'expired' } : null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.expires_at, order?.status]);

  useEffect(() => {
    if (!orderId || !isPolling || !order || order.status !== 'pending_payment') return;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { orderId }
        });
        
        if (data?.status === 'confirmed') {
          setIsPolling(false);
          await refreshProfile();
          setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
          toast.success('Payment confirmed! Your challenge is now active.');
          setTimeout(() => setLocation('/dashboard'), 3000);
        } else if (data?.status === 'expired') {
          setIsPolling(false);
          setOrder(prev => prev ? { ...prev, status: 'expired' } : null);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [orderId, isPolling, order?.status, refreshProfile, setLocation]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleManualCheck = async () => {
    if (!orderId || !user || isManualChecking) return;
    setIsManualChecking(true);
    try {
      const { data } = await supabase.functions.invoke('verify-payment', { body: { orderId } });
      if (data?.status === 'confirmed') {
        setIsPolling(false);
        await refreshProfile();
        setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
        toast.success('Payment confirmed! Your challenge is now active.');
        setTimeout(() => setLocation('/dashboard'), 3000);
      } else if (data?.status === 'expired') {
        setIsPolling(false);
        setOrder(prev => prev ? { ...prev, status: 'expired' } : null);
        toast.error('Payment window has expired. Please start a new challenge.');
      } else {
        toast.info('Blockchain verification still in progress. Please wait a moment and try again.');
      }
    } catch {
      toast.error('Unable to check payment status. Please try again.');
    } finally {
      setIsManualChecking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="glass rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-destructive mb-6 opacity-80" />
          <h2 className="text-2xl font-display font-bold mb-4">Invoice Not Found</h2>
          <p className="text-muted-foreground font-mono mb-8 max-w-md text-sm">
            The requested invoice could not be located in the registry.
          </p>
          <Button onClick={() => setLocation('/dashboard')} variant="outline" className="font-mono uppercase tracking-wider bg-black/20 border-white/10 hover:bg-white/5">
            Return to Terminal
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isExpired = order.status === 'expired' || (order.status === 'pending_payment' && timeLeft === 0);
  const isConfirmed = order.status === 'confirmed';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass rounded-2xl p-6 relative overflow-hidden">
          {order.status === 'pending_payment' && !isExpired && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none" />
          )}
          {isConfirmed && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] pointer-events-none" />
          )}
          
          <div className="relative z-10">
            <div className="section-label mb-2 text-primary/80">Payment Gateway</div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-display font-bold tracking-tight">Invoice Awaiting</h1>
              {order.status === 'pending_payment' && !isExpired && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                </span>
              )}
              {isConfirmed && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertCircle className="w-3 h-3" /> Expired
                </span>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mt-2">ID: {order.id}</p>
          </div>
          
          {order.status === 'pending_payment' && !isExpired && (
            <div className="flex items-center gap-4 glass bg-black/40 px-6 py-4 rounded-xl relative z-10 border border-amber-500/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 mb-1">Time Remaining</span>
                <div className="font-mono text-3xl font-bold tracking-widest text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Clock className="w-8 h-8 text-amber-500/30 ml-2" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Details Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="md:col-span-2">
            <div className="glass rounded-2xl p-6 h-full flex flex-col">
              <div className="section-label mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Invoice Details</div>
              
              <div className="space-y-6 flex-1">
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Allocation Plan</div>
                  <div className="font-display text-2xl capitalize text-foreground">{order.challenge_plan}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass bg-black/20 p-4 rounded-xl">
                    <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase tracking-widest">USD Base</div>
                    <div className="font-mono text-lg font-bold">${order.purchase_price_usd.toFixed(2)}</div>
                  </div>
                  <div className="glass bg-black/20 p-4 rounded-xl">
                    <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase tracking-widest">Oracle Rate</div>
                    <div className="font-mono text-lg font-bold">${order.sol_price_usd.toFixed(2)}</div>
                  </div>
                </div>

                <div className="glass glass-primary bg-primary/5 p-5 rounded-xl border border-primary/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3 relative z-10">Exact Amount Required</div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="font-mono text-3xl font-bold text-foreground drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]">{order.required_sol} SOL</div>
                    {order.status === 'pending_payment' && !isExpired && (
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(order.required_sol.toString(), 'Amount')} className="hover:bg-primary/20 hover:text-primary h-10 w-10 bg-black/20 border border-white/5">
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Expecting Transfer From</div>
                  <div className="font-mono text-xs break-all glass bg-black/40 p-3 rounded-lg text-muted-foreground border-white/[0.03]">
                    {order.user_wallet}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }} className="md:col-span-3">
            <AnimatePresence mode="wait">
              {isConfirmed ? (
                <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                  <div className="glass bg-emerald-500/5 border-emerald-500/30 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
                    <CheckCircle2 className="w-24 h-24 text-emerald-400 mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <h3 className="font-display text-3xl font-bold mb-4 text-emerald-50">Transaction Verified</h3>
                    <p className="font-mono text-sm text-emerald-500/70 mb-10 max-w-sm leading-relaxed">
                      Payment detected on-chain. Your evaluation environment is being provisioned. Redirecting sequence initiated.
                    </p>
                    <Button onClick={() => setLocation('/dashboard')} className="font-mono uppercase tracking-wider w-full max-w-xs h-12 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      Enter Terminal <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : isExpired ? (
                <motion.div key="expired" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                  <div className="glass bg-red-500/5 border-red-500/20 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                    <AlertCircle className="w-20 h-20 text-red-500/50 mb-6" />
                    <h3 className="font-display text-2xl font-bold mb-4">Session Timeout</h3>
                    <p className="font-mono text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
                      The active payment window has elapsed. The exchange rate is no longer guaranteed. Please generate a new invoice.
                    </p>
                    <Button onClick={() => setLocation('/challenge')} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono uppercase tracking-wider w-full max-w-xs h-12">
                      Initialize New Run
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                  <div className="glass glass-primary rounded-2xl h-full flex flex-col p-8">
                    <div className="section-label mb-8">Execution Protocol</div>
                    
                    <ol className="space-y-8 font-mono text-sm mb-auto">
                      <li className="flex gap-5 group">
                        <div className="w-8 h-8 rounded-full glass bg-primary/10 border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.1)] group-hover:scale-110 transition-transform">1</div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-3">Copy Exact Payload Amount</p>
                          <Button variant="outline" onClick={() => handleCopy(order.required_sol.toString(), 'Amount')} className="font-mono text-sm w-full justify-between h-14 bg-black/40 border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <span className="font-bold text-foreground">{order.required_sol} SOL</span>
                            <div className="flex items-center gap-2 text-muted-foreground"><span className="text-[10px] uppercase">Copy</span> <Copy className="w-4 h-4 text-primary" /></div>
                          </Button>
                        </div>
                      </li>
                      
                      <li className="flex gap-5 group">
                        <div className="w-8 h-8 rounded-full glass bg-primary/10 border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.1)] group-hover:scale-110 transition-transform">2</div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-3">Transmit to Treasury Address</p>
                          <div className="flex items-center glass bg-black/40 border-white/10 rounded-lg overflow-hidden h-14 transition-all hover:border-primary/50 group-hover:bg-primary/5">
                            <div className="px-4 py-2 font-mono text-sm truncate flex-1 text-muted-foreground group-hover:text-foreground transition-colors">
                              {order.treasury_wallet}
                            </div>
                            <Button 
                              variant="ghost" 
                              className="rounded-none h-full px-6 border-l border-white/10 hover:bg-primary hover:text-primary-foreground shrink-0 transition-colors"
                              onClick={() => handleCopy(order.treasury_wallet, 'Treasury wallet address')}
                              data-testid="button-copy-treasury"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                      
                      <li className="flex gap-5 group">
                        <div className="w-8 h-8 rounded-full glass bg-primary/10 border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.1)] group-hover:scale-110 transition-transform">3</div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-foreground uppercase tracking-widest text-[10px] mb-2">Maintain Connection</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">The system continuously polls the Solana mempool. Payment verification typically resolves within 15-30 seconds. Do not close this terminal.</p>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-10 space-y-3">
                      <div className="p-5 glass bg-black/40 border-primary/20 rounded-xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        <div className="relative z-10 p-2 glass rounded-full bg-primary/10 border-primary/30">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        </div>
                        <div className="relative z-10 flex-1">
                          <p className="font-mono text-sm font-bold text-foreground">Listening for network events...</p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-primary/70 mt-1">Polling mempool / Confirming blocks</p>
                        </div>
                      </div>

                      <Button
                        onClick={handleManualCheck}
                        disabled={isManualChecking}
                        className="w-full h-12 font-mono uppercase tracking-wider text-sm font-semibold"
                        variant="outline"
                      >
                        {isManualChecking ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Checking blockchain...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            I've Made the Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}