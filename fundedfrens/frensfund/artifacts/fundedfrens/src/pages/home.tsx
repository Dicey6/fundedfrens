import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, ChevronRight, Shield, Zap, TrendingUp,
  Users, Target, Award, BarChart3, Clock, Star, Menu, X,
  MessageCircle, Wallet, Bell, Activity, Lock, ExternalLink,
  ChevronDown, Globe, Bot, LineChart, RefreshCw, Copy, Sun, Moon, Contrast
} from 'lucide-react';
import { useState } from 'react';
import { CHALLENGE_PLANS } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] } }),
};

const stats = [
  { value: 'Robinhood', label: 'Native Platform' },
  { value: 'ETH', label: 'Secure Payments' },
  { value: '24/7', label: 'Challenge Access' },
  { value: '$3,500', label: 'Max Capital' },
];

const trustSignals = [
  { icon: Zap, label: 'Built for Robinhood Chain' },
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
  { icon: Target, title: 'Built for Robinhood Chain', desc: 'Purpose-built for meme coin and Robinhood Chain ecosystem traders from day one.' },
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
  { q: 'What is HOODFUND?', a: 'HOODFUND is a prop trading platform for on-chain traders. Complete a Demo Challenge to prove your skills, then unlock real firm capital with an 80% profit split.' },
  { q: 'What is a Demo Challenge?', a: 'A Demo Challenge is an evaluation period where you trade a simulated account. Hit 70%+ win rate over 5+ trading days within 21 days, respecting all risk rules, and you pass.' },
  { q: 'How do funded accounts work?', a: "Once you pass and are approved, you receive access to a funded trading account with real firm capital. You keep 80% of all profits and the firm keeps 20%." },
  { q: 'How are payments verified?', a: 'Payments are processed on-chain via Robinhood Chain. Our system monitors your unique treasury wallet address and automatically activates your challenge when funds are received.' },
  { q: 'How long is the evaluation?', a: 'The evaluation period is 21 days. You need to trade on at least 5 of those days and maintain a 70%+ win rate.' },
  { q: 'What happens if I fail?', a: 'If you breach the max drawdown (30%) or fail to meet targets within 21 days, your challenge is marked as failed. You can purchase a new challenge to try again.' },
  { q: 'Can I try again?', a: 'Yes — absolutely. There is no limit on how many challenges you can attempt. Each is a fresh evaluation period.' },
  { q: 'How does the Telegram bot work?', a: 'All trading (buying, selling, position management) happens via @fundedfrensbot on Telegram. The website handles everything else: dashboard, analytics, payments, and referrals.' },
  { q: 'How do referrals work?', a: 'Share your unique referral code or link. When someone signs up with your code and purchases any challenge, you automatically earn 10% of their fee.' },
];

// Update these values in one place when the token details or destinations change.
const TOKEN_NAME = 'FundedFrens';
const TOKEN_SYMBOL = 'FFRENS';
const TOKEN_NETWORK = 'Solana';
const TOKEN_CONTRACT_ADDRESS = '9qMLFMYMMXVUsgnDwm9FYuEYhENPiuYB8SnjofhDpump';
const TOKEN_EXPLORER_URL = `https://solscan.io/token/${TOKEN_CONTRACT_ADDRESS}`;
const TOKEN_TRADE_URL = '#';

// ── Reusable components ───────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-[10px] font-mono uppercase tracking-widest text-primary mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

