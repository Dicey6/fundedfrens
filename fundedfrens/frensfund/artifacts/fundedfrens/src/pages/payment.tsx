import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const verifyingRef = useRef(false);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stableRefreshProfile = useRef(refreshProfile);
  useEffect(() => { stableRefreshProfile.current = refreshProfile; }, [refreshProfile]);
  const stableSetLocation = useRef(setLocation);
  useEffect(() => { stableSetLocation.current = setLocation; }, [setLocation]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchOrder = async () => {
      if (!user || !orderId) return;
      try {
        const { data, error } = await supabase
          .from('orders').select('*').eq('id', orderId).eq('user_id', user.id).single();
        if (error) throw error;
        if (mounted) {
          setOrder(data as Order);
          if (data.status !== 'pending_payment') setIsPolling(false);
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
      return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 0) {
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
      if (verifyingRef.current) return;
      verifyingRef.current = true;
      try {
        const { data } = await supabase.functions.invoke('verify-payment', { body: { orderId } });
        if (data?.status === 'confirmed') {
          setIsPolling(false);
          await stableRefreshProfile.current();
          setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
          toast.success('Payment confirmed! Your challenge is now active.');
          redirectTimerRef.current = setTimeout(() => stableSetLocation.current('/dashboard'), 3000);
        } else if (data?.status === 'expired') {
          setIsPolling(false);
          setOrder(prev => prev ? { ...prev, status: 'expired' } : null);
        }
      } catch (err) {
        console.error('Polling error:', err);
      } finally {
        verifyingRef.current = false;
      }
    };
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isPolling, order?.status]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleManualCheck = useCallback(async () => {
    if (!orderId || !user || verifyingRef.current) return;
    verifyingRef.current = true;
    setIsManualChecking(true);
    try {
      const { data } = await supabase.functions.invoke('verify-payment', { body: { orderId } });
      if (data?.status === 'confirmed') {
        setIsPolling(false);
        await stableRefreshProfile.current();
        setOrder(prev => prev ? { ...prev, status: 'confirmed' } : null);
        toast.success('Payment confirmed! Your challenge is now active.');
        redirectTimerRef.current = setTimeout(() => stableSetLocation.current('/dashboard'), 3000);
      } else if (data?.status === 'expired') {
        setIsPolling(false);
        setOrder(prev => prev ? { ...prev, status: 'expired' } : null);
        toast.error('Payment window has expired. Please start a new challenge.');
      } else {
        toast.info('Blockchain verification in progress. Please wait a moment and try again.');
      }
    } catch {
      toast.error('Unable to check payment status. Please try again.');
    } finally {
      verifyingRef.current = false;
      setIsManualChecking(false);
    }
  }, [orderId, user]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-40" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-destructive/70" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Invoice Not Found</h2>
          <p className="text-muted-foreground font-mono mb-8 max-w-md text-sm">
            The requested invoice could not be located.
          </p>
          <Button onClick={() => setLocation('/dashboard')} variant="outline" className="font-mono uppercase tracking-wider rounded-xl">
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isExpired = order.status === 'expired' || (order.status === 'pending_payment' && timeLeft === 0);
  const isConfirmed = order.status === 'confirmed';
  const isPending = order.status === 'pending_payment' && !isExpired;

  const isRobinhood = order.payment_network === 'robinhood';
  const networkLabel = isRobinhood ? 'Robinhood Chain' : 'Solana';
  const currencySymbol = isRobinhood ? 'ETH' : 'SOL';
  const requiredAmount = isRobinhood ? order.required_eth : order.required_sol;
  const oracleRate = isRobinhood ? order.eth_price_usd : order.sol_price_usd;

  const networkLogo = isRobinhood ? '/robinhood-logo.png' : '/solana-logo.jpeg';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">

        {/* Header */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          {isPending && <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400/60" />}
          {isConfirmed && <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/60" />}
          {isExpired && <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/40" />}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Payment Gateway</p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-display font-bold tracking-tight">
                  {isConfirmed ? 'Payment Confirmed' : isExpired ? 'Payment Expired' : 'Awaiting Payment'}
                </h1>
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                  </span>
                )}
                {isConfirmed && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertCircle className="w-3 h-3" /> Expired
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mt-2">ID: {order.id}</p>
            </div>

            {isPending && (
              <div className="flex items-center gap-3 bg-amber-500/6 border border-amber-500/20 px-5 py-3.5 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/70 mb-0.5">Time Remaining</span>
                  <div className="font-mono text-2xl font-bold tracking-widest text-amber-500">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <Clock className="w-6 h-6 text-amber-500/30" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Invoice Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="md:col-span-2"
          >
            <div className="glass rounded-2xl p-6 h-full flex flex-col gap-5">
              <p className="section-label flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Invoice Details</p>

              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Allocation Plan</div>
                <div className="font-display text-xl capitalize text-foreground font-semibold">{order.challenge_plan}</div>
              </div>

              {/* Network with logo */}
              <div className="bg-foreground/[0.03] border border-border p-4 rounded-xl">
                <div className="text-[10px] font-mono text-muted-foreground mb-2 uppercase tracking-widest">Payment Network</div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border/60 flex-shrink-0">
                    <img src={networkLogo} alt={networkLabel} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold">{networkLabel}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{currencySymbol}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-foreground/[0.03] border border-border p-4 rounded-xl">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase tracking-widest">USD Base</div>
                  <div className="font-mono text-lg font-bold">${order.purchase_price_usd.toFixed(2)}</div>
                </div>
                <div className="bg-foreground/[0.03] border border-border p-4 rounded-xl">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase tracking-widest">Oracle Rate</div>
                  <div className="font-mono text-lg font-bold">${(oracleRate ?? 0).toFixed(2)}</div>
                </div>
              </div>

              {/* Amount required */}
              <div className="bg-primary/6 border border-primary/20 p-5 rounded-xl relative overflow-hidden">
                <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-2">Exact Amount Required</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-3xl font-bold text-foreground">{requiredAmount} {currencySymbol}</div>
                  {isPending && (
                    <Button variant="ghost" size="icon" onClick={() => handleCopy((requiredAmount ?? 0).toString(), 'Amount')} className="hover:bg-primary/10 hover:text-primary h-10 w-10 rounded-lg">
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Sending From</div>
                <div className="font-mono text-xs break-all bg-foreground/[0.03] border border-border p-3 rounded-lg text-muted-foreground">
                  {order.user_wallet}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 300, damping: 28 }}
            className="md:col-span-3"
          >
            <AnimatePresence mode="sync">
              {isConfirmed ? (
                <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                  <div className="glass rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden border border-emerald-500/20">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-emerald-400">Payment Verified</h3>
                    <p className="font-mono text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
                      Your payment was detected on-chain. Your evaluation environment is being provisioned. Redirecting in a moment…
                    </p>
                    <Button onClick={() => setLocation('/dashboard')} className="font-mono uppercase tracking-wider w-full max-w-xs h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
                      Enter Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : isExpired ? (
                <motion.div key="expired" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                  <div className="glass rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden border border-red-500/15">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/8 border border-red-500/20 flex items-center justify-center mb-6">
                      <AlertCircle className="w-8 h-8 text-red-400/70" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">Payment Expired</h3>
                    <p className="font-mono text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
                      The payment window has elapsed. The exchange rate is no longer guaranteed. Please generate a new invoice.
                    </p>
                    <Button onClick={() => setLocation('/challenge')} variant="outline" className="border-red-500/25 text-red-400 hover:bg-red-500/8 font-mono uppercase tracking-wider w-full max-w-xs h-12 rounded-xl">
                      Start New Challenge
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                  <div className="glass rounded-2xl h-full flex flex-col p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <p className="section-label">Payment Instructions</p>
                      <div className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-lg bg-foreground/[0.03] border border-border">
                        <img src={networkLogo} alt={networkLabel} className="w-4 h-4 rounded-full object-cover" />
                        <span className="text-[10px] font-mono text-muted-foreground">{networkLabel}</span>
                      </div>
                    </div>

                    <ol className="space-y-7 font-mono text-sm mb-auto">
                      {/* Step 1 */}
                      <li className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 text-xs">1</div>
                        <div className="flex-1 pt-1">
                          <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Copy exact amount</p>
                          <Button
                            variant="outline"
                            onClick={() => handleCopy((requiredAmount ?? 0).toString(), 'Amount')}
                            className="font-mono text-sm w-full justify-between h-14 bg-foreground/[0.02] border-border hover:border-primary/40 hover:bg-primary/4 transition-all rounded-xl"
                          >
                            <span className="font-bold text-foreground">{requiredAmount} {currencySymbol}</span>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-[10px] uppercase">Copy</span>
                              <Copy className="w-4 h-4 text-primary" />
                            </div>
                          </Button>
                        </div>
                      </li>

                      {/* Step 2 */}
                      <li className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 text-xs">2</div>
                        <div className="flex-1 pt-1">
                          <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Send to treasury address</p>
                          <div className="flex items-center bg-foreground/[0.02] border border-border rounded-xl overflow-hidden h-14 hover:border-primary/40 transition-all">
                            <div className="px-4 py-2 font-mono text-xs truncate flex-1 text-muted-foreground">
                              {order.treasury_wallet}
                            </div>
                            <Button
                              variant="ghost"
                              className="rounded-none h-full px-5 border-l border-border hover:bg-primary hover:text-black shrink-0 transition-all"
                              onClick={() => handleCopy(order.treasury_wallet, 'Treasury wallet address')}
                              data-testid="button-copy-treasury"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </li>

                      {/* Step 3 */}
                      <li className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-foreground/[0.06] border border-border text-muted-foreground flex items-center justify-center font-bold shrink-0 text-xs">3</div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-foreground uppercase tracking-widest text-[10px] mb-1.5">Keep this page open</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            The system continuously polls the {isRobinhood ? 'Robinhood Chain' : 'Solana'} network. Payment verification typically resolves within 15–30 seconds.
                          </p>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-8 space-y-3">
                      {/* Polling indicator */}
                      <div className="p-4 bg-primary/4 border border-primary/15 rounded-xl flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs font-semibold text-foreground">Listening for payment…</p>
                          <p className="font-mono text-[10px] text-primary/60 mt-0.5 uppercase tracking-widest">Polling {isRobinhood ? 'Robinhood Chain' : 'Solana'} · Auto-verifying</p>
                        </div>
                        <img src={networkLogo} alt={networkLabel} className="w-6 h-6 rounded-full object-cover opacity-60 flex-shrink-0" />
                      </div>

                      <Button
                        onClick={handleManualCheck}
                        disabled={isManualChecking}
                        className="w-full h-12 font-mono uppercase tracking-wider text-sm font-semibold rounded-xl"
                        variant="outline"
                      >
                        {isManualChecking ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking…</>
                        ) : (
                          <><RefreshCw className="w-4 h-4 mr-2" /> I've Sent the Payment</>
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
