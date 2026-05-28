import React from 'react';
import { Star, ShieldCheck, Heart, AlertCircle, Award, TrendingUp } from 'lucide-react';
import { ReputationSummary } from '../../modules/profile/profileStore';
import { cn } from '@/lib/utils';

interface ReputationPanelProps {
  reputation: ReputationSummary;
}

export const ReputationPanel: React.FC<ReputationPanelProps> = ({ reputation }) => {
  return (
    <div className="flex flex-col gap-6 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Social Proof / Reputation
           </h3>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RepCard 
            label="Avg Multi-Vendor Rating" 
            value={reputation.averageRating} 
            icon={Star} 
            color="text-amber-400" 
            sub={`From ${reputation.totalReviews} peer evaluations`}
          />
          <RepCard 
            label="Seller Reliability" 
            value={`${reputation.sellerScore}%`} 
            icon={ShieldCheck} 
            color="text-cyan-400" 
            sub="Dispatch & fulfillment velocity"
          />
          <RepCard 
            label="Buyer Standing" 
            value={`${reputation.buyerReliability}%`} 
            icon={Heart} 
            color="text-emerald-400" 
            sub="Payment & pickup consistency"
          />
          <RepCard 
            label="Conflict Resolution" 
            value={`${reputation.disputeHistory} Cases`} 
            icon={AlertCircle} 
            color="text-rose-500" 
            sub="Resolved disputes in 12 months"
          />
       </div>

       <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Network Accolades</h4>
          <div className="flex flex-wrap gap-2">
             {reputation.badges.map(badge => (
                <div key={badge} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 group cursor-default">
                   <Award className="w-3.5 h-3.5 text-indigo-400" />
                   <span className="text-[9px] font-black uppercase text-indigo-400/80 group-hover:text-indigo-400 transition-colors tracking-tight">{badge}</span>
                </div>
             ))}
          </div>
       </div>

       <div className="mt-2 p-5 rounded-3xl bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
             <TrendingUp className="w-16 h-16 text-cyan-400" />
          </div>
          <div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Reputation Trajectory</p>
             <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight mt-1.5">Consistently in the top 2% of Merchant cluster.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-zinc-500 uppercase cursor-pointer hover:text-white hover:border-white/10 transition-all">
             Full Breakdown
          </button>
       </div>
    </div>
  );
};

const RepCard = ({ label, value, icon: Icon, color, sub }: any) => (
  <div className="p-4 rounded-2xl bg-black/20 border border-[var(--pm-border)] group hover:border-white/10 transition-all">
     <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">{label}</span>
     </div>
     <p className="text-xl font-mono font-black text-white">{value}</p>
     <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight mt-1 leading-tight">{sub}</p>
  </div>
);
