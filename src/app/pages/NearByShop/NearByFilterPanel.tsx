import React from 'react';
import { useNearbyShopStore } from './nearbyShopStore';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, MapPin, Tag, Star, Shield, FilterX } from 'lucide-react';
import { motion } from 'motion/react';

export const NearByFilterPanel: React.FC = () => {
  const { filters, setFilter } = useNearbyShopStore();

  const categories = ['All', 'Wholesale', 'Food', 'Electronics', 'Furniture', 'Services'];
  const radiusOptions = [
    { label: '1 KM', value: 1 },
    { label: '3 KM', value: 3 },
    { label: '5 KM', value: 5 },
    { label: '10 KM', value: 10 },
    { label: '25 KM', value: 25 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Search Header */}
      <div className="flex items-center gap-3 px-2">
        <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Discovery Filters</h2>
      </div>

      {/* Distance Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Scanning Radius</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {radiusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter('radius', opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                filters.radius === opt.value 
                  ? "bg-cyan-400 border-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "bg-white/5 border-white/5 text-zinc-600 hover:border-white/10 hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Industry Cluster</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat === 'All' ? '' : cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                (cat === 'All' && !filters.category) || (cat === filters.category)
                  ? "bg-white/10 border-cyan-400/50 text-cyan-400"
                  : "bg-white/5 border-white/5 text-zinc-600 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rating & Switches */}
      <div className="space-y-5">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Min. Trust Rating</span>
          </div>
          <span className="text-[10px] font-black text-white">{filters.minRating}+</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.5" 
          value={filters.minRating}
          onChange={(e) => setFilter('minRating', parseFloat(e.target.value))}
          className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
        />

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setFilter('openNow', !filters.openNow)}
            className={cn(
              "flex items-center justify-between p-3 rounded-2xl border transition-all group",
              filters.openNow ? "bg-cyan-400/5 border-cyan-400/20" : "bg-white/5 border-white/5"
            )}
          >
            <span className={cn("text-[9px] font-black uppercase tracking-widest", filters.openNow ? "text-cyan-400" : "text-zinc-600")}>Operational Now</span>
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-colors duration-300",
              filters.openNow ? "bg-cyan-400" : "bg-zinc-800"
            )}>
              <div className={cn(
                "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all duration-300",
                filters.openNow ? "right-0.5" : "left-0.5"
              )} />
            </div>
          </button>

          <button 
            onClick={() => setFilter('verifiedOnly', !filters.verifiedOnly)}
            className={cn(
              "flex items-center justify-between p-3 rounded-2xl border transition-all group",
              filters.verifiedOnly ? "bg-cyan-400/5 border-cyan-400/20" : "bg-white/5 border-white/5"
            )}
          >
            <div className="flex items-center gap-2">
              <Shield className={cn("w-3 h-3", filters.verifiedOnly ? "text-cyan-400" : "text-zinc-600")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest", filters.verifiedOnly ? "text-cyan-400" : "text-zinc-600")}>Verified Nodes</span>
            </div>
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-colors duration-300",
              filters.verifiedOnly ? "bg-cyan-400" : "bg-zinc-800"
            )}>
              <div className={cn(
                "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all duration-300",
                filters.verifiedOnly ? "right-0.5" : "left-0.5"
              )} />
            </div>
          </button>
        </div>
      </div>

      {/* Sorting */}
      <div className="pt-4 border-t border-white/5">
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-[9px] font-black text-white uppercase tracking-widest outline-none focus:border-cyan-400/30"
        >
          <option value="distance">Priority: Distance</option>
          <option value="rating">Priority: Trust Rating</option>
          <option value="popularity">Priority: Engagement</option>
        </select>
      </div>

      <button className="flex items-center justify-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-widest hover:text-rose-500 transition-colors">
        <FilterX className="w-3 h-3" />
        Reset Diagnostics
      </button>
    </div>
  );
};
