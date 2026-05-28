import React, { useState } from 'react';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { MarketplacePortalBar } from '../components/MarketplacePortalBar';
import { MarketplaceProductCard } from '../components/MarketplaceProductCard';
import { MarketplaceStoreCard } from '../components/MarketplaceStoreCard';
import { MarketplacePortalType, MarketplaceItem, MarketplaceStore } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowRight, Zap, TrendingUp, Sparkles, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// MOCK DATA for demonstration - in real app this comes from API
const MOCK_PRODUCTS: MarketplaceItem[] = [
  { id: '1', title: 'Premium Cotton Polo Shirt - Bulk Offer', price: 450, rating: 4.8, reviewCount: 124, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', portal: 'b2b', storeName: 'RK Fabrics Ltd', storeId: 's1', isVerified: true },
  { id: '2', title: 'Home Made Organic Honey - 500g', price: 650, rating: 4.9, reviewCount: 89, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', portal: 'nearby', storeName: 'Village Organics', storeId: 's2' },
  { id: '3', title: 'Smart Watch Pro Series 7 - Black', price: 2450, rating: 4.7, reviewCount: 342, imageUrl: 'https://images.unsplash.com/photo-1546868889-4e0c68a27a8b?w=400', portal: 'retail', storeName: 'Tech Hub', storeId: 's3', isVerified: true },
  { id: '4', title: 'Luxury Travel Bag - Leather', price: 3800, rating: 4.6, reviewCount: 56, imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400', portal: 'retail', storeName: 'Elite Leather', storeId: 's4' },
  { id: '5', title: 'Smartphone Repair Service - Any Model', price: 999, rating: 4.5, reviewCount: 231, imageUrl: 'https://images.unsplash.com/photo-1512428559083-a40ea90132c1?w=400', portal: 'services', storeName: 'FixIt Now', storeId: 's5' },
  { id: '6', title: 'Traditional Nakshikatha - Hand Stitched', price: 5500, rating: 5.0, reviewCount: 12, imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400', portal: 'pk-shop', storeName: 'Heritage Crafts', storeId: 's6', isVerified: true },
];

const MOCK_STORES: MarketplaceStore[] = [
  { id: 's1', name: 'RK Fabrics Ltd', logo: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100', rating: 4.8, isVerified: true, type: 'factory', portal: 'b2b' },
  { id: 's2', name: 'Village Organics', logo: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?w=100', rating: 4.9, isVerified: false, type: 'retail', portal: 'nearby' },
  { id: 's3', name: 'Tech Hub', logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100', rating: 4.7, isVerified: true, type: 'brand', portal: 'retail' },
];

export const MarketplaceHome = () => {
  const [selectedPortal, setSelectedPortal] = useState<MarketplacePortalType>('all');
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (selectedPortal === 'all' || p.portal === selectedPortal) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-32">
      <MarketplaceHeader />
      <MarketplacePortalBar selected={selectedPortal} onChange={setSelectedPortal} />

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 space-y-10">
        
        {/* Mobile Global Search Input */}
        <div className="md:hidden">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search products, suppliers, stores..."
              className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400 transition-all text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section D: Trending Now (Horizontal) */}
        {selectedPortal === 'all' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">Trending Now</h2>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Hottest items across PaikarMart</p>
                </div>
              </div>
              <button className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1 group hover:text-white transition-colors">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
              {MOCK_PRODUCTS.slice(0, 5).map((product) => (
                <div key={product.id} className="min-w-[220px] w-[220px]">
                  <MarketplaceProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Store Aggregator Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">Featured Suppliers</h2>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Verified factory & retail outlets</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {MOCK_STORES.map((store) => (
              <MarketplaceStoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* Section E: Recommended For You (Grid) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">
                  {selectedPortal === 'all' ? 'Recommended For You' : `${selectedPortal.charAt(0).toUpperCase() + selectedPortal.slice(1)} Feed`}
                </h2>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Curated from across portals</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
               <button className="px-4 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs font-bold hover:border-cyan-400/50 transition-all">Filter</button>
               <button className="px-4 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs font-bold hover:border-cyan-400/50 transition-all">Sort</button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedPortal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <MarketplaceProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-[var(--pm-surface)] rounded-[40px] border border-dashed border-[var(--pm-border)]">
                  <Zap className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest">No listings found for this category</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Infinite Scroll Indicator */}
          <div className="mt-12 flex justify-center">
             <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading more treasures...</span>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
};

