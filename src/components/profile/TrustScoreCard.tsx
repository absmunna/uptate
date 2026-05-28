import React from 'react';
import { Target, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustScoreCardProps {
  score: number;
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({ score }) => {
  // Score determination
  const status = score > 80 ? 'Elite' : score > 50 ? 'Stable' : 'Risk';
  const color = score > 80 ? 'text-emerald-400' : score > 50 ? 'text-amber-400' : 'text-rose-500';
  const bgColor = score > 80 ? 'bg-emerald-400' : score > 50 ? 'bg-amber-400' : 'bg-rose-500';

  return (
    <div className="p-8 rounded-[32px] bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] flex flex-col gap-6 items-center text-center relative overflow-hidden select-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-20" />
      
      <div className="flex flex-col items-center">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Identity Trust Index</h3>
         
         {/* Simple Visual Score UI (No library) */}
         <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
               <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-zinc-800 fill-none"
                  strokeWidth="8"
               />
               <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className={cn("fill-none transition-all duration-1000", color.replace('text', 'stroke'))}
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * score) / 100}
                  strokeLinecap="round"
               />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-black text-white">{score}</span>
                <span className={cn("text-[10px] uppercase font-black tracking-widest mt-1", color)}>{status}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
         <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-[8px]">Growth</span>
            <div className="flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-emerald-400" />
               <span className="text-xs font-mono font-bold text-white">+4.2%</span>
            </div>
         </div>
         <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-[8px]">Network Rank</span>
            <div className="flex items-center gap-1">
               <Target className="w-3 h-3 text-cyan-400" />
               <span className="text-xs font-mono font-bold text-white">#1,240</span>
            </div>
         </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 w-full text-left">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
             This score reflects your peer-to-peer reliability across the PaikarMart network.
          </p>
      </div>
    </div>
  );
};
