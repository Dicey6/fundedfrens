import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Users, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const features = [
  { icon: TrendingUp, text: 'Real-time performance tracking & analytics' },
  { icon: ShieldCheck, text: 'Institutional-grade risk management rules' },
  { icon: Zap, text: 'Instant payments — Solana & Robinhood Chain' },
  { icon: Users, text: 'Active trader community & Telegram alerts' },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<10ms', label: 'Latency' },
  { value: '24/7', label: 'Support' },
  { value: '80%', label: 'Profit split' },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* ── Left panel — branding ── */}
      <div className="hidden md:flex md:w-[50%] lg:w-[48%] flex-col justify-between relative overflow-hidden bg-sidebar border-r border-border">

        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/20" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px]" />
        </div>

        <div className="relative z-10 p-10 lg:p-14 flex flex-col h-full justify-between">

          {/* Top: logo + badge */}
          <div>
            <div className="flex items-center justify-between mb-14">
              <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-black font-display font-bold text-sm">FF</span>
                  </div>
                  <span className="font-display font-bold text-xl text-foreground tracking-tight">FundedFrens</span>
                </div>
              </Link>
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live
              </span>
            </div>

            {/* Hero headline */}
            <div className="mb-12">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-4">
                Crypto Prop Trading
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground mb-5">
                Trade with<br />
                discipline.<br />
                <span className="text-primary">Unlock capital.</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Prove your edge on a demo account. Hit the targets. Get funded with real firm capital and keep 80% of profits.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom: stats row */}
          <div className="mt-10">
            <div className="h-px bg-border mb-8" />
            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ value, label }) => (
                <div key={label} className="glass rounded-xl p-3 text-center">
                  <div className="font-mono font-bold text-foreground text-base leading-none mb-1.5">{value}</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 relative">

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <span className="text-black font-display font-bold text-xl">FF</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">FundedFrens</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">Crypto Prop Trading</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-display font-semibold tracking-tight text-foreground mb-2">{title}</h2>
              {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>

            {children}
          </motion.div>

          <div className="md:hidden mt-10 flex items-center justify-center gap-2 text-[10px] font-mono text-muted-foreground/50">
            <CheckCircle className="w-3 h-3 text-primary/50" />
            <span className="uppercase tracking-widest">Secure · Encrypted · Non-custodial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