// ── Creative Network Hero Badge ───────────────────────────────────────────────
function NetworkHeroBadge() {
  return (
    <div className="inline-flex items-center gap-0 relative select-none">
      {/* Robinhood chip */}
      <motion.div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 z-10 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb),0.15) 0%, rgba(0,0,0,0.08) 100%)',
          borderColor: 'rgba(var(--accent-rgb),0.45)',
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary leading-none">Robinhood Chain</div>
          <div className="text-[9px] font-mono text-primary/50 uppercase tracking-wider mt-0.5">ETH</div>
        </div>
        <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/40 flex-shrink-0 shadow-lg float-anim-delay">
          <img src="/robinhood-logo.png" alt="Robinhood Chain" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  const copyContractAddress = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(TOKEN_CONTRACT_ADDRESS);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = TOKEN_CONTRACT_ADDRESS;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-200 shadow-md flex-shrink-0">
              <img src="/handshake-logo.jpeg" alt="HOODFUND" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">HOODFUND</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#plans' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">{label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : theme === 'light' ? <Moon className="w-4 h-4" /> : <Contrast className="w-4 h-4" />}
              </motion.div>
            </button>
            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate('/login')}>Log In</Button>
            <Button className="text-sm font-semibold px-5 rounded-xl neon-glow" onClick={() => navigate('/signup')}>
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-1"
          >
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
            <div className="pt-3 space-y-2 border-t border-border">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : theme === 'light' ? <Moon className="w-4 h-4" /> : <Contrast className="w-4 h-4" />}
                <span>{theme === 'dark' ? 'Light Mode' : theme === 'light' ? 'Mono Mode' : 'Dark Mode'}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full text-sm rounded-xl" onClick={() => { setNavOpen(false); navigate('/login'); }}>Login</Button>
                <Button className="w-full text-sm font-semibold rounded-xl" onClick={() => { setNavOpen(false); navigate('/signup'); }}>Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/5 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/3 blur-[100px] rounded-full" />
          <div className="absolute top-1/3 left-0 w-[200px] h-[200px] bg-purple-500/5 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Creative network badge — replaces plain pill */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="flex justify-center mb-8"
          >
            <NetworkHeroBadge />
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
            Prove Your Edge.
            <br />
            <span className="text-primary neon-text-glow">Get Funded.</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            HOODFUND is the premier on-chain prop trading platform. Complete a Demo Challenge, pass the evaluation, and unlock real firm capital — no KYC, pay in SOL or ETH.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-13 rounded-xl neon-glow transition-all duration-200">
                Start Your Challenge <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-13 rounded-xl text-muted-foreground hover:text-foreground border-foreground/10 hover:border-foreground/25 transition-all duration-200">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="glass outline-card rounded-2xl p-5 hover:border-primary/20 transition-all duration-200">
                <div className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-1">{value}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-border bg-card/60 py-4 px-4 sm:px-6 backdrop-blur-sm">
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
            <SectionTag>Supported Network</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">Built on Robinhood Chain.</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Pay your evaluation fee on Robinhood Chain — fully supported with instant verification.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
            {/* Robinhood Chain */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="glass glass-hover rounded-2xl p-8 flex flex-col gap-5 border-[1.5px] border-primary/20 hover:border-primary/40 transition-all duration-250">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30 flex-shrink-0 shadow-lg">
                  <img src="/robinhood-logo.png" alt="Robinhood Chain" className="w-full h-full object-cover" />
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

      {/* ── OFFICIAL TOKEN CONTRACT ── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="glass outline-card rounded-3xl p-6 sm:p-8 border-[1.5px] border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <SectionTag>Token Information</SectionTag>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Official Token Contract</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified on-chain
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Token Name', value: TOKEN_NAME },
                  { label: 'Token Symbol', value: TOKEN_SYMBOL },
                  { label: 'Network', value: TOKEN_NETWORK },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-foreground/[0.03] px-4 py-3">
                    <div className="metric-label mb-1">{label}</div>
                    <div className="font-display font-semibold text-sm">{value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
                <div>
                  <div className="min-w-0">
                    <div className="metric-label mb-2">Contract Address (CA)</div>
                    <div className="font-mono text-sm sm:text-base text-muted-foreground">
                      Coming soon
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/[0.03] px-4 py-2.5 text-xs font-mono font-semibold text-muted-foreground/50 cursor-not-allowed flex-1"
                  aria-label="Contract address not yet available"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Coming Soon
                </button>
                <Button variant="outline" disabled className="flex-1 rounded-xl text-xs font-mono font-semibold border-foreground/10 text-muted-foreground/50 cursor-not-allowed">
                  View on Explorer <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </Button>
                <a href={TOKEN_TRADE_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full rounded-xl text-xs font-mono font-semibold neon-glow transition-all duration-200">
                    Trade Now <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
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
                className="glass outline-card rounded-2xl p-6 flex flex-col items-start gap-4 relative group hover:border-primary/25 transition-all duration-200">
                <div className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground/20 font-bold">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Why HOODFUND</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Every feature built specifically for on-chain meme coin traders — purpose-built, not repurposed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {whyFeatures.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 5}
                className="glass glass-hover outline-card rounded-2xl p-5 group hover:border-primary/20 transition-all duration-200">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-200">
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
                  <div className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-250 hover:-translate-y-1.5 ${
                    isPopular
                      ? 'bg-card border-[1.5px] border-primary/35 shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.08),0_20px_40px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.15),0_28px_56px_-10px_rgba(0,0,0,0.4)]'
                      : 'bg-card border-[1.5px] border-foreground/10 shadow-sm hover:shadow-lg hover:border-foreground/20'
                  }`}>
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                    )}
                    {isPopular && (
                      <div className="px-6 py-2.5 bg-primary/8 border-b border-primary/15">
                        <div className="flex items-center gap-1.5 justify-center text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                          <Zap className="w-3 h-3" /> Most Popular
                        </div>
                      </div>
                    )}

                    <div className={`p-7 border-b ${isPopular ? 'border-primary/10' : 'border-foreground/[0.08]'}`}>
                      <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`}>{plan.name}</div>
                      <div className="font-mono text-4xl font-bold mb-1">${plan.fundedValueUsd.toLocaleString()}</div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Approximate Funded Value</div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-lg">
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
                            <div className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                            {feat}
                          </li>
                        ))}
                      </ul>

                      <Link href="/signup">
                        <Button
                          className={`w-full font-semibold rounded-xl transition-all duration-200 ${isPopular ? 'neon-glow' : 'bg-foreground/[0.06] hover:bg-foreground/[0.1] text-foreground border border-foreground/10 hover:border-foreground/20'}`}
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
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <img src="/robinhood-logo.png" alt="Robinhood" className="w-3.5 h-3.5 rounded-full object-cover opacity-50" />
              <span className="text-[10px] font-mono text-muted-foreground/40">ETH</span>
            </div>
            <span className="text-muted-foreground/20 text-xs">·</span>
            <span className="text-[10px] font-mono text-muted-foreground/40">No KYC · Instant order generation</span>
          </div>
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
                className="glass outline-card glass-hover rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden hover:border-primary/25 transition-all duration-200">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" />
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
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">HOODFUND separates trading execution from analytics — each optimized for its purpose.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              className="glass outline-card rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Web Platform</h3>
              <p className="text-sm text-muted-foreground mb-5">The HOODFUND website handles everything non-trading.</p>
              <ul className="space-y-2.5">
                {['Dashboard & Analytics', 'Challenge Management', 'Payment Processing', 'Referral Center', 'Profile & Settings'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="glass outline-card rounded-2xl p-7 border-primary/20 hover:border-primary/35 transition-all duration-200" style={{ borderColor: 'rgba(var(--accent-rgb),0.2)' }}>
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
                <Button className="font-mono uppercase tracking-wider text-xs rounded-xl neon-glow">
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

          {/* Network logo row */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/25 bg-primary/6">
              <img src="/robinhood-logo.png" alt="Robinhood Chain" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-mono text-primary">Robinhood Chain (ETH)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentSteps.map(({ n, title, desc }, i) => (
              <motion.div key={n} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 3}
                className="glass glass-hover outline-card rounded-2xl p-5 flex gap-4 hover:border-primary/20 transition-all duration-200">
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
            className="glass rounded-3xl p-10 sm:p-14 text-center border-[1.5px] border-primary/25 relative overflow-hidden outline-card-bold">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <SectionTag>Referrals</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">Earn While Your Network Trades</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Invite friends to HOODFUND. When they complete their first successful challenge purchase, you automatically earn <strong className="text-foreground">10% of their fee</strong>. Automatic tracking. Automatic rewards. No hidden conditions.
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

          <div className="glass outline-card rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {analyticsPreview.map(({ label, value }, i) => (
                <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 4}
                  className="bg-foreground/[0.02] border border-border rounded-xl p-4 hover:bg-foreground/[0.04] hover:border-foreground/15 transition-all duration-200">
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
              <div key={i} className="glass outline-card rounded-xl overflow-hidden hover:border-foreground/15 transition-all duration-200">
                <button
                  className="w-full flex items-center justify-between p-5 text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-medium text-sm sm:text-base">{q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
                  </motion.div>
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
            className="relative rounded-3xl overflow-hidden glass border-[1.5px] border-primary/25 p-10 sm:p-16 text-center outline-card-bold">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/4 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 flex items-center justify-center mx-auto mb-6 shadow-xl pulse-ring">
                <img src="/handshake-logo.jpeg" alt="HOODFUND" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">
                Ready to prove your trading skills?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Join traders already on HOODFUND. Start your evaluation today — no KYC, pay in SOL or ETH, instant activation.
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
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/25 flex-shrink-0 shadow-md">
                  <img src="/handshake-logo.jpeg" alt="HOODFUND" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-semibold text-foreground">HOODFUND</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] mb-5">
                The premier on-chain prop trading platform. Prove your edge, unlock real capital.
              </p>
              <div className="flex items-center gap-2.5 mb-4">
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
              {/* Network indicator in footer */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-foreground/[0.02]">
                  <img src="/robinhood-logo.png" alt="Robinhood" className="w-3.5 h-3.5 rounded-full object-cover" />
                  <span className="text-[9px] font-mono text-muted-foreground/60">ETH</span>
                </div>
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
              © 2026 HOODFUND. All rights reserved. Not financial advice. Trading involves significant risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
