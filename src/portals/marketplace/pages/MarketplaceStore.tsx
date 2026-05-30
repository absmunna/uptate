import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { MarketplaceProductCard } from '../components/MarketplaceProductCard';
import { 
  ShieldCheck, Star, Users, MessageSquare, 
  Info, LayoutGrid, Newspaper, Heart, Share2, MoreHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoryBar } from '@/components/feed/StoryBar';

type StoreTab = 'products' | 'posts' | 'reviews' | 'about';

export const MarketplaceStorePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StoreTab>('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-20 pt-16">
      <div className="sticky top-16 z-[110]">
        <MarketplaceHeader />
      </div>

      {/* ━━━ HERO ZONE: Stories ━━━ */}
      <section className="pt-3 md:pt-4 overflow-hidden bg-[var(--pm-bg)] border-b border-[var(--pm-border)] pb-2">
        <StoryBar context="retail" />
      </section>

      {/* Store Hero Section */}
      <div className="relative">
        {/* Banner */}
        <div className="h-[240px] md:h-[320px] w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" 
            className="w-full h-full object-cover"
            alt="Store Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Global Store Info Card (Floats over banner) */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 -mt-20 relative z-10">
          <div className="bg-[var(--pm-surface)]/90 backdrop-blur-2xl p-6 md:p-8 rounded-[40px] border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 {/* Logo */}
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-zinc-900 border-4 border-[var(--pm-surface)] shadow-2xl overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200" className="w-full h-full object-cover" alt="Logo" />
                 </div>

                 <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                       <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Elite Tech Store</h1>
                       <ShieldCheck className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
                       <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[9px] font-black uppercase text-cyan-400 tracking-widest self-center">Official Brand</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                       <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-black text-white">4.9</span>
                          <span className="text-xs font-bold">(12.4k Reviews)</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-black text-white">85.6k</span>
                          <span className="text-xs font-bold">Followers</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => setIsFollowing(!isFollowing)}
                   className={`flex-1 md:flex-none h-12 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-white/5 border border-white/10 text-white' : 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'}`}
                 >
                   {isFollowing ? 'Following' : 'Follow Store'}
                 </button>
                 <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-10 mt-10">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-10 border-b border-[var(--pm-border)] overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'Products', icon: LayoutGrid },
            { id: 'posts', label: 'Market Feed', icon: Newspaper },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'about', label: 'About Store', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StoreTab)}
                className={`
                  flex items-center gap-2 px-6 py-4 transition-all relative whitespace-nowrap
                  ${isActive ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="store-tab-active" 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-t-full shadow-[0_-2px_10px_rgba(34,211,238,0.5)]" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-20"
          >
             {activeTab === 'products' && (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {/* Mock products */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-[var(--pm-surface)] rounded-[24px] aspect-[3/4] border border-[var(--pm-border)]" />
                  ))}
               </div>
             )}

             {activeTab === 'about' && (
               <div className="max-w-3xl space-y-6">
                  <div className="p-8 rounded-[32px] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                     <h3 className="text-xl font-bold mb-4 italic uppercase tracking-tighter">Business Summary</h3>
                     <p className="text-zinc-400 leading-relaxed">
                        Established in 2018, Elite Tech Store has been a pioneer in bringing the latest global electronics to the Bangladesh market. 
                        We specialize in premium smartphones, high-performance computing, and smart home solutions. 
                        As a verified partner, we ensure 100% authentic products with official warranties.
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 rounded-[24px] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Joined</span>
                        <span className="text-lg font-bold text-white">May 20, 2018</span>
                     </div>
                     <div className="p-6 rounded-[24px] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Response Rate</span>
                        <span className="text-lg font-bold text-white">98% (Avg 10m)</span>
                     </div>
                  </div>
               </div>
             )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
