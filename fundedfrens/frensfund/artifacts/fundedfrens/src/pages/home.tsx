import { Link, useLocation } from 'wouter';
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
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' } }),
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
  { icon: RefreshCw, label: 'Auto Evaluation' },
  { icon: Shield, label: 'Secure Payments' },
  { icon: Clock, label: '24/7 Trading' },
  { icon: Target, label: 'Professional Risk Rules' },
];

const steps = [
  { icon: Users, step: '01', title: 'Create Your Account', desc: 'Sign up in seconds. No KYC required. Start with just your email address.' },
  { icon: Wallet, step: '02', title: 'Purchase a Challenge', desc: 'Choose your capital tier. Pay the evaluation fee in SOL or ETH.' },
  { icon: BarChart3, step: '03', title: 'Complete Evaluation', desc: 'Trade via your Telegram bot. Hit 70%+ win rate within risk rules over 21 days.' },
  { icon: Shield, step: '04', title: 'Get Approved', desc: 'Our team reviews your performance. Approval is granted to consistently profitable traders.' },
  { icon: Award, step: '05', title: 'Unlock Capital', desc: 'Receive real firm capital and keep 80% of all profits you generate.' },
];

const whyFeatures = [
  { icon: Target, title: 'Built for Solana', desc: 'Purpose-built for meme coin and Solana ecosystem traders from day one.' },
  { icon: Shield, title: 'Professional Evaluation', desc: 'Rigorous but fair criteria with clear, transparent rules.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Full performance dashboard with PnL, win rate, drawdown, and more.' },
  { icon: MessageCircle, title: 'Telegram-First Trading', desc: 'Execute trades directly through your Telegram bot — fast and frictionless.' },
  { icon: Activity, title: 'Real-Time Tracking', desc: 'Live progress tracking with instant updates every time you trade.' },
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
  { n: '03', title: 'Send SOL or ETH', desc: 'Transfer the exact amount to the treasury wallet.' },
  { n: '04', title: 'Auto-Verified', desc: 'Our system confirms the transaction on-chain automatically.' },
  { n: '05', title: 'Challenge Activates', desc: 'Your evaluation period starts immediately upon confirmation.' },
  { n: '06', title: 'Referrals Process', desc: 'Your referrer earns their reward automatically — no manual action.' },
];

const faqs = [
  { q: 'What is FundedFrens?', a: 'FundedFrens is a prop trading platform for on-chain traders. Complete a Demo Challenge to prove your skills, then unlock real firm capital with an 80% profit split.' },
  { q: 'What is a Demo Challenge?', a: 'A Demo Challenge is an evaluation period where you trade a simulated account. Hit 70%+ win rate over 5+ trading days within 21 days, respecting all risk rules, and you pass.' },
  { q: 'How do funded accounts work?', a: "Once you pass and are approved, you receive access to a funded trading account with real firm capital. You keep 80% of all profits and the firm keeps 20%." },
  { q: 'How are payments verified?', a: 'Payments are processed on-chain (Solana or Robinhood Chain). Our system monitors your unique treasury wallet address and automatically activates your challenge when funds are received.' },
  { q: 'How long is the evaluation?', a: 'The evaluation period is 21 days. You need to trade on at least 5 of those days and maintain a 70%+ win rate.' },
  { q: 'What happens if I fail?', a: 'If you breach the max drawdown (30%) or fail to meet targets within 21 days, your challenge is marked as failed. You can purchase a new challenge to try again.' },
  { q: 'Can I try again?', a: 'Yes — absolutely. There is no limit on how many challenges you can attempt. Each is a fresh evaluation period.' },
  { q: 'How does the Telegram bot work?', a: 'All trading (buying, selling, position management) happens via @fundedfrensbot on Telegram. The website handles everything else: dashboard, analytics, payments, and referrals.' },
  { q: 'How do referrals work?', a: 'Share your unique referral code or link. When someone signs up with your code and purchases any challenge, you automatically earn 10% of their fee.' },
];

