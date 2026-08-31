import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, ChevronRight, Shield, Zap, TrendingUp,
  Users, Target, Award, BarChart3, Clock, Star, Menu, X, CheckCircle2,
  DollarSign, Terminal, RefreshCw, Activity
} from 'lucide-react';
import { useState } from 'react';
import { CHALLENGE_PLANS } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

const stats = [
  { value: '2,400+', label: 'Active Traders' },
  { value: '$1.2M+', label: 'Total Funded' },
  { value: '68%', label: 'Pass Rate' },
  { value: '$3,500', label: 'Max Capital' },
];

const steps = [
  { icon: Target, step: '01', title: 'Create Account', desc: 'Sign up in seconds. No KYC required.' },
  { icon: DollarSign, step: '02', title: 'Purchase Challenge', desc: 'Pay your fee in SOL directly on-chain.' },
  { icon: Terminal, step: '03', title: 'Pass Evaluation', desc: 'Trade via Telegram, hit 10% target, stay within limits.' },
  { icon: CheckCircle2, step: '04', title: 'Get Approved', desc: 'Automatic review upon target completion.' },
  { icon: Award, step: '05', title: 'Unlock Capital', desc: 'Receive real firm capital and keep 80% of profits.' },
];

const features = [
  { icon: Zap, title: 'Built for Solana', desc: 'Native SOL integration. Fast execution and minimal latency.' },
  { icon: Shield, title: 'Professional Rules', desc: 'Clear, fair risk parameters matching industry standards.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Comprehensive dashboards tracking every edge.' },
  { icon: Target, title: 'Telegram Trading', desc: 'Execute and manage positions directly via the bot.' },
  { icon: Activity, title: 'Real-time Tracking', desc: 'Watch your challenge progress update live.' },
  { icon: RefreshCw, title: 'Auto Verification', desc: 'Instant on-chain payment detection.' },
  { icon: TrendingUp, title: 'Performance Insights', desc: 'Identify your strengths and weaknesses automatically.' },
  { icon: Terminal, title: 'Clean Dashboard', desc: 'A clutter-free interface focused purely on your trading.' },
  { icon: CheckCircle2, title: 'Risk Management', desc: 'Built-in tools to help you stay within drawdown limits.' },
  { icon: Star, title: 'Premium Experience', desc: 'Crafted interface designed for professional prop traders.' },
];

const paymentSteps = [
  { num: '01', title: 'Choose Challenge', desc: 'Select the capital tier.' },
  { num: '02', title: 'Payment Details', desc: 'Get a unique SOL address.' },
  { num: '03', title: 'Send SOL', desc: 'Transfer exact evaluation fee.' },
  { num: '04', title: 'On-chain Verify', desc: 'Automatic transaction detection.' },
  { num: '05', title: 'Instant Activation', desc: 'Dashboard and bot unlocked.' },
  { num: '06', title: 'Referral Rewards', desc: 'Referrer earns 10% auto.' },
];

