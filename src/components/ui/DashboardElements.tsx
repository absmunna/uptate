import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, ChevronDown, BarChart, Users } from 'lucide-react';

export const LiveBalanceCard = ({ balance }: { balance: number }) => (
  <div className="bg-[var(--pm-elevated)] p-4 rounded-2xl border border-[var(--pm-border)]">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider">উপলব্ধ ব্যালেন্স</span>
      <button className="text-[var(--pm-accent)] animate-spin-once"><RefreshCw className="w-4 h-4" /></button>
    </div>
    <div className="text-2xl font-black text-white">৳{balance.toLocaleString()}</div>
    <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded w-fit">
      <ShieldCheck className="w-3 h-3" /> এসক্রো ট্রেড প্রটেক্টেড (Escrow)
    </div>
  </div>
);

export const GraphToggle = ({ active, onChange }: { active: 'sales' | 'views', onChange: (v: 'sales' | 'views') => void }) => (
  <div className="flex bg-[var(--pm-surface)] p-1 rounded-full border border-[var(--pm-border)] w-fit">
    <button 
      onClick={() => onChange('sales')}
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${active === 'sales' ? 'bg-[var(--pm-accent)] text-white' : 'text-white/50'}`}
    >
      <BarChart className="w-3 h-3 inline mr-1" /> বিক্রি
    </button>
    <button 
      onClick={() => onChange('views')}
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${active === 'views' ? 'bg-[var(--pm-accent)] text-white' : 'text-white/50'}`}
    >
      <Users className="w-3 h-3 inline mr-1" /> ট্রাফিক
    </button>
  </div>
);

export const RatingStarsDropdown = ({ rating, distribution }: { rating: number, distribution: Record<number, number> }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-xs font-black text-white hover:text-[var(--pm-accent)]">
        {rating} <span className="text-amber-500">★</span> <ChevronDown className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="absolute top-8 right-0 bg-[var(--pm-surface)] border border-[var(--pm-border)] p-3 rounded-xl w-40 z-10 shadow-xl">
          {[5,4,3,2,1].map(r => (
            <div key={r} className="flex items-center gap-2 text-[10px] text-white/70">
              <span className="font-bold w-3">{r}</span>
              <div className="h-1 flex-1 bg-white/5 rounded-full"><div className="h-full bg-amber-500" style={{ width: `${distribution[r]}%` }} /></div>
              <span className="w-8 text-right">{distribution[r]}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
