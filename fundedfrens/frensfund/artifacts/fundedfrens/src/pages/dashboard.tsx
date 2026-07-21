import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardLayout, useDashboardContext } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { useChallenge } from '@/hooks/use-challenge';
import { useOrders } from '@/hooks/use-orders';
import {
  Shield, Wallet, Trophy, Target, Award, Copy,
  TrendingUp, Activity, BarChart3, LineChart, CheckCircle2,
  AlertCircle, Lock, Unlock, Bell, BellRing,
  Clock, ArrowRight, Users, MessageCircle,
  ChevronRight, ExternalLink, RefreshCw, Check
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' } }),
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

function MetricCard({ label, value, accent = 'default', size = 'md' }: { label: string; value: string; accent?: string; size?: 'sm' | 'md' | 'lg' }) {
  const accentClass =
    accent === 'green' ? 'from-emerald-500/60 to-transparent' :
    accent === 'red' ? 'from-red-500/60 to-transparent' :
    accent === 'amber' ? 'from-amber-400/60 to-transparent' :
    accent === 'sky' ? 'from-sky-400/60 to-transparent' :
    'from-primary/60 to-transparent';
  return (
    <div className="glass glass-hover rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentClass} opacity-60`} />
      <span className="metric-label leading-none">{label}</span>
      <span className={`font-mono font-bold leading-none ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'} ${value === '—' ? 'text-muted-foreground/30' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-display font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground font-mono mt-1">{subtitle}</p>}
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
    { label: 'Challenge', section: 'challenge' as const, icon: Target, color: 'from-primary/20 to-primary/5' },
    { label: 'Analytics', section: 'analytics' as const, icon: BarChart3, color: 'from-sky-500/20 to-sky-500/5' },
    { label: 'Portfolio', section: 'portfolio' as const, icon: Wallet, color: 'from-emerald-500/20 to-emerald-500/5' },
    { label: 'Referrals', section: 'referrals' as const, icon: Users, color: 'from-amber-500/20 to-amber-500/5' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      {/* Welcome header */}
      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
            <Activity className="w-64 h-64" />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="section-label mb-2 text-primary/80">Trading Terminal</div>
              <h1 className="text-3xl font-display font-bold tracking-tight">
                Welcome back, <span className="text-primary">{profile?.username || 'Trader'}</span>
              </h1>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {challengeStatus === 'active' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active Evaluation
                  </span>
                )}
                {challengeStatus === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-3 h-3" /> Live Funded Account
                  </span>
                )}
                {hasActiveChallenge && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-muted-foreground border border-white/10">
                    <Clock className="w-3 h-3" /> {daysRemaining} Days Left
                  </span>
                )}
                {challengeStatus === 'none' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-muted-foreground border border-white/10">
                    No Challenge Active
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg bg-black/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Live Data</span>
              </div>
              {challengeStatus === 'none' && (
                <Link href="/challenge">
                  <Button className="font-mono uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(139,92,246,0.3)]">
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
          {quickLinks.map(({ label, section, icon: Icon, color }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className="glass glass-hover rounded-xl p-4 flex items-center gap-3 text-left group"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-foreground/70" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Account overview */}
      <motion.div variants={item}>
        <div className="section-label mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Account Overview</div>
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

      {/* Challenge snapshot + Risk at a glance */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge snapshot */}
          <div className="glass rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="section-label flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Challenge Snapshot</div>
              <button onClick={() => setActiveSection('challenge')} className="text-[10px] font-mono text-primary/70 hover:text-primary flex items-center gap-1">
                Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {hasActiveChallenge ? (
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-lg p-3 border border-white/[0.04]">
                    <div className="metric-label mb-1">Challenge Day</div>
                    <div className="font-mono text-lg font-bold">Day {21 - daysRemaining} <span className="text-xs text-muted-foreground">/ 21</span></div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/[0.04]">
                    <div className="metric-label mb-1">Trading Days</div>
                    <div className="font-mono text-lg font-bold">{challenge.trading_days} <span className="text-xs text-muted-foreground">/ 5</span></div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/[0.04]">
                    <div className="metric-label mb-1">Win Rate</div>
                    <div className={`font-mono text-lg font-bold ${challenge.win_rate >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{challenge.win_rate}%</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 border border-white/[0.04]">
                    <div className="metric-label mb-1">Drawdown</div>
                    <div className={`font-mono text-lg font-bold ${challenge.drawdown > 40 ? 'text-red-400' : challenge.drawdown > 30 ? 'text-amber-400' : 'text-foreground'}`}>{challenge.drawdown}%</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="metric-label">Evaluation Progress</span>
                    <span className="font-mono text-xs font-bold text-primary">{challenge.challenge_progress}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, challenge.challenge_progress)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-black/10 rounded-lg border border-dashed border-white/10">
                <Target className="w-10 h-10 text-muted-foreground/20 mb-3" />
                <p className="text-xs font-mono text-muted-foreground mb-4 max-w-xs">No active evaluation. Purchase a Demo Challenge to begin.</p>
                <Link href="/challenge">
                  <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                    View Plans
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Risk at a glance */}
          <div className="glass rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="section-label flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" /> Risk Parameters</div>
              {hasActiveChallenge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Within Limits
                </span>
              )}
            </div>
            {hasActiveChallenge ? (
              <div className="space-y-4 flex-1">
                {[
                  { label: 'Max Drawdown (50% Limit)', value: challenge.drawdown, max: 50 },
                ].map((r, i) => (
                  <div key={i} className="p-4 bg-black/20 rounded-lg border border-white/[0.04]">
                    <div className="flex justify-between items-end mb-2">
                      <span className="metric-label">{r.label}</span>
                      <span className="font-mono font-bold text-sm">{r.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${r.value > r.max * 0.8 ? 'bg-red-500' : r.value > r.max * 0.5 ? 'bg-amber-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(100, (r.value / r.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Win Rate', value: `${challenge.win_rate}%`, req: '≥75%' },
                    { label: 'Positions', value: `${challenge.open_positions}`, req: 'Max 3' },
                    { label: 'Days Left', value: `${daysRemaining}`, req: '/ 21' },
                  ].map((s, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-3 border border-white/[0.04] text-center">
                      <div className="metric-label mb-1">{s.label}</div>
                      <div className="font-mono text-base font-bold">{s.value}</div>
                      <div className="text-[9px] font-mono text-muted-foreground/50 mt-0.5">{s.req}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                <div className="space-y-3 w-full">
                  <div className="h-12 bg-white/5 rounded-lg" />
                  <div className="h-12 bg-white/5 rounded-lg" />
                  <div className="h-8 bg-white/5 rounded-lg" />
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
    { label: 'Required Win Rate', value: '75%', icon: Trophy },
    { label: 'Max Position Size', value: '30%', icon: Target },
    { label: 'Max Open Positions', value: '3', icon: BarChart3 },
    { label: 'Max Drawdown', value: '50%', icon: AlertCircle },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Evaluation Progress" subtitle="Track your demo challenge performance in real time" />

      {/* Status banner */}
      <motion.div variants={item}>
        <div className={`glass rounded-xl p-5 border ${
          challengeStatus === 'active' ? 'border-primary/25 bg-primary/5' :
          challengeStatus === 'passed' ? 'border-emerald-500/25 bg-emerald-500/5' :
          challengeStatus === 'failed' ? 'border-red-500/25 bg-red-500/5' :
          challengeStatus === 'approved' ? 'border-emerald-500/30 bg-emerald-500/8' :
          'border-white/[0.06]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="section-label mb-1">Challenge Status</div>
              <div className="flex items-center gap-3">
                <span className={`text-xl font-display font-bold ${
                  challengeStatus === 'active' ? 'text-primary' :
                  challengeStatus === 'passed' || challengeStatus === 'approved' ? 'text-emerald-400' :
                  challengeStatus === 'failed' ? 'text-red-400' : 'text-muted-foreground'
                }`}>
                  {challengeStatus === 'active' ? 'Active Evaluation' :
                   challengeStatus === 'passed' ? 'Passed — Pending Approval' :
                   challengeStatus === 'failed' ? 'Challenge Failed' :
                   challengeStatus === 'approved' ? 'Approved — Funded Trader' : 'No Active Challenge'}
                </span>
              </div>
            </div>
            {challengeStatus === 'none' && (
              <Link href="/challenge">
                <Button className="font-mono uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(139,92,246,0.3)]">
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
            <div className="section-label mb-5 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Challenge Metrics</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Challenge Day', value: `Day ${21 - daysRemaining}`, sub: 'of 21' },
                { label: 'Days Remaining', value: `${daysRemaining}`, sub: 'days left' },
                { label: 'Trading Days', value: `${challenge.trading_days}`, sub: '/ 5 required' },
                { label: 'Win Rate', value: `${challenge.win_rate}%`, sub: '≥ 75% required', highlight: challenge.win_rate >= 75 ? 'green' : 'amber' },
                { label: 'Drawdown', value: `${challenge.drawdown}%`, sub: '50% max', highlight: challenge.drawdown > 40 ? 'red' : 'default' },
                { label: 'Open Positions', value: `${challenge.open_positions}`, sub: '3 max' },
              ].map((m, i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4 border border-white/[0.04]">
                  <div className="metric-label mb-2">{m.label}</div>
                  <div className={`font-mono text-2xl font-bold ${
                    m.highlight === 'green' ? 'text-emerald-400' :
                    m.highlight === 'amber' ? 'text-amber-400' :
                    m.highlight === 'red' ? 'text-red-400' : 'text-foreground'
                  }`}>{m.value}</div>
                  <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">{m.sub}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="p-4 bg-black/20 rounded-lg border border-white/[0.04]">
              <div className="flex justify-between items-center mb-2">
                <span className="metric-label">Win Rate Progress (Target: 75%)</span>
                <span className="font-mono font-bold text-primary text-sm">{challenge.win_rate}% / 75%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${challenge.win_rate >= 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-primary to-purple-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (challenge.win_rate / 75) * 100)}%` }}
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
          <div className="section-label mb-5 flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Evaluation Rules</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rules.map(({ label, value, icon: Icon }, i) => (
              <div key={i} className="glass glass-hover rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
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

      {/* Telegram notice */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-4 border border-primary/15 bg-primary/5 flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-xs font-mono text-muted-foreground">Analytics data flows in from your Telegram bot. Connect your bot to populate these metrics.</p>
        </div>
      </motion.div>

      {/* Performance metrics */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="section-label mb-5 flex items-center gap-2"><LineChart className="w-3.5 h-3.5 text-primary/60" /> Performance Metrics</div>
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

      {/* Trading analytics */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="section-label mb-5 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-primary/60" /> Trade Execution Metrics</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {[
              'Avg Entry MCap', 'Avg Exit MCap', 'Avg Position Size', 'Avg PnL %', 'Avg PnL (SOL)',
              'Peak Unrealized', 'Max Adverse Exc.', 'Stop Loss %', 'Take Profit %', 'Manual Close %',
            ].map((l, i) => (
              <div key={i} className="bg-black/20 border border-white/[0.03] rounded-lg p-3.5 flex flex-col gap-1.5 hover:bg-black/30 transition-colors">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">{l}</span>
                <span className="font-mono text-base font-semibold text-muted-foreground/25">—</span>
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
          <div className="section-label mb-5 flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> Holdings Summary</div>
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

          {/* Open Positions Table */}
          <div className="section-label mb-3">Open Positions</div>
          <div className="bg-black/10 rounded-xl border border-white/[0.03] overflow-hidden">
            <div className="grid grid-cols-5 md:grid-cols-9 gap-2 p-3 bg-black/20 border-b border-white/[0.05]">
              {['Token', 'Entry MCap', 'Curr MCap', 'Invested', 'Value', 'PnL %', 'PnL SOL', 'Hold Time', 'Status'].map((h, i) => (
                <span key={i} className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider hidden md:block first:block">{h}</span>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/40">
              <Wallet className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-xs font-mono uppercase tracking-widest">No open positions</p>
              <p className="text-[10px] font-mono text-muted-foreground/30 mt-1">Connect your Telegram bot to trade</p>
            </div>
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Order History" subtitle="All your challenge purchases and payment records" />

      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="section-label flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Transactions</div>
            <div className="flex gap-2 bg-black/30 p-1 rounded-lg border border-white/[0.05]">
              {(['all', 'confirmed', 'pending_payment', 'expired'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white/10 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/10 rounded-xl border border-white/[0.03] overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <span className="font-mono text-sm text-muted-foreground animate-pulse">Loading orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground/40">
                <Award className="w-8 h-8 mb-2 opacity-40" />
                <span className="font-mono text-xs uppercase tracking-widest">No orders found</span>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filteredOrders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="font-display font-medium text-foreground text-sm capitalize">{order.challenge_plan} Challenge</div>
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
                          <Link href={`/payment/${order.id}`}>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] font-mono uppercase">Pay Now</Button>
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
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };
  const referralLink = `https://fundedfrens.com/signup?ref=${profile?.referral_code || ''}`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <SectionHeader title="Referral Center" subtitle="Invite traders and earn 10% of their first successful challenge" />

      {/* Code + Link */}
      <motion.div variants={item}>
        <div className="glass glass-primary rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="section-label mb-2 text-primary/80 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Your Referral</div>
            <h3 className="font-display text-xl font-bold mb-5">Refer &amp; Earn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="metric-label mb-2">Referral Code</div>
                <div className="flex items-center bg-black/30 border border-primary/20 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 font-mono text-lg tracking-widest text-primary font-bold flex-1">{profile?.referral_code || '—'}</div>
                  <Button size="sm" variant="ghost" className="hover:bg-primary/20 hover:text-primary h-auto py-3 px-3 rounded-none border-l border-primary/20"
                    onClick={() => handleCopy(profile?.referral_code || '', 'Referral code')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="metric-label mb-2">Referral Link</div>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 font-mono text-xs text-muted-foreground flex-1 truncate">{referralLink}</div>
                  <Button size="sm" variant="ghost" className="hover:bg-white/10 h-auto py-3 px-3 rounded-none border-l border-white/10"
                    onClick={() => handleCopy(referralLink, 'Referral link')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Successful Referrals', value: '—' },
            { label: 'Pending Rewards', value: '$0.00', accent: 'amber' },
            { label: 'Paid Out', value: '$0.00', accent: 'green' },
            { label: 'Total Earnings', value: '$0.00', accent: 'default' },
          ].map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} accent={m.accent} />
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="section-label mb-5 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> How It Works</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Share Your Code', desc: 'Give friends your referral code or link. They use it during signup.' },
              { step: '02', title: 'They Pass a Challenge', desc: 'Your referee purchases and completes a Demo Challenge successfully.' },
              { step: '03', title: 'You Earn 10%', desc: 'You automatically receive 10% of their challenge fee. No hidden conditions.' },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="bg-black/20 rounded-xl p-5 border border-white/[0.04]">
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

// ── NOTIFICATIONS SECTION ─────────────────────────────────────────────────────
function NotificationsSection() {
  const { notifications, isLoading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-start justify-between">
        <SectionHeader title="Notifications" subtitle="System events and platform updates" />
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="font-mono text-xs uppercase tracking-wider border-white/10 mt-1">
            Mark all read
          </Button>
        )}
      </div>

      <motion.div variants={item}>
        <div className="glass rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
              <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-3" />
              <p className="font-mono text-xs uppercase tracking-widest">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
              <BellRing className="w-10 h-10 mb-3 opacity-40" />
              <p className="font-mono text-xs uppercase tracking-widest">No notifications yet</p>
              <p className="text-[10px] font-mono text-muted-foreground/30 mt-1">Activity will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`p-5 flex gap-4 cursor-pointer transition-colors ${notif.read ? 'hover:bg-white/[0.02]' : 'bg-primary/5 hover:bg-primary/8'}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-white/20' : 'bg-primary animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.8)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${notif.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>{notif.message}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mt-1.5">
                      {format(new Date(notif.created_at), 'HH:mm · MMM dd, yyyy')}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="text-[9px] font-mono text-primary/70 border border-primary/20 px-1.5 py-0.5 rounded h-fit mt-0.5">NEW</span>
                  )}
                </div>
              ))}
            </div>
          )}
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
          <div className="glass rounded-2xl p-8 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="section-label mb-1 text-emerald-400/70">Connection Status</div>
                <h3 className="font-display text-xl font-bold text-emerald-400 mb-2">Telegram Connected</h3>
                <p className="text-sm text-muted-foreground font-mono mb-4">Your account is linked to Telegram ID: <span className="text-foreground">{profile.telegram_id}</span></p>
                <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider border-white/10">
                  <RefreshCw className="w-3 h-3 mr-2" /> Reconnect Bot
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div variants={item}>
            <div className="glass rounded-2xl p-8 border border-white/[0.06]">
              <div className="section-label mb-5 flex items-center gap-2 text-primary/80"><MessageCircle className="w-3.5 h-3.5" /> Setup Instructions</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { step: '1', title: 'Copy Your Code', desc: 'Copy your personal link code below. Keep it private.' },
                  { step: '2', title: 'Open FundedFrensBot', desc: 'Open Telegram and start a chat with @FundedFrensBot.' },
                  { step: '3', title: 'Send Link Command', desc: 'Send the command: /link YOUR_CODE to the bot.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="bg-black/20 rounded-xl p-5 border border-white/[0.04]">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-sm mb-3">{step}</div>
                    <h4 className="font-display font-semibold mb-2">{title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Link code */}
              <div className="mb-4">
                <div className="metric-label mb-2">Your Link Code</div>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-lg overflow-hidden max-w-sm">
                  <div className="px-4 py-3 bg-white/5 font-mono text-xs text-muted-foreground border-r border-white/10 uppercase tracking-widest">CODE</div>
                  <div className="px-4 py-3 font-mono text-lg tracking-widest flex-1">{profile?.telegram_link_code || '—'}</div>
                  <Button variant="ghost" size="icon" className="rounded-none h-auto py-3 px-3 hover:bg-white/10 border-l border-white/10"
                    onClick={() => handleCopy(profile?.telegram_link_code || '', 'Link code')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <a href="https://t.me/FundedFrensBot" target="_blank" rel="noopener noreferrer">
                <Button className="font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <MessageCircle className="w-4 h-4 mr-2" /> Open FundedFrensBot <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </>
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
          <Button variant="outline" size="sm" className="font-mono uppercase text-xs tracking-wider border-white/10 mt-1">
            Edit Profile <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      <motion.div variants={item}>
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div key={i} className="flex justify-between items-center py-3.5 px-4 bg-black/20 rounded-xl border border-white/[0.04]">
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
        <div className={`glass rounded-2xl p-10 relative overflow-hidden ${isApproved ? 'border-emerald-500/30' : 'border-primary/15'}`}>
          <div className={`absolute inset-0 pointer-events-none ${isApproved ? 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent' : 'bg-gradient-to-br from-primary/5 via-transparent to-transparent'}`} />
          <div className="relative z-10 text-center">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border ${isApproved ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'glass-primary border-primary/20'}`}>
              {isApproved ? <Unlock className="w-12 h-12 text-emerald-400" /> : <Lock className="w-12 h-12 text-primary/50" />}
            </div>
            <div className={`section-label mb-2 ${isApproved ? 'text-emerald-400' : 'text-primary/60'}`}>
              {isApproved ? 'Active Allocation' : 'FUNDED ACCOUNT'}
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              {isApproved ? 'Live Capital Deployed' : <><span className="font-mono">🔒</span> Locked</>}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto font-mono text-sm leading-relaxed">
              {isApproved
                ? 'You are managing live firm capital. Adhere strictly to risk parameters to maintain access. Profit splits processed at month end.'
                : 'Complete your Demo Challenge and receive approval to unlock your funded trading account.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div variants={item}>
        <div className="glass rounded-xl p-6">
          <div className="section-label mb-5 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Future Benefits</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map(({ title, desc }, i) => (
              <div key={i} className="bg-black/20 rounded-xl p-4 border border-white/[0.04] flex gap-3">
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

// ── MAIN DASHBOARD COMPONENT ──────────────────────────────────────────────────
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
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'challenge' && <ChallengeSection />}
        {activeSection === 'analytics' && <AnalyticsSection />}
        {activeSection === 'portfolio' && <PortfolioSection />}
        {activeSection === 'orders' && <OrdersSection />}
        {activeSection === 'referrals' && <ReferralsSection />}
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'telegram' && <TelegramSection />}
        {activeSection === 'profile' && <ProfileSummarySection />}
        {activeSection === 'funded' && <FundedSection />}
      </motion.div>
    </AnimatePresence>
  );
}

