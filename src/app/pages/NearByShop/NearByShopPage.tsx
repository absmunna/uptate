import React, { useEffect, useState } from 'react';
import { NearByFilterPanel } from './NearByFilterPanel';
import { NearByShopList } from './NearByShopList';
import { NearByMapPreview } from './NearByMapPreview';
import { ShopQuickPreviewModal } from './ShopQuickPreviewModal';
import { useNearbyShopStore } from './nearbyShopStore';
// locationStore removed — using fallback coords
import { MapPin, Search, Navigation, Compass, Utensils, Pill, Hotel, ShoppingBasket, Wrench, Coffee, X, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortalIconBar } from '@/components/home/PortalIconBar';
import { StoryBar } from '@/components/feed/StoryBar';
import { cn } from '@/lib/utils';
import { HomeMadeFoodUI } from './categories/HomeMadeFoodUI';
import { PharmacyUI } from './categories/PharmacyUI';
import { HotelUI } from './categories/HotelUI';
import { GroceryNearbyUI } from './categories/GroceryNearbyUI';
import { ServicesNearbyUI } from './categories/ServicesNearbyUI';
import { CafeNearbyUI } from './categories/CafeNearbyUI';

type SpecialCategory = 'all' | 'food' | 'pharmacy' | 'hotel' | 'grocery' | 'services' | 'cafe';

const SPECIAL_CATEGORIES = [
  { id: 'all', label: 'All Nearby', icon: Compass, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
  { id: 'food', label: 'Home Food', icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'shadow-orange-500/20' },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  { id: 'hotel', label: 'Hotels', icon: Hotel, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
  { id: 'grocery', label: 'Grocery', icon: ShoppingBasket, color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', glow: 'shadow-lime-500/20' },
  { id: 'services', label: 'Services', icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  { id: 'cafe', label: 'Cafes', icon: Coffee, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', glow: 'shadow-pink-500/20' },
];

const NearByShopPage: React.FC = () => {
  const { fetchShops, selectedShop, setSelectedShop } = useNearbyShopStore();
  const lat = 23.8103, lng = 90.4125, city = 'Dhaka';
  const [activeCategory, setActiveCategory] = useState<SpecialCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      fetchShops(lat, lng);
    } else {
      fetchShops(23.8103, 90.4125);
    }
  }, [lat, lng, fetchShops]);

  const activeCatData = SPECIAL_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-24 lg:pb-0 pt-16">
      {/* Story Bar */}
      <section className="pt-3 px-4 md:px-6">
        <StoryBar context="local" />
      </section>

      {/* Portal Icon Bar */}
      <section className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4 md:px-6 pb-1">
        <PortalIconBar context="local" />
      </section>

      {/* Header */}
      <div className="px-4 md:px-6 pt-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">Nearby Shops</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {city || 'Dhaka'} — Live Scan
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all",
              showFilters ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400" : "bg-white/[0.04] border-white/[0.06] text-zinc-500"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-11 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 flex items-center gap-2.5 focus-within:border-cyan-400/30 transition-all">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search shops near you..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
              </button>
            )}
          </div>
          <button className="w-11 h-11 bg-white/[0.04] border border-white/[0.06] rounded-2xl flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {SPECIAL_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(cat.id as SpecialCategory)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-[10px] font-black transition-all",
                  isActive
                    ? `${cat.bg} ${cat.border} ${cat.color} shadow-lg ${cat.glow}`
                    : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 md:px-6"
          >
            <div className="py-4 border border-white/[0.06] rounded-2xl bg-white/[0.02] px-4 mb-3">
              <NearByFilterPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content — switches based on active category */}
      <AnimatePresence mode="wait">
        {activeCategory === 'food' ? (
          <motion.div key="food" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <HomeMadeFoodUI searchQuery={searchQuery} />
          </motion.div>
        ) : activeCategory === 'pharmacy' ? (
          <motion.div key="pharmacy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <PharmacyUI searchQuery={searchQuery} />
          </motion.div>
        ) : activeCategory === 'hotel' ? (
          <motion.div key="hotel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <HotelUI searchQuery={searchQuery} />
          </motion.div>
        ) : activeCategory === 'grocery' ? (
          <motion.div key="grocery" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <GroceryNearbyUI searchQuery={searchQuery} />
          </motion.div>
        ) : activeCategory === 'services' ? (
          <motion.div key="services" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <ServicesNearbyUI searchQuery={searchQuery} />
          </motion.div>
        ) : activeCategory === 'cafe' ? (
          <motion.div key="cafe" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <CafeNearbyUI searchQuery={searchQuery} />
          </motion.div>
        ) : (
          <motion.div key="all" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {/* Default 3-column layout for All / Grocery / Services / Cafe */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6">
                {/* Left: Filter (desktop only) */}
                <aside className="hidden lg:block">
                  <div className="sticky top-32">
                    <NearByFilterPanel />
                  </div>
                </aside>

                {/* Center: Shop list */}
                <main>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {activeCategory === 'all' ? 'All Active Shops' : activeCatData.label} — Live Feed
                      </span>
                    </div>
                  </div>
                  <NearByShopList />
                </main>

                {/* Right: Map preview (desktop only) */}
                <aside className="hidden lg:block h-[calc(100vh-220px)]">
                  <div className="sticky top-32 h-full">
                    <NearByMapPreview />
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter FAB */}
      <div className="lg:hidden fixed bottom-[84px] left-4 right-4 z-[180]">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "w-full h-12 backdrop-blur-3xl border rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all",
            showFilters
              ? "bg-cyan-400/20 border-cyan-400/30"
              : "bg-black/80 border-cyan-400/20"
          )}
        >
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white uppercase tracking-widest">
            {showFilters ? 'Hide Filters' : 'Filters & Sort'}
          </span>
        </motion.button>
      </div>

      {/* Shop Quick Preview Modal */}
      <ShopQuickPreviewModal
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
      />
    </div>
  );
};

export default NearByShopPage;
