import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './navigationConfig';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import { LogOut, Zap, Grid3x3, Sun, Moon, Languages, Palette, ChevronDown } from 'lucide-react';
import { useAppLauncherStore } from './useAppLauncherStore';

import { useLanguageStore } from './useLanguageStore';
import { useThemeStore, themes } from './useThemeStore';

import { motion, AnimatePresence } from 'motion/react';

export const GlobalSidebar: React.FC = () => {
  const { role, logout } = useAuth();
  const { toggleLauncher } = useAppLauncherStore();
  const { t, language, toggleLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const filteredItems = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(role as any)
  );

  return (
     <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 bg-[var(--pm-bg)] border-r border-[var(--pm-border)] p-8 select-none overflow-y-auto">
       <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10 px-2 cursor-pointer"
        onClick={toggleLauncher}
       >
          <div className="w-12 h-12 rounded-3xl bg-[var(--pm-accent)] flex items-center justify-center text-[var(--pm-text)] shadow-lg">
             <Zap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-[var(--pm-text)] uppercase italic leading-none">PaikarMart</h1>
            <p className="text-[10px] text-[var(--pm-accent)] font-bold uppercase tracking-widest mt-1">Super App v3.0</p>
          </div>
       </motion.div>

       {/* User Profile Snippet */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="mb-10 p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center gap-4"
       >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--pm-accent)] to-[var(--pm-text-secondary)] flex items-center justify-center text-[var(--pm-text)] font-bold shadow-md">
             {role === 'guest' ? 'G' : 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-sm font-bold text-[var(--pm-text)] truncate">
                {role === 'guest' ? t('nav.guest') || 'Guest User' : 'Authenticated User'}
             </p>
             <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium uppercase tracking-wider truncate">
                Role: {role}
             </p>
          </div>
       </motion.div>

       <nav className="flex-1 flex flex-col gap-3">
          {/* App Launcher Quick Access for Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0 }}
            className="mb-4"
          >
              <button 
                  onClick={toggleLauncher}
                  className="flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer bg-muted hover:bg-accent/20 text-foreground"
              >
                  <div className="flex items-center gap-3">
                      <Grid3x3 className="w-5 h-5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">{t('app.allApps')}</span>
                  </div>
              </button>
          </motion.div>

          {filteredItems.map((item, index) => {
             const Icon = item.icon;
             return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                >
                    <NavLink 
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer",
                            isActive ? "bg-accent/20 border-l-4 border-primary text-foreground" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "group-hover:text-primary")} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{t(item.id)}</span>
                                </div>
                                {item.badge && (
                                    <motion.span 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black uppercase"
                                    >
                                        {item.badge}
                                    </motion.span>
                                )}
                            </>
                        )}
                    </NavLink>
                </motion.div>
             );
          })}
       </nav>

       <div className="mt-6 flex flex-col gap-2">
         {/* Theme & Language Switchers */}
         <div className="flex gap-2">
            <div className="relative flex-1">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-muted text-muted-foreground hover:text-primary"
              >
                <div className="flex items-center">
                    <Palette className="w-5 h-5" />
                    <span className="ml-2 font-bold text-xs">{themes.find(t => t.id === theme)?.name}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showThemeMenu ? "rotate-180" : "")} />
              </button>
              <AnimatePresence>
                {showThemeMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 w-full bg-popover rounded-xl overflow-hidden border border-border z-10"
                    >
                        {themes.map(tOption => (
                            <button 
                                key={tOption.id}
                                onClick={() => { setTheme(tOption.id as any); setShowThemeMenu(false); }}
                                className={cn("w-full text-left p-2 text-xs font-bold hover:bg-accent/10", theme === tOption.id ? "text-primary" : "text-foreground")}
                            >
                                {tOption.name}
                            </button>
                        ))}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center justify-center p-2 rounded-xl bg-muted text-muted-foreground hover:text-primary"
            >
              <Languages className="w-5 h-5" />
              <span className="ml-2 font-bold text-xs">{language.toUpperCase()}</span>
            </button>
         </div>
       </div>

       <div className="mt-10 flex flex-col gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
             <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Network Live</span>
             </div>
             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary" 
                />
             </div>
             <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tight mt-2 italic leading-relaxed">
                Active nodes synchronized with central governance.
             </p>
          </motion.div>

          <motion.button 
             whileHover={{ x: 4, color: 'var(--color-destructive)' }}
             whileTap={{ scale: 0.98 }}
             onClick={logout}
             className="flex items-center gap-3 w-full h-11 px-4 rounded-xl text-destructive/60 hover:bg-destructive/5 transition-all group cursor-pointer"
          >
             <LogOut className="w-5 h-5 transition-transform" />
             <span className="text-xs font-black uppercase tracking-widest">{t('app.logout')}</span>
          </motion.button>
       </div>
    </aside>
  );
};
