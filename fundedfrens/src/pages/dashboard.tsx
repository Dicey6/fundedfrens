import React, { useState } from 'react';
import { DashboardLayout, useDashboardContext } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { useChallenge } from '@/hooks/use-challenge';
import { useOrders } from '@/hooks/use-orders';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Wallet, Trophy, Target, Award, Copy, 
  TrendingUp, Activity, BarChart3, LineChart, CheckCircle2,
  AlertCircle, Lock, Unlock, Bell, BellRing, Settings, Smartphone,
  Clock, XCircle, ArrowRight, BookOpen, ExternalLink, List, 
  Check, LogOut, Briefcase, ShoppingCart, Users, MessageCircle, ChevronRight
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'wouter';
import { DashboardSection } from '../components/DashboardLayout';

export default function Dashboard() {
  const { activeSection, setActiveSection } = useDashboardContext();
  const { profile } = useAuth();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const { challenge } = useChallenge();
  const { orders, loading: ordersLoading } = useOrders();
  const [, setLocation] = useLocation();

  const [activeOrderTab, setActiveOrderTab] = useState<'all' | 'pending_payment' | 'confirmed' | 'expired'>('all');
  const filteredOrders = orders.filter(o => activeOrderTab === 'all' ? true : o.status === activeOrderTab);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const challengeStatus = profile?.challenge_status || 'none';
  const hasActiveChallenge = challengeStatus === 'active' && challenge;
  const daysRemaining = challenge?.ends_at ? Math.max(0, differenceInDays(new Date(challenge.ends_at), new Date())) : 0;

  const fadeVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.15 } }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Activity className="w-64 h-64" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="section-label mb-2 text-primary/80">Trading Terminal</div>
                  <h1 className="text-3xl font-display font-bold tracking-tight">
                    Welcome back, <span className="text-primary">{profile?.username || 'Trader'}</span>
                  </h1>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {challengeStatus === 'active' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active Evaluation
                      </span>
                    )}
                    {challengeStatus === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <Shield className="w-3 h-3" /> Live Funded Account
                      </span>
                    )}
                    {hasActiveChallenge && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-muted-foreground border border-white/10">
                        <Clock className="w-3 h-3" /> Day {21 - daysRemaining} of 21
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg bg-black/20 w-full sm:w-auto justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Live Data</span>
                  </div>
                  {challengeStatus === 'none' && (
                    <Button onClick={() => setLocation('/challenge')} className="w-full sm:w-auto font-mono uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      Start Challenge
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {hasActiveChallenge && (
              <div className="glass rounded-xl p-6 border-l-[3px] border-l-primary">
                <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-4">
                  <div>
                    <div className="section-label mb-2">Challenge Progress</div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">Day {21 - daysRemaining} of 21</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-sm font-mono text-muted-foreground">Win Rate: {challenge.win_rate}%</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-sm font-mono text-muted-foreground">Drawdown: {challenge.drawdown}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="metric-label mb-1">Profit Target (10%)</div>
                    <div className="font-mono text-xl font-bold text-primary">{challenge.challenge_progress}%</div>
                  </div>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/[0.05]">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 relative" 
                    style={{ width: `${Math.min(100, (challenge.challenge_progress / 10) * 100)}%` }} 
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Demo Balance', value: '—', accent: 'primary' },
                { label: 'Current Equity', value: '—', accent: 'primary' },
                { label: "Today's PnL", value: '—', accent: 'sky' },
                { label: 'Total PnL', value: '—', accent: 'sky' },
                { label: 'Unrealized PnL', value: '—', accent: 'amber' },
                { label: 'Total Return', value: '—', accent: 'amber' }
              ].map((metric, i) => (
                <div key={i} className="group glass glass-hover rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-50 ${
                    metric.accent === 'primary' ? 'bg-gradient-to-r from-primary/80 to-transparent' :
                    metric.accent === 'sky' ? 'bg-gradient-to-r from-sky-400/80 to-transparent' :
                    'bg-gradient-to-r from-amber-400/80 to-transparent'
                  }`} />
                  <span className="metric-label leading-none">{metric.label}</span>
                  <span className="font-mono text-xl font-bold text-foreground/50 leading-none">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Target, label: 'Challenge', id: 'challenge' },
                { icon: BarChart3, label: 'Analytics', id: 'analytics' },
                { icon: Briefcase, label: 'Portfolio', id: 'portfolio' },
                { icon: Users, label: 'Referrals', id: 'referrals' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-primary/20">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-display font-semibold">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        );
      
      case 'challenge':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <h2 className="text-3xl font-display font-bold">Evaluation Progress</h2>

            {hasActiveChallenge ? (
              <>
                <div className="glass rounded-xl p-6 relative overflow-hidden border-t-[3px] border-t-primary">
                  <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-8">
                    <div>
                      <div className="section-label mb-3">Status</div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          Active ({challenge.challenge_plan} Plan)
                        </span>
                        <span className="text-sm font-mono text-muted-foreground">
                          Day {21 - daysRemaining} of 21
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="metric-label mb-1">Profit Target (10%)</div>
                      <div className="font-mono text-2xl font-bold text-primary">{challenge.challenge_progress}%</div>
                    </div>
                  </div>

                  <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-8 border border-white/[0.05]">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 relative" 
                      style={{ width: `${Math.min(100, (challenge.challenge_progress / 10) * 100)}%` }} 
                    >
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 rounded-lg p-4 border border-white/[0.04]">
                      <div className="flex justify-between items-end mb-2">
                        <span className="metric-label">Drawdown (10% Max)</span>
                        <span className={`font-mono font-bold ${challenge.drawdown > 8 ? 'text-destructive' : challenge.drawdown > 5 ? 'text-amber-500' : 'text-emerald-400'}`}>
                          {challenge.drawdown}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${challenge.drawdown > 8 ? 'bg-destructive' : challenge.drawdown > 5 ? 'bg-amber-500' : 'bg-emerald-400'}`} 
                          style={{ width: `${Math.min(100, (challenge.drawdown / 10) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 border border-white/[0.04]">
                      <div className="flex justify-between items-end mb-2">
                        <span className="metric-label">Trading Days (5 Min)</span>
                        <span className="font-mono font-bold text-foreground">{challenge.trading_days} / 5</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (challenge.trading_days / 5) * 100)}%` }} />
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 border border-white/[0.04]">
                      <div className="flex justify-between items-end mb-2">
                        <span className="metric-label">Win Rate (75% Req)</span>
                        <span className={`font-mono font-bold ${challenge.win_rate >= 75 ? 'text-emerald-400' : 'text-foreground'}`}>{challenge.win_rate}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${challenge.win_rate >= 75 ? 'bg-emerald-400' : 'bg-primary'}`} style={{ width: `${Math.min(100, challenge.win_rate)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mt-8 mb-4">Evaluation Requirements</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Evaluation Period', value: '21 Days', desc: `${daysRemaining} days remaining` },
                    { label: 'Minimum Trading Days', value: '5 Days', desc: `${challenge.trading_days} days completed` },
                    { label: 'Required Win Rate', value: '75%', desc: `Currently at ${challenge.win_rate}%` },
                    { label: 'Max Position Size', value: '30%', desc: 'Of total account balance' },
                    { label: 'Max Open Positions', value: '3', desc: `Currently ${challenge.open_positions} open` },
                    { label: 'Max Drawdown', value: '50%', desc: `Currently at ${challenge.drawdown}%` },
                  ].map((rule, i) => (
                    <div key={i} className="glass rounded-xl p-5 border-l-[3px] border-l-primary/30 hover:border-l-primary transition-colors">
                      <div className="metric-label mb-2">{rule.label}</div>
                      <div className="font-mono text-2xl font-bold text-foreground mb-1">{rule.value}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{rule.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="glass rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">No Active Challenge</h3>
                <p className="text-muted-foreground max-w-md mb-8">You need an active evaluation account to track your progress. Choose a plan and start trading.</p>
                <Button onClick={() => setLocation('/challenge')} size="lg" className="font-semibold px-8 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  View Challenge Plans <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="section-label flex items-center gap-2"><LineChart className="w-4 h-4 text-primary/60" /> Performance</div>
                <div className="h-px flex-1 mx-4 bg-gradient-to-r from-white/[0.04] to-transparent" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  'Total Trades', 'Winning Trades', 'Losing Trades', 'Win Rate', 
                  'Average Winner', 'Average Loser', 'Largest Win', 'Largest Loss', 
                  'Profit Factor', 'Avg Risk/Reward', 'Average Hold Time', 'Consistency Score'
                ].map((l, i) => (
                  <div key={i} className="bg-black/20 border border-white/[0.04] rounded-xl p-4 flex flex-col gap-2 hover:bg-black/30 transition-colors">
                    <span className="metric-label">{l}</span>
                    <span className="font-mono text-xl font-bold text-muted-foreground/30">—</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="section-label flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary/60" /> Trading Analytics</div>
                <div className="h-px flex-1 mx-4 bg-gradient-to-r from-white/[0.04] to-transparent" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  'Avg Entry MCap', 'Avg Exit MCap', 'Avg Position Size', 'Avg PnL %', 'Avg PnL SOL',
                  'Peak Unrealized', 'Max Adverse Exc.', 'Stop Loss %', 'Take Profit %', 'Manual Close %'
                ].map((l, i) => (
                  <div key={i} className="bg-black/20 border border-white/[0.03] rounded-lg p-4 flex flex-col gap-1.5 hover:bg-black/30 transition-colors">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">{l}</span>
                    <span className="font-mono text-base font-semibold text-muted-foreground/25">—</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8 text-sm font-mono text-muted-foreground">
              Connect your Telegram bot to see trading analytics
            </div>
          </motion.div>
        );

      case 'portfolio':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-xl p-8 flex flex-col items-center justify-center border-b-2 border-b-primary/50 text-center">
              <div className="section-label mb-4"><Wallet className="w-4 h-4 inline-block mr-2" /> Portfolio Value</div>
              <div className="text-5xl font-mono font-bold text-foreground/50 mb-2">—</div>
              <div className="text-sm font-mono text-muted-foreground/50">Total Assets Under Management</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { l: 'Portfolio Value', v: '—' },
                { l: 'Open Positions', v: '—' },
                { l: 'Unrealized PnL', v: '—' },
                { l: 'Realized PnL', v: '—' },
                { l: 'Avg Position Value', v: '—' },
              ].map((m, i) => (
                <div key={i} className="glass rounded-xl p-4 flex flex-col gap-2">
                  <span className="metric-label">{m.l}</span>
                  <span className="font-mono text-xl font-bold text-muted-foreground/50">{m.v}</span>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl overflow-hidden mt-8">
              <div className="p-6 border-b border-white/[0.05]">
                <div className="section-label">Open Positions</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.05] text-xs font-mono uppercase tracking-widest text-muted-foreground bg-black/20">
                      <th className="py-4 px-6 font-normal">Token</th>
                      <th className="py-4 px-6 font-normal">Entry MCap</th>
                      <th className="py-4 px-6 font-normal">Current MCap</th>
                      <th className="py-4 px-6 font-normal">Invested SOL</th>
                      <th className="py-4 px-6 font-normal">Current Value</th>
                      <th className="py-4 px-6 font-normal">PnL %</th>
                      <th className="py-4 px-6 font-normal">PnL SOL</th>
                      <th className="py-4 px-6 font-normal">Hold Time</th>
                      <th className="py-4 px-6 font-normal text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-muted-foreground/60 font-mono text-xs uppercase tracking-widest">
                        <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        No open positions. Connect Telegram bot to trade.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-xl p-6 flex flex-col h-[calc(100vh-160px)] min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="section-label"><ShoppingCart className="w-4 h-4 inline-block mr-2" /> Order History</div>
                <div className="flex gap-2 bg-black/30 p-1 rounded-lg border border-white/[0.05] overflow-x-auto">
                  {(['all', 'pending_payment', 'confirmed', 'expired'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveOrderTab(tab)}
                      className={`px-4 py-2 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${activeOrderTab === tab ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                    >
                      {tab.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-black/10 rounded-xl border border-white/[0.03] overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/[0.05] text-xs font-mono uppercase tracking-widest text-muted-foreground bg-black/20">
                        <th className="py-4 px-6 font-normal">Plan</th>
                        <th className="py-4 px-6 font-normal">Date</th>
                        <th className="py-4 px-6 font-normal">Amount USD</th>
                        <th className="py-4 px-6 font-normal">Amount SOL</th>
                        <th className="py-4 px-6 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={5} className="py-16 text-center text-muted-foreground font-mono text-sm animate-pulse">Loading orders...</td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-16 text-center text-muted-foreground/60 font-mono text-xs uppercase tracking-widest">
                            <ShoppingCart className="w-8 h-8 mx-auto mb-3 opacity-30" />
                            No matching orders found
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 font-display font-medium text-foreground text-sm capitalize">{order.challenge_plan} Challenge</td>
                            <td className="py-4 px-6 text-xs font-mono text-muted-foreground">{format(new Date(order.created_at), 'MMM dd, yyyy · HH:mm')}</td>
                            <td className="py-4 px-6 font-mono font-bold text-sm">${order.purchase_price_usd}</td>
                            <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{order.required_sol} SOL</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                {order.status === 'confirmed' && (
                                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>
                                )}
                                {order.status === 'pending_payment' && (
                                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                                )}
                                {order.status === 'expired' && (
                                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Expired</span>
                                )}
                                {order.status === 'failed' && (
                                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Failed</span>
                                )}
                                {order.status === 'pending_payment' && (
                                  <Button onClick={() => setLocation(`/payment/${order.id}`)} variant="outline" size="sm" className="h-7 px-3 text-[10px] font-mono uppercase">Pay</Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'referrals':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass glass-primary rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="relative z-10 flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2">
                  <div className="section-label mb-2 flex items-center gap-2 text-primary/80"><TrendingUp className="w-4 h-4" /> Affiliate Network</div>
                  <h3 className="font-display text-3xl font-bold mb-4">Refer & Earn</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Invite friends to FundedFrens. They get a premium trading experience, and you earn 10% of their first successful challenge purchase. Automatic tracking, automatic rewards.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Your Referral Code</div>
                      <div className="bg-black/30 border border-primary/30 rounded-xl p-1.5 flex items-center">
                        <div className="px-4 font-mono text-lg tracking-widest text-primary font-bold flex-1 truncate">
                          {profile?.referral_code || 'LOADING...'}
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-primary/20 hover:text-primary rounded-lg h-10" onClick={() => handleCopy(profile?.referral_code || '', 'Referral code')}>
                          <Copy className="w-4 h-4 mr-2" /> Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Your Referral Link</div>
                      <div className="bg-black/30 border border-white/10 rounded-xl p-1.5 flex items-center">
                        <div className="px-4 font-mono text-xs tracking-widest text-foreground/80 flex-1 truncate">
                          {profile?.referral_code ? `https://fundedfrens.com/signup?ref=${profile.referral_code}` : 'LOADING...'}
                        </div>
                        <Button size="sm" variant="ghost" className="hover:bg-white/10 rounded-lg h-10" onClick={() => handleCopy(profile?.referral_code ? `https://fundedfrens.com/signup?ref=${profile.referral_code}` : '', 'Referral link')}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-5 flex flex-col justify-center border-l-[3px] border-l-primary/30 hover:border-l-primary transition-colors">
                    <span className="metric-label mb-2">Successful Referrals</span>
                    <span className="font-mono text-3xl font-bold text-foreground">—</span>
                  </div>
                  <div className="glass rounded-xl p-5 flex flex-col justify-center border-l-[3px] border-l-amber-500/30 hover:border-l-amber-500 transition-colors">
                    <span className="metric-label mb-2">Pending Rewards</span>
                    <span className="font-mono text-3xl font-bold text-foreground">$0.00</span>
                  </div>
                  <div className="glass rounded-xl p-5 flex flex-col justify-center border-l-[3px] border-l-emerald-500/30 hover:border-l-emerald-500 transition-colors">
                    <span className="metric-label mb-2">Paid Rewards</span>
                    <span className="font-mono text-3xl font-bold text-foreground">$0.00</span>
                  </div>
                  <div className="glass rounded-xl p-5 flex flex-col justify-center border-l-[3px] border-l-sky-500/30 hover:border-l-sky-500 transition-colors">
                    <span className="metric-label mb-2">Total Earnings</span>
                    <span className="font-mono text-3xl font-bold text-foreground">$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-8">
              <h4 className="font-display font-bold text-lg mb-6">How it works</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-mono text-xs font-bold">1</div>
                  <h5 className="font-semibold text-sm">Share your link</h5>
                  <p className="text-xs text-muted-foreground">Send your unique referral link or code to your trading network.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-mono text-xs font-bold">2</div>
                  <h5 className="font-semibold text-sm">They purchase a plan</h5>
                  <p className="text-xs text-muted-foreground">Your referral completes the purchase of any Demo Challenge.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold">3</div>
                  <h5 className="font-semibold text-sm text-primary">You earn 10%</h5>
                  <p className="text-xs text-muted-foreground">The 10% commission is automatically credited to your account.</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-black/20 border border-white/[0.05] rounded-lg text-xs font-mono text-muted-foreground">
                <AlertCircle className="w-4 h-4 inline-block mr-2 text-primary/70" />
                No hidden conditions. The reward is calculated based on the SOL value at the time of purchase.
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-xl p-6 h-[calc(100vh-160px)] min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="section-label"><Bell className="w-4 h-4 inline-block mr-2" /> System Log</div>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary text-primary-foreground">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm" className="font-mono text-xs uppercase tracking-wider h-8">
                    <Check className="w-3 h-3 mr-2" /> Mark all read
                  </Button>
                )}
              </div>

              <div className="flex-1 bg-black/10 rounded-xl border border-white/[0.03] overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground/40">
                      <BellRing className="w-12 h-12 mb-4 opacity-50" />
                      <span className="font-mono text-sm uppercase tracking-widest">System Log Empty</span>
                      <span className="text-xs mt-2">Notifications will appear here.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.04]">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => !notif.read && markAsRead(notif.id)}
                          className={`p-6 transition-colors cursor-pointer ${notif.read ? 'hover:bg-white/[0.02]' : 'bg-primary/5 hover:bg-primary/10'}`}
                        >
                          <div className="flex gap-4">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-white/20' : 'bg-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]'}`} />
                            <div>
                              <p className={`text-sm mb-1 ${notif.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{notif.message}</p>
                              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                                {format(new Date(notif.created_at), 'HH:mm:ss · MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        );

      case 'telegram':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Telegram Comm Link</h2>
              <p className="text-muted-foreground">Connect your account to trade directly via the FundedFrens Telegram Bot.</p>
            </div>

            {profile?.telegram_linked ? (
              <div className="glass rounded-2xl p-8 border-t-[3px] border-t-emerald-500 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Connected Successfully</h3>
                <p className="text-sm text-muted-foreground mb-6">Your account is linked. You can now execute trades, check positions, and receive critical alerts via Telegram.</p>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4 inline-block text-left mb-8">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Telegram ID</div>
                  <div className="font-mono text-lg font-bold">{profile.telegram_id}</div>
                </div>
                <div>
                  <a href="https://t.me/FundedFrensBot" target="_blank" rel="noopener noreferrer">
                    <Button className="font-semibold shadow-[0_0_20px_rgba(0,136,204,0.3)] bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">
                      Open Telegram Bot <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-8">
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-mono font-bold text-primary">1</div>
                    <div>
                      <h4 className="font-display font-semibold text-lg mb-2">Copy your link code</h4>
                      <p className="text-sm text-muted-foreground mb-4">This unique code authenticates your Telegram account with your web dashboard.</p>
                      <div className="flex items-center bg-black/30 border border-white/10 rounded-xl overflow-hidden max-w-md">
                        <div className="px-4 py-3 bg-white/5 font-mono text-xs text-muted-foreground border-r border-white/10">CODE</div>
                        <div className="px-4 py-3 font-mono text-lg tracking-widest flex-1 font-bold">{profile?.telegram_link_code || 'UNAVAILABLE'}</div>
                        <Button variant="ghost" className="rounded-none h-auto w-14 hover:bg-white/10" onClick={() => handleCopy(profile?.telegram_link_code || '', 'Link Code')}>
                          <Copy className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-muted-foreground">2</div>
                    <div>
                      <h4 className="font-display font-semibold text-lg mb-2">Message the bot</h4>
                      <p className="text-sm text-muted-foreground mb-4">Start a conversation with our official Telegram bot.</p>
                      <a href="https://t.me/FundedFrensBot" target="_blank" rel="noopener noreferrer">
                        <Button className="font-semibold shadow-[0_0_20px_rgba(0,136,204,0.3)] bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">
                          @FundedFrensBot <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-muted-foreground">3</div>
                    <div>
                      <h4 className="font-display font-semibold text-lg mb-2">Send the command</h4>
                      <p className="text-sm text-muted-foreground">Paste the following command into the bot chat to complete the link:</p>
                      <div className="mt-3 font-mono text-sm px-4 py-2 bg-black/40 border border-white/5 rounded-lg text-primary inline-block">
                        /link {profile?.telegram_link_code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6 max-w-3xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
              </div>
              <div className="px-8 pb-8 relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] absolute -top-12 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center font-mono font-bold text-3xl text-primary">
                    {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
                  </div>
                </div>
                
                <div className="pt-16 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-1">{profile?.username || 'Trader'}</h2>
                    <p className="text-sm font-mono text-muted-foreground">Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}</p>
                  </div>
                  <Button onClick={() => setLocation('/profile')} variant="outline" className="font-mono text-xs uppercase tracking-wider">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 space-y-6">
                <div className="section-label">Account Details</div>
                
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">User ID</div>
                  <div className="font-mono text-sm">{profile?.id || '—'}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Payout Wallet</div>
                  <div className="font-mono text-sm truncate">{profile?.payout_wallet || 'Not set'}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Referred By</div>
                  <div className="font-mono text-sm">{profile?.referred_by_code || 'None'}</div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 space-y-6">
                <div className="section-label">Status Overview</div>
                
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Challenge Status</div>
                  <div className="font-mono text-sm capitalize">{challengeStatus.replace('_', ' ')}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Telegram Status</div>
                  <div className="font-mono text-sm flex items-center gap-2">
                    {profile?.telegram_linked ? (
                      <><span className="w-2 h-2 rounded-full bg-emerald-500" /> Linked ({profile.telegram_id})</>
                    ) : (
                      <><span className="w-2 h-2 rounded-full bg-red-500" /> Not Linked</>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Reliability Rating</div>
                  <div className="font-mono text-sm flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${profile?.reliability_rating || 100}%` }} />
                    </div>
                    {profile?.reliability_rating || 100}/100
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'funded':
        return (
          <motion.div variants={fadeVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div className="glass rounded-2xl p-12 text-center relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
              
              <div className="relative z-10 max-w-lg mx-auto">
                <div className="w-24 h-24 rounded-full bg-background border-2 border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  {challengeStatus === 'approved' ? (
                    <Unlock className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <span className="text-4xl">🔒</span>
                  )}
                </div>
                
                <div className="section-label mb-4 text-primary">Premium Tier</div>
                <h2 className="text-4xl font-display font-bold mb-4">
                  FUNDED ACCOUNT
                </h2>
                
                {challengeStatus === 'approved' ? (
                  <p className="text-lg text-muted-foreground mb-8">
                    Congratulations! Your account is active. You are now trading with live firm capital. Keep 80% of your profits.
                  </p>
                ) : (
                  <>
                    <p className="text-lg text-muted-foreground mb-8">
                      This area is locked. Pass a demo evaluation challenge to unlock live firm capital and priority features.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                      {[
                        'Higher Capital Allocation', '80/20 Profit Split', 
                        'Priority Withdrawals', 'Exclusive Features'
                      ].map(feature => (
                        <div key={feature} className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/[0.05]">
                          <Check className="w-4 h-4 text-primary/50" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button onClick={() => setLocation('/challenge')} size="lg" className="font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] w-full sm:w-auto">
                      Start Your Journey
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
