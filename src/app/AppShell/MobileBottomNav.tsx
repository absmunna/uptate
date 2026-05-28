import React from 'react';
import { NavLink } from 'react-router-dom';
import { MOBILE_NAV_ITEMS } from './navigationConfig';
import { cn } from '@/lib/utils';
import { useAppLauncherStore } from './useAppLauncherStore';
import { useLanguageStore } from './useLanguageStore';

import { motion } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const { toggleLauncher } = useAppLauncherStore();
  const { t } = useLanguageStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] p-4 pointer-events-none">
      <nav className="pointer-events-auto h-[68px] bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl px-2 flex items-center justify-around shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-zinc-600 dark:text-zinc-400">
         {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            
            if (item.id === 'apps') {
               return (
                 <button 
                  key={item.id} 
                  onClick={toggleLauncher}
                  className="flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 focus:outline-none group"
                 >
                     <motion.div 
                      initial={false}
                      className="flex flex-col items-center relative"
                     >
                        <motion.div 
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-xl transition-all duration-300 bg-gray-100 dark:bg-white/5 text-zinc-900 dark:text-white group-hover:bg-[#00a859] group-hover:text-white shadow-sm"
                        >
                           <Icon className="w-5 h-5" />
                        </motion.div>
                        <span className="text-[9px] font-bold tracking-wide mt-1 group-hover:text-[#00a859] transition-colors">{t(`nav.${item.id}`)}</span>
                     </motion.div>
                 </button>
               );
            }

            return (
               <NavLink 
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => cn(
                      "flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative",
                      isActive ? "text-[#00a859]" : "hover:text-zinc-900 dark:hover:text-white"
                  )}
               >
                  {({ isActive }) => (
                     <motion.div 
                      initial={false}
                      animate={isActive ? { y: -2 } : { y: 0 }}
                      className="flex flex-col items-center"
                     >
                        {isActive && (
                           <motion.div layoutId="nav-indicator" className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-[#00a859] shadow-[0_0_8px_rgba(0,168,89,0.8)]" />
                        )}
                        <motion.div 
                          whileTap={{ scale: 0.9 }}
                          className={cn(
                            "p-1.5 rounded-xl transition-all duration-300",
                            isActive && "bg-[#00a859]/10 text-[#00a859]"
                          )}
                        >
                           <Icon className={cn("w-5 h-5", isActive && "stroke-2")} />
                        </motion.div>
                        <span className={cn("text-[9px] font-bold tracking-wide mt-1 transition-colors", isActive && "text-[#00a859]")}>{t(`nav.${item.id}`)}</span>
                     </motion.div>
                  )}
               </NavLink>
            );
         })}
      </nav>
    </div>
  );
};
