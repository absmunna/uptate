import React from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  Bell, 
  User, 
  Rss, 
  Building2, 
  Star, 
  Wallet, 
  Package, 
  History, 
  Globe,
  ShieldCheck,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useWalletStore } from '../../store/walletStore';
import { ThemeLangSwitcher } from './ThemeLangSwitcher';
import { LocationPicker } from './LocationPicker';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  isCenter?: boolean;
}

export const GlobalNavigation: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { fiatBalance } = useWalletStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate role data/metadata loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const role = user?.role || 'buyer';

  const [lang, setLang] = React.useState<'BN' | 'EN'>('BN');
  const [isLangOpen, setIsLangOpen] = React.useState(false);

  // --- 1. Navigation Item Configs ---
  const mobileNavItems: NavItem[] = [
    { label: 'হোম', icon: Home, path: '/' },
    { label: 'ক্যাটাগরি', icon: LayoutGrid, path: '/categories' },
    { label: 'হাব পোর্টাল', icon: LayoutGrid, path: '/b2b', isCenter: true },
    { label: 'পিকে শপ', icon: Star, path: '/pk-shop' },
    { label: 'প্রোফাইল', icon: User, path: '/profile' },
  ];

  const getRoleBasedItems = (): NavItem[] => {
    const common = [
      { label: 'হোম ফিড', path: '/', icon: Globe },
      { label: 'সোশ্যাল ফিড', path: '/feed', icon: Rss },
    ];

    if (String(role) === 'admin' || String(role) === 'super_admin') {
      return [
        ...common,
        { label: 'অ্যাডমিন প্যানেল', path: '/dashboard/admin', icon: ShieldCheck },
        { label: 'গ্রাহক ও বিক্রেতা', path: '/dashboard/admin/users', icon: Users },
        { label: 'পণ্য ভেরিফিকেশন', path: '/dashboard/admin/products', icon: Package },
        { label: 'লেনদেন', path: '/dashboard/admin/transactions', icon: CreditCard },
      ];
    }

    if (role === 'seller') {
      return [
        { label: 'ড্যাশবোর্ড', path: '/dashboard', icon: Home },
        { label: 'আমার পণ্য', path: '/dashboard/products', icon: Package },
        { label: 'অর্ডার সমূহ', path: '/dashboard/orders', icon: History },
        { label: 'বিটুবি মার্কেট', path: '/b2b', icon: Building2 },
        { label: 'ওয়ালেট', path: '/wallet', icon: Wallet },
      ];
    }

    return [
      ...common,
      { label: 'বিটুবি পোর্টাল', path: '/b2b', icon: Building2 },
      { label: 'পিকে শপ', path: '/pk-shop', icon: Star },
      { label: 'আমার ওয়ালেট', path: '/wallet', icon: Wallet },
      { label: 'অর্ডার হিস্ট্রি', path: '/orders', icon: History },
    ];
  };

  const desktopItems = getRoleBasedItems();
  const skeletonList = Array.from({ length: 6 });

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <>
      {/* ----------------- 2. Desktop Sidebar (260px) ----------------- */}
      <aside className="hidden lg:flex flex-col w-[240px] h-full sticky top-0 bg-transparent border-r border-white/5 z-40 py-6 pr-4 transition-all duration-300">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--pm-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--pm-accent)]/20 rotate-3">
             <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight">
            Paikar<span className="text-[var(--pm-accent)]">Mart</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            skeletonList.map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 animate-pulse">
                <div className="w-5 h-5 rounded-lg bg-white/10" />
                <div className="h-3 w-2/3 bg-white/10 rounded-full" />
              </div>
            ))
          ) : (
            desktopItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden
                  ${isActive 
                    ? 'bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/20 translate-x-1' 
                    : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-[var(--pm-accent)]'}`} />
                    <span className="text-sm font-bold truncate line-clamp-1">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-accent"
                        className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1"
                      />
                    )}
                    {!isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />}
                  </>
                )}
              </NavLink>
            ))
          )}
        </nav>

        {/* User Quick Profile & Logout */}
        <div className="pt-4 border-t border-[var(--pm-border)] mt-4">
          <Link
            to="/wallet"
            className="block p-4 mb-3 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/10 to-transparent border border-[var(--pm-accent)]/20 group hover:border-[var(--pm-accent)]/40 transition-all"
          >
            <p className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest mb-1">Available Balance</p>
            <p className="text-lg font-black font-mono text-[var(--pm-accent)]">৳ {fiatBalance.toLocaleString()}</p>
          </Link>
          
          <Link 
            to="/profile"
            className="p-3 mb-2 rounded-2xl bg-[var(--pm-bg)]/50 border border-[var(--pm-border)] flex items-center gap-3 group hover:border-[var(--pm-accent)]/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--pm-accent)] to-[#f43f5e] flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
               <p className="text-xs font-black text-[var(--pm-text)] truncate line-clamp-1">{user?.name || 'অতিথি গ্রাহক'}</p>
               <p className="text-[10px] text-[var(--pm-text-secondary)] uppercase tracking-wider">{role}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5 capitalize" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>



      {/* 5. Mobile Search Modal & Drawer (Mobile Only) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleMobileMenu()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-[var(--pm-surface)] z-[70] lg:hidden flex flex-col p-6 shadow-2xl shadow-black/50 border-r border-[var(--pm-border)]"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--pm-accent)] flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[var(--pm-text)] tracking-tight">প্যানেল মেনু</h2>
                    </div>
                    <button 
                      onClick={() => toggleMobileMenu()}
                      className="p-2 bg-[var(--pm-bg)] rounded-xl border border-[var(--pm-border)]"
                    >
                      <X className="w-6 h-6 text-[var(--pm-text-secondary)]" />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-2 mb-6 pb-6 border-b border-[var(--pm-border)]">
                    <LocationPicker />
                    <ThemeLangSwitcher />
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto hide-scrollbar">
                    {/* Role Specific Group */}
                    <div>
                        <p className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest mb-3 ml-2">আপনার ড্যাশবোর্ড</p>
                        <nav className="space-y-1.5">
                            {isLoading ? (
                                skeletonList.map((_, i) => (
                                    <div key={i} className="h-14 w-full bg-white/5 rounded-2xl animate-pulse" />
                                ))
                            ) : (
                                desktopItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => toggleMobileMenu()}
                                        className={({ isActive }) => `w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                        isActive 
                                            ? 'bg-[var(--pm-accent)] text-white shadow-xl shadow-[var(--pm-accent)]/20' 
                                            : 'bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5 transition-colors" />
                                        <span className="font-bold text-sm truncate line-clamp-1">{item.label}</span>
                                    </NavLink>
                                ))
                            )}
                        </nav>
                    </div>

                    {/* Support & Community */}
                    <div>
                         <p className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest mb-3 ml-2">কমিউনিটি ও সাপোর্ট</p>
                         <nav className="space-y-1.5">
                             {[
                                { label: 'জিজ্ঞাসিত প্রশ্ন', path: '/faq', icon: Globe },
                                { label: 'মার্চেন্ট নীতি', path: '/rules', icon: ShieldCheck },
                                { label: 'সাপোর্ট সেন্টার', path: '/support', icon: Users },
                             ].map((item) => (
                                 <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => toggleMobileMenu()}
                                    className={({ isActive }) => `w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] transition-all ${isActive ? 'border-[var(--pm-accent)] text-[var(--pm-accent)] shadow-lg shadow-[var(--pm-accent)]/10' : ''}`}
                                 >
                                    {({ isActive }) => (
                                      <>
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--pm-accent)]' : 'text-emerald-500'}`} />
                                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                      </>
                                    )}
                                 </NavLink>
                             ))}
                         </nav>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--pm-border)]">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 font-black border border-red-500/20 active:scale-95 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>লগআউট</span>
                    </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
