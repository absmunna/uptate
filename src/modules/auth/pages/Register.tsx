import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { useTranslation } from '../../../hooks/useTranslation';
import { ThemeLangSwitcher } from '../../../components/navigation/ThemeLangSwitcher';
import { BackButton } from '../../../components/ui/BackButton';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register({ name, email, password, role: 'buyer' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || t('registrationFailed') || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--pm-bg)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-orange-500/5 blur-[110px] rounded-full" />

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
            initial={{ rotate: 15 }}
            animate={{ rotate: -5 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Join<span className="text-emerald-500">Us</span>
          </h1>
          <p className="text-[var(--pm-text-secondary)] mt-2 text-xs font-bold uppercase tracking-widest opacity-60">
            {t('registrationMessage') || 'নতুন অ্যাকাউন্ট তৈরি করুন'}
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

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest ml-1 opacity-60">
              {t('fullName') || 'আপনার নাম'}
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--pm-text-secondary)] group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-white/10 shadow-inner"
                placeholder={t('enterName') || 'John Doe'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest ml-1 opacity-60">
              {t('email') || 'ইমেইল ঠিকানা'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--pm-text-secondary)] group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-white/10 shadow-inner"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase tracking-widest ml-1 opacity-60">
              {t('password') || 'পাসওয়ার্ড'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--pm-text-secondary)] group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-white/10 shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-700 text-white font-black py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:grayscale"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest">{t('registerNow') || 'অ্যাকাউন্ট খুলুন'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/50 pt-6 space-y-3">
          <p className="text-[11px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-widest opacity-60">
            {t('alreadyHaveAccount') || 'অ্যাকাউন্ট আছে?'} {' '}
            <Link to="/login" className="text-emerald-500 font-black hover:underline ml-1">
              {t('login') || 'লগইন করুন'}
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
          <ShieldCheck className="w-3 h-3" /> GDPR Compliant • Cloud Active
        </div>
      </motion.div>
    </div>
  );
};
