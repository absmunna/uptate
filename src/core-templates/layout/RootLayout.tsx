import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar } from '../../components/navigation/Navbar';
import { GlobalNavigation } from '../../components/navigation/GlobalNavigation';
import { MoreBottomSheet } from '../../components/navigation/MoreBottomSheet';
import { FloatingNavButton } from '../../components/navigation/FloatingNavButton';
import { Footer } from '../../components/navigation/Footer';

import { CartDrawer } from '../../components/cart/CartDrawer';
import { SearchModal } from '../../components/navigation/SearchModal';
import { BottomNav } from '../../components/navigation/BottomNav';
import { MerchantTierRing, VerificationBadge } from '../../components/ui/StatusElements';
import { useCartDrawerStore } from '../../modules/cart/cartDrawerStore';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useAppStore } from '../../store/appStore';
import { useWalletStore } from '../../store/walletStore';
import { useUIStore } from '../../store/uiStore';
import { 
  Home, Newspaper, Building2, Star, ShoppingCart, Wallet, 
  Package, Globe, Users, ShieldCheck, CreditCard, HelpCircle, 
  BookOpen, Heart, Phone, ArrowUpRight, TrendingUp, Settings, Bell, Zap
} from 'lucide-react';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();
  const user = useAuthStore((state) => state.user);
  const { fiatBalance } = useWalletStore();
  const location = useLocation();
  const setIsScrolled = useUIStore((state) => state.setIsScrolled);

  const hiddenRoutes = ['/checkout', '/payment', '/fullscreen'];
  const isFooterHidden = hiddenRoutes.some(route => location.pathname.includes(route));

  // Sync Drawer/Sheet states
  useEffect(() => {
    if (isOpen) {
      setMoreSheetOpen(false);
    }
  }, [isOpen]);

  // Reset scrolled state on location change
  useEffect(() => {
    setIsScrolled(false);
  }, [location.pathname, setIsScrolled]);

  const handleMoreClick = () => {
    setMoreSheetOpen(true);
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'admin' || role === 'super_admin') return 'সিস্টেম অ্যাডমিন';
    if (role === 'seller') return 'প্রো সেলার';
    if (role === 'moderator') return 'মডারেটর';
    return 'গ্রাহক';
  };

  return (
    <div className="h-[100dvh] w-full bg-[var(--pm-bg)] transition-colors duration-500 overflow-hidden flex flex-col relative">
      {/* Ambient Lighting Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <div className="flex-1 w-full mx-auto flex overflow-hidden lg:pl-4 transition-all duration-300">
        
        {/* Left Global Sidebar Navigation */}
        <GlobalNavigation />

        {/* Middle Stage: Marketplace Feed (Full Wide) */}
        <div 
          onScroll={(e) => {
            setIsScrolled(e.currentTarget.scrollTop > 80);
          }}
          className="flex-1 min-w-0 glass-panel relative h-full flex flex-col overflow-y-auto hide-scrollbar lg:rounded-tl-[24px] transition-all duration-300 border-l border-t border-white/5 bg-[var(--pm-surface)]/40"
        >
          <MoreBottomSheet isOpen={moreSheetOpen} onClose={() => setMoreSheetOpen(false)} />
          <CartDrawer isOpen={isOpen} onClose={close} />
          <SearchModal />

          <main className="flex-1 pb-28 md:pb-8">
            <FloatingNavButton />
            {children}
            {!isFooterHidden && <Footer />}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

