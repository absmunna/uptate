import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, ShoppingBag, Grid, ShieldAlert, Settings, LogOut, Check, LogIn, User } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/features/theme/ThemeContext';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { mode: theme, setMode: setTheme, presets: themePresets } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { lang, setLang } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute top-[105px] md:top-[72px] bottom-[64px] lg:bottom-0 left-0 right-0 bg-black/50 z-[40] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute top-[105px] md:top-[72px] bottom-[64px] lg:bottom-0 left-0 w-[85vw] max-w-[240px] bg-[var(--pm-surface)]/95 backdrop-blur-2xl z-[50] p-4 shadow-2xl border-y border-r border-[var(--pm-border)] rounded-tr-3xl rounded-br-3xl flex flex-col gap-3 overflow-y-auto hide-scrollbar"
          >
            <div className="flex items-start justify-between">
              {/* User Profile Card */}
              {isAuthenticated && user ? (
                <Link to="/profile" onClick={onClose} className="flex flex-col gap-2 group">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" className="w-full h-full object-cover bg-[var(--pm-bg)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[var(--pm-text)] leading-tight">{user.name || t('profile')}</h3>
                    <span className="text-[9px] text-[var(--pm-accent)] font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login" onClick={onClose} className="flex flex-col gap-2 group">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--pm-border)] border-dashed overflow-hidden shadow-md group-hover:border-[var(--pm-accent)] transition-all flex items-center justify-center bg-[var(--pm-surface-hover)]">
                    <User className="w-5 h-5 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[var(--pm-text)] leading-tight">{t('guestUser')}</h3>
                    <span className="text-[9px] text-[var(--pm-accent)] font-medium">{t('login')}</span>
                  </div>
                </Link>
              )}
              <button onClick={onClose} className="p-1 rounded-full bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full h-[1px] bg-[var(--pm-border)]/50 my-0.5" />

            {/* Navigation Links */}
            <nav className="flex-1 space-y-0.5">
              <NavLink to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-xs font-medium text-[var(--pm-text)]" onClick={onClose}><Home className="w-4 h-4 text-[var(--pm-accent)]"/> {t('home')}</NavLink>
              <NavLink to="/shop" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-xs font-medium text-[var(--pm-text)]" onClick={onClose}><ShoppingBag className="w-4 h-4 text-[var(--pm-accent)]"/> {t('shop')}</NavLink>
              <NavLink to="/portals" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-xs font-medium text-[var(--pm-text)]" onClick={onClose}><Grid className="w-4 h-4 text-[var(--pm-accent)]"/> {t('portals')}</NavLink>
              <NavLink to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-xs font-medium text-[var(--pm-text)]" onClick={onClose}><ShieldAlert className="w-4 h-4 text-[var(--pm-accent)]"/> {t('dashboard')}</NavLink>
              <NavLink to="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-xs font-medium text-[var(--pm-text)]" onClick={onClose}><Settings className="w-4 h-4 text-[var(--pm-accent)]"/> {t('settings')}</NavLink>
            </nav>
            
            <div className="mt-auto flex flex-col gap-2.5">
              {/* Theme & Language Settings */}
              <div className="bg-[var(--pm-surface-hover)] p-2.5 rounded-xl border border-[var(--pm-border)] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">{t('theme')}</span>
                  <div className="flex gap-1">
                    {themePresets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className="w-5 h-5 rounded-full border-2 relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shadow-sm overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[1]} 50%, ${t.swatch[2]} 100%)` }}
                        title={t.label}
                      >
                        {theme === t.id && <Check className="w-2.5 h-2.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-[var(--pm-border)]/50" />

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">{t('language')}</span>
                  <div className="flex bg-[var(--pm-bg)]/60 p-0.5 rounded-md border border-[var(--pm-border)]/50">
                    <button
                      onClick={() => setLang('EN')}
                      className={`px-2 py-0.5 rounded text-[9px] font-black transition-all ${lang === 'EN' ? 'bg-[var(--pm-accent)] text-white shadow-sm' : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('BN')}
                      className={`px-2 py-0.5 rounded text-[9px] font-black transition-all ${lang === 'BN' ? 'bg-[var(--pm-accent)] text-white shadow-sm' : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'}`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 w-full py-2 text-red-500 font-bold border border-red-500/20 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" /> {t('logout')}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
