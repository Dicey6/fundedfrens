import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, ChevronRight, Shield, Zap, TrendingUp,
  Users, Target, Award, BarChart3, Clock, Star, Menu, X,
  MessageCircle, Wallet, Bell, Activity, Lock, ExternalLink,
  ChevronDown, Globe, Bot, LineChart, RefreshCw, Copy, Sun, Moon
} from 'lucide-react';
import { useState } from 'react';
import { CHALLENGE_PLANS } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

const stats = [
  { value: 'Solana', label: 'Native Platform' },
  { value: 'SOL', label: 'Secure Payments' },
  { value: '24/7', label: 'Challenge Access' },
  { value: '$3,500', label: 'Max Capital' },
];

const trustSignals = [
  { icon: Zap, label: 'Built for Solana' },
  { icon: MessageCircle, label: 'Telegram Trading' },
  { icon: Activity, label: 'Instant Analytics' },
  { icon: RefreshCw, label: 'Automatic Evaluation' },
  { icon: Shield, label: 'Secure Payments' },
  { icon: Clock, label: '24/7 Trading' },
  { icon: Target, label: 'Professional Risk Rules' },
];

const steps = [
  { icon: Users, step: '01', title: 'Create Your Account', desc: 'Sign up in seconds. No KYC required. Start with just your email address.' },
  { icon: Wallet, step: '02', title: 'Purchase a Demo Challenge', desc: 'Choose your capital tier. Pay the evaluation fee in SOL on the Solana network.' },
  { icon: BarChart3, step: '03', title: 'Complete the Evaluation', desc: 'Trade via your Telegram bot. Hit 75%+ win rate within the risk rules over 21 days.' },
  { icon: Shield, step: '04', title: 'Get Approved', desc: 'Our team reviews your performance. Approval is granted to consistently profitable traders.' },
  { icon: Award, step: '05', title: 'Unlock Your Funded Account', desc: 'Receive real firm capital and keep 80% of all profits you generate.' },
];

const whyFeatures = [
  { icon: Target, title: 'Built for Solana Traders', desc: 'Purpose-built for meme coin and Solana ecosystem traders from day one.' },
  { icon: Shield, title: 'Professional Evaluation', desc: 'Rigorous but fair evaluation criteria with clear, transparent rules.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Full performance dashboard with PnL, win rate, drawdown, and more.' },
  { icon: MessageCircle, title: 'Telegram-First Trading', desc: 'Execute trades directly through your Telegram bot — fast and frictionless.' },
  { icon: Activity, title: 'Real Challenge Tracking', desc: 'Live progress tracking with instant updates every time you trade.' },
  { icon: Zap, title: 'Automatic Payments', desc: 'Blockchain verification — challenges activate the moment payment confirms.' },
  { icon: LineChart, title: 'Performance Insights', desc: 'Deep trade analytics including win streaks, hold times, and risk metrics.' },
  { icon: Globe, title: 'Clean Dashboard', desc: 'Premium trading interface designed for clarity and speed.' },
  { icon: Lock, title: 'Risk Management', desc: 'Professional drawdown controls and position sizing enforcement.' },
  { icon: Star, title: 'Premium Experience', desc: 'Every detail crafted to match the tools professional traders expect.' },
];

const challengeRules = [
  { label: 'Evaluation Period', value: '21 Days' },
  { label: 'Min Trading Days', value: '5 Days' },
  { label: 'Required Win Rate', value: '70%' },
  { label: 'Max Position Size', value: '30%' },
  { label: 'Max Open Positions', value: '3' },
  { label: 'Max Drawdown', value: '30%' },
];

const analyticsPreview = [
  { label: 'Total Trades', value: '—' }, { label: 'Win Rate', value: '—' },
  { label: 'Total PnL', value: '—' }, { label: 'Profit Factor', value: '—' },
  { label: 'Largest Win', value: '—' }, { label: 'Largest Loss', value: '—' },
  { label: 'Avg Hold Time', value: '—' }, { label: 'Drawdown', value: '—' },
  { label: 'Open Positions', value: '—' }, { label: 'Portfolio Value', value: '—' },
  { label: 'Challenge Progress', value: '—' }, { label: 'Reliability Rating', value: '—' },
];

const paymentSteps = [
  { n: '01', title: 'Choose a Challenge', desc: 'Select Starter, Advanced, or Professional.' },
  { n: '02', title: 'Receive Instructions', desc: 'We generate a unique payment request with our treasury address.' },
  { n: '03', title: 'Send SOL', desc: 'Transfer the exact SOL amount to the treasury wallet.' },
  { n: '04', title: 'Auto-Verified', desc: 'Our system confirms the transaction on-chain automatically.' },
  { n: '05', title: 'Challenge Activates', desc: 'Your evaluation period starts immediately upon confirmation.' },
  { n: '06', title: 'Referrals Process', desc: 'Your referrer earns their reward automatically — no manual action.' },
];

