import React from 'react';
import { Home, Grid, Plus, ShoppingBag, User, Bell } from 'lucide-react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  // Hide on checkout, payment, etc.
  const hiddenRoutes = ['/checkout', '/payment', '/fullscreen'];
  const isHidden = hiddenRoutes.some(route => location.pathname.includes(route));

  if (isHidden) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] md:hidden px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="glass-morphism rounded-[28px] h-[72px] flex items-center justify-around px-2 w-full max-w-md mx-auto pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
      >
        {/* Home */}
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all ${
            isActive ? 'text-cyan-400' : 'text-white/40'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
        </NavLink>

        {/* Categories */}
        <NavLink 
          to="/categories" 
          className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all ${
            isActive ? 'text-cyan-400' : 'text-white/40'
          }`}
        >
          <Grid className="w-5 h-5 mb-1" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Market</span>
        </NavLink>

        {/* Sourcing (Center-ish) */}
        <NavLink 
          to="/b2b" 
          className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all ${
            isActive ? 'text-orange-400' : 'text-white/40'
          }`}
        >
          <ShoppingBag className="w-6 h-6 mb-0.5" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Sourcing</span>
        </NavLink>

        {/* Notifications */}
        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all ${
            isActive ? 'text-cyan-400' : 'text-white/40'
          }`}
        >
          <div className="relative">
             <Bell className="w-5 h-5 mb-1" />
             <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#0c0c16]" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter">Alerts</span>
        </NavLink>

        {/* Profile */}
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-12 rounded-2xl transition-all ${
            isActive ? 'text-cyan-400' : 'text-white/40'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Profile</span>
        </NavLink>
      </motion.nav>
    </div>
  );
};

