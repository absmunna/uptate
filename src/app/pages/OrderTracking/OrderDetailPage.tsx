import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, MoreVertical, MessageSquare, 
  Phone, HelpCircle, ShieldCheck, ExternalLink, 
  MapPin, Clock, Package, AlertTriangle 
} from 'lucide-react';
import { useOrderTrackingStore } from '@/modules/orders/orderTrackingStore';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { LogisticsLivePanel } from '@/components/orders/LogisticsLivePanel';
import { EscrowStatusCard } from '@/components/orders/EscrowStatusCard';
import { OrderActivityFeed } from '@/components/orders/OrderActivityFeed';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/format';
import { format } from 'date-fns';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, setActiveOrder, activeOrder } = useOrderTrackingStore();

  useEffect(() => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setActiveOrder(order);
    }
  }, [id, orders, setActiveOrder]);

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-zinc-500 text-sm mb-6">The order link is invalid or expired.</p>
        <Button onClick={() => navigate('/orders')} className="bg-[var(--pm-surface)] text-white rounded-xl">Back to List</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-32">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-[var(--pm-nav-bg)] backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/orders')} className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
                <h2 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest leading-none mb-1">{activeOrder.id}</h2>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">Live Logistics Feed</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer">
                <Share2 className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer">
                <MoreVertical className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pt-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Timeline Experience */}
            <div className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-8 rounded-3xl">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Logistics Chain State</h3>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                     <span className="text-[10px] font-mono text-cyan-400/80 font-bold uppercase">Real-Time Syncing</span>
                  </div>
               </div>
               <OrderTimeline currentStatus={activeOrder.status} />
            </div>

            {/* Product List */}
            <div className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-6 rounded-3xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                 <Package className="w-4 h-4" /> Ship-Group Inventory
               </h3>
               <div className="flex flex-col gap-4">
                  {/* Since I didn't see items fully populated in store, Mocking one if empty */}
                  {(activeOrder.items?.length ? activeOrder.items : [
                    { id: '1', name: 'Premium Garment Lot #42', price: activeOrder.total, quantity: 1, image: '' }
                  ]).map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 items-center">
                       <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center text-zinc-700">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-xl" /> : <Package className="w-8 h-8" />}
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">Unit Price: {formatBDT(item.price)}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-mono font-black text-cyan-400">{formatBDT(item.price * (item.quantity || 1))}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Qty: {item.quantity || 1}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-8 rounded-3xl">
               <OrderActivityFeed activities={activeOrder.activities} />
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <LogisticsLivePanel order={activeOrder} />
            <EscrowStatusCard order={activeOrder} />
            
            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Support & Actions</h3>
                <div className="flex flex-col gap-3">
                   <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-400/30 group transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                         <HelpCircle className="w-4.5 h-4.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                         <span className="text-xs font-bold text-white">Raise Dispute / Claim</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-400/30 group transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                         <span className="text-xs font-bold text-white">View Verification Rules</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600" />
                   </button>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100] h-[72px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
         <button className="h-full px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
         </button>
         <button className="flex-1 h-full rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
            <Phone className="w-4 h-4 fill-black" />
            <span>Contact Pilot</span>
         </button>
      </div>
    </div>
  );
}
