import React from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionList } from '../components/TransactionList';
import { PaymentMethods } from '../components/PaymentMethods';
import { ShieldCheck, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BackButton } from '@/components/ui/PremiumButtons';

export const WalletDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 px-4 pb-12 pt-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onBack={() => navigate('/')} size="md" variant="glass" className="border-white/10 bg-white/5 hover:bg-white/10" />
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">সুপার ওয়ালেট</h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Wallet 2.0 • Secure Assets</p>
          </div>
        </div>
        <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Trust Shield Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-[28px] bg-indigo-500/10 border border-indigo-500/20 shadow-inner group"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 group-hover:scale-110 transition-transform">
           <ShieldCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Secure Protocol</span>
           <p className="text-[11px] text-indigo-200/60 leading-snug font-medium">
             আপনার লেনদেন সুরক্ষিত এবং সামরিক গ্রেড এনক্রিপশন দ্বারা রক্ষিত।
           </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        <BalanceCard />
        <PaymentMethods />
        <TransactionList />
      </div>
    </div>
  );
};
export default WalletDashboard;
