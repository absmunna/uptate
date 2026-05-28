import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppLauncherStore } from './useAppLauncherStore';
import { useLanguageStore } from './useLanguageStore';
import { 
  Search, Mic, X,
  ShoppingBag, MapPin, Package, Truck,
  Briefcase, Globe, Store, BarChart2,
  Video, MessageCircle, Heart, Users,
  Wallet, HelpCircle, Settings, Navigation, PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Type Definitions
type AppItem = {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  color: string;
};

type AppGroup = {
  title: string;
  apps: AppItem[];
};

// Data Data
const COMMERCE_APPS: AppItem[] = [
  { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, path: '/marketplace', color: 'bg-[#51c479]' },
  { id: 'nearby', name: 'Nearby Shops', path: '/local', icon: Store, color: 'bg-[#ff8f4a]' },
  { id: 'orders', name: 'Orders', path: '/orders', icon: Package, color: 'bg-[#4092ff]' },
  { id: 'delivery', name: 'Delivery', path: '/delivery', icon: Truck, color: 'bg-[#6C5CE7]' },
];

const BUSINESS_APPS: AppItem[] = [
  { id: 'services', name: 'Services', path: '/services', icon: PenTool, color: 'bg-[#00CEC9]' },
  { id: 'b2b', name: 'B2B Wholesale', path: '/wholesale', icon: Users, color: 'bg-[#FDCB6E]' },
  { id: 'export', name: 'Export', path: '/export', icon: Globe, color: 'bg-[#0984E3]' },
  { id: 'seller', name: 'Seller Hub', path: '/seller', icon: BarChart2, color: 'bg-[#D63031]' },
];

const SOCIAL_APPS: AppItem[] = [
  { id: 'reels', name: 'Reels', path: '/reels', icon: Video, color: 'bg-[#E84393]' },
  { id: 'messages', name: 'Messages', path: '/chat', icon: MessageCircle, color: 'bg-[#74B9FF]' },
  { id: 'saved', name: 'Saved', path: '/wishlist', icon: Heart, color: 'bg-[#FF7675]' },
  { id: 'followers', name: 'Followers', path: '/followers', icon: Users, color: 'bg-[#00B894]' },
];

const UTILITY_APPS: AppItem[] = [
  { id: 'wallet', name: 'Wallet', path: '/wallet', icon: Wallet, color: 'bg-amber-500' },
  { id: 'support', name: 'Support', path: '/support', icon: HelpCircle, color: 'bg-sky-500' },
  { id: 'settings', name: 'Settings', path: '/settings', icon: Settings, color: 'bg-slate-500' },
];

const ALL_GROUPS: AppGroup[] = [
  { title: 'Commerce', apps: COMMERCE_APPS },
  { title: 'Business', apps: BUSINESS_APPS },
  { title: 'Social', apps: SOCIAL_APPS },
  { title: 'Utility', apps: UTILITY_APPS },
];

const QUICK_ACCESS: AppItem[] = [
  COMMERCE_APPS[0], // Marketplace
  COMMERCE_APPS[2], // Delivery
  BUSINESS_APPS[0], // B2B
  SOCIAL_APPS[1],   // Messages
  UTILITY_APPS[0],  // Wallet
];

const RECENT_APPS: AppItem[] = [
  COMMERCE_APPS[3], // Nearby
  BUSINESS_APPS[2], // Seller Hub
  SOCIAL_APPS[0],   // Reels
  UTILITY_APPS[2],  // Settings
  COMMERCE_APPS[1], // Orders
];

export const AppLauncher: React.FC = () => {
  const { isOpen, closeLauncher } = useAppLauncherStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    closeLauncher();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLauncher}
            className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm transition-opacity"
          />

          {/* Launcher Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-[301] h-[90vh] lg:h-[100vh] lg:top-0 lg:max-w-2xl lg:mx-auto bg-white dark:bg-[var(--pm-bg)]/90 backdrop-blur-[20px] rounded-t-[28px] lg:rounded-none lg:rounded-b-[28px] border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header Area */}
            <div className="flex-none px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{t('app.allApps')}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('app.launcherText')}</p>
                </div>
                <button 
                  onClick={closeLauncher}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-zinc-900 dark:text-white/70 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative h-[56px]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search apps, services, marketplace..."
                  className="w-full h-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-[28px] pl-12 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00a859]/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm"
                />
                <button className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-white transition-colors">
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-8 hide-scrollbar">
              
              {/* Quick Access */}
              <section>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">{t('app.quickAccess')}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {QUICK_ACCESS.map(app => (
                    <AppIconCard key={app.id} app={app} onClick={() => handleNavigate(app.path)} />
                  ))}
                </div>
              </section>

              {/* Recently Used */}
              <section>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">{t('app.recent')}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {RECENT_APPS.map(app => (
                    <AppIconCard key={app.id} app={app} onClick={() => handleNavigate(app.path)} />
                  ))}
                </div>
              </section>

              {/* All Groups */}
              {ALL_GROUPS.map(group => (
                <section key={group.title}>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">{group.title}</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {group.apps.map(app => (
                      <AppIconCard key={app.id} app={app} onClick={() => handleNavigate(app.path)} />
                    ))}
                  </div>
                </section>
              ))}

            </div>
            
            {/* Bottom Gradient for fade effect on scroll */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[var(--pm-bg)] via-white/80 dark:via-[var(--pm-bg)]/80 to-transparent pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AppIconCard = React.memo(({ app, onClick }: { app: AppItem, onClick: () => void }) => {
  const Icon = app.icon;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 group outline-none"
    >
      <div className={`w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[18px] sm:rounded-[20px] ${app.color} shadow-lg shadow-black/50 flex items-center justify-center transition-transform relative overflow-hidden`}>
        {/* Soft highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />
        <Icon className={`w-7 h-7 sm:w-8 sm:h-8 relative z-10 text-white`} fill="currentColor" strokeWidth={1} />
      </div>
      <span className="text-[11px] sm:text-[12px] font-medium text-zinc-700 dark:text-zinc-300 leading-tight text-center px-1 max-w-[70px] truncate">
        {app.name}
      </span>
    </motion.button>
  );
});

AppIconCard.displayName = 'AppIconCard';
