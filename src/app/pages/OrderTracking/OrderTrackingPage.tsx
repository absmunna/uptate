import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, AlertCircle } from 'lucide-react';
import { useOrderTrackingStore } from '@/modules/orders/orderTrackingStore';
import { OrderListCard } from '@/components/orders/OrderListCard';
import { Button } from '@/components/ui/button';

export default function OrderTrackingPage() {
  const { orders } = useOrderTrackingStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-20">
      <div className="max-w-[1280px] mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-cyan-400" /> My Orders
            </h1>
            <p className="text-sm text-[var(--pm-text-secondary)] mt-1">
              Track your active sourcing and retail logistics in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                    type="text" 
                    placeholder="Search Order ID..." 
                    className="w-full bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] rounded-xl py-2.5 pl-10 pr-4 text-xs focus:border-cyan-400 outline-none transition-all"
                />
            </div>
            <Button variant="outline" className="rounded-xl border-[var(--pm-border)] bg-[var(--pm-surface)]/20 px-4">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderListCard 
                key={order.id} 
                order={order} 
                onClick={() => navigate(`/orders/track/${order.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No active orders found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">
                Your sourcing and retail orders will appear here once you complete a checkout.
            </p>
            <Button 
                onClick={() => navigate('/')}
                className="bg-cyan-400 hover:bg-cyan-500 text-black px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
                Start Shopping
            </Button>
          </div>
        )}

        {/* Global Support CTA */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-zinc-900/40 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Need Logistical Support?</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Contact our 24/7 Trade Assurance desk for assistance.</p>
                </div>
            </div>
            <Button variant="outline" className="rounded-xl border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase">
                Open Support Ticket
            </Button>
        </div>
      </div>
    </div>
  );
}
