import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderSummaryCard } from './OrderSummaryCard';
import { DeliveryTimeline } from './DeliveryTimeline';
import { DeliveryAgentCard } from './DeliveryAgentCard';
import { DeliveryMapPanel } from './DeliveryMapPanel';
import { useDeliveryStore } from './deliveryStore';
import { 
  ArrowLeft, RefreshCw, Smartphone, 
  HelpCircle, MoreVertical, Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlobalSkeletonSystem } from '../../AppShell/GlobalSkeletonSystem';

const DeliveryTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentPackage, isLoading, error, fetchTracking } = useDeliveryStore();

  useEffect(() => {
    if (orderId) {
      fetchTracking(orderId);
    }
  }, [orderId, fetchTracking]);

  if (isLoading) {
    return (
      <div className="max-w-[1300px] mx-auto p-6 lg:py-12 grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8">
        <GlobalSkeletonSystem className="h-[500px]" />
        <div className="space-y-8">
           <GlobalSkeletonSystem className="h-20" />
           <GlobalSkeletonSystem className="h-[400px]" />
        </div>
        <GlobalSkeletonSystem className="h-[500px]" />
      </div>
    );
  }

  if (error || !currentPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900 border border-white/5">
           <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <RefreshCw className="w-8 h-8" />
           </div>
           <h1 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Tracking Signal Lost</h1>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight leading-relaxed mb-8">
              Regional synchronization failed or the order ID is invalid in the logistics registry.
           </p>
           <button 
             onClick={() => navigate('/orders')}
             className="w-full h-14 bg-white/5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all"
           >
              Return to Archives
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-32 lg:pb-12 overflow-x-hidden">
      {/* Header Chrome */}
      <div className="sticky top-0 z-[100] bg-[var(--pm-nav-bg)] backdrop-blur-2xl border-b border-white/5 px-6 h-20 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-zinc-900 border border-white/5 hover:text-cyan-400 transition-all"
            >
               <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
               <h1 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Transit Operations</h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest font-mono">Live Sync: ACTIVE</span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button className="hidden sm:flex h-11 px-6 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest items-center gap-2 opacity-60">
               <Zap className="w-4 h-4" />
               Logistics Protocol v4
            </button>
            <button className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
               <MoreVertical className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-10 items-start">
          
          {/* Order Snapshot */}
          <aside className="sticky lg:top-32 space-y-8">
             <OrderSummaryCard pkg={currentPackage} />
             <div className="lg:hidden">
                <DeliveryAgentCard agent={currentPackage.agent} />
             </div>
          </aside>

          {/* Core Timeline Feed */}
          <main className="space-y-12">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Operational Timeline</h2>
                    <div className="h-[1px] w-12 bg-white/10" />
                </div>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black text-cyan-400 uppercase">
                    UTC Synchronization 100%
                </div>
             </div>
             
             <div className="pl-4 lg:pl-0">
                <DeliveryTimeline timeline={currentPackage.timeline} />
             </div>
          </main>

          {/* Agent & Geo Intelligence */}
          <aside className="sticky lg:top-32 flex flex-col gap-8">
             <div className="hidden lg:block">
                <DeliveryAgentCard agent={currentPackage.agent} />
             </div>
             <DeliveryMapPanel 
               eta={currentPackage.eta} 
               distance={currentPackage.distanceRemaining} 
             />
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Comm Hub */}
      <div className="lg:hidden fixed bottom-[84px] left-6 right-6 z-[200]">
          <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="flex gap-3 p-2 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl"
          >
              <button className="flex-1 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center gap-3 text-black font-black uppercase tracking-widest text-xs">
                 <Smartphone className="w-4 h-4" />
                 Secure Contact
              </button>
              <button className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500">
                 <HelpCircle className="w-5 h-5" />
              </button>
          </motion.div>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
