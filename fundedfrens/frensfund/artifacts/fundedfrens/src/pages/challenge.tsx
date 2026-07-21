import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, CHALLENGE_PLANS, fetchSolPrice, usdToSol, TREASURY_WALLET } from '@/lib/supabase';
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

  const loadPrice = async () => {
    setLoadingPrice(true);
    const price = await fetchSolPrice();
    setSolPrice(price);
    setLoadingPrice(false);
  };

  useEffect(() => {
    loadPrice();
  }, []);

  if (profile?.challenge_status && profile.challenge_status !== 'none') {
    return (
      <DashboardLayout>
        <div className="glass rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[60vh] border border-primary/20">
          <ShieldCheck className="w-16 h-16 text-primary mb-6" />
          <h2 className="text-2xl font-display font-bold mb-4">Active Challenge Detected</h2>
          <p className="text-muted-foreground font-mono mb-8 max-w-md text-sm leading-relaxed">
            You already have an active or completed challenge on your account. You must complete or reset your current evaluation before starting a new one.
          </p>
          <Link href="/dashboard" data-testid="link-back-dashboard">
            <Button variant="outline" className="font-mono uppercase tracking-wider bg-black/20 border-white/10 hover:bg-white/5">
              Return to Terminal
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleCreateOrder = async () => {
    if (!selectedPlan || !solPrice || !user) return;
    
    if (!walletAddress.trim() || walletAddress.trim().length < 32) {
      toast.error('Please enter a valid Solana wallet address');
      return;
    }

    setCreatingOrder(true);
    
    try {
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      const { data: order, error } = await supabase.from('orders').insert({
        user_id: user.id,
        challenge_plan: selectedPlan.id,
        purchase_price_usd: selectedPlan.purchasePriceUsd,
        sol_price_usd: solPrice,
        required_sol: usdToSol(selectedPlan.purchasePriceUsd, solPrice),
        treasury_wallet: TREASURY_WALLET || 'TREASURY_WALLET_NOT_CONFIGURED',
        user_wallet: walletAddress.trim(),
        expires_at: expiresAt.toISOString(),
      }).select().single();

      if (error) throw error;
      
      toast.success('Order created successfully');
      setLocation(`/payment/${order.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="section-label mb-2">Evaluation Phase</div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Select Allocation</h1>
            <p className="text-muted-foreground font-mono text-sm mt-2 max-w-lg leading-relaxed">
              Choose your capital tier. Pay the evaluation fee in SOL. Pass the target criteria to unlock live firm capital.
            </p>
          </div>
          
          <div className="glass bg-black/40 rounded-xl p-4 flex flex-col gap-2 min-w-[200px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-xl rounded-full" />
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <span>Oracle Rate</span>
              <span className="text-primary">SOL/USD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-foreground">
                {loadingPrice ? <span className="animate-pulse opacity-50">...</span> : `$${solPrice?.toFixed(2)}`}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={loadPrice} 
                disabled={loadingPrice}
                className="h-8 w-8 hover:bg-white/10"
                data-testid="button-refresh-price"
              >
                <RefreshCw className={`w-4 h-4 text-primary ${loadingPrice ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CHALLENGE_PLANS.map((plan, i) => {
            const isPopular = plan.id === 'advanced';
            const requiredSol = solPrice ? usdToSol(plan.purchasePriceUsd, solPrice) : null;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <div className={`h-full flex flex-col relative rounded-2xl transition-all duration-300 ${
                  isPopular 
                    ? 'glass glass-primary scale-[1.02] z-10' 
                    : 'glass glass-hover opacity-90 hover:opacity-100'
                }`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)] z-20 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> Most Selected
                    </div>
                  )}
                  
                  <div className="p-8 text-center border-b border-white/[0.04]">
                    <h3 className={`font-display text-xl mb-4 ${isPopular ? 'text-primary' : 'text-foreground'}`}>
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
                    <ul className="space-y-5 font-mono text-sm text-muted-foreground/90 mb-8">
                      <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div> Profit Target: 10%</li>
                      <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div> Max Drawdown: 10%</li>
                      <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div> Daily Drawdown: 5%</li>
                      <li className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-primary" /></div> Trading Days: ∞</li>
                    </ul>
                    
                    <div className="bg-black/30 rounded-xl p-5 border border-white/[0.04] mb-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Evaluation Fee</span>
                        <span className="font-display text-xl font-bold">${plan.purchasePriceUsd}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                        <span>Payable in SOL</span>
                        <span className="text-primary">{requiredSol ? `~${requiredSol} SOL` : '...'}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full h-12 font-mono uppercase tracking-wider text-xs ${isPopular ? 'shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10'}`}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => setSelectedPlan(plan)}
                      disabled={!solPrice}
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

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-lg glass bg-background/80 p-0 overflow-hidden border-white/10">
          <div className="p-6 md:p-8 border-b border-white/[0.05]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl mb-2">Confirm Allocation</DialogTitle>
              <DialogDescription className="font-mono text-sm leading-relaxed text-muted-foreground">
                Initializing the <strong className="text-foreground">{selectedPlan?.name}</strong> evaluation protocol for <strong className="text-foreground">${selectedPlan?.fundedValueUsd.toLocaleString()}</strong> in deployable capital.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 md:p-8 space-y-8 bg-black/40">
            <div className="glass rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center font-mono text-sm border-b border-white/[0.05] pb-3">
                <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Payment Network</span>
                <span className="text-foreground">Solana (SOL)</span>
              </div>
              <div className="flex justify-between items-center font-mono text-sm border-b border-white/[0.05] pb-3">
                <span className="text-muted-foreground uppercase tracking-wider text-[10px]">USD Total</span>
                <span className="text-foreground font-bold">${selectedPlan?.purchasePriceUsd} USD</span>
              </div>
              <div className="flex justify-between items-center font-mono text-sm pt-1">
                <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Required SOL Rate</span>
                <span className="text-primary font-bold text-lg">
                  {selectedPlan && solPrice ? usdToSol(selectedPlan.purchasePriceUsd, solPrice) : '...'} SOL
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="wallet" className="font-mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                <Zap className="w-3 h-3" /> Origin Wallet Address
              </Label>
              <div className="relative">
                <Input 
                  id="wallet"
                  placeholder="Enter the Solana address you will pay from..."
                  className="font-mono text-sm h-12 bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary pl-4"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  data-testid="input-wallet-address"
                />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed bg-primary/5 p-3 rounded-md border border-primary/10">
                <strong className="text-primary">CRITICAL:</strong> We use this address to automatically detect and verify your on-chain payment. You must send funds from this exact address.
              </p>
            </div>
          </div>
          
          <div className="p-6 border-t border-white/[0.05] bg-background/50">
            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="font-mono uppercase text-xs tracking-wider" disabled={creatingOrder}>
                Abort
              </Button>
              <Button onClick={handleCreateOrder} disabled={creatingOrder || !walletAddress} className="font-mono uppercase text-xs tracking-wider shadow-[0_0_15px_rgba(20,184,166,0.2)]" data-testid="button-create-order">
                {creatingOrder ? 'Generating Order...' : 'Generate Invoice'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}