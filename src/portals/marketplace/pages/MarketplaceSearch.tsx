import React, { useState } from 'react';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { MarketplaceProductCard } from '../components/MarketplaceProductCard';
import { MarketplaceStoreCard } from '../components/MarketplaceStoreCard';
import { Search, Filter, ArrowLeft, LayoutGrid, Store, Factory, Settings, Tag } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

type SearchTab = 'products' | 'stores' | 'factories' | 'services' | 'brands';

export const MarketplaceSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('products');
  const navigate = useNavigate();

  const tabs: { id: SearchTab; label: string; icon: any }[] = [
    { id: 'products', label: 'Products', icon: LayoutGrid },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'factories', label: 'Factories', icon: Factory },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'brands', label: 'Brands', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-20 pt-16">
      {/* Sticky Search Header */}
      <div className="sticky top-16 z-[120] bg-[var(--pm-nav-bg)]/80 backdrop-blur-xl border-b border-[var(--pm-border)]">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400 transition-all text-white"
            />
          </div>

          <button className="w-12 h-12 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center text-zinc-400 hover:text-cyan-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Tabs */}
        <div className="max-w-[1440px] mx-auto overflow-x-auto no-scrollbar flex items-center gap-2 px-4 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap border
                  ${isActive 
                    ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                    : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-8">
             <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter">
                   Results for <span className="text-cyan-400">"{query || 'Everything'}"</span>
                </h1>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">Found 48 relevant listings in {activeTab}</p>
             </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={activeTab === 'products' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6" : "flex flex-wrap gap-4"}
          >
             {/* Dynamic results based on tab would go here */}
             {activeTab === 'products' ? (
                Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-[var(--pm-surface)] rounded-[24px] aspect-[3/4] border border-[var(--pm-border)]" />
                ))
             ) : (
                Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full md:w-[380px] h-32 animate-pulse bg-[var(--pm-surface)] rounded-[24px] border border-[var(--pm-border)]" />
                ))
             )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
