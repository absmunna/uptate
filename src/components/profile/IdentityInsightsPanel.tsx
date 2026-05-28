import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const IdentityInsightsPanel: React.FC = () => {
  return (
    <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-6 rounded-3xl flex flex-col gap-5 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-24 h-24 text-cyan-400 fill-cyan-400" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
            <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-white font-black">AI Identity Insights</h3>
      </div>

      <div className="flex flex-col gap-4">
          <InsightCard 
            type="prediction"
            message="Trust index predicated to increase by 2.4% after next 2 successful deliveries."
            cta="View Forecast"
          />
          <InsightCard 
            type="risk"
            message="Moderate risk flag detected on linked payout channel. Verification recommended."
            cta="Audit Channel"
            critical
          />
          <InsightCard 
            type="suggestion"
            message="Your business profile completion is at 82%. Adding a trade license will boost visibility."
            cta="Finish Setup"
          />
      </div>

      <div className="mt-2 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-indigo-400" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Sentinel Protection</span>
                <span className="text-[8px] text-zinc-500 font-bold uppercase">Enhanced Privacy Active</span>
             </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
      </div>
    </div>
  );
};

const InsightCard = ({ message, cta, critical = false }: any) => (
  <div className={cn(
    "p-4 rounded-2xl bg-black/30 border flex flex-col gap-3 group transition-all",
    critical ? "border-rose-500/20 hover:border-rose-500/40" : "border-white/5 hover:border-white/10"
  )}>
      <div className="flex items-start gap-3">
          <div className={cn(
              "p-2 rounded-xl shrink-0", 
              critical ? "bg-rose-500/10 text-rose-500" : "bg-cyan-400/10 text-cyan-400"
          )}>
              {critical ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-bold uppercase tracking-tight group-hover:text-zinc-300">
              {message}
          </p>
      </div>
      <button className={cn(
          "flex items-center justify-between w-full h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider group/btn transition-all cursor-pointer",
          critical ? "text-rose-500" : "text-cyan-400"
      )}>
          <span>{cta}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
      </button>
  </div>
);
