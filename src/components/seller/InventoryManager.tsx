import React from 'react';
import { Box, AlertTriangle, RefreshCcw, Eye, Search, Filter, Plus } from 'lucide-react';
import { SellerProduct } from '../../modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InventoryManagerProps {
  products: SellerProduct[];
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ products }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" /> Sourcing Hub / Inventory
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Real-time stock ledger</p>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <RefreshCcw className="w-4 h-4" />
            </button>
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-black text-[10px] font-black uppercase rounded-xl h-9">
               <Plus className="w-4 h-4 mr-1.5" /> Bulk Update
            </Button>
         </div>
      </div>

      <div className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Product Details</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Price & Sourcing</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Current Stock</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                        <div>
                            <p className="text-xs font-bold text-white truncate max-w-[140px]">{p.title}</p>
                            <p className="text-[9px] font-mono text-zinc-600 uppercase mt-0.5">#{p.id}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-black text-cyan-400">{formatBDT(p.price)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-xs font-mono font-black",
                            p.stock === 0 ? "text-rose-500" : p.stock < 15 ? "text-amber-400" : "text-emerald-400"
                        )}>
                            {p.stock} Units
                        </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {p.stock === 0 ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" /> RESTOCK CRITICAL
                        </span>
                    ) : p.stock < 20 ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                    ) : (
                        <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Healthy
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
