import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, CHALLENGE_PLANS, fetchSolPrice, usdToSol, pickTreasuryWallet, fetchEthPrice, usdToEth, pickRobinhoodTreasuryWallet } from '@/lib/supabase';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RefreshCw, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChallengePage() {
  const { profile, user } = useAuth();
  const [, setLocation] = useLocation();
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<typeof CHALLENGE_PLANS[0] | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const creatingOrderRef = useRef(false);
  const [paymentNetwork, setPaymentNetwork] = useState<'solana' | 'robinhood'>('robinhood');
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loadingEthPrice, setLoadingEthPrice] = useState(true);

  const loadPrice = async () => {
    setLoadingPrice(true);
    const price = await fetchSolPrice();
    setSolPrice(price);
    setLoadingPrice(false);
  };

  const loadEthPrice = async () => {
    setLoadingEthPrice(true);
    const price = await fetchEthPrice();
    setEthPrice(price);
    setLoadingEthPrice(false);
  };

  const loadAllPrices = async () => {
    await Promise.all([loadPrice(), loadEthPrice()]);
  };

  useEffect(() => {
    loadAllPrices();
  }, []);

  if (profile?.challenge_status && profile.challenge_status !== 'none') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Active Challenge Detected</h2>
          <p className="text-muted-foreground font-mono mb-8 max-w-md text-sm leading-relaxed">
            You already have an active or completed challenge on your account. Complete or reset your current evaluation before starting a new one.
          </p>
          <Link href="/dashboard" data-testid="link-back-dashboard">
            <Button variant="outline" className="font-mono uppercase tracking-wider rounded-xl">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isRobinhoodNetwork = paymentNetwork === 'robinhood';
  const isValidWallet = isRobinhoodNetwork
    ? /^0x[0-9a-fA-F]{40}$/.test(walletAddress.trim())
    : walletAddress.trim().length >= 32;

  const handleCreateOrder = async () => {
    const requiredPrice = isRobinhoodNetwork ? ethPrice : solPrice;
    if (creatingOrderRef.current || !selectedPlan || !requiredPrice || !user) return;

    if (!isValidWallet) {
      toast.error(
        isRobinhoodNetwork
          ? 'Please enter a valid EVM wallet address (0x...)'
          : 'Please enter a valid Solana wallet address'
      );
      return;
    }

    creatingOrderRef.current = true;
    setCreatingOrder(true);

    try {
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      const orderFields = isRobinhoodNetwork
        ? {
            payment_network: 'robinhood' as const,
            eth_price_usd: ethPrice,
            required_eth: usdToEth(selectedPlan.purchasePriceUsd, ethPrice!),
            treasury_wallet: pickRobinhoodTreasuryWallet(),
          }
        : {
            payment_network: 'solana' as const,
            sol_price_usd: solPrice,
            required_sol: usdToSol(selectedPlan.purchasePriceUsd, solPrice!),
            treasury_wallet: pickTreasuryWallet(),
          };

      const { data: order, error } = await supabase.from('orders').insert({
        user_id: user.id,
        challenge_plan: selectedPlan.id,
        purchase_price_usd: selectedPlan.purchasePriceUsd,
        user_wallet: walletAddress.trim(),
        expires_at: expiresAt.toISOString(),
        ...orderFields,
      }).select().single();

      if (error) throw error;

      setSelectedPlan(null);
      toast.success('Order created successfully');
      setLocation(`/payment/${order.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create order. Please try again.');
    } finally {
      creatingOrderRef.current = false;
      setCreatingOrder(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !creatingOrder) {
      setSelectedPlan(null);
      setWalletAddress('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">

        {/* Header card */}
        <div className="glass rounded-2xl p-6 border border-border/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Evaluation Phase</p>
              <h1 className="text-2xl font-display font-bold tracking-tight">Select Allocation</h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-lg leading-relaxed">
                Choose your capital tier and payment network. Pass the target criteria to unlock live firm capital.
              </p>
            </div>

            {/* Oracle Rate */}
            <div className="bg-foreground/[0.03] border border-border p-4 rounded-xl min-w-[200px] outline-card">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <span>Oracle Rate</span>
                <span className="text-primary">{paymentNetwork === 'robinhood' ? 'ETH/USD' : 'SOL/USD'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold text-foreground">
                  {paymentNetwork === 'robinhood'
                    ? (loadingEthPrice ? <span className="animate-pulse opacity-50">...</span> : `$${ethPrice?.toFixed(2)}`)
                    : (loadingPrice ? <span className="animate-pulse opacity-50">...</span> : `$${solPrice?.toFixed(2)}`)
                  }
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loadAllPrices}
                  disabled={loadingPrice || loadingEthPrice}
                  className="h-8 w-8 hover:bg-foreground/[0.06] rounded-lg"
                  data-testid="button-refresh-price"
                >
                  <RefreshCw className={`w-4 h-4 text-primary ${(loadingPrice || loadingEthPrice) ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Network — Robinhood Chain only */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border border-primary/40 bg-primary/8 text-foreground shadow-sm font-mono text-sm">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-primary/20">
                <img src="/robinhood-logo.png" alt="Robinhood Chain" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="font-semibold uppercase tracking-wider text-[11px]">Robinhood Chain</div>
                <div className="text-[10px] opacity-60">Pay in ETH</div>
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Challenge plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHALLENGE_PLANS.map((plan, i) => {
            const isPopular = plan.id === 'advanced';
            const requiredSol = solPrice ? usdToSol(plan.purchasePriceUsd, solPrice) : null;
            const requiredEth = ethPrice ? usdToEth(plan.purchasePriceUsd, ethPrice) : null;
            const requiredCrypto = paymentNetwork === 'robinhood' ? requiredEth : requiredSol;
            const cryptoSymbol = paymentNetwork === 'robinhood' ? 'ETH' : 'SOL';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
                className="h-full"
              >
                <div className={`h-full flex flex-col rounded-2xl border transition-all duration-250 hover:-translate-y-1.5 overflow-hidden ${
                  isPopular
                    ? 'bg-card border-primary/30 shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.08),0_16px_32px_-6px_rgba(0,0,0,0.25)] hover:shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.15),0_24px_48px_-8px_rgba(0,0,0,0.3)]'
                    : 'bg-card border-border shadow-sm hover:shadow-lg hover:border-foreground/15'
                }`}>
                  {isPopular && <div className="h-0.5 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />}

                  {isPopular && (
                    <div className="px-6 py-2.5 bg-primary/6 border-b border-primary/12">
                      <div className="flex items-center gap-1.5 justify-center text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                        <Zap className="w-3 h-3" /> Most Selected
                      </div>
                    </div>
                  )}

                  <div className={`p-8 text-center border-b ${isPopular ? 'border-primary/10' : 'border-border'}`}>
                    <h3 className={`font-display text-xl mb-4 font-semibold ${isPopular ? 'text-primary' : 'text-foreground'}`}>
                      {plan.name}
                    </h3>
                    <div className="font-mono text-5xl font-bold tracking-tight text-foreground mb-2">
                      ${plan.fundedValueUsd.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      Live Capital Allocation
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <ul className="space-y-4 font-mono text-sm text-muted-foreground mb-8">
                      {[
                        'Evaluation Period: 21 Days',
                        'Required Win Rate: 70%',
                        'Max Drawdown: 30%',
                        'Min Trading Days: 5',
                        'Max Position Size: 30%',
                        'Max Open Positions: 3',
                      ].map(feat => (
                        <li key={feat} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div className={`rounded-xl p-5 border mb-6 ${isPopular ? 'bg-primary/5 border-primary/20' : 'bg-foreground/[0.03] border-border'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Evaluation Fee</span>
                        <span className="font-display text-xl font-bold">${plan.purchasePriceUsd}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={paymentNetwork === 'robinhood' ? '/robinhood-logo.png' : '/solana-logo.jpeg'}
                            alt={cryptoSymbol}
                            className="w-3.5 h-3.5 rounded-full object-cover"
                          />
                          <span>Payable in {cryptoSymbol}</span>
                        </div>
                        <span className="text-primary font-semibold">{requiredCrypto ? `~${requiredCrypto} ${cryptoSymbol}` : '...'}</span>
                      </div>
                    </div>

                    <Button
                      className={`w-full h-12 font-mono uppercase tracking-wider text-xs rounded-xl transition-all duration-200 ${
                        isPopular ? 'neon-glow hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)]' : 'bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border hover:border-foreground/20'
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => setSelectedPlan(plan)}
                      disabled={isRobinhoodNetwork ? !ethPrice : !solPrice}
                      data-testid={`button-select-${plan.id}`}
                    >
                      Initialize Challenge <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-lg bg-card border-border p-0 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl mb-2">Confirm Allocation</DialogTitle>
              <DialogDescription className="font-mono text-sm leading-relaxed text-muted-foreground">
                Initializing the <strong className="text-foreground">{selectedPlan?.name}</strong> evaluation protocol for <strong className="text-foreground">${selectedPlan?.fundedValueUsd.toLocaleString()}</strong> in deployable capital.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 md:p-8 space-y-6 bg-foreground/[0.02]">
            <div className="rounded-xl border border-border overflow-hidden">
              {[
                {
                  label: 'Payment Network',
                  value: (
                    <div className="flex items-center gap-2">
                      <img
                        src={isRobinhoodNetwork ? '/robinhood-logo.png' : '/solana-logo.jpeg'}
                        alt={isRobinhoodNetwork ? 'Robinhood' : 'Solana'}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{isRobinhoodNetwork ? 'Robinhood Chain (ETH)' : 'Solana (SOL)'}</span>
                    </div>
                  )
                },
                { label: 'USD Total', value: `$${selectedPlan?.purchasePriceUsd} USD`, bold: true },
                {
                  label: `Required ${isRobinhoodNetwork ? 'ETH' : 'SOL'}`,
                  value: `${isRobinhoodNetwork
                    ? (selectedPlan && ethPrice ? usdToEth(selectedPlan.purchasePriceUsd, ethPrice) : '...')
                    : (selectedPlan && solPrice ? usdToSol(selectedPlan.purchasePriceUsd, solPrice) : '...')
                  } ${isRobinhoodNetwork ? 'ETH' : 'SOL'}`,
                  primary: true
                },
              ].map(({ label, value, bold, primary }, i, arr) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3 font-mono text-sm ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{label}</span>
                  <span className={`${primary ? 'text-primary font-bold text-base' : bold ? 'font-bold text-foreground' : 'text-foreground'}`}>{value as any}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="wallet" className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                <Zap className="w-3 h-3" /> Origin Wallet Address
              </Label>
              <Input
                id="wallet"
                placeholder={isRobinhoodNetwork ? 'Enter your EVM address (0x...)...' : 'Enter the Solana address you will pay from...'}
                className="font-mono text-sm h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                data-testid="input-wallet-address"
              />
              <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed bg-primary/4 p-3 rounded-lg border border-primary/10">
                <strong className="text-primary">Critical:</strong> We use this address to verify your on-chain payment. You must send funds from this exact address.{isRobinhoodNetwork ? ' Must be a valid EVM address starting with 0x.' : ''}
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-background">
            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => handleDialogOpenChange(false)} className="font-mono uppercase text-xs tracking-wider" disabled={creatingOrder}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={creatingOrder || !isValidWallet}
                className="font-mono uppercase text-xs tracking-wider rounded-xl"
                data-testid="button-create-order"
              >
                {creatingOrder ? 'Generating...' : 'Generate Invoice'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
