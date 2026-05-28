import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { useTranslation } from '../../../hooks/useTranslation';
import { ThemeLangSwitcher } from '../../../components/navigation/ThemeLangSwitcher';
import { BackButton } from '../../../components/ui/BackButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      setUser(response.user as any);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || t('loginFailed') || 'লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--pm-bg)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--pm-accent)]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-pink-500/5 blur-[100px] rounded-full" />

      <div className="absolute top-6 left-6 z-10">
        <BackButton />
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeLangSwitcher />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 3 }}
            className="w-16 h-16 bg-gradient-to-br from-[var(--pm-accent)] to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/20"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Paikar<span className="text-[var(--pm-accent)]">Mart</span>
          </h1>
          <p className="text-[var(--pm-text-secondary)] mt-2 text-xs font-bold uppercase tracking-widest opacity-60">
            {t('loginMessage') || 'প্রোফাইলে লগইন করুন'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold uppercase tracking-wide flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest ml-1 opacity-60">
              {t('email') || 'ইমেইল বা ফোন'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--pm-text-secondary)] group-focus-within:text-[var(--pm-accent)] transition-colors" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-white/10 shadow-inner"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest opacity-60">
                {t('password') || 'পাসওয়ার্ড'}
              </label>
              <Link to="/forgot-password" title="পাসওয়ার্ড রিসেট" className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-widest hover:underline opacity-80 hover:opacity-100 transition-all">
                {t('forgotPassword') || 'ভুলে গেছেন?'}
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--pm-text-secondary)] group-focus-within:text-[var(--pm-accent)] transition-colors" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-white/10 shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-xl shadow-orange-600/20 disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest">{t('login') || 'লগইন করুন'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Quick demo login */}
        <p className="text-[10px] text-white/40 tracking-wider font-bold text-center mb-3 uppercase">Try with demo accounts:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => { setEmail("admin@paikarmart.com"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-300">Admin</span>
          </button>
          <button
            type="button"
            onClick={() => { setEmail("seller@paikarmart.com"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300">Seller</span>
          </button>
          <button
            type="button"
            onClick={() => { setEmail("buyer@paikarmart.com"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <LogIn className="h-4 w-4 text-cyan-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300">Buyer</span>
          </button>
        </div>

        <div className="mt-8 text-center border-t border-slate-800/50 pt-6 space-y-3">
          <p className="text-[11px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-widest opacity-60">
            {t('dontHaveAccount') || 'অ্যাকাউন্ট নেই?'} {' '}
            <Link to="/register" className="text-[var(--pm-accent)] font-black hover:underline ml-1">
              {t('registerNow') || 'এখনি যোগ দিন'}
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[9px] font-bold text-white/40 uppercase tracking-wide">
            <Link to="/auth/seller-register" className="hover:text-amber-400 transition-colors">সেলার</Link>
            <span>•</span>
            <Link to="/auth/wholesale-register" className="hover:text-emerald-400 transition-colors">পাইকারি বিক্রেতা</Link>
            <span>•</span>
            <Link to="/auth/factory-register" className="hover:text-cyan-400 transition-colors">কারখানা মালিক</Link>
            <span>•</span>
            <Link to="/auth/rural-register" className="hover:text-orange-400 transition-colors">গ্রামীণ দোকান</Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> 256-bit AES Encrypted Session
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
