import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      setAuth(response.user as any, response.accessToken, response.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Dev Quick Logins
  const handleDevLogin = (role: string) => {
    setAuth({
      id: `dev-${role}-1`,
      email: `${role}@paikarmart.com`,
      name: `Mr. ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role
    } as any, 'fake-access-token', 'fake-refresh-token');
    
    if (role === 'admin' || role === 'super_admin') {
      navigate('/dashboard/admin');
    } else if (role === 'seller') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--pm-bg)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--pm-surface)] p-8 rounded-2xl border border-[var(--pm-border)] shadow-xl mt-12"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--pm-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-[var(--pm-accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--pm-text)]">স্বাগতম পাইকার মার্টে</h1>
          <p className="text-[var(--pm-text-secondary)] mt-2">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--pm-text-secondary)] block ml-1">ইমেইল ঠিকানা</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-secondary)]" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)] outline-none transition-all"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--pm-text-secondary)] block ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-secondary)]" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--pm-accent)] text-white font-bold py-3 px-6 rounded-xl hover:bg-[var(--pm-accent)]/90 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                লগইন করুন
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Dev Options - Temporary for testing */}
        <div className="mt-8 pt-6 border-t border-[var(--pm-border)]">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Test Login Options</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleDevLogin('admin')} className="text-xs py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 font-medium">Admin</button>
            <button onClick={() => handleDevLogin('seller')} className="text-xs py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 font-medium">Seller</button>
            <button onClick={() => handleDevLogin('buyer')} className="text-xs py-2 bg-[var(--pm-border)] text-[var(--pm-text)] rounded-lg hover:bg-[var(--pm-border)]/80 font-medium col-span-2">Buyer</button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[var(--pm-text-secondary)]">
            অ্যাকাউন্ট নেই? {' '}
            <Link to="/register" className="text-[var(--pm-accent)] font-bold hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
