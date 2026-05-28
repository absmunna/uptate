import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle, ChevronRight, User } from 'lucide-react';
import { SellerOrder } from '../../modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SellerOrderPanelProps {
  orders: SellerOrder[];
  onAccept: (id: string) => void;
  onShip: (id: string) => void;
}

const STATUS_CONFIG: Record<SellerOrder['status'], { label: string; color: string; bg: string; icon: any }> = {
  new: { label: 'New Order', color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: ShoppingBag },
  processing: { label: 'In Packing', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  shipped: { label: 'Dispatched', color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: Truck },
  completed: { label: 'Settled', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-400/10', icon: XCircle },
};

export const SellerOrderPanel: React.FC<SellerOrderPanelProps> = ({ orders, onAccept, onShip }) => {
  return (
    <div className="flex flex-col gap-3">
      {orders.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-black/10 border border-white/5 border-dashed rounded-2xl">
              <ShoppingBag className="w-10 h-10 text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No Active Orders</p>
          </div>
      ) : (
        orders.map((order) => {
          const status = STATUS_CONFIG[order.status];
          const StatusIcon = status.icon;

          return (
            <div key={order.id} className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] rounded-2xl p-4 hover:border-white/10 transition-all group">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-mono font-black text-white uppercase tracking-tighter">#{order.id}</span>
                     <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-white/5", status.color, status.bg)}>
                        {status.label}
                     </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {format(new Date(order.createdAt), 'h:mm a')}
                  </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-500">
                          <User className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-white leading-none">{order.buyerName}</p>
                          <p className="text-[10px] text-zinc-600 font-bold mt-1 uppercase tracking-tight">{order.itemCount} Item(s) • COD Verified</p>
                      </div>
                  </div>
                  <p className="text-sm font-mono font-black text-cyan-400">{formatBDT(order.amount)}</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  {order.status === 'new' && (
                      <button 
                        onClick={() => onAccept(order.id)}
                        className="flex-1 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-cyan-400/10 active:scale-95"
                      >
                        Accept Order
                      </button>
                  )}
                  {order.status === 'processing' && (
                      <button 
                        onClick={() => onShip(order.id)}
                        className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-400/10 active:scale-95"
                      >
                        Ship Manifest
                      </button>
                  )}
                  <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-white/5">
                      Details
                  </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