const faqs = [
  { q: 'What is FundedFrens?', a: 'FundedFrens is a Solana-native prop trading platform. Traders complete a Demo Challenge to prove their skills, then unlock real firm capital with an 80% profit split.' },
  { q: 'What is a Demo Challenge?', a: 'A Demo Challenge is an evaluation period where you trade a simulated account. Hit 75%+ win rate over 5+ trading days within 21 days, respecting all risk rules, and you pass.' },
  { q: 'How do funded accounts work?', a: "Once you pass and are approved, you receive access to a funded trading account with real firm capital. You keep 80% of all profits and the firm keeps 20%." },
  { q: 'How are payments verified?', a: 'Payments are processed on the Solana blockchain. Our system monitors your unique treasury wallet address and automatically activates your challenge when SOL is received.' },
  { q: 'How long is the evaluation?', a: 'The evaluation period is 21 days. You need to trade on at least 5 of those days and maintain a 75%+ win rate.' },
  { q: 'What happens if I fail?', a: 'If you breach the max drawdown (50%) or fail to meet targets within 21 days, your challenge is marked as failed. You can purchase a new challenge to try again.' },
  { q: 'Can I try again?', a: 'Yes — absolutely. There is no limit on how many challenges you can attempt. Each is a fresh evaluation period.' },
  { q: 'How does the Telegram bot work?', a: 'All trading (buying, selling, position management) happens via @FundedFrensBot on Telegram. The website handles everything else: dashboard, analytics, payments, and referrals.' },
  { q: 'How do referrals work?', a: 'Share your unique referral code or link. When someone uses it to sign up and completes their first challenge purchase, you automatically earn 10% of their fee. No hidden conditions.' },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-9 h-9 rounded-xl object-cover shadow-[0_0_16px_rgba(139,92,246,0.4)]" />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">FundedFrens</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">{label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.05] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/login">
              <Button variant="ghost" className="font-sans text-sm text-muted-foreground hover:text-foreground">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-sans text-sm font-semibold px-5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-background/95 backdrop-blur-xl px-4 pb-4 space-y-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a key={href} href={href} onClick={() => setNavOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                {label}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-white/[0.06]">
              <Link href="/login">
                <Button variant="outline" className="w-full text-sm" onClick={() => setNavOpen(false)}>Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full text-sm font-semibold" onClick={() => setNavOpen(false)}>Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-800/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/8 blur-[80px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-[11px] font-mono uppercase tracking-widest text-primary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Solana Prop Trading Platform
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
            Prove Your Edge.<br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Get Funded.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FundedFrens is the premier Solana prop trading platform. Complete a Demo Challenge, pass the evaluation, and unlock real firm capital — no KYC, pay in SOL.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-14 shadow-[0_0_32px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-shadow">
                Start Your Challenge <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-14 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="glass rounded-2xl p-5">
                <div className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-1">{value}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.01] py-4 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustSignals.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/70">
                <Icon className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">The Process</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Five steps to funded</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Simple, transparent, and designed for serious Solana traders.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 flex flex-col items-start gap-4 relative group hover:border-primary/20 transition-all hover:-translate-y-0.5">
                <div className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground/20 font-bold">{step}</div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base mb-1.5">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FUNDEDFRENS ── */}
      <section id="features" className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[300px] h-[400px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Advantages</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Why FundedFrens</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every feature built specifically for Solana meme coin traders — purpose-built, not repurposed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {whyFeatures.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 5}
                className="glass glass-hover rounded-2xl p-5 group">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE PLANS ── */}
      <section id="plans" className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/6 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Capital Tiers</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Choose your challenge</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Pay the evaluation fee in SOL. Pass the challenge. Get funded with real firm capital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-6">
            {CHALLENGE_PLANS.map((plan, i) => {
              const isPopular = plan.id === 'advanced';
              return (
                <motion.div key={plan.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className={`relative rounded-2xl flex flex-col ${isPopular ? 'glass border-primary/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]' : 'glass'}`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-1.5 whitespace-nowrap">
                      <Zap className="w-3 h-3" /> Most Popular
                    </div>
                  )}

                  <div className={`p-7 border-b ${isPopular ? 'border-primary/15' : 'border-white/[0.05]'}`}>
                    <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`}>{plan.name}</div>
                    <div className="font-mono text-4xl font-bold mb-1">${plan.fundedValueUsd.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Approximate Funded Value</div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg">
                      <span className="text-xs font-mono text-muted-foreground">Fee:</span>
                      <span className="font-mono font-bold text-foreground">${plan.purchasePriceUsd}</span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {[
                        'Win Rate: 75% Required',
                        'Max Drawdown: 50%',
                        'Evaluation: 21 Days',
                        'Min Trading Days: 5',
                        'Max Positions: 3',
                        '80% Profit Split',
                      ].map(feat => (
                        <li key={feat} className="flex items-center gap-3 text-xs text-muted-foreground/90">
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-primary" />
                          </div>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <Link href="/signup">
                      <Button
                        className={`w-full font-semibold ${isPopular ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10'}`}
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        Start Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs font-mono text-muted-foreground/60 px-4">
            Funded values are approximate and adjust with the live SOL/USD market price. The USD value is the source of truth.
          </p>
          <p className="text-center text-xs font-mono text-muted-foreground/40 mt-1">
            All fees payable in SOL · No KYC required · Instant order generation
          </p>
        </div>
      </section>

      {/* ── DEMO CHALLENGE RULES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Evaluation</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Challenge Requirements</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Clear rules, no surprises. Know exactly what you need to pass before you start.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {challengeRules.map(({ label, value }, i) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="glass glass-hover rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 to-transparent" />
                <div className="font-mono text-3xl sm:text-4xl font-bold text-foreground">{value}</div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TELEGRAM SECTION ── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/6 blur-[100px] rounded-full -translate-y-1/2" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Architecture</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Trade via Telegram, Track via Web</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">FundedFrens separates trading execution from analytics — each optimized for its purpose.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Web platform */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              className="glass rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Web Platform</h3>
              <p className="text-sm text-muted-foreground mb-5">The FundedFrens website handles everything non-trading.</p>
              <ul className="space-y-2.5">
                {['Dashboard & Analytics', 'Challenge Management', 'Payment Processing', 'Referral Center', 'Notifications', 'Profile & Settings'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground/90">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Telegram bot */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="glass glass-primary rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Telegram Bot</h3>
              <p className="text-sm text-muted-foreground mb-5">@FundedFrensBot handles all your trading actions in real time.</p>
              <ul className="space-y-2.5">
                {['Buying & Selling Tokens', 'Portfolio Management', 'Open Positions View', 'Trading Controls', 'PnL Cards', 'Stop Loss / Take Profit'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground/90">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <a href="https://t.me/FundedFrensBot" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
                <Button className="font-mono uppercase tracking-wider text-xs">
                  Open Bot <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PAYMENT SECTION ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Payments</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">How Payments Work</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Blockchain-verified, fully automatic — from payment to activation without manual review.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentSteps.map(({ n, title, desc }, i) => (
              <motion.div key={n} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 3}
                className="glass glass-hover rounded-2xl p-5 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-xs flex-shrink-0">{n}</div>
                <div>
                  <h4 className="font-display font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERRAL SECTION ── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/6 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="glass glass-primary rounded-3xl p-10 sm:p-14 text-center border-primary/20">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Referrals</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Earn While Your Network Trades</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Invite friends to FundedFrens. When they complete their first successful challenge purchase, you automatically earn <strong className="text-foreground">10% of their fee</strong>. Automatic tracking. Automatic rewards. No hidden conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="font-semibold px-8 shadow-[0_0_24px_rgba(139,92,246,0.3)]">
                  Get Your Referral Code <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Analytics</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">What You Will Track</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Professional-grade metrics delivered directly from your Telegram trading activity.</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {analyticsPreview.map(({ label, value }, i) => (
                <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 4}
                  className="bg-black/20 border border-white/[0.04] rounded-xl p-4 hover:bg-black/30 transition-colors">
                  <div className="metric-label mb-2">{label}</div>
                  <div className="font-mono text-xl font-bold text-muted-foreground/20">{value}</div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs font-mono text-muted-foreground/50 mt-5">Data shown after connecting your Telegram bot</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-medium text-sm sm:text-base">{q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-white/[0.05] pt-4">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden glass border-primary/20 p-10 sm:p-16 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            <div className="relative z-10">
              <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.4)]" />
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
                Ready to prove your trading skills?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Join thousands of Solana traders already on FundedFrens. Start your evaluation today — no KYC, pay in SOL, instant activation.
              </p>
              <Link href="/signup">
                <Button size="lg" className="font-semibold px-10 shadow-[0_0_32px_rgba(139,92,246,0.4)] hover:shadow-[0_0_48px_rgba(139,92,246,0.6)] transition-shadow">
                  Start Your Demo Challenge <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] pt-14 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-display font-semibold text-foreground">FundedFrens</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] mb-5">
                The premier Solana prop trading platform. Prove your edge on-chain, unlock real meme coin capital.
              </p>
              <div className="flex items-center gap-2.5">
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-[#2AABEE] transition-colors"
                  aria-label="Telegram">
                  {/* Telegram official icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://x.com/FundedFrens" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="X (Twitter)">
                  {/* X official icon */}
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-4">Platform</div>
              <div className="space-y-2.5">
                {[
                  { label: 'About', href: '#features' },
                  { label: 'Features', href: '#features' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Pricing', href: '#plans' },
                  { label: 'FAQ', href: '#faq' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{label}</a>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-4">Account</div>
              <div className="space-y-2.5">
                <Link href="/login" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/signup" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
                <Link href="/dashboard" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-4">Legal &amp; Support</div>
              <div className="space-y-2.5">
                <Link href="/terms" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Contact &amp; Support</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-6">
            <p className="text-xs text-muted-foreground/40 font-mono text-center">
              © 2026 FundedFrens. All rights reserved. Not financial advice. Trading involves significant risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
