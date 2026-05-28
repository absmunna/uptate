import React from 'react';
import { NearByShopCard } from './NearByShopCard';
import { useNearbyShopStore } from './nearbyShopStore';
import { GlobalSkeletonSystem } from '../../AppShell/GlobalSkeletonSystem';
import { ShoppingBag, MapPinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NearByShopList: React.FC = () => {
  const { shops, isLoading, error, setSelectedShop } = useNearbyShopStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <GlobalSkeletonSystem key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center rounded-[32px] bg-rose-500/5 border border-rose-500/10 backdrop-blur-xl">
        <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
          <MapPinOff className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2 italic">Signal Loss</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{error}</p>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="p-12 text-center rounded-[32px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 mx-auto mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Silent Horizon</h3>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">No shops matching your frequency in this radius.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {shops.map((shop, i) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
          >
            <NearByShopCard 
              shop={shop} 
              onClick={(shop) => setSelectedShop(shop)} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
