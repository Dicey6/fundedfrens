import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Zap, Users, CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const features = [
  { icon: TrendingUp, text: 'Real-time performance tracking & analytics' },
  { icon: ShieldCheck, text: 'Institutional-grade risk management rules' },
  { icon: Zap, text: 'Instant SOL payments — no fiat friction' },
  { icon: Users, text: 'Active trader community & Telegram alerts' },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<10ms', label: 'Latency' },
  { value: '24/7', label: 'Support' },
  { value: '$500K', label: 'Max Capital' },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* ── Left panel — branding & value props ── */}
      <div className="hidden md:flex md:w-[52%] lg:w-1/2 flex-col justify-between relative overflow-hidden bg-sidebar">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Ambient glow top-right */}
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          {/* Ambient glow bottom-left */}
          <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-accent/8 blur-[100px]" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-10 lg:p-14 flex flex-col h-full justify-between">

          {/* Top: logo + trust badge */}
          <div>
            <div className="flex items-center justify-between mb-14">
              <div className="flex items-center gap-3">
                <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-10 h-10 rounded-xl object-cover shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                <span className="font-display font-bold text-xl text-foreground tracking-tight">FundedFrens</span>
              </div>
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Platform
              </span>
            </div>

            {/* Hero headline */}
            <div className="mb-10">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary/70 mb-4">
                Crypto Prop Trading
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight text-foreground mb-5">
                Trade with<br />
                discipline.<br />
                <span className="text-primary relative">
                  Unlock capital.
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-primary/60 to-transparent" />
                </span>
              </h1>
              <p className="text-muted-foreground text-sm font-mono leading-relaxed max-w-sm">
                Prove your edge on a demo account. Hit the targets. Get funded with real firm capital.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground/90 font-sans">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom: stats row */}
          <div className="mt-10">
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />
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
        {/* Subtle inner glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
            <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-14 h-14 rounded-2xl object-cover shadow-[0_0_28px_rgba(139,92,246,0.4)] mb-4" />
            <span className="font-display font-bold text-2xl text-foreground">FundedFrens</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">Crypto Prop Trading</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-display font-semibold tracking-tight text-foreground mb-2">{title}</h2>
              {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>

            {children}
          </motion.div>

          {/* Trust strip — desktop hidden since shown on left */}
          <div className="md:hidden mt-10 flex items-center justify-center gap-2 text-[10px] font-mono text-muted-foreground/60">
            <CheckCircle className="w-3 h-3 text-primary/50" />
            <span className="uppercase tracking-widest">Secure · Encrypted · Non-custodial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
