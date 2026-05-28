import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './navigationConfig';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/features/theme/ThemeContext';
import { cn } from '@/lib/utils';
import { LogOut, Zap, Grid3x3, X, Palette, Check } from 'lucide-react';
import { useAppLauncherStore } from './useAppLauncherStore';
import { useLanguageStore } from './useLanguageStore';
import { motion } from 'motion/react';

interface MobileSidebarProps {
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  const { role, logout } = useAuth();
  const { mode: currentTheme, setMode, presets } = useTheme();
  const { toggleLauncher } = useAppLauncherStore();
  const { t } = useLanguageStore();

  const filteredItems = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(role as any)
  );

  return (
    <div className="lg:hidden fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm" onClick={onClose}>
       <motion.div 
         initial={{ x: '-100%' }}
         animate={{ x: 0 }}
         exit={{ x: '-100%' }}
         onClick={(e) => e.stopPropagation()}
         transition={{ type: 'spring', damping: 25, stiffness: 200 }}
         className="w-[280px] h-full bg-gray-50 dark:bg-[var(--pm-bg)] shadow-2xl border-r border-gray-200 dark:border-white/5 flex flex-col overflow-y-auto"
       >
          <div className="p-6 h-full flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => { toggleLauncher(); onClose(); }}
                >
                   <div className="w-9 h-9 rounded-xl bg-[#00a859] flex items-center justify-center text-white shadow-lg shadow-[#00a859]/20">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                   <div>
                     <h1 className="text-lg font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">PaikarMart</h1>
                     <p className="text-[8px] text-[#00a859] font-bold uppercase tracking-widest mt-1">Super App v3.0</p>
                   </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-white/5"
                >
                   <X className="w-5 h-5" />
                </button>
             </div>

             {/* User Profile Snippet */}
             <div className="mb-6 p-4 rounded-xl bg-gray-200/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00a859] to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
                   {role === 'guest' ? 'G' : 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {role === 'guest' ? t('nav.guest') || 'Guest User' : 'Authenticated User'}
                   </p>
                   <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider truncate">
                      Role: {role}
                   </p>
                </div>
             </div>
             
             <nav className="flex-1 flex flex-col gap-1.5">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4"
                >
                    <button 
                        onClick={() => { toggleLauncher(); onClose(); }}
                        className="flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-zinc-900 dark:text-white"
                    >
                        <div className="flex items-center gap-3">
                            <Grid3x3 className="w-5 h-5 text-[#00a859]" />
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
                              onClick={onClose}
                              className={({ isActive }) => cn(
                                  "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer",
                                  isActive ? "bg-gray-200 dark:bg-white/5 border-l-4 border-[#00a859] text-zinc-900 dark:text-white" : "text-zinc-500 hover:bg-gray-200 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                              )}
                          >
                              {({ isActive }) => (
                                  <>
                                      <div className="flex items-center gap-3">
                                          <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-[#00a859]" : "group-hover:text-[#00a859]")} />
                                          <span className="text-xs font-bold uppercase tracking-widest">{t(`nav.${item.id}`)}</span>
                                      </div>
                                      {item.badge && (
                                          <motion.span 
                                              initial={{ scale: 0.8 }}
                                              animate={{ scale: 1 }}
                                              className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase"
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

             <div className="mt-8 flex flex-col gap-6">
                {/* Theme Switcher */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                     <Palette className="w-4 h-4 text-[#00a859]" />
                     <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                        {t('settings.theme') || 'App Theme'}
                     </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 px-1">
                     {presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setMode(preset.id)}
                          className={cn(
                            "relative w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden",
                            currentTheme === preset.id 
                              ? "border-[#00a859] scale-105 shadow-md shadow-[#00a859]/20" 
                              : "border-transparent bg-gray-200 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/10"
                          )}
                          title={preset.label}
                        >
                           <div 
                             className="w-full h-full"
                             style={{ 
                               background: `linear-gradient(135deg, ${preset.swatch[0]} 0%, ${preset.swatch[1]} 50%, ${preset.swatch[2]} 100%)` 
                             }}
                           />
                           {currentTheme === preset.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                 <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
                </div>

                <motion.div 
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5"
                >
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-[#00a859] animate-pulse" />
                      <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Network Live</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-[#00a859]" 
                      />
                   </div>
                </motion.div>

                <motion.button 
                   whileTap={{ scale: 0.98 }}
                   onClick={() => { logout(); onClose(); }}
                   className="flex items-center gap-3 w-full h-11 px-4 rounded-xl text-rose-500/60 hover:bg-rose-500/5 transition-all group cursor-pointer"
                >
                   <LogOut className="w-5 h-5 transition-transform" />
                   <span className="text-xs font-black uppercase tracking-widest">{t('app.logout')}</span>
                </motion.button>
             </div>
          </div>
       </motion.div>
    </div>
  );
};
