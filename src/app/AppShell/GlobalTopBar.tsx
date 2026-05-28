import React, { useState } from 'react';
import { Search, Bell, ShoppingCart, User, Menu, Command, LogIn, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalNotificationCenter } from './GlobalNotificationCenter';
import { useAuth } from '@/features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from './useThemeStore';
import { useLanguageStore } from './useLanguageStore';

import { motion } from 'motion/react';

interface GlobalTopBarProps {
  onToggleSidebar?: () => void;
}

export const GlobalTopBar: React.FC<GlobalTopBarProps> = ({ onToggleSidebar }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage, t } = useLanguageStore();

  return (
    <header className="h-16 fixed w-full top-0 z-[500] bg-background/80 backdrop-blur-xl border-b border-border px-3 md:px-6 flex items-center justify-between shadow-[0_4px_30px_rgb(0,0,0,0.02)] transition-all">
       {/* Mobile-only content */}
       <div className="flex md:hidden items-center justify-between w-full h-full">
          {/* Left: Side Menu + Logo */}
          <div className="flex items-center gap-1.5">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={onToggleSidebar}
               aria-label="Toggle Navigation Sidebar"
               className="p-2 rounded-xl hover:bg-muted transition-all"
             >
                <Menu className="w-5 h-5 text-foreground" />
             </motion.button>
             
             <div className="flex items-center gap-1.5 cursor-pointer ml-0.5" onClick={() => navigate('/')}>
                <div className="text-primary">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                   </svg>
                </div>
                <h1 className="text-lg font-black tracking-tight text-primary leading-none">Paikar<span className="text-accent">Mart</span></h1>
             </div>
          </div>

          {/* Right: Search + Message/Login */}
          <div className="flex items-center gap-1">
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-all text-foreground"
             >
                {/* Note: Topbar still needs logic for multiple themes if needed */}
                <Sun className="w-4.5 h-4.5" />
             </motion.button>

             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {/* Search action */}}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-all text-foreground"
             >
                <Search className="w-4.5 h-4.5" />
             </motion.button>

             {isAuthenticated ? (
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate('/chat')}
                 className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-all text-foreground relative"
               >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
               </motion.button>
             ) : (
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate('/auth/login')}
                 className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-all text-foreground"
               >
                 <User className="w-4.5 h-4.5" />
               </motion.button>
             )}
          </div>
       </div>

       {/* Desktop-only content */}
       <div className="hidden md:flex items-center justify-between w-full h-full">

       {/* Search - Desktop */}
       <div className="flex flex-1 mx-6 max-w-xl relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
             <Search className="w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <motion.input 
             whileFocus={{ scale: 1.01 }}
             type="text" 
             placeholder={t('app.search') || "Search in PaikarMart..."} 
             className="w-full bg-muted hover:bg-muted border border-transparent rounded-2xl py-2.5 pl-11 pr-4 text-[13px] font-semibold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground placeholder:font-medium shadow-inner ring-4 ring-transparent focus:ring-primary/10"
          />
       </div>

       {/* Right Section */}
       <div className="flex items-center gap-2 md:gap-3">
          <motion.button 
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             onClick={toggleLanguage}
             aria-label="Toggle Language"
             className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:text-primary transition-all group text-foreground"
          >
             <Globe className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
             <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-background rounded-full px-1 shadow-sm uppercase">{language}</span>
          </motion.button>

          <motion.button 
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             onClick={toggleTheme}
             aria-label="Toggle Theme"
             className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:text-primary transition-all group text-foreground"
          >
             {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 group-hover:-rotate-12 transition-transform" />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            aria-label="Shopping Cart"
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:text-primary transition-all group text-foreground"
          >
             <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          </motion.button>

          <motion.button 
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsNotifOpen(!isNotifOpen)}
             aria-label="Notifications Panel"
             className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-card border border-border flex items-center justify-center relative hover:text-primary transition-all group text-foreground"
          >
             <Bell className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
             <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border-2 border-background animate-pulse" />
          </motion.button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* User Profile Hook */}
          {isAuthenticated ? (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/profile')}
              aria-label="User Profile Menu"
              className="p-1 rounded-2xl bg-card border border-border flex items-center gap-2 md:gap-3 hover:border-primary/30 transition-all md:pr-4"
            >
               <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={`${user.fullName}'s identity`} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                  )}
               </div>
               <div className="hidden lg:flex flex-col items-start pr-2">
                  <span className="text-[10px] font-black text-foreground uppercase tracking-tighter leading-none whitespace-nowrap">{user?.fullName || 'User'}</span>
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{user?.role || 'Guest'}</span>
               </div>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth/login')}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t('app.signIn')}</span>
            </motion.button>
          )}
       </div>

       </div>

       <GlobalNotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
};
