import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Target, BarChart3, Briefcase, ShoppingCart,
  Users, MessageCircle, User, Settings, LogOut, Menu, X,
  Shield, Sun, Moon, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// ── Dashboard Section Context ─────────────────────────────────────────────────
export type DashboardSection =
  | 'overview' | 'challenge' | 'analytics' | 'portfolio'
  | 'orders' | 'referrals' | 'telegram'
  | 'profile' | 'funded';

interface DashboardContextValue {
  activeSection: DashboardSection;
  setActiveSection: (s: DashboardSection) => void;
}

export const DashboardContext = React.createContext<DashboardContextValue>({
  activeSection: 'overview',
  setActiveSection: () => {},
});

export const useDashboardContext = () => React.useContext(DashboardContext);

// ── Nav item definitions ──────────────────────────────────────────────────────
type NavItem =
  | { kind: 'section'; label: string; section: DashboardSection; icon: React.ElementType }
  | { kind: 'link'; label: string; href: string; icon: React.ElementType };

const mainNav: NavItem[] = [
  { kind: 'section', label: 'Dashboard',  section: 'overview',  icon: LayoutDashboard },
  { kind: 'section', label: 'Challenge',  section: 'challenge', icon: Target },
  { kind: 'section', label: 'Analytics',  section: 'analytics', icon: BarChart3 },
  { kind: 'section', label: 'Portfolio',  section: 'portfolio', icon: Briefcase },
  { kind: 'section', label: 'Orders',     section: 'orders',    icon: ShoppingCart },
];

const accountNav: NavItem[] = [
  { kind: 'section', label: 'Referrals',  section: 'referrals', icon: Users },
  { kind: 'section', label: 'Telegram',   section: 'telegram',  icon: MessageCircle },
  { kind: 'section', label: 'Profile',    section: 'profile',   icon: User },
  { kind: 'link',    label: 'Settings',   href: '/profile',     icon: Settings },
];

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({
  activeSection,
  setActiveSection,
  location,
  profile,
  onNav,
}: {
  activeSection: DashboardSection;
  setActiveSection: (s: DashboardSection) => void;
  location: string;
  profile: any;
  unreadCount?: number;
  onNav?: () => void;
}) {
  const [, navigate] = useLocation();

  const handleSectionNav = (section: DashboardSection) => {
    setActiveSection(section);
    if (location !== '/dashboard') navigate('/dashboard');
    onNav?.();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const renderNavItem = (item: NavItem, idx: number) => {
    const Icon = item.icon;

    if (item.kind === 'section') {
      const isActive = location === '/dashboard' && activeSection === item.section;
      return (
        <button
          key={idx}
          onClick={() => handleSectionNav(item.section)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
            isActive
              ? 'bg-primary/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
          }`}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
          <span className="text-[11px] font-medium tracking-wide flex-1">{item.label}</span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>
      );
    }

    const isActive = location === item.href;
    return (
      <Link key={idx} href={item.href} onClick={onNav}>
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer ${
          isActive
            ? 'bg-primary/10 text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
        }`}>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
          <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/30 flex-shrink-0 group-hover:border-primary/60 transition-all duration-200 shadow-md">
              <img src="/handshake-logo.jpeg" alt="FundedFrens" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-base text-foreground tracking-tight">FundedFrens</span>
          </div>
        </Link>
        <div className="mt-5 h-px bg-border" />
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 overflow-y-auto space-y-6 pb-4">
        <div>
          <div className="px-3 mb-1.5 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Main</div>
          <div className="space-y-0.5">
            {mainNav.map((item, i) => renderNavItem(item, i))}
          </div>
        </div>
        <div>
          <div className="px-3 mb-1.5 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Account</div>
          <div className="space-y-0.5">
            {accountNav.map((item, i) => renderNavItem(item, mainNav.length + i))}
          </div>
        </div>
        <div>
          <div className="px-3 mb-1.5 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Capital</div>
          <button
            onClick={() => handleSectionNav('funded')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
              location === '/dashboard' && activeSection === 'funded'
                ? 'bg-primary/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'
            }`}
          >
            {location === '/dashboard' && activeSection === 'funded' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
            )}
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span className="text-[11px] font-medium tracking-wide flex-1">Funded Account</span>
            <span className="text-[8px] font-mono text-muted-foreground/40 border border-border px-1.5 py-0.5 rounded-md">Locked</span>
          </button>
        </div>
      </div>

      {/* User info + Logout */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 mb-2 px-2 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 text-black font-mono font-bold text-xs shadow-sm">
            {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="font-medium text-sm truncate text-foreground">
              {profile?.username || 'Trader'}
            </div>
            <div className={`text-[10px] font-mono truncate mt-0.5 ${
              profile?.challenge_status === 'active' ? 'text-primary' :
              profile?.challenge_status === 'approved' ? 'text-emerald-400' : 'text-muted-foreground'
            }`}>
              {profile?.challenge_status === 'active' ? '● Active evaluation' :
               profile?.challenge_status === 'approved' ? '● Funded trader' : 'No challenge'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 text-[11px] font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── Main Layout Component ─────────────────────────────────────────────────────
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = React.useState<DashboardSection>('overview');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const sectionTitles: Record<DashboardSection, string> = {
    overview: 'Dashboard',
    challenge: 'Challenge',
    analytics: 'Analytics',
    portfolio: 'Portfolio',
    orders: 'Orders',
    referrals: 'Referrals',
    telegram: 'Telegram',
    profile: 'Profile',
    funded: 'Funded Account',
  };

  const currentTitle = location === '/dashboard'
    ? sectionTitles[activeSection]
    : location === '/profile' ? 'Settings'
    : 'Dashboard';

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="min-h-screen bg-background flex">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:flex w-[240px] flex-shrink-0 bg-sidebar border-r border-sidebar-border flex-col sticky top-0 h-screen">
          <SidebarContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            location={location}
            profile={profile}
          />
        </aside>

        {/* ── Mobile hamburger ── */}
        <div className="md:hidden fixed top-0 left-0 z-50 p-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border text-foreground/80 hover:text-foreground shadow-sm transition-all duration-200 hover:shadow-md"
            aria-label="Open navigation"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                className="md:hidden fixed top-0 left-0 z-50 h-full w-[240px] bg-sidebar border-r border-sidebar-border shadow-2xl flex flex-col"
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
                <SidebarContent
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  location={location}
                  profile={profile}
                  onNav={() => setDrawerOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col overflow-auto min-w-0">

          {/* Top bar */}
          <header className="sticky top-0 z-30 h-14 flex items-center px-4 md:px-6 border-b border-border bg-background/95 backdrop-blur-md gap-4">
            <div className="md:hidden w-8" />
            <div className="flex items-center gap-2 flex-1">
              <span className="text-muted-foreground/40 text-sm hidden md:block">/</span>
              <span className="text-sm font-medium text-foreground">{currentTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              {profile?.challenge_status === 'active' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Evaluation
                </span>
              )}
              {profile?.challenge_status === 'approved' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Shield className="w-3 h-3" /> Funded
                </span>
              )}
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
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </button>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-mono font-bold text-xs flex-shrink-0 shadow-sm">
                {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border px-4 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/handshake-logo.jpeg" alt="FundedFrens" className="w-4 h-4 rounded object-cover opacity-40" />
                <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">© 2026 FundedFrens · v1.0</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/terms" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors">Terms</a>
                <a href="/privacy" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors">Privacy</a>
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
