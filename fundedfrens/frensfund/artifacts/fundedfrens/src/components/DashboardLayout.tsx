import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Target, BarChart3, Briefcase, ShoppingCart,
  Users, MessageCircle, User, Settings, LogOut, Menu, X,
  Shield, ChevronRight, Lock, Sun, Moon
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
  { kind: 'section', label: 'Dashboard',      section: 'overview',       icon: LayoutDashboard },
  { kind: 'section', label: 'Challenge',       section: 'challenge',      icon: Target },
  { kind: 'section', label: 'Analytics',       section: 'analytics',      icon: BarChart3 },
  { kind: 'section', label: 'Portfolio',       section: 'portfolio',      icon: Briefcase },
  { kind: 'section', label: 'Orders',          section: 'orders',         icon: ShoppingCart },
];

const accountNav: NavItem[] = [
  { kind: 'section', label: 'Referrals',       section: 'referrals',      icon: Users },
  { kind: 'section', label: 'Telegram',        section: 'telegram',       icon: MessageCircle },
  { kind: 'section', label: 'Profile',         section: 'profile',        icon: User },
  { kind: 'link',    label: 'Settings',        href: '/profile',          icon: Settings },
];

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({
  activeSection,
  setActiveSection,
  location,
  profile,
  unreadCount,
  onNav,
}: {
  activeSection: DashboardSection;
  setActiveSection: (s: DashboardSection) => void;
  location: string;
  profile: any;
  onNav?: () => void;
}) {
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
          onClick={() => { setActiveSection(item.section); onNav?.(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
            isActive
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent'
          }`}
        >
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
          <span className="text-xs font-mono uppercase tracking-wider flex-1">{item.label}</span>
        </button>
      );
    }

    // Link kind (Settings → /profile)
    const isActive = location === item.href;
    return (
      <Link key={idx} href={item.href} onClick={onNav}>
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative cursor-pointer ${
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent'
        }`}>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
          <span className="text-xs font-mono uppercase tracking-wider">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 pb-6">
        <div className="flex items-center gap-3">
          <img
            src="/fundedfrens/logo.jpeg"
            alt="FundedFrens"
            className="w-9 h-9 rounded-xl object-cover shadow-[0_0_14px_rgba(139,92,246,0.35)]"
          />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">FundedFrens</span>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-primary/30 via-white/5 to-transparent" />
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 overflow-y-auto space-y-5 pb-4">
        {/* Main */}
        <div>
          <div className="px-3 mb-2 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Main</div>
          <div className="space-y-0.5">
            {mainNav.map((item, i) => renderNavItem(item, i))}
          </div>
        </div>
        {/* Account */}
        <div>
          <div className="px-3 mb-2 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Account</div>
          <div className="space-y-0.5">
            {accountNav.map((item, i) => renderNavItem(item, mainNav.length + i))}
          </div>
        </div>
        {/* Funded Account */}
        <div>
          <div className="px-3 mb-2 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Capital</div>
          <button
            onClick={() => { setActiveSection('funded'); onNav?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
              location === '/dashboard' && activeSection === 'funded'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {location === '/dashboard' && activeSection === 'funded' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
            )}
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-mono uppercase tracking-wider flex-1">Funded Account</span>
            <span className="text-[9px] font-mono text-muted-foreground/40 border border-white/10 px-1.5 py-0.5 rounded">Locked</span>
          </button>
        </div>
      </div>

      {/* User info + Logout */}
      <div className="p-3 border-t border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20 text-primary font-mono font-bold text-sm flex-shrink-0">
            {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="font-display font-medium text-sm truncate text-foreground/90">
              {profile?.username || 'Trader'}
            </div>
            <div className={`text-[9px] font-mono uppercase tracking-widest mt-0.5 ${
              profile?.challenge_status === 'active' ? 'text-primary/70' :
              profile?.challenge_status === 'approved' ? 'text-emerald-400/70' : 'text-muted-foreground/60'
            }`}>
              {profile?.challenge_status === 'active' ? '● Active Evaluation' :
               profile?.challenge_status === 'approved' ? '● Live Funded' : 'No active challenge'}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-mono uppercase text-[10px] tracking-wider h-8"
          onClick={handleLogout}
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Log Out
        </Button>
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

  // Section titles for top bar
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
    : location === '/profile'
    ? 'Settings'
    : 'Dashboard';

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="min-h-screen bg-background flex">

        {/* ── Desktop sidebar ── */}
        <div className="hidden md:flex w-[260px] flex-shrink-0 bg-sidebar/80 backdrop-blur-xl border-r border-white/[0.06] flex-col sticky top-0 h-screen">
          <SidebarContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            location={location}
            profile={profile}
          />
        </div>

        {/* ── Mobile: hamburger ── */}
        <div className="md:hidden fixed top-0 left-0 z-50 p-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/[0.08] text-foreground/80 hover:text-primary transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
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
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-sidebar/95 backdrop-blur-xl border-r border-white/[0.08] shadow-2xl flex flex-col"
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
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
          <div className="sticky top-0 z-30 h-14 flex items-center px-4 md:px-6 border-b border-white/[0.05] bg-background/80 backdrop-blur-xl gap-4">
            {/* Mobile spacer */}
            <div className="md:hidden w-8" />
            {/* Page title */}
            <div className="flex items-center gap-2 flex-1">
              <ChevronRight className="w-3 h-3 text-muted-foreground/40 hidden md:block" />
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                {currentTitle}
              </span>
            </div>
            {/* Right side */}
            <div className="flex items-center gap-3">
              {profile?.challenge_status === 'active' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Evaluation Active
                </span>
              )}
              {profile?.challenge_status === 'approved' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Shield className="w-3 h-3" /> Funded
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] dark:hover:bg-white/[0.06] light:hover:bg-black/[0.04] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20 text-primary font-mono font-bold text-xs">
                {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
              </div>
            </div>
          </div>

          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02]" />
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/4 to-transparent blur-[100px] opacity-30" />
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full relative z-10">
            {children}
          </main>

          {/* Dashboard footer */}
          <footer className="relative z-10 border-t border-white/[0.05] px-4 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">© 2026 FundedFrens · v1.0</span>
              <div className="flex items-center gap-4">
                <a href="/terms" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors uppercase tracking-widest">Terms</a>
                <a href="/privacy" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors uppercase tracking-widest">Privacy</a>
                <a href="https://t.me/FundedFrens" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors uppercase tracking-widest">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
