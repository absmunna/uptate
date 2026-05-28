import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, LogOut, User, HelpCircle, FileText, Bell } from 'lucide-react';
import { CloseButton } from '@/components/ui/PremiumButtons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/authStore';
import { useTranslation } from '../../hooks/useTranslation';

interface MoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreBottomSheet = ({ isOpen, onClose }: MoreBottomSheetProps) => {
  const { user, isAuthenticated, logout } = useAuthStore();
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center lg:hidden"
          >
            <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] bg-[var(--pm-surface)] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-x border-[var(--pm-border)] flex flex-col pb-safe">
              
              {/* Drag Handle */}
              <div className="w-full pt-3 pb-4 px-4 flex justify-center items-center relative" onClick={onClose}>
                <div className="w-12 h-1.5 bg-[var(--pm-border)] rounded-full hover:bg-[var(--pm-text-muted)] transition-colors cursor-pointer" />
                <CloseButton size="sm" variant="glass" className="absolute right-4 rounded-full border-[var(--pm-border)] shadow-xs" onClose={onClose} />
              </div>

              {/* Profile Overview Card */}
              <div className="px-5 pb-5">
                {isAuthenticated && user ? (
                  <Link to="/profile" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 transition-colors group">
                    <div className="w-14 h-14 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" className="w-full h-full object-cover bg-[var(--pm-bg)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[var(--pm-text)] leading-tight truncate">{user.name || t('profile')}</h3>
                      <p className="text-xs text-[var(--pm-accent)] font-medium uppercase tracking-wider mt-1">{user.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--pm-bg)] flex items-center justify-center text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                  </Link>
                ) : (
                  <Link to="/login" onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] border-dashed hover:border-[var(--pm-accent)]/50 transition-colors group">
                    <div className="w-14 h-14 rounded-full border-2 border-[var(--pm-border)] border-dashed overflow-hidden shadow-sm group-hover:border-[var(--pm-accent)] flex items-center justify-center shrink-0 bg-[var(--pm-bg)]">
                      <User className="w-6 h-6 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[var(--pm-text)] leading-tight truncate">{t('guestUser')}</h3>
                      <p className="text-xs text-[var(--pm-accent)] font-medium mt-1">{t('login')}</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Action Links */}
              <div className="px-3 pb-6 flex flex-col gap-1 overflow-y-auto max-h-[50vh] hide-scrollbar">
                
                <div className="px-4 py-2">
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">{t('settings') || 'Preferences'}</span>
                </div>
                
                <Link to="/settings" onClick={onClose} className="flex items-center justify-between p-4 mx-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full glass border border-[var(--pm-border)] flex items-center justify-center group-hover:border-[var(--pm-accent)]/30 transition-colors">
                      <Settings className="w-4 h-4 text-[var(--pm-text)] group-hover:text-[var(--pm-accent)]" />
                    </div>
                    <span className="font-medium text-[var(--pm-text)]">{t('settings') || 'Account Settings'}</span>
                  </div>
                </Link>

                <Link to="/notifications" onClick={onClose} className="flex items-center justify-between p-4 mx-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full glass border border-[var(--pm-border)] flex items-center justify-center group-hover:border-[var(--pm-accent)]/30 transition-colors">
                      <Bell className="w-4 h-4 text-[var(--pm-text)] group-hover:text-[var(--pm-accent)]" />
                    </div>
                    <span className="font-medium text-[var(--pm-text)]">Notifications</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--pm-accent)]" />
                </Link>

                <div className="px-4 py-2 mt-2">
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">Support & Info</span>
                </div>

                <Link to="/support" onClick={onClose} className="flex items-center justify-between p-4 mx-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full glass border border-[var(--pm-border)] flex items-center justify-center group-hover:border-[var(--pm-accent)]/30 transition-colors">
                      <HelpCircle className="w-4 h-4 text-[var(--pm-text)] group-hover:text-[var(--pm-accent)]" />
                    </div>
                    <span className="font-medium text-[var(--pm-text)]">Help Center</span>
                  </div>
                </Link>

                <Link to="/terms" onClick={onClose} className="flex items-center justify-between p-4 mx-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full glass border border-[var(--pm-border)] flex items-center justify-center group-hover:border-[var(--pm-accent)]/30 transition-colors">
                      <FileText className="w-4 h-4 text-[var(--pm-text)] group-hover:text-[var(--pm-accent)]" />
                    </div>
                    <span className="font-medium text-[var(--pm-text)]">Terms & Policies</span>
                  </div>
                </Link>

                {isAuthenticated && (
                  <>
                    <div className="w-full h-px bg-[var(--pm-border)]/50 my-2" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-4 mx-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{t('logout') || 'Log Out'}</span>
                    </button>
                  </>
                )}
                
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
