import React, { useEffect } from 'react';
import { NearByFilterPanel } from './NearByFilterPanel';
import { NearByShopList } from './NearByShopList';
import { NearByMapPreview } from './NearByMapPreview';
import { ShopQuickPreviewModal } from './ShopQuickPreviewModal';
import { useNearbyShopStore } from './nearbyShopStore';
import { useLocationStore } from '@/modules/location/locationStore';
import { MapPin, Search, Navigation, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { PortalIconBar } from '@/components/home/PortalIconBar';
import { StoryBar } from '@/components/feed/StoryBar';

const NearByShopPage: React.FC = () => {
  const { fetchShops, selectedShop, setSelectedShop } = useNearbyShopStore();
  const { lat, lng, city } = useLocationStore();

  useEffect(() => {
    // Initial fetch
    if (lat && lng) {
      fetchShops(lat, lng);
    } else {
      // Fallback location for Demo (Dhaka Center)
      fetchShops(23.8103, 90.4125);
    }
  }, [lat, lng, fetchShops]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-24 lg:pb-0 pt-16">
      {/* Upper Portal Chrome */}
      <section className="pt-3 md:pt-4">
        <StoryBar context="local" />
      </section>
      <section className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-white/5 pb-2">
        <PortalIconBar context="local" />
      </section>

      {/* Main Discover Layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-10 transition-all">
        
        {/* Dynamic Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
                        <Compass className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Locality Scan</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-cyan-400" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        Currently scanning node sector: <span className="text-cyan-400">{city || 'GLOBAL_CLUSTER_01'}</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group flex-1 lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="SEARCH LOCAL ENTITIES..." 
                        className="w-full h-14 pl-12 pr-6 bg-[var(--pm-surface)] border border-white/5 rounded-2xl text-[10px] font-black text-white placeholder:text-zinc-700 outline-none focus:border-cyan-400/30 transition-all uppercase tracking-widest"
                    />
                </div>
                <button className="h-14 w-14 bg-[var(--pm-surface)] border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* 3-Column Meta Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8">
            
            {/* Left Column: Filter Node */}
            <aside className="hidden lg:block">
                <div className="sticky top-24">
                    <NearByFilterPanel />
                </div>
            </aside>

            {/* Center Column: Listing Feed */}
            <main className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Signal: Active</span>
                    </div>
                    <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-rose-500/30">
                        Diagnostics View
                    </button>
                </div>
                <NearByShopList />
            </main>

            {/* Right Column: Geo Visualizer */}
            <aside className="hidden lg:block h-[calc(100vh-140px)]">
                <div className="sticky top-24 h-full">
                    <NearByMapPreview />
                </div>
            </aside>
        </div>
      </div>

      {/* Mobile Optimization: Bottom Overlay Filter */}
      <div className="lg:hidden fixed bottom-[84px] left-6 right-6 z-[180]">
          <motion.button 
             whileTap={{ scale: 0.95 }}
             className="w-full h-14 bg-black/80 backdrop-blur-3xl border border-cyan-400/20 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-cyan-400/20"
          >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest italic">Modify Local Spectrum</span>
          </motion.button>
      </div>

      {/* Global Modals */}
      <ShopQuickPreviewModal 
        shop={selectedShop} 
        onClose={() => setSelectedShop(null)} 
      />
    </div>
  );
};

export default NearByShopPage;
