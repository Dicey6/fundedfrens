import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardLayout, useDashboardContext } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChallenge } from '@/hooks/use-challenge';
import { useOrders } from '@/hooks/use-orders';
import { useReferrals } from '@/hooks/use-referrals';
import {
  Shield, Wallet, Trophy, Target, Award, Copy,
  TrendingUp, Activity, BarChart3, LineChart, CheckCircle2,
  AlertCircle, Lock, Unlock,
  Clock, ArrowRight, Users, MessageCircle,
  ChevronRight, ExternalLink, RefreshCw, Check, Send, Loader2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

// ── Reusable Components ───────────────────────────────────────────────────────
function MetricCard({ label, value, accent = 'default', size = 'md' }: {
  label: string; value: string; accent?: string; size?: 'sm' | 'md' | 'lg'
}) {
  const accentColor =
    accent === 'green' ? 'bg-emerald-500' :
    accent === 'red' ? 'bg-red-500' :
    accent === 'amber' ? 'bg-amber-400' :
    accent === 'sky' ? 'bg-sky-400' :
    'bg-primary';

  return (
    <div className="glass glass-hover rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentColor} opacity-50`} />
      <span className="metric-label">{label}</span>
      <span className={`font-mono font-bold leading-none ${
        size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
      } ${value === '—' ? 'text-muted-foreground/25' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-display font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: {
  icon: React.ElementType; title: string; desc: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-foreground/[0.04] border border-border flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-muted-foreground/40" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground/60 mb-4 max-w-[200px]">{desc}</p>
      {action}
    </div>
  );
}

// ── OVERVIEW SECTION ──────────────────────────────────────────────────────────
function OverviewSection() {
  const { profile } = useAuth();
  const { challenge } = useChallenge();
  const { setActiveSection } = useDashboardContext();
  const challengeStatus = profile?.challenge_status || 'none';
  const hasActiveChallenge = challengeStatus === 'active' && challenge;
  const daysRemaining = challenge?.ends_at ? Math.max(0, differenceInDays(new Date(challenge.ends_at), new Date())) : 0;

  const quickLinks = [
    { label: 'Challenge', section: 'challenge' as const, icon: Target, desc: 'View progress' },
    { label: 'Analytics', section: 'analytics' as const, icon: BarChart3, desc: 'Performance' },
    { label: 'Portfolio', section: 'portfolio' as const, icon: Wallet, desc: 'Holdings' },
    { label: 'Referrals', section: 'referrals' as const, icon: Users, desc: 'Earn rewards' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">

      {/* Welcome header */}
      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Trading Terminal</p>
              <h1 className="text-2xl font-display font-bold tracking-tight">
                Welcome back, <span className="text-primary">{profile?.username || 'Trader'}</span>
              </h1>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {challengeStatus === 'active' && (
                  <span className="badge-neon">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active Evaluation
                  </span>
                )}
                {challengeStatus === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Shield className="w-3 h-3" /> Live Funded Account
                  </span>
                )}
                {hasActiveChallenge && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-foreground/5 text-muted-foreground border border-border">
                    <Clock className="w-3 h-3" /> {daysRemaining} Days Left
                  </span>
                )}
                {challengeStatus === 'none' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-foreground/5 text-muted-foreground border border-border">
                    No Challenge Active
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-foreground/[0.03] border border-border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Live</span>
              </div>
              {challengeStatus === 'none' && (
                <Link href="/challenge">
                  <Button className="font-mono uppercase tracking-wider text-xs rounded-xl">
                    Start Challenge
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ label, section, icon: Icon, desc }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className="glass glass-hover rounded-xl p-4 flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/12 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="text-[10px] font-mono text-muted-foreground">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Account overview */}
      <motion.div variants={item}>
        <p className="section-label mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Account Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Demo Balance', value: '—', accent: 'default' },
            { label: 'Current Equity', value: '—', accent: 'default' },
            { label: "Today's PnL", value: '—', accent: 'sky' },
            { label: 'Total PnL', value: '—', accent: 'sky' },
            { label: 'Unrealized PnL', value: '—', accent: 'amber' },
            { label: 'Total Return', value: '—', accent: 'amber' },
          ].map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} accent={m.accent} />
          ))}
        </div>
      </motion.div>

      {/* Challenge snapshot + Risk */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Challenge snapshot */}
          <div className="glass rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <p className="section-label flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Challenge Snapshot</p>
              <button onClick={() => setActiveSection('challenge')} className="text-[10px] font-mono text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {hasActiveChallenge ? (
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Challenge Day', value: `Day ${21 - daysRemaining}`, sub: '/ 21' },
                    { label: 'Trading Days', value: String(challenge.trading_days), sub: '/ 5 required' },
                    { label: 'Win Rate', value: `${challenge.win_rate}%`, highlight: challenge.win_rate >= 75 ? 'green' : 'amber' },
                    { label: 'Drawdown', value: `${challenge.drawdown}%`, highlight: challenge.drawdown > 40 ? 'red' : challenge.drawdown > 30 ? 'amber' : 'default' },
                  ].map((m, i) => (
                    <div key={i} className="bg-foreground/[0.025] rounded-lg p-3 border border-border">
                      <div className="metric-label mb-1">{m.label}</div>
                      <div className={`font-mono text-lg font-bold ${
                        m.highlight === 'green' ? 'text-emerald-500' :
                        m.highlight === 'amber' ? 'text-amber-500' :
                        m.highlight === 'red' ? 'text-red-500' : 'text-foreground'
                      }`}>{m.value} {m.sub && <span className="text-xs text-muted-foreground font-normal">{m.sub}</span>}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="metric-label">Evaluation Progress</span>
                    <span className="font-mono text-xs font-bold text-primary">{challenge.challenge_progress}%</span>
                  </div>
                  <div className="h-2 bg-foreground/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, challenge.challenge_progress)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="No active challenge"
                desc="Purchase a Demo Challenge to begin your evaluation."
                action={
                  <Link href="/challenge">
                    <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider rounded-lg border-primary/25 text-primary hover:bg-primary hover:text-black">
                      View Plans
                    </Button>
                  </Link>
                }
              />
            )}
          </div>

          {/* Risk Parameters */}
          <div className="glass rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <p className="section-label flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" /> Risk Parameters</p>
              {hasActiveChallenge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Within Limits
                </span>
              )}
            </div>
            {hasActiveChallenge ? (
              <div className="space-y-4 flex-1">
                {[{ label: 'Max Drawdown (30% Limit)', value: challenge.drawdown, max: 30 }].map((r, i) => (
                  <div key={i} className="p-4 bg-foreground/[0.025] rounded-lg border border-border">
                    <div className="flex justify-between items-end mb-2">
                      <span className="metric-label">{r.label}</span>
                      <span className="font-mono font-bold text-sm">{r.value}%</span>
                    </div>
                    <div className="h-2 bg-foreground/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${r.value > r.max * 0.8 ? 'bg-red-500' : r.value > r.max * 0.5 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(100, (r.value / r.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Win Rate', value: `${challenge.win_rate}%`, req: '≥70%' },
                    { label: 'Positions', value: `${challenge.open_positions}`, req: 'Max 3' },
                    { label: 'Days Left', value: `${daysRemaining}`, req: '/ 21' },
                  ].map((s, i) => (
                    <div key={i} className="bg-foreground/[0.025] rounded-lg p-3 border border-border text-center">
                      <div className="metric-label mb-1">{s.label}</div>
                      <div className="font-mono text-base font-bold">{s.value}</div>
                      <div className="text-[9px] font-mono text-muted-foreground/50 mt-0.5">{s.req}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-25 pointer-events-none">
                <div className="space-y-3 w-full">
                  <div className="h-12 bg-foreground/[0.05] rounded-lg" />
                  <div className="h-12 bg-foreground/[0.05] rounded-lg" />
                  <div className="h-8 bg-foreground/[0.05] rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── CHALLENGE SECTION ─────────────────────────────────────────────────────────
function ChallengeSection() {
  const { profile } = useAuth();
  const { challenge } = useChallenge();
  const challengeStatus = profile?.challenge_status || 'none';
  const hasActiveChallenge = challengeStatus === 'active' && challenge;
  const daysRemaining = challenge?.ends_at ? Math.max(0, differenceInDays(new Date(challenge.ends_at), new Date())) : 0;

  const rules = [
    { label: 'Evaluation Period', value: '21 Days', icon: Clock },
    { label: 'Min Trading Days', value: '5 Days', icon: Activity },
    { label: 'Required Win Rate', value: '70%', icon: Trophy },
    { label: 'Max Position Size', value: '30%', icon: Target },
    { label: 'Max Open Positions', value: '3', icon: BarChart3 },
    { label: 'Max Drawdown', value: '30%', icon: AlertCircle },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Evaluation Progress" subtitle="Track your demo challenge performance in real time" />

      {/* Status banner */}
      <motion.div variants={item}>
        <div className={`glass rounded-xl p-5 border ${
          challengeStatus === 'active' ? 'border-primary/25 bg-primary/4' :
          challengeStatus === 'passed' ? 'border-emerald-500/25 bg-emerald-500/4' :
          challengeStatus === 'failed' ? 'border-red-500/25 bg-red-500/4' :
          challengeStatus === 'approved' ? 'border-emerald-500/30 bg-emerald-500/6' :
          'border-border'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label mb-1">Challenge Status</p>
              <span className={`text-xl font-display font-bold ${
                challengeStatus === 'active' ? 'text-primary' :
                challengeStatus === 'passed' || challengeStatus === 'approved' ? 'text-emerald-500' :
                challengeStatus === 'failed' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {challengeStatus === 'active' ? 'Active Evaluation' :
                 challengeStatus === 'passed' ? 'Passed — Pending Approval' :
                 challengeStatus === 'failed' ? 'Challenge Failed' :
                 challengeStatus === 'approved' ? 'Approved — Funded Trader' : 'No Active Challenge'}
              </span>
            </div>
            {challengeStatus === 'none' && (
              <Link href="/challenge">
                <Button className="font-mono uppercase tracking-wider text-xs rounded-xl">
                  Start Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress details */}
      {hasActiveChallenge && (
        <motion.div variants={item}>
          <div className="glass rounded-xl p-6">
            <p className="section-label mb-5 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Challenge Metrics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Challenge Day', value: `Day ${21 - daysRemaining}`, sub: 'of 21' },
                { label: 'Days Remaining', value: `${daysRemaining}`, sub: 'days left' },
                { label: 'Trading Days', value: `${challenge.trading_days}`, sub: '/ 5 required' },
                { label: 'Win Rate', value: `${challenge.win_rate}%`, sub: '≥ 70% required', highlight: challenge.win_rate >= 70 ? 'green' : 'amber' },
                { label: 'Drawdown', value: `${challenge.drawdown}%`, sub: '30% max', highlight: challenge.drawdown > 24 ? 'red' : 'default' },
                { label: 'Open Positions', value: `${challenge.open_positions}`, sub: '3 max' },
              ].map((m, i) => (
                <div key={i} className="bg-foreground/[0.025] rounded-xl p-4 border border-border">
                  <div className="metric-label mb-2">{m.label}</div>
                  <div className={`font-mono text-2xl font-bold ${
                    m.highlight === 'green' ? 'text-emerald-500' :
                    m.highlight === 'amber' ? 'text-amber-500' :
                    m.highlight === 'red' ? 'text-red-500' : 'text-foreground'
                  }`}>{m.value}</div>
                  <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-foreground/[0.025] rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="metric-label">Win Rate Progress (Target: 70%)</span>
                <span className="font-mono font-bold text-primary text-sm">{challenge.win_rate}% / 70%</span>
              </div>
              <div className="h-2.5 bg-foreground/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${challenge.win_rate >= 70 ? 'bg-emerald-500' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (challenge.win_rate / 70) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Challenge Rules */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Evaluation Rules</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rules.map(({ label, value, icon: Icon }, i) => (
              <div key={i} className="glass glass-hover rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-40" />
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold mb-1">{value}</div>
                  <div className="metric-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ANALYTICS SECTION ─────────────────────────────────────────────────────────
function AnalyticsSection() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Performance Analytics" subtitle="Detailed trading metrics powered by your Telegram bot" />

      <motion.div variants={item}>
        <div className="flex items-center gap-3 p-4 glass rounded-xl border border-primary/15 bg-primary/4">
          <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-xs font-mono text-muted-foreground">Analytics data flows in from your Telegram bot. Connect your bot to populate these metrics.</p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><LineChart className="w-3.5 h-3.5" /> Performance Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Trades', value: '—' }, { label: 'Winning Trades', value: '—' },
              { label: 'Losing Trades', value: '—' }, { label: 'Win Rate', value: '—' },
              { label: 'Average Winner', value: '—' }, { label: 'Average Loser', value: '—' },
              { label: 'Largest Win', value: '—', accent: 'green' }, { label: 'Largest Loss', value: '—', accent: 'red' },
              { label: 'Profit Factor', value: '—' }, { label: 'Avg Risk/Reward', value: '—' },
              { label: 'Avg Hold Time', value: '—' }, { label: 'Consistency Score', value: '—' },
            ].map((m, i) => (
              <MetricCard key={i} label={m.label} value={m.value} accent={m.accent} size="sm" />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> Trade Execution Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {[
              'Avg Entry MCap', 'Avg Exit MCap', 'Avg Position Size', 'Avg PnL %', 'Avg PnL (SOL)',
              'Peak Unrealized', 'Max Adverse Exc.', 'Stop Loss %', 'Take Profit %', 'Manual Close %',
            ].map((l, i) => (
              <div key={i} className="bg-foreground/[0.025] border border-border rounded-lg p-3.5 flex flex-col gap-1.5 hover:bg-foreground/[0.04] transition-colors">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">{l}</span>
                <span className="font-mono text-base font-semibold text-muted-foreground/20">—</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── PORTFOLIO SECTION ─────────────────────────────────────────────────────────
function PortfolioSection() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Portfolio" subtitle="Your current holdings and open positions" />

      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Portfolio Value', value: '—', accent: 'default' },
            { label: 'Unrealized PnL', value: '—', accent: 'amber' },
            { label: 'Realized PnL', value: '—', accent: 'green' },
          ].map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} accent={m.accent} size="lg" />
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> Holdings Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Open Positions', value: '—' },
              { label: 'Avg Position Value', value: '—' },
              { label: 'Largest Holding', value: '—' },
              { label: 'Current Exposure', value: '—' },
            ].map((m, i) => (
              <MetricCard key={i} label={m.label} value={m.value} size="sm" />
            ))}
          </div>

          <p className="section-label mb-3">Open Positions</p>
          <div className="bg-foreground/[0.02] rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-5 md:grid-cols-9 gap-2 p-3 bg-foreground/[0.03] border-b border-border">
              {['Token', 'Entry MCap', 'Curr MCap', 'Invested', 'Value', 'PnL %', 'PnL SOL', 'Hold Time', 'Status'].map((h, i) => (
                <span key={i} className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider hidden md:block first:block">{h}</span>
              ))}
            </div>
            <EmptyState
              icon={Wallet}
              title="No open positions"
              desc="Connect your Telegram bot to trade"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ORDERS SECTION ────────────────────────────────────────────────────────────
function OrdersSection() {
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState<'all' | 'pending_payment' | 'confirmed' | 'expired'>('all');
  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  const tabs = ['all', 'confirmed', 'pending_payment', 'expired'] as const;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Order History" subtitle="All your challenge purchases and payment records" />

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="section-label flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Transactions</p>
            <div className="flex gap-1 bg-foreground/[0.04] p-1 rounded-lg border border-border">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-foreground/[0.02] rounded-xl border border-border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <EmptyState icon={Award} title="No orders found" desc="Your challenge purchases will appear here" />
            ) : (
              <div className="divide-y divide-border">
                {filteredOrders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-foreground/[0.02] transition-colors">
                    <div>
                      <div className="font-medium text-foreground text-sm capitalize">{order.challenge_plan} Challenge</div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">{format(new Date(order.created_at), 'MMM dd, yyyy · HH:mm')}</div>
                      {order.tx_signature && (
                        <div className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">TX: {order.tx_signature.slice(0, 12)}...</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm">${order.purchase_price_usd}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{order.required_sol} SOL</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {order.status === 'confirmed' && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Confirmed</span>
                        )}
                        {order.status === 'pending_payment' && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">Pending</span>
                        )}
                        {order.status === 'expired' && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Expired</span>
                        )}
                        {order.status === 'failed' && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Failed</span>
                        )}
                        {order.status === 'pending_payment' && (
                          <Link href={`/payment/${order.id}`}>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] font-mono uppercase rounded-lg">Pay Now</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── REFERRALS SECTION ─────────────────────────────────────────────────────────
function ReferralsSection() {
  const { profile } = useAuth();
  const { stats, isLoading: statsLoading, isSubmitting, pendingWithdrawal, requestWithdrawal } = useReferrals();
  const [, setLocation] = useLocation();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  const referralLink = `https://fundedfrens.com/signup?ref=${profile?.referral_code || ''}`;

  const handleWithdrawal = async () => {
    if (!profile?.payout_wallet) {
      toast.error('No payout wallet set. Please add one in your Profile first.');
      setLocation('/profile');
      return;
    }
    const result = await requestWithdrawal();
    if (result.success) {
      toast.success('Withdrawal request submitted! We will process it within 24–48 hours.');
    } else {
      toast.error(result.error ?? 'Failed to submit withdrawal request.');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Referral Center" subtitle="Invite traders and earn 10% of their first successful challenge" />

      {/* Code + Link */}
      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6 relative overflow-hidden border border-primary/15">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/50" />
          <p className="section-label mb-2 flex items-center gap-2 text-primary"><TrendingUp className="w-3.5 h-3.5" /> Your Referral</p>
          <h3 className="font-display text-xl font-bold mb-5">Refer &amp; Earn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="metric-label mb-2">Referral Code</div>
              <div className="flex items-center bg-foreground/[0.04] border border-primary/20 rounded-xl overflow-hidden">
                <div className="px-4 py-3 font-mono text-lg tracking-widest text-primary font-bold flex-1">{profile?.referral_code || '—'}</div>
                <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary h-auto py-3 px-3 rounded-none border-l border-primary/15"
                  onClick={() => handleCopy(profile?.referral_code || '', 'Referral code')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="metric-label mb-2">Referral Link</div>
              <div className="flex items-center bg-foreground/[0.04] border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 font-mono text-xs text-muted-foreground flex-1 truncate">{referralLink}</div>
                <Button size="sm" variant="ghost" className="hover:bg-foreground/[0.06] h-auto py-3 px-3 rounded-none border-l border-border"
                  onClick={() => handleCopy(referralLink, 'Referral link')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse h-20" />
            ))
          ) : (
            <>
              <MetricCard label="Successful Referrals" value={String(stats.successfulReferrals)} />
              <MetricCard label="Pending Rewards" value={`${stats.pendingRewards.toFixed(2)}`} accent="amber" />
              <MetricCard label="Paid Out" value={`${stats.creditedRewards.toFixed(2)}`} accent="green" />
              <MetricCard label="Total Earnings" value={`${stats.totalEarnings.toFixed(2)}`} />
            </>
          )}
        </div>
      </motion.div>

      {/* Withdrawal */}
      {!statsLoading && stats.creditedRewards > 0 && (
        <motion.div variants={item}>
          <div className="glass rounded-xl p-6 border border-emerald-500/15 bg-emerald-500/4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="section-label mb-1 text-emerald-500 flex items-center gap-2"><Send className="w-3.5 h-3.5" /> Available to Withdraw</p>
                <p className="font-mono text-2xl font-bold text-emerald-400">${stats.creditedRewards.toFixed(2)}</p>
                {pendingWithdrawal && (
                  <p className="text-xs font-mono text-amber-500/80 mt-1">Withdrawal pending — submitted {new Date(pendingWithdrawal.created_at).toLocaleDateString()}</p>
                )}
                {!profile?.payout_wallet && (
                  <p className="text-xs font-mono text-muted-foreground mt-1">Set a payout wallet in your Profile first.</p>
                )}
              </div>
              <Button
                onClick={handleWithdrawal}
                disabled={isSubmitting || !!pendingWithdrawal}
                className="font-mono uppercase tracking-wider text-xs shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : pendingWithdrawal ? 'Request Pending' : 'Request Withdrawal'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* How it works */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Share Your Code', desc: 'Give friends your referral code or link. They use it during signup.' },
              { step: '02', title: 'They Purchase a Challenge', desc: 'Your referee just needs to purchase a challenge — that\'s all it takes for you to earn your bonus.' },
              { step: '03', title: 'You Earn 10%', desc: 'You automatically receive 10% of their challenge fee. No hidden conditions.' },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="bg-foreground/[0.025] rounded-xl p-5 border border-border">
                <div className="font-mono text-xs text-muted-foreground/40 font-bold mb-2">{step}</div>
                <h4 className="font-display font-semibold mb-2">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── TELEGRAM SECTION ──────────────────────────────────────────────────────────
function TelegramSection() {
  const { profile } = useAuth();
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Telegram Connection" subtitle="Link your Telegram account to receive alerts and execute trades" />

      {profile?.telegram_linked ? (
        <motion.div variants={item}>
          <div className="glass rounded-2xl p-8 border border-emerald-500/20 bg-emerald-500/4">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="section-label mb-1 text-emerald-500/70">Connection Status</p>
                <h3 className="font-display text-xl font-bold text-emerald-400 mb-2">Telegram Connected</h3>
                <p className="text-sm text-muted-foreground font-mono mb-4">Your account is linked to Telegram ID: <span className="text-foreground">{profile.telegram_id}</span></p>
                <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider rounded-xl border-border">
                  <RefreshCw className="w-3 h-3 mr-2" /> Reconnect Bot
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <div className="glass rounded-2xl p-8">
            <p className="section-label mb-5 flex items-center gap-2 text-primary/80"><MessageCircle className="w-3.5 h-3.5" /> Setup Instructions</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { step: '1', title: 'Copy Your Code', desc: 'Copy your personal link code below. Keep it private.' },
                { step: '2', title: 'Open @hoodfundbot', desc: 'Open Telegram and start a chat with @hoodfundbot.' },
                { step: '3', title: 'Send Link Command', desc: 'Send the command: /link YOUR_CODE to the bot.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-foreground/[0.025] rounded-xl p-5 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-sm mb-3">{step}</div>
                  <h4 className="font-display font-semibold mb-2">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="metric-label mb-2">Your Link Code</div>
              <div className="flex items-center bg-foreground/[0.04] border border-border rounded-xl overflow-hidden max-w-sm">
                <div className="px-4 py-3 bg-foreground/[0.04] font-mono text-xs text-muted-foreground border-r border-border uppercase tracking-widest">CODE</div>
                <div className="px-4 py-3 font-mono text-lg tracking-widest flex-1">{profile?.telegram_link_code || '—'}</div>
                <Button variant="ghost" size="icon" className="rounded-none h-auto py-3 px-3 hover:bg-foreground/[0.06] border-l border-border"
                  onClick={() => handleCopy(profile?.telegram_link_code || '', 'Link code')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <a href="https://t.me/hoodfundbot" target="_blank" rel="noopener noreferrer">
              <Button className="font-mono uppercase tracking-wider rounded-xl">
                <MessageCircle className="w-4 h-4 mr-2" /> Open @hoodfundbot <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── PROFILE SUMMARY SECTION ───────────────────────────────────────────────────
function ProfileSummarySection() {
  const { profile, user } = useAuth();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-start justify-between">
        <SectionHeader title="Profile" subtitle="Your account details and configuration" />
        <Link href="/profile">
          <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider rounded-xl border-border mt-1">
            Edit Profile <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Username', value: profile?.username || '—' },
              { label: 'Email', value: user?.email || '—' },
              { label: 'Payout Wallet', value: profile?.payout_wallet ? `${profile.payout_wallet.slice(0, 6)}...${profile.payout_wallet.slice(-6)}` : 'Not set' },
              { label: 'Account Created', value: profile?.created_at ? format(new Date(profile.created_at), 'MMM dd, yyyy') : '—' },
              { label: 'Challenge Status', value: profile?.challenge_status?.replace('_', ' ') || 'None' },
              { label: 'Telegram Status', value: profile?.telegram_linked ? 'Connected' : 'Not connected' },
              { label: 'Referral Code', value: profile?.referral_code || '—' },
              { label: 'Reliability Rating', value: profile?.reliability_rating ? `${profile.reliability_rating} / 100` : '—' },
            ].map(({ label, value }, i) => (
              <div key={i} className="flex justify-between items-center py-3.5 px-4 bg-foreground/[0.025] rounded-xl border border-border">
                <span className="metric-label">{label}</span>
                <span className="text-sm font-mono text-foreground/90 truncate max-w-[60%] text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── FUNDED ACCOUNT SECTION ────────────────────────────────────────────────────
function FundedSection() {
  const { profile } = useAuth();
  const challengeStatus = profile?.challenge_status || 'none';
  const isApproved = challengeStatus === 'approved';

  const benefits = [
    { title: 'Higher Capital', desc: 'Access to larger trading capital based on your proven track record.' },
    { title: 'Profit Split', desc: 'Keep up to 80% of all profits generated on your funded account.' },
    { title: 'Priority Withdrawals', desc: 'Faster payout processing for funded account traders.' },
    { title: 'Exclusive Features', desc: 'Access to advanced analytics and priority support.' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Funded Account" subtitle="Unlock real trading capital after passing your evaluation" />

      <motion.div variants={item}>
        <div className={`glass rounded-2xl p-10 relative overflow-hidden ${isApproved ? 'border border-emerald-500/25' : 'border border-primary/15'}`}>
          {isApproved && <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/60" />}
          {!isApproved && <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/40" />}
          <div className="relative z-10 text-center">
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center border ${
              isApproved ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-foreground/[0.04] border-border'
            }`}>
              {isApproved
                ? <Unlock className="w-10 h-10 text-emerald-400" />
                : <Lock className="w-10 h-10 text-muted-foreground/40" />
              }
            </div>
            <p className={`section-label mb-2 ${isApproved ? 'text-emerald-500' : 'text-primary/60'}`}>
              {isApproved ? 'Active Allocation' : 'Funded Account'}
            </p>
            <h2 className="text-3xl font-display font-bold mb-3">
              {isApproved ? 'Live Capital Deployed' : 'Locked'}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto font-mono text-sm leading-relaxed">
              {isApproved
                ? 'You are managing live firm capital. Adhere strictly to risk parameters to maintain access. Profit splits processed at month end.'
                : 'Complete your Demo Challenge and receive approval to unlock your funded trading account.'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <p className="section-label mb-5 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Benefits</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map(({ title, desc }, i) => (
              <div key={i} className="bg-foreground/[0.025] rounded-xl p-4 border border-border flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm mb-1">{title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}

function DashboardContent() {
  const { activeSection } = useDashboardContext();

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'challenge' && <ChallengeSection />}
        {activeSection === 'analytics' && <AnalyticsSection />}
        {activeSection === 'portfolio' && <PortfolioSection />}
        {activeSection === 'orders' && <OrdersSection />}
        {activeSection === 'referrals' && <ReferralsSection />}
        {activeSection === 'telegram' && <TelegramSection />}
        {activeSection === 'profile' && <ProfileSummarySection />}
        {activeSection === 'funded' && <FundedSection />}
      </motion.div>
    </AnimatePresence>
  );
}