const faqs = [
  { q: 'What is FundedFrens?', a: 'A premium prop trading firm built specifically for the Solana ecosystem, evaluating traders via a demo challenge.' },
  { q: 'What is a Demo Challenge?', a: 'An evaluation phase where you trade simulated funds with specific rules to prove your profitability.' },
  { q: 'How do funded accounts work?', a: 'Pass the challenge, and we allocate real capital. You keep 80% of all generated profits.' },
  { q: 'How are payments verified?', a: 'Payments are made in SOL to unique addresses and verified automatically on-chain.' },
  { q: 'How long is the evaluation?', a: 'You have unlimited days to complete the challenge. Take your time and trade your setup.' },
  { q: 'What happens if I fail?', a: 'If you hit a drawdown limit, the challenge ends. You can always purchase a new one.' },
  { q: 'Can I try again?', a: 'Yes, there is no limit to how many challenges you can attempt.' },
  { q: 'How does the Telegram bot work?', a: 'Link your account via the dashboard, and use the bot to execute trades and check PnL on the go.' },
  { q: 'How do referrals work?', a: 'Share your link. When someone buys a challenge, you get 10% of their fee deposited to your account.' },
];

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-9 h-9 rounded-xl object-cover shadow-[0_0_16px_rgba(139,92,246,0.4)]" />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">FundedFrens</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">How it works</a>
            <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Pricing</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">Features</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation('/login')} className="font-sans text-sm text-muted-foreground hover:text-foreground">Sign In</Button>
            <Button onClick={() => setLocation('/signup')} className="font-sans text-sm font-semibold px-5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
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
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'Features', href: '#features' },
              { label: 'FAQ', href: '#faq' },
            ].map(item => (
              <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                {item.label}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-white/[0.06]">
              <Button variant="outline" className="w-full text-sm" onClick={() => { setNavOpen(false); setLocation('/login'); }}>Sign In</Button>
              <Button className="w-full text-sm font-semibold" onClick={() => { setNavOpen(false); setLocation('/signup'); }}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-800/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/8 blur-[80px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-[11px] font-mono uppercase tracking-widest text-primary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Crypto Prop Trading Platform
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
            Trade Smarter.<br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Get Funded.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Prove your edge on a demo account. Hit the targets. Receive real firm capital with an 80% profit split — no strings attached.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Button onClick={() => setLocation('/signup')} size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-13 shadow-[0_0_32px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-shadow">
              Start Your Challenge <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-13 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="glass rounded-2xl p-4 sm:p-5">
                <div className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-1">{value}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-y border-white/[0.05] bg-black/20 backdrop-blur-md overflow-hidden relative">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {['Built for Solana', 'Telegram Trading', 'Instant Analytics', 'Automatic Evaluation', 'Secure Payments', '24/7 Trading', 'Professional Risk Rules'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">The Process</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Five steps to funded</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Simple, transparent, and designed for serious traders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />

            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 flex flex-col items-center text-center gap-4 relative group hover:border-primary/30 transition-colors">
                <div className="absolute top-3 right-4 font-mono text-[10px] text-muted-foreground/30 font-bold">{step}</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all relative z-10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FUNDEDFRENS ── */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-black/20 border-y border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Platform Advantage</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Why FundedFrens</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 5}
                className="glass glass-hover rounded-2xl p-5 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="plans" className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/6 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">Capital Tiers</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Choose your allocation</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Pay the evaluation fee in SOL. Pass the challenge. Get funded.</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-2">Funded values are approximate and adjust with the live SOL/USD market price.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {CHALLENGE_PLANS.map((plan, i) => {
              const isPopular = plan.id === 'advanced';
              return (
                <motion.div key={plan.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className={`relative rounded-2xl flex flex-col ${isPopular ? 'glass border-primary/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] scale-105 z-10' : 'glass'}`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-1.5 whitespace-nowrap">
                      <Zap className="w-3 h-3" /> Most Popular
                    </div>
                  )}

                  <div className={`p-7 border-b ${isPopular ? 'border-primary/15' : 'border-white/[0.05]'}`}>
                    <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`}>{plan.name}</div>
                    <div className="font-mono text-4xl font-bold mb-1">${plan.fundedValueUsd.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">Live Capital Allocation</div>
                    
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-muted-foreground">Evaluation Fee</span>
                      <span className="font-mono text-lg font-bold">${plan.purchasePriceUsd}</span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-7 flex-1">
                      {[
                        'Profit Target: 10%',
                        'Max Drawdown: 50%',
                        'Max Position Size: 30%',
                        '75% Win Rate Required',
                        'Unlimited Trading Days',
                      ].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/90">
                          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-primary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => setLocation('/signup')}
                      className={`w-full font-semibold ${isPopular ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10'}`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      Start Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DEMO CHALLENGE RULES ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold tracking-tight">Evaluation Requirements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { l: 'Evaluation Period', v: '21 Days' },
              { l: 'Minimum Trading Days', v: '5 Days' },
              { l: 'Required Win Rate', v: '75%' },
              { l: 'Max Position Size', v: '30%' },
              { l: 'Max Open Positions', v: '3' },
              { l: 'Max Drawdown', v: '50%' },
            ].map((rule, i) => (
              <div key={i} className="glass rounded-xl p-6 border-l-[3px] border-l-primary/30 text-center">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">{rule.l}</div>
                <div className="font-mono text-3xl font-bold text-foreground">{rule.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TELEGRAM SECTION ── */}
      <section className="py-24 px-4 sm:px-6 bg-black/20 border-y border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Trade via Telegram, Track via Web</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A seamless dual-interface experience optimized for speed and insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-48 h-48" /></div>
              <h3 className="font-display text-2xl font-bold mb-6">Web Dashboard</h3>
              <ul className="space-y-4 relative z-10">
                {['Deep Performance Analytics', 'Challenge Progress Tracking', 'Automated Payments', 'Affiliate Management', 'System Log & Notifications', 'Risk Metrics Overview'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-10 relative overflow-hidden border-t-[3px] border-t-[#0088cc]">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Smartphone className="w-48 h-48" /></div>
              <h3 className="font-display text-2xl font-bold mb-6">Telegram Bot</h3>
              <ul className="space-y-4 relative z-10">
                {['Instant Market Orders', 'Active Position Management', 'Quick PnL Summary Cards', 'Stop Loss / Take Profit', 'Margin Call Alerts', 'Direct Exchange Execution'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-[#0088cc] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 relative z-10">
                <Button onClick={() => setLocation('/login')} className="font-semibold shadow-[0_0_20px_rgba(0,136,204,0.3)] bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">
                  Connect your bot <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAYMENT SECTION ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-4">Frictionless Onboarding</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentSteps.map((step, i) => (
              <div key={i} className="glass rounded-xl p-6 relative">
                <div className="text-5xl font-display font-bold text-white/5 absolute top-4 right-4">{step.num}</div>
                <h4 className="font-display font-semibold mb-2 relative z-10">{step.title}</h4>
                <p className="text-sm text-muted-foreground relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-4">What you'll track</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Trades', value: '142' },
              { label: 'Winning Trades', value: '108' },
              { label: 'Losing Trades', value: '34' },
              { label: 'Win Rate', value: '76.1%', color: 'text-emerald-400' },
              { label: 'Total PnL', value: '+$4,250.00', color: 'text-emerald-400' },
              { label: 'Average Winner', value: '+$125.50' },
              { label: 'Average Loser', value: '-$45.20' },
              { label: 'Largest Win', value: '+$840.00' },
              { label: 'Largest Loss', value: '-$120.00' },
              { label: 'Avg Hold Time', value: '42m' },
              { label: 'Portfolio Value', value: '$104,250' },
              { label: 'Risk Metrics', value: 'Optimal', color: 'text-primary' },
              { label: 'Challenge Progress', value: 'Passed', color: 'text-primary' },
              { label: 'Max Drawdown', value: '2.4%' },
              { label: 'Reliability Rating', value: '98/100', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4 flex flex-col gap-1.5 border-t border-t-white/10 hover:bg-white/[0.05] transition-colors">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                <span className={`font-mono text-lg font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERRAL SECTION ── */}
      <section className="py-24 px-4 sm:px-6 bg-black/20 border-y border-white/[0.03]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Earn While Your Network Trades</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Invite friends → Earn 10% of their first successful challenge purchase. <br />
            Automatic tracking, automatic rewards, no hidden conditions.
          </p>
          <Button onClick={() => setLocation('/signup')} size="lg" className="font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Get Your Referral Link
          </Button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-white/[0.02]"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-medium text-sm sm:text-base">{q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-90' : ''}`} />
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

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden glass border-primary/20 p-10 sm:p-14 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
            </div>
            <div className="relative z-10">
              <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.4)]" />
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
                Ready to prove your trading skills?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto font-mono text-sm uppercase tracking-wider">
                NO KYC · PAY IN SOL · INSTANT START
              </p>
              <Button onClick={() => setLocation('/signup')} size="lg" className="font-semibold px-10 shadow-[0_0_32px_rgba(139,92,246,0.4)] hover:shadow-[0_0_48px_rgba(139,92,246,0.6)] transition-shadow">
                Start Your Demo Challenge <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-12 px-4 sm:px-6 bg-black/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-semibold text-foreground text-lg">FundedFrens</span>
            </div>
            <p className="text-xs text-muted-foreground/50 font-mono">© 2025 FundedFrens. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a href="#how-it-works" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">About</a>
            <a href="#features" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Features</a>
            <a href="#plans" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Pricing</a>
            <a href="#faq" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">FAQ</a>
            <Link href="#" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Terms</Link>
            <Link href="#" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">Privacy</Link>
            <Link href="/login" className="text-xs font-mono text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">Sign In</Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
