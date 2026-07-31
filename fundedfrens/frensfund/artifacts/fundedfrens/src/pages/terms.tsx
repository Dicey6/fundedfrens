import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Contrast } from 'lucide-react';

const sections = [
  {
    num: '1',
    title: 'Introduction',
    content: [
      'Welcome to FundedFrens ("FundedFrens", "we", "our", or "us").',
      'These Terms and Conditions ("Terms") govern your access to and use of the FundedFrens website, services, dashboard, Telegram trading bot, applications, and any related services (collectively, the "Platform").',
      'By creating an account, accessing the Platform, purchasing a Demo Challenge, connecting your Telegram account, or using any FundedFrens service, you acknowledge that you have read, understood, and agree to be legally bound by these Terms.',
      'If you do not agree with these Terms, you must not use the Platform.',
    ],
  },
  {
    num: '2',
    title: 'Eligibility',
    content: ['To use FundedFrens you must:'],
    bullets: [
      'Be at least eighteen (18) years old.',
      'Have the legal capacity to enter into binding agreements.',
      'Comply with the laws of your country or jurisdiction.',
      'Not be prohibited from using our services under applicable law.',
    ],
    footer: 'We reserve the right to request identity verification where necessary.',
  },
  {
    num: '3',
    title: 'About FundedFrens',
    content: [
      'FundedFrens is a crypto proprietary trading evaluation platform designed specifically for Solana meme coin traders.',
      'The Platform allows users to:',
    ],
    bullets: [
      'Create an account.',
      'Purchase a Demo Challenge.',
      'Complete a trading evaluation.',
      'View trading analytics.',
      'Connect a Telegram trading bot.',
      'Participate in referral programs.',
      'Become eligible for a funded account after successfully completing the evaluation and any required review.',
    ],
    footer:
      'Passing a Demo Challenge does not automatically guarantee a funded account. All funded accounts remain subject to review, compliance, and approval.',
  },
  {
    num: '4',
    title: 'User Accounts',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to:',
    ],
    bullets: [
      'Provide accurate information.',
      'Keep your information up to date.',
      'Protect your login credentials.',
      'Notify us immediately if you believe your account has been compromised.',
    ],
    footer: 'You are responsible for all activity occurring under your account.',
  },
  {
    num: '5',
    title: 'Demo Challenge',
    content: [
      'A Demo Challenge is a simulated evaluation intended to assess trading performance according to FundedFrens\' published rules.',
      'Challenge rules may include:',
    ],
    bullets: [
      'Minimum trading days.',
      'Required win rate.',
      'Maximum drawdown.',
      'Maximum position size.',
      'Maximum open positions.',
      'Evaluation period.',
      'Other risk management requirements.',
    ],
    footer:
      'Violation of challenge rules may result in challenge failure. FundedFrens reserves the right to modify challenge rules for future participants without affecting challenges already in progress unless required for security or compliance.',
  },
  {
    num: '6',
    title: 'Funded Accounts',
    content: [
      'Successfully completing a Demo Challenge does not create a contractual obligation for FundedFrens to provide capital.',
      'Funded accounts may require:',
    ],
    bullets: [
      'Internal review.',
      'Fraud checks.',
      'Risk assessment.',
      'Compliance verification.',
      'Additional acceptance requirements.',
    ],
    footer:
      'FundedFrens reserves the right to deny, suspend, or terminate funded accounts where fraud, abuse, manipulation, or policy violations are detected.',
  },
  {
    num: '7',
    title: 'Payments',
    content: [
      'Challenge purchases are made using Solana (SOL). Displayed USD prices are reference values only.',
      'The amount of SOL required is calculated using the current SOL/USD market price at the time of purchase.',
      'Payments are considered complete only after successful blockchain verification.',
      'Users are solely responsible for sending payments to the correct treasury wallet displayed during checkout.',
      'Sending funds to an incorrect address cannot be recovered by FundedFrens.',
    ],
  },
  {
    num: '8',
    title: 'Blockchain Payment Verification',
    content: [
      'FundedFrens automatically verifies eligible payments using blockchain data.',
      'Payment verification may use blockchain infrastructure providers.',
      'Users agree that blockchain confirmation times vary and activation may require sufficient network confirmations.',
      'Transactions that cannot be matched to an order may require additional review.',
      'Attempting to submit fraudulent transaction signatures or manipulated blockchain data may result in permanent account termination.',
    ],
  },
  {
    num: '9',
    title: 'Refund Policy',
    content: ['Except where required by law:'],
    bullets: [
      'Demo Challenge purchases are non-refundable after successful payment verification.',
      'Failed challenges are not refundable.',
      'Inactive accounts are not refundable.',
      'Network fees are non-refundable.',
    ],
    footer:
      'Refund requests may be considered only in exceptional circumstances at our sole discretion.',
  },
  {
    num: '10',
    title: 'Referral Program',
    content: ['FundedFrens may provide referral rewards. Referral rewards are subject to:'],
    bullets: [
      'Valid purchases.',
      'Genuine users.',
      'Compliance with referral rules.',
    ],
    footer:
      'Self-referrals, fraudulent referrals, fake accounts, automated registrations, or abuse of the referral system may result in removal of rewards, account suspension, or permanent disqualification. FundedFrens reserves the right to modify or discontinue the referral program at any time.',
  },
  {
    num: '11',
    title: 'Telegram Trading Bot',
    content: [
      'The FundedFrens Telegram Bot is provided as a trading interface.',
      'The website remains the primary location for dashboard, analytics, referrals, challenge management, profile management, notifications, and payments.',
      'The Telegram Bot is intended for trading-related functionality only.',
      'Users remain responsible for protecting their Telegram account and ensuring it remains secure.',
    ],
  },
  {
    num: '12',
    title: 'User Responsibilities',
    content: ['You agree that you will not:'],
    bullets: [
      'Commit fraud.',
      'Abuse the platform.',
      'Attempt unauthorized access.',
      'Reverse engineer the Platform.',
      'Circumvent security measures.',
      'Manipulate evaluations.',
      'Exploit software bugs.',
      'Use automated tools to interfere with Platform operations.',
      'Impersonate another person.',
      'Upload malicious software.',
      'Interfere with other users.',
    ],
    footer: 'Violation of these Terms may result in immediate suspension or permanent termination.',
  },
  {
    num: '13',
    title: 'Risk Disclosure',
    content: [
      'Trading digital assets involves substantial financial risk. Prices may change rapidly and users may experience significant losses.',
      'Past performance does not guarantee future results.',
      'FundedFrens does not guarantee profits, successful evaluations, funded accounts, or future earnings.',
      'Users participate entirely at their own risk.',
    ],
  },
  {
    num: '14',
    title: 'No Financial Advice',
    content: ['Nothing on the Platform constitutes financial advice, investment advice, tax advice, accounting advice, or legal advice.'],
    bullets: [],
    footer: 'All information is provided for informational purposes only. Users should consult qualified professionals before making financial decisions.',
  },
  {
    num: '15',
    title: 'Intellectual Property',
    content: [
      'All software, branding, designs, graphics, code, logos, content, dashboards, interfaces, and materials provided through FundedFrens remain the exclusive property of FundedFrens unless otherwise stated.',
      'You may not reproduce, distribute, modify, copy, sell, license, or exploit any portion of the Platform without prior written permission.',
    ],
  },
  {
    num: '16',
    title: 'Limitation of Liability',
    content: [
      'To the maximum extent permitted by law, FundedFrens shall not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages arising from your use of the Platform.',
      'This includes, but is not limited to: loss of profits, trading losses, data loss, service interruptions, blockchain delays, network congestion, wallet errors, or third-party service failures.',
      'Our total liability shall not exceed the amount paid by you for the specific Demo Challenge giving rise to the claim.',
    ],
  },
  {
    num: '17',
    title: 'Suspension and Termination',
    content: ['FundedFrens may suspend or terminate any account at its discretion where it reasonably believes a user has:'],
    bullets: [
      'Violated these Terms.',
      'Engaged in fraudulent activity.',
      'Attempted to manipulate challenge results.',
      'Used unauthorized software.',
      'Threatened the security or integrity of the Platform.',
    ],
    footer: 'Termination may result in loss of access to Platform services.',
  },
  {
    num: '18',
    title: 'Changes to These Terms',
    content: [
      'FundedFrens may update these Terms from time to time. Material changes will be communicated through the Platform where appropriate.',
      'Your continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.',
    ],
  },
  {
    num: '19',
    title: 'Governing Law',
    content: [
      'These Terms shall be governed by and interpreted in accordance with the laws applicable to FundedFrens\' operating jurisdiction, without regard to conflict of law principles.',
      'Any disputes shall be resolved through the appropriate courts or dispute resolution mechanisms available in that jurisdiction.',
    ],
  },
  {
    num: '20',
    title: 'Contact',
    content: [
      'If you have any questions regarding these Terms, please contact FundedFrens through the official support channels listed on the Platform.',
    ],
  },
];

export default function TermsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : theme === 'light' ? <Moon className="w-4 h-4" /> : <Contrast className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Title block */}
        <div className="mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <img src="/handshake-logo.jpeg" alt="FundedFrens" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-display font-bold text-xl">FundedFrens</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground font-mono">Effective Date: July 21, 2026</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map(({ num, title, content, bullets, footer }) => (
            <section key={num} className="scroll-mt-20">
              <h2 className="text-lg font-display font-semibold mb-3 flex items-start gap-2">
                <span className="text-primary font-mono text-sm mt-0.5 shrink-0">{num}.</span>
                {title}
              </h2>
              <div className="space-y-3 pl-6">
                {content.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
                {bullets && bullets.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {footer && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">{footer}</p>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Final Acknowledgement */}
        <div className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-base font-display font-semibold mb-3">Final Acknowledgement</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            By creating an account, purchasing a Demo Challenge, connecting the Telegram Bot, or otherwise using FundedFrens, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You further acknowledge that cryptocurrency trading involves substantial risk, that participation in the Demo Challenge does not guarantee funding, and that you are solely responsible for your use of the Platform.
          </p>
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">© 2026 FundedFrens. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy">
              <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/">
              <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
