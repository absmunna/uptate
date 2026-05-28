import React from 'react';
import { Shop } from './nearbyShopService';
import { Star, MapPin, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface NearByShopCardProps {
  shop: Shop;
  onClick: (shop: Shop) => void;
}

export const NearByShopCard: React.FC<NearByShopCardProps> = React.memo(({ shop, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(shop)}
      className="p-4 bg-[#0c0f17]/60 backdrop-blur-xl border border-white/5 rounded-3xl hover:border-cyan-400/30 transition-all cursor-pointer group shadow-2xl shadow-black/20"
    >
      <div className="flex gap-4">
        {/* Avatar/Icon Bundle */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 shadow-xl">
            <img 
              src={shop.avatar} 
              alt={shop.name} 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
          {shop.isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0f17] animate-pulse" />
          )}
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-black text-white uppercase tracking-tight truncate group-hover:text-cyan-400 transition-colors">
              {shop.name}
            </h3>
            {shop.isVerified && (
              <ShieldCheck className="w-3.4 h-3.4 text-cyan-400 shrink-0" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-white">{shop.rating}</span>
              <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">({shop.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{shop.distance} KM</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{shop.deliveryTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                {shop.category}
              </div>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                {shop.activeProductsCount} PRODUCTS
              </span>
            </div>
            <button className="p-2 rounded-xl bg-white/5 text-zinc-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
