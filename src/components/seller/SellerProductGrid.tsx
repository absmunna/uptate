import React from 'react';
import { MoreVertical, Edit3, Rocket, PauseCircle, Trash2, Eye, ShoppingCart, BarChart3 } from 'lucide-react';
import { SellerProduct } from '../../modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';

interface SellerProductGridProps {
  products: SellerProduct[];
}

export const SellerProductGrid: React.FC<SellerProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] rounded-2xl p-4 flex gap-4 group hover:border-cyan-400/20 transition-all">
          {/* Image */}
          <div className="w-24 h-24 rounded-xl bg-black/20 border border-[var(--pm-border)] overflow-hidden shrink-0 relative">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            {product.isBoosted && (
                <div className="absolute top-1 left-1 bg-cyan-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter flex items-center gap-0.5">
                    <Rocket className="w-2 h-2" /> BOOSTED
                </div>
            )}
            {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest -rotate-12 border border-rose-400 px-1 py-0.5">Sold Out</span>
                </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-white truncate leading-tight">{product.title}</h3>
              <div className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-white/5 rounded-lg text-zinc-400 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs font-mono font-black text-cyan-400 mt-1">{formatBDT(product.price)}</p>

            <div className="grid grid-cols-3 gap-2 mt-3">
               <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> Views</span>
                  <span className="text-[10px] font-mono font-bold text-white leading-none mt-1">{product.views}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><ShoppingCart className="w-2.5 h-2.5" /> Sales</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 leading-none mt-1">{product.sales}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><BarChart3 className="w-2.5 h-2.5" /> CR</span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 leading-none mt-1">{product.conversion}%</span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider transition-all cursor-pointer">
                    <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                    product.isBoosted ? "bg-cyan-400 text-black hover:bg-cyan-500" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                )}>
                    {product.isBoosted ? "Boost active" : "Boost"}
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
