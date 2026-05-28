import React from 'react';
import { useNearbyShopStore } from './nearbyShopStore';
import { Map as MapIcon, Navigation, Target, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const NearByMapPreview: React.FC = () => {
  const { shops, selectedShop, setSelectedShop } = useNearbyShopStore();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Map Header */}
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Geo-Intelligence</h2>
         </div>
         <div className="px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-[8px] font-black text-rose-500 uppercase">
            LIVE PREVIEW
         </div>
      </div>

      {/* Mock Map Container */}
      <div className="relative aspect-square sm:aspect-auto sm:flex-1 rounded-[40px] bg-[#0c0f17] border border-white/5 overflow-hidden shadow-inner group">
        {/* Abstract Map Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Selected Shop Context Info (Overlay) */}
        {selectedShop && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute top-4 left-4 right-4 p-4 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 z-10 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <img src={selectedShop.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black text-white uppercase truncate">{selectedShop.name}</h4>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest truncate">{selectedShop.address}</p>
                </div>
                <button 
                    onClick={() => setSelectedShop(null)}
                    className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white"
                >
                    <Navigation className="w-3 h-3" />
                </button>
            </motion.div>
        )}

        {/* Mock Markers */}
        <div className="absolute inset-0">
            {shops.map((shop) => {
                const isSelected = selectedShop?.id === shop.id;
                // Randomized positions for demo map
                const top = `${(Math.sin(parseInt(shop.id) * 45) + 1) * 40 + 5}%`;
                const left = `${(Math.cos(parseInt(shop.id) * 33) + 1) * 40 + 5}%`;

                return (
                    <motion.button
                        key={shop.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2, zIndex: 50 }}
                        onClick={() => setSelectedShop(shop)}
                        className="absolute cursor-pointer"
                        style={{ top, left }}
                    >
                        <div className={cn(
                            "relative group",
                            isSelected ? "z-20" : "z-10"
                        )}>
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                                isSelected ? "bg-cyan-400 scale-125 shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "bg-zinc-800 border border-white/10 hover:border-cyan-400"
                            )}>
                                {isSelected ? (
                                    <MapIcon className="w-3 h-3 text-black" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                )}
                            </div>
                            
                            {/* Marker Hover Label */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-black/90 border border-white/5 px-2 py-1 rounded-lg">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">{shop.name}</span>
                            </div>
                        </div>
                    </motion.button>
                );
            })}

            {/* Central User Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="relative">
                    <div className="w-8 h-8 bg-cyan-400/20 rounded-full animate-ping absolute inset-0" />
                    <div className="w-8 h-8 bg-cyan-400/10 rounded-full scale-150 border border-cyan-400/20" />
                    <div className="w-3 h-3 bg-cyan-400 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400/50" />
                </div>
            </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-xl">
                <Target className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-xl">
                <MapIcon className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="p-5 rounded-[32px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
         <div className="flex items-center gap-2 mb-4">
            <Info className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Insights</span>
         </div>
         <div className="space-y-4">
            <div className="flex justify-between items-end">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Active Nodes</p>
                <p className="text-sm font-black text-white tracking-tighter italic">{shops.length}</p>
            </div>
            <div className="flex justify-between items-end">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Avg. Response Time</p>
                <p className="text-sm font-black text-cyan-400 tracking-tighter italic">28ms</p>
            </div>
            <div className="pt-3 border-t border-white/5">
                <p className="text-[8px] text-zinc-600 font-bold uppercase leading-relaxed tracking-tight italic">
                    Coordinates finalized. Showing verified logistics endpoints within defined radius.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};