// ── Reusable components ───────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-[10px] font-mono uppercase tracking-widest text-primary mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-black font-display font-bold text-sm">FF</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">FundedFrens</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate('/login')}>Log In</Button>
            <Button className="text-sm font-semibold px-5 rounded-xl" onClick={() => navigate('/signup')}>
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
          <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a key={href} href={href} onClick={() => setNavOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors">
                {label}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2 border-t border-border">
              <Button variant="outline" className="w-full text-sm rounded-xl" onClick={() => { setNavOpen(false); navigate('/login'); }}>Login</Button>
              <Button className="w-full text-sm font-semibold rounded-xl" onClick={() => { setNavOpen(false); navigate('/signup'); }}>Get Started</Button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/6 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/4 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-[10px] font-mono uppercase tracking-widest text-primary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Prop Trading · Solana & Robinhood Chain
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
            Prove Your Edge.
            <br />
            <span className="text-primary">Get Funded.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FundedFrens is the premier on-chain prop trading platform. Complete a Demo Challenge, pass the evaluation, and unlock real firm capital — no KYC, pay in SOL or ETH.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-13 rounded-xl neon-glow">
                Start Your Challenge <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-13 rounded-xl text-muted-foreground hover:text-foreground">
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
      <section className="border-y border-border bg-card py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustSignals.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/70">
                <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-mono uppercase tracking-widest whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORTED NETWORKS ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionTag>Supported Networks</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">Two chains. One platform.</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Pay your evaluation fee using either network — both fully supported with instant verification.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Solana */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              className="glass glass-hover rounded-2xl p-8 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                  🟣
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Solana</h3>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Pay in SOL</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pay your challenge fee in SOL on the Solana network. Our system auto-detects on-chain transactions and activates your evaluation instantly.
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">Active Network</span>
              </div>
            </motion.div>

            {/* Robinhood Chain */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="glass glass-hover rounded-2xl p-8 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
                  ⚫
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">Robinhood Chain</h3>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Pay in ETH</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pay your challenge fee in ETH on Robinhood Chain. Same automatic verification and instant activation — no manual processing required.
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">Active Network</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag>The Process</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Five steps to funded</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Simple, transparent, and designed for serious on-chain traders.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="glass rounded-2xl p-6 flex flex-col items-start gap-4 relative glass-hover group">
                <div className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground/20 font-bold">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FUNDEDFRENS ── */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag>Advantages</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Why FundedFrens</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Every feature built specifically for on-chain meme coin traders — purpose-built, not repurposed.</p>
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
      <section id="plans" className="py-24 px-4 sm:px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag>Capital Tiers</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Choose your challenge</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Pay the evaluation fee in SOL or ETH. Pass the challenge. Get funded with real firm capital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-6">
            {CHALLENGE_PLANS.map((plan, i) => {
              const isPopular = plan.id === 'advanced';
              return (
                <motion.div key={plan.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
                  <div className={`relative rounded-2xl flex flex-col border overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
                    isPopular
                      ? 'bg-card border-primary/30 shadow-[0_0_0_1px_rgba(204,255,0,0.1),0_20px_40px_-8px_rgba(0,0,0,0.3)]'
                      : 'bg-card border-border shadow-sm hover:shadow-md hover:border-border/80'
                  }`}>
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                    {isPopular && (
                      <div className="px-6 py-2 bg-primary/8 border-b border-primary/15">
                        <div className="flex items-center gap-1.5 justify-center text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                          <Zap className="w-3 h-3" /> Most Popular
                        </div>
                      </div>
                    )}

                    <div className={`p-7 border-b ${isPopular ? 'border-primary/10' : 'border-border'}`}>
                      <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`}>{plan.name}</div>
                      <div className="font-mono text-4xl font-bold mb-1">${plan.fundedValueUsd.toLocaleString()}</div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Approximate Funded Value</div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-border rounded-lg">
                        <span className="text-xs font-mono text-muted-foreground">Fee:</span>
                        <span className="font-mono font-bold text-foreground">${plan.purchasePriceUsd}</span>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col">
                      <ul className="space-y-2.5 mb-7 flex-1">
                        {[
                          'Win Rate: 70% Required',
                          'Max Drawdown: 30%',
                          'Evaluation: 21 Days',
                          'Min Trading Days: 5',
                          'Max Positions: 3',
                          '80% Profit Split',
                        ].map(feat => (
                          <li key={feat} className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                            {feat}
                          </li>
                        ))}
                      </ul>

                      <Link href="/signup">
                        <Button
                          className={`w-full font-semibold rounded-xl ${isPopular ? 'neon-glow' : 'bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border'}`}
                          variant={isPopular ? 'default' : 'outline'}
                        >
                          Start Challenge <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs font-mono text-muted-foreground/60 px-4">
            Funded values are approximate and adjust with the live market price. The USD value is the source of truth.
          </p>
          <p className="text-center text-xs font-mono text-muted-foreground/40 mt-1">
            Fees payable in SOL or ETH · No KYC required · Instant order generation
          </p>
        </div>
      </section>

      {/* ── CHALLENGE RULES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>Evaluation</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Challenge Requirements</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Clear rules, no surprises. Know exactly what you need to pass before you start.</p>
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

      {/* ── TELEGRAM + WEB SECTION ── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>Architecture</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Trade via Telegram, Track via Web</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">FundedFrens separates trading execution from analytics — each optimized for its purpose.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              className="glass rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Web Platform</h3>
              <p className="text-sm text-muted-foreground mb-5">The FundedFrens website handles everything non-trading.</p>
              <ul className="space-y-2.5">
                {['Dashboard & Analytics', 'Challenge Management', 'Payment Processing', 'Referral Center', 'Profile & Settings'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="glass rounded-2xl p-7 border-primary/20" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Telegram Bot</h3>
              <p className="text-sm text-muted-foreground mb-5">@fundedfrensbot handles all your trading actions in real time.</p>
              <ul className="space-y-2.5">
                {['Buying & Selling Tokens', 'Portfolio Management', 'Open Positions View', 'Trading Controls', 'PnL Cards', 'Stop Loss / Take Profit'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <a href="https://t.me/fundedfrensbot" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
                <Button className="font-mono uppercase tracking-wider text-xs rounded-xl">
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
            <SectionTag>Payments</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">How Payments Work</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Blockchain-verified, fully automatic — from payment to activation without manual review.</p>
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
      <section className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="glass rounded-3xl p-10 sm:p-14 text-center border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <SectionTag>Referrals</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Earn While Your Network Trades</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Invite friends to FundedFrens. When they complete their first successful challenge purchase, you automatically earn <strong className="text-foreground">10% of their fee</strong>. Automatic tracking. Automatic rewards. No hidden conditions.
            </p>
            <Link href="/signup">
              <Button size="lg" className="font-semibold px-8 rounded-xl neon-glow">
                Get Your Referral Code <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>Analytics</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">What You Will Track</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Professional-grade metrics delivered directly from your Telegram trading activity.</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {analyticsPreview.map(({ label, value }, i) => (
                <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 4}
                  className="bg-foreground/[0.02] border border-border rounded-xl p-4 hover:bg-foreground/[0.04] transition-colors">
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
      <section id="faq" className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>FAQ</SectionTag>
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
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
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
            className="relative rounded-3xl overflow-hidden glass border border-primary/20 p-10 sm:p-16 text-center">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/4 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-display font-bold text-xl">FF</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
                Ready to prove your trading skills?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Join traders already on FundedFrens. Start your evaluation today — no KYC, pay in SOL or ETH, instant activation.
              </p>
              <Link href="/signup">
                <Button size="lg" className="font-semibold px-10 rounded-xl neon-glow">
                  Start Your Demo Challenge <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border pt-14 pb-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-black font-display font-bold text-xs">FF</span>
                </div>
                <span className="font-display font-semibold text-foreground">FundedFrens</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] mb-5">
                The premier on-chain prop trading platform. Prove your edge, unlock real capital.
              </p>
              <div className="flex items-center gap-2.5">
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-[#2AABEE] transition-colors"
                  aria-label="Telegram">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://x.com/FundedFrens" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

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

            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-4">Account</div>
              <div className="space-y-2.5">
                <Link href="/login" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/signup" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
                <Link href="/dashboard" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-4">Legal &amp; Support</div>
              <div className="space-y-2.5">
                <Link href="/terms" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Contact &amp; Support</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground/40 font-mono text-center">
              © 2026 FundedFrens. All rights reserved. Not financial advice. Trading involves significant risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
