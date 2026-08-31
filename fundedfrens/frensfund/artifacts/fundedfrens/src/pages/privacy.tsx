import { Link } from 'wouter';
import { ArrowLeft, Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const sections = [
  {
    num: '1',
    title: 'Introduction',
    content: [
      'FundedFrens ("FundedFrens", "we", "our", or "us") values your privacy and is committed to protecting your personal information.',
      'This Privacy Policy explains how we collect, use, store, disclose, and protect your information when you access or use the FundedFrens website, dashboard, Telegram trading bot, and any related services (collectively, the "Platform").',
      'By creating an account or using the Platform, you acknowledge that you have read and understood this Privacy Policy.',
    ],
  },
  {
    num: '2',
    title: 'Information We Collect',
    content: ['Depending on how you use the Platform, we may collect the following categories of information.'],
    subsections: [
      {
        title: 'Account Information',
        bullets: [
          'Email address',
          'Username',
          'Encrypted password (managed through authentication services)',
          'Account creation date',
          'Account status',
        ],
      },
      {
        title: 'Profile Information',
        bullets: [
          'Payout wallet address',
          'Telegram username',
          'Referral code',
          'Profile preferences',
        ],
      },
      {
        title: 'Challenge Information',
        bullets: [
          'Purchased challenge plan',
          'Challenge status',
          'Challenge start and completion dates',
          'Trading days completed',
          'Performance statistics',
          'Risk metrics',
        ],
      },
      {
        title: 'Trading Analytics',
        bullets: [
          'Tokens traded',
          'Entry and exit market capitalization',
          'Invested SOL and current value',
          'Profit and loss, profit percentages',
          'Position sizes, hold duration',
          'Stop Loss, Take Profit, Trailing Stop, Auto Sell usage',
          'Portfolio performance',
        ],
        footer: 'This information is used solely to power your analytics dashboard.',
      },
      {
        title: 'Payment Information',
        bullets: [
          'Order details',
          'Transaction signature',
          'Payment wallet address',
          'Payment amount and status',
          'Blockchain confirmation data',
        ],
        footer: 'FundedFrens does not collect or store your wallet\'s private keys or recovery phrases.',
      },
      {
        title: 'Telegram Information',
        bullets: [
          'Telegram User ID',
          'Telegram username',
          'Link status and date',
          'Connection token',
        ],
        footer: 'This information is used only to securely connect your Telegram account with your FundedFrens account.',
      },
      {
        title: 'Device Information',
        bullets: [
          'Browser type',
          'Device type',
          'Operating system',
          'IP address',
          'Language settings and time zone',
          'Log and session information',
        ],
        footer: 'This information helps improve security and platform performance.',
      },
    ],
  },
  {
    num: '3',
    title: 'How We Use Your Information',
    content: ['We use your information to:'],
    bullets: [
      'Create and manage your account.',
      'Authenticate your identity.',
      'Provide access to the Platform.',
      'Process Demo Challenge purchases.',
      'Verify blockchain payments.',
      'Generate analytics.',
      'Connect your Telegram account.',
      'Track referral rewards.',
      'Improve platform performance.',
      'Detect fraud and prevent abuse.',
      'Provide customer support.',
      'Comply with legal obligations.',
    ],
    footer: 'We will only use your information for legitimate business purposes.',
  },
  {
    num: '4',
    title: 'Blockchain Data',
    content: [
      'Payments made using the Solana blockchain are publicly recorded.',
      'FundedFrens may access publicly available blockchain information for purposes including payment verification, fraud prevention, order validation, and security monitoring.',
      'Blockchain transactions are permanent and publicly accessible. FundedFrens cannot modify or remove blockchain records.',
    ],
  },
  {
    num: '5',
    title: 'Cookies and Similar Technologies',
    content: ['We may use cookies, local storage, and similar technologies to:'],
    bullets: [
      'Keep you signed in.',
      'Remember your preferences.',
      'Improve website performance.',
      'Enhance security.',
      'Prevent unauthorized access.',
      'Analyze platform usage.',
    ],
    footer: 'You may disable cookies through your browser settings, although doing so may affect certain features.',
  },
  {
    num: '6',
    title: 'Referral Program Information',
    content: ['If you participate in the referral program, we may collect:'],
    bullets: [
      'Referral code and link usage.',
      'Referral earnings and activity.',
      'Referral payment status.',
    ],
    footer: 'This information is used exclusively to operate the referral program.',
  },
  {
    num: '7',
    title: 'Third-Party Services',
    content: [
      'FundedFrens may rely on trusted third-party providers to operate the Platform. These providers may include services for authentication, database hosting, cloud infrastructure, blockchain verification, Telegram integration, analytics, and email delivery.',
      'These providers only receive information necessary to perform their services and are expected to maintain appropriate security measures.',
    ],
  },
  {
    num: '8',
    title: 'Sharing of Information',
    content: ['We do not sell your personal information. We may share information only when necessary:'],
    bullets: [
      'To provide our services.',
      'To process payments.',
      'To comply with legal obligations.',
      'To protect users and the Platform.',
      'To investigate fraud or abuse.',
      'During mergers, acquisitions, or business restructuring, where permitted by law.',
    ],
  },
  {
    num: '9',
    title: 'Data Security',
    content: [
      'FundedFrens implements reasonable administrative, technical, and organizational measures designed to protect your information.',
      'Examples include secure authentication, encrypted communications, database access controls, role-based permissions, and security monitoring.',
      'While we strive to protect your information, no online system can guarantee absolute security.',
    ],
  },
  {
    num: '10',
    title: 'Data Retention',
    content: ['We retain information only as long as reasonably necessary to:'],
    bullets: [
      'Provide our services.',
      'Maintain account records.',
      'Resolve disputes.',
      'Prevent fraud.',
      'Meet legal and regulatory obligations.',
    ],
    footer: 'Information may be deleted or anonymized when it is no longer required.',
  },
  {
    num: '11',
    title: 'Your Rights',
    content: ['Depending on your jurisdiction, you may have the right to:'],
    bullets: [
      'Access your personal information.',
      'Correct inaccurate information.',
      'Request deletion of your information.',
      'Object to certain processing activities.',
      'Request data portability where applicable.',
    ],
    footer: 'Some requests may be limited where retention is required by law or for legitimate business purposes.',
  },
  {
    num: '12',
    title: "Children's Privacy",
    content: [
      'FundedFrens is intended only for individuals who are at least 18 years old.',
      'We do not knowingly collect personal information from children.',
      'If we become aware that information has been collected from a person under the minimum required age, we will take reasonable steps to remove it.',
    ],
  },
  {
    num: '13',
    title: 'International Users',
    content: [
      'Your information may be processed and stored in jurisdictions different from your country of residence.',
      'By using the Platform, you acknowledge that your information may be transferred internationally in accordance with applicable laws.',
    ],
  },
  {
    num: '14',
    title: 'Platform Security',
    content: ['Users are responsible for protecting their own accounts. You should:'],
    bullets: [
      'Keep your password confidential.',
      'Enable available security features.',
      'Protect your email account.',
      'Secure your Telegram account.',
      'Protect your cryptocurrency wallets.',
    ],
    footer: 'FundedFrens cannot recover funds lost due to compromised personal wallets or accounts outside of our control.',
  },
  {
    num: '15',
    title: 'Changes to this Privacy Policy',
    content: [
      'We may update this Privacy Policy periodically to reflect changes in our services, technology, legal obligations, or business practices.',
      'When significant changes are made, we may provide notice through the Platform.',
      'Your continued use of FundedFrens after any updates constitutes acceptance of the revised Privacy Policy.',
    ],
  },
  {
    num: '16',
    title: 'Contact Us',
    content: [
      'If you have any questions regarding this Privacy Policy or how your information is handled, please contact FundedFrens through the official support channels available on the Platform.',
    ],
  },
];

export default function PrivacyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground font-mono">Effective Date: July 21, 2026</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map(({ num, title, content, bullets, footer, subsections }: any) => (
            <section key={num} className="scroll-mt-20">
              <h2 className="text-lg font-display font-semibold mb-3 flex items-start gap-2">
                <span className="text-primary font-mono text-sm mt-0.5 shrink-0">{num}.</span>
                {title}
              </h2>
              <div className="space-y-3 pl-6">
                {content.map((p: string, i: number) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
                {bullets && bullets.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {bullets.map((b: string, i: number) => (
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
                {subsections && subsections.map((sub: any, si: number) => (
                  <div key={si} className="mt-5">
                    <h3 className="text-sm font-display font-semibold text-foreground mb-2">{sub.title}</h3>
                    <ul className="space-y-1.5">
                      {sub.bullets.map((b: string, bi: number) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {sub.footer && (
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">{sub.footer}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Final Acknowledgement */}
        <div className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
          <h2 className="text-base font-display font-semibold mb-3">Final Acknowledgement</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            By creating an account or using the FundedFrens Platform, you acknowledge that you have read, understood, and accepted this Privacy Policy.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You understand that FundedFrens collects and processes information necessary to operate the Platform, verify payments, generate trading analytics, provide account services, and maintain the security and integrity of the ecosystem. Your privacy is important to us, and we are committed to handling your information responsibly and in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">© 2026 FundedFrens. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms">
              <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms &amp; Conditions</span>
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
