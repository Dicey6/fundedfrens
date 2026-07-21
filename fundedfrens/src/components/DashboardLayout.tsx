import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Briefcase,
  ShoppingCart,
  Users,
  Bell,
  MessageCircle,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export type DashboardSection = 'overview' | 'challenge' | 'analytics' | 'portfolio' | 'orders' | 'referrals' | 'notifications' | 'telegram' | 'profile' | 'settings' | 'funded';

export const DashboardContext = createContext<{
  activeSection: DashboardSection;
  setActiveSection: (s: DashboardSection) => void;
}>({ activeSection: 'overview', setActiveSection: () => {} });

export const useDashboardContext = () => useContext(DashboardContext);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation('/login');
  };

  const isProfileRoute = location === '/profile';

  const mainNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'challenge', label: 'Challenge', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  const accountNavItems = [
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'telegram', label: 'Telegram', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const handleNavClick = (section: DashboardSection) => {
    if (location !== '/dashboard') {
      setLocation('/dashboard');
    }
    setActiveSection(section);
    setDrawerOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-6">
        <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 relative cursor-pointer">
          <div className="absolute -bottom-4 left-0 right-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-9 h-9 rounded-xl object-cover shadow-[0_0_14px_rgba(139,92,246,0.35)]" />
          <span className="font-display font-bold text-xl text-foreground tracking-tight">FundedFrens</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6 scrollbar-none">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 px-3">Main</div>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = !isProfileRoute && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as DashboardSection)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-mono text-xs uppercase tracking-wider ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 border-l-[3px] border-l-accent shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                      : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 px-3">Account</div>
          <div className="space-y-1">
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = !isProfileRoute && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as DashboardSection)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-mono text-xs uppercase tracking-wider ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 border-l-[3px] border-l-accent shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                      : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            <Link href="/profile" onClick={() => setDrawerOpen(false)} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-mono text-xs uppercase tracking-wider ${
              isProfileRoute
                ? 'bg-primary/10 text-primary border border-primary/20 border-l-[3px] border-l-accent shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent border-l-[3px] border-l-transparent'
            }`}>
              <Settings className={`w-4 h-4 flex-shrink-0 ${isProfileRoute ? 'text-primary' : ''}`} />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* User + logout */}
      <div className="p-4 border-t border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30 text-primary font-mono font-bold text-sm flex-shrink-0">
            {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="font-display font-medium text-sm truncate text-foreground/90">{profile?.username || 'Trader'}</div>
            <div className="text-[10px] text-muted-foreground font-mono truncate uppercase tracking-widest mt-0.5">
              ID: {profile?.id?.substring(0, 8)}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-mono uppercase text-xs tracking-wider h-9"
          onClick={() => { handleLogout(); setDrawerOpen(false); }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  );

  const getSectionTitle = () => {
    if (isProfileRoute) return 'Settings';
    const allItems = [...mainNavItems, ...accountNavItems];
    const found = allItems.find(i => i.id === activeSection);
    if (found) return found.label;
    if (activeSection === 'funded') return 'Funded Account';
    return 'Dashboard';
  };

  const challengeStatus = profile?.challenge_status || 'none';

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="min-h-screen bg-background flex">
        {/* Desktop sidebar */}
        <div className="hidden md:flex w-[260px] flex-shrink-0 bg-sidebar/80 backdrop-blur-xl border-r border-white/[0.06] flex-col sticky top-0 h-screen">
          <SidebarContent />
        </div>

        {/* Mobile drawer */}
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
                className="md:hidden fixed top-0 left-0 z-50 h-full w-[260px] bg-sidebar/95 backdrop-blur-xl border-r border-white/[0.08] shadow-2xl flex flex-col"
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0 h-screen">
          {/* Top bar */}
          <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/[0.08] text-foreground/80 hover:text-primary transition-colors"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <img src="/fundedfrens/logo.jpeg" alt="FundedFrens" className="w-8 h-8 rounded-lg object-cover md:hidden" />
                <h2 className="font-display font-bold text-lg hidden sm:block">{getSectionTitle()}</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {challengeStatus === 'active' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Active Challenge
                </span>
              )}
              {challengeStatus === 'approved' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Shield className="w-3 h-3" /> Funded
                </span>
              )}
              
              <button 
                onClick={() => handleNavClick('notifications')}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/[0.08] text-foreground/80 hover:text-primary transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                )}
              </button>
              
              <Link href="/profile">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30 text-primary font-mono font-bold text-sm cursor-pointer hover:shadow-[0_0_14px_rgba(139,92,246,0.3)] transition-all">
                  {profile?.username?.substring(0, 2).toUpperCase() || 'FF'}
                </div>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto relative">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
              <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-[100px] opacity-30" />
            </div>

            <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10 pb-20">
              {children}
            </main>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
