import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';
import { useTranslation } from '../../../hooks/useTranslation';
import { ThemeLangSwitcher } from '../../../components/navigation/ThemeLangSwitcher';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || t('registrationFailed') || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--pm-bg)] relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-full text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeLangSwitcher />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--pm-surface)] p-8 rounded-2xl border border-[var(--pm-border)] shadow-xl mt-8"
      >
        <Link to="/login" className="inline-flex items-center text-sm font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('back') || 'ফিরে যান'}
        </Link>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--pm-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-[var(--pm-accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--pm-text)]">{t('forgotPasswordTitle') || 'পাসওয়ার্ড ভুলে গেছেন?'}</h1>
          <p className="text-[var(--pm-text-secondary)] mt-2 mx-auto max-w-[260px]">
            {t('forgotDescription') || 'আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠাবো।'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-bold">
              {t('otpSentToNumber') || 'ইমেইল পাঠানো হয়েছে! দয়া করে আপনার ইনবক্স চেক করুন।'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--pm-text-secondary)] block ml-1">{t('email') || 'ইমেইল ঠিকানা'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-secondary)]" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none transition-all"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--pm-accent)] text-white font-bold py-3 px-6 rounded-xl hover:bg-[var(--pm-accent)]/90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('sendResetOtp') || 'রিসেট লিংক পাঠান'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
