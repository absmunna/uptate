import React from 'react';
import { Shop } from './nearbyShopService';
import { 
  X, Star, MapPin, Clock, MessageCircle, 
  ExternalLink, Package, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface ShopQuickPreviewModalProps {
  shop: Shop | null;
  onClose: () => void;
}

export const ShopQuickPreviewModal: React.FC<ShopQuickPreviewModalProps> = ({ shop, onClose }) => {
  if (!shop) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className="relative max-w-2xl w-full bg-[#0c0f17] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
        >
            <button 
               onClick={onClose}
               className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-rose-500 transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Header / Cover */}
            <div className="h-56 relative overflow-hidden">
                <img src={shop.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-black/30" />
                
                <div className="absolute bottom-6 left-8 right-8 flex items-end gap-6">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-[#0c0f17] bg-zinc-900 shadow-2xl relative translate-y-8">
                        <img src={shop.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 pt-12 pb-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{shop.name}</h2>
                            {shop.isVerified && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                             <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-black text-white">{shop.rating}</span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">({shop.reviewCount} Ratings)</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-zinc-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-tight">{shop.distance} KM FROM YOU</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-emerald-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Operational: {shop.isOpen ? 'Active' : 'Offline'}</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link 
                            to={`/shops/${shop.id}`}
                            className="h-14 px-8 rounded-2xl bg-cyan-400 text-black font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Launch Portal
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                        <Package className="w-4 h-4 text-zinc-600 mb-2" />
                        <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Catalog Size</h4>
                        <p className="text-sm font-black text-white tracking-tighter italic">{shop.activeProductsCount}+ Items</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                        <Clock className="w-4 h-4 text-zinc-600 mb-2" />
                        <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Logistics Pace</h4>
                        <p className="text-sm font-black text-white tracking-tighter italic">{shop.deliveryTime}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                        <MessageCircle className="w-4 h-4 text-zinc-600 mb-2" />
                        <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Responsiveness</h4>
                        <p className="text-sm font-black text-emerald-400 tracking-tighter italic">98% Match</p>
                    </div>
                </div>

                {/* Local Micro-Inventory Preview */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trending Locally</h3>
                        <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 group">
                            Full Analysis
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[120px] p-2 rounded-2xl bg-zinc-900 border border-white/5">
                                <div className="aspect-square rounded-xl bg-zinc-800 mb-2 overflow-hidden">
                                     <img src={`https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop&q=80&sig=${i}`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="h-2 w-12 bg-white/5 rounded-full mb-1" />
                                <div className="h-2 w-8 bg-white/10 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
