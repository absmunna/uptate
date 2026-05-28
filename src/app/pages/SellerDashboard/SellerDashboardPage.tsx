import React, { useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  MessageSquare, Star, Settings, UserCircle, 
  Wallet, Sparkles, Bell, Plus, Search,
  Box, TrendingUp, AlertCircle, Percent
} from 'lucide-react';
import { useSellerDashboardStore } from '@/modules/seller/sellerDashboardStore';
import { sellerDashboardService } from '@/modules/seller/sellerDashboardService';
import { SellerProductGrid } from '@/components/seller/SellerProductGrid';
import { SellerOrderPanel } from '@/components/seller/SellerOrderPanel';
import { RevenueAnalyticsChart } from '@/components/seller/RevenueAnalyticsChart';
import { InventoryManager } from '@/components/seller/InventoryManager';
import { SellerReviewManager } from '@/components/seller/SellerReviewManager';
import { SellerAIInsightsPanel } from '@/components/seller/SellerAIInsightsPanel';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function SellerDashboardPage() {
  const { kpis, products, orders, insights, isLoading } = useSellerDashboardStore();

  useEffect(() => {
    sellerDashboardService.init();
    sellerDashboardService.initEventListeners();
  }, []);

  if (isLoading && products.length === 0) {
    return (
        <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white">
      {/* Top Header Strip */}
      <div className="sticky top-0 z-[100] bg-[var(--pm-nav-bg)] backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
                 <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Seller HQ</h2>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Universal Store Search..." 
                  className="w-full bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] rounded-xl py-2 pl-10 pr-4 text-xs focus:border-cyan-400 outline-none"
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] border border-white/5 flex items-center justify-center relative hover:text-cyan-400 transition-all cursor-pointer">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-[var(--pm-bg)]" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Navigation Sidebar (Hidden on mobile) */}
          <div className="hidden lg:col-span-2 lg:flex flex-col gap-1 sticky top-24 h-fit">
             <NavItem icon={LayoutDashboard} label="Overview" active />
             <NavItem icon={Package} label="Products" />
             <NavItem icon={ShoppingCart} label="Orders" count={kpis.pendingOrders} />
             <NavItem icon={Box} label="Inventory" />
             <NavItem icon={BarChart3} label="Revenue" />
             <NavItem icon={Sparkles} label="Promotions" />
             <NavItem icon={MessageSquare} label="Messages" />
             <NavItem icon={Star} label="Reviews" />
             <div className="h-px bg-white/5 my-4 mx-2" />
             <NavItem icon={Wallet} label="Payouts" />
             <NavItem icon={Settings} label="Settings" />
          </div>

          {/* CENTER: Core Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
             
             {/* Header Content */}
             <div className="flex items-center justify-between">
                <div>
                   <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Merchant Operations</h1>
                   <p className="text-sm text-zinc-500 mt-1 uppercase font-bold tracking-tight">Active Session: {new Date().toLocaleDateString()}</p>
                </div>
                <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs h-11 px-6 rounded-2xl shadow-xl shadow-cyan-400/20 active:scale-95 transition-all">
                   <Plus className="w-4 h-4 mr-2" /> List New Product
                </Button>
             </div>

             {/* 1. SELLER KPI CARDS */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard label="Total Sales" value={formatBDT(kpis.totalSales * 0.42)} icon={TrendingUp} color="text-emerald-400" />
                <KPICard label="Total Orders" value={kpis.totalOrders} icon={ShoppingCart} />
                <KPICard label="Conversion" value={`${kpis.conversionRate}%`} icon={Percent} color="text-amber-400" />
                <KPICard label="Pending" value={kpis.pendingOrders} icon={Clock} color="text-cyan-400" />
             </div>

             {/* 2. REVENUE ANALYTICS */}
             <RevenueAnalyticsChart />

             {/* 3. PRODUCT PERFORMANCE */}
             <SectionHeader title="Product Matrix" cta="Manage All" />
             <SellerProductGrid products={products} />

             {/* 4. ORDER MANAGEMENT */}
             <SectionHeader title="Recent Transaction Log" cta="View History" />
             <SellerOrderPanel 
                orders={orders} 
                onAccept={sellerDashboardService.acceptOrder}
                onShip={sellerDashboardService.shipOrder}
             />

             {/* 5. INVENTORY */}
             <InventoryManager products={products} />
          </div>

          {/* RIGHT: AI Insights & Reputation (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
             <SellerAIInsightsPanel insights={insights} />
             <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <BarChart3 className="w-5 h-5" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-white leading-none">Share Market Capture</h3>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-400 w-[65%]" />
                </div>
                <p className="text-[10px] text-zinc-500 mt-3 font-bold uppercase tracking-tight">You occupy 65% of your local niche category.</p>
             </div>
             <SellerReviewManager />
             
             <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col gap-4">
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Policy Alerts</h3>
                <div className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-400 leading-relaxed uppercase font-bold tracking-tighter">
                       Identity Verification Update Required before next settlement cycle.
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* MOBILE TABS NAVIGATION */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] h-[72px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
         <MobileTab icon={LayoutDashboard} active />
         <MobileTab icon={Package} />
         <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center text-black shadow-lg shadow-cyan-400/20">
            <Plus className="w-6 h-6" />
         </div>
         <MobileTab icon={ShoppingCart} />
         <MobileTab icon={UserCircle} />
      </div>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, active = false, count = 0 }: any) => (
  <button className={cn(
    "flex items-center justify-between w-full h-11 px-4 rounded-xl transition-all group cursor-pointer",
    active ? "bg-white/5 border-l-2 border-cyan-400" : "hover:bg-white/5 text-zinc-500 hover:text-white"
  )}>
    <div className="flex items-center gap-3">
        <Icon className={cn("w-4.5 h-4.5", active ? "text-cyan-400" : "group-hover:text-cyan-400")} />
        <span className={cn("text-xs font-bold uppercase tracking-widest tracking-tighter", active ? "text-white" : "text-inherit")}>{label}</span>
    </div>
    {count > 0 && (
        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">{count}</span>
    )}
  </button>
);

const KPICard = ({ label, value, icon: Icon, color = "text-white" }: any) => (
  <div className="p-4 rounded-2xl bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] flex flex-col gap-3 group hover:border-white/10 transition-all">
    <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition-colors">
            <Icon className="w-4 h-4" />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
    </div>
    <div>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
        <p className={cn("text-lg font-mono font-black mt-1", color)}>{value}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, cta }: any) => (
    <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-500">{title}</h3>
        <button className="text-[10px] font-black uppercase text-cyan-400 hover:underline cursor-pointer">{cta}</button>
    </div>
);

const MobileTab = ({ icon: Icon, active = false }: any) => (
    <button className={cn(
        "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-xl transition-all",
        active ? "text-cyan-400 bg-white/5" : "text-zinc-500"
    )}>
        <Icon className="w-6 h-6" />
    </button>
);

function Clock(props: any) {
    return <ShoppingCart {...props} />;
}
