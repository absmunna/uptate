import React from 'react';
import { Sparkles, TrendingUp, DollarSign, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { SellerAIInsight } from '../../modules/seller/sellerDashboardStore';
import { cn } from '@/lib/utils';

interface SellerAIInsightsPanelProps {
  insights: SellerAIInsight[];
}

const TYPE_CONFIG: Record<SellerAIInsight['type'], { icon: any; color: string; bg: string }> = {
  trending: { icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  price_demand: { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  refund_risk: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  suggestion: { icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
};

export const SellerAIInsightsPanel: React.FC<SellerAIInsightsPanelProps> = ({ insights }) => {
  return (
    <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-6 rounded-3xl flex flex-col gap-5 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap className="w-24 h-24 text-cyan-400 fill-cyan-400" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-white font-black">AI Seller Insights</h3>
      </div>

      <div className="flex flex-col gap-4">
        {insights.map((insight) => {
          const config = TYPE_CONFIG[insight.type];
          const Icon = config.icon;

          return (
            <div key={insight.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-all">
                <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-xl shrink-0 border border-white/5", config.color, config.bg)}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed group-hover:text-white transition-colors uppercase font-bold tracking-tight">
                        {insight.message}
                    </p>
                </div>
                
                <button className="flex items-center justify-between w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider text-cyan-400 group/btn transition-all cursor-pointer">
                    <span>{insight.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
          );
        })}
      </div>

      <div className="mt-2 p-3 bg-zinc-800/20 rounded-2xl border border-white/5">
          <p className="text-[9px] text-zinc-500 italic leading-snug">
              Paikar AI analyzes 10k+ local trade signals daily to optimize your store conversion.
          </p>
      </div>
    </div>
  );
};
