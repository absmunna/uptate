import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { MarketplaceStore } from '../types';
import { useNavigate } from 'react-router-dom';

interface StoreCardProps {
  store: MarketplaceStore;
}

export const MarketplaceStoreCard = ({ store }: StoreCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-[var(--pm-surface)]/80 backdrop-blur-md rounded-[24px] border border-[var(--pm-border)] p-4 flex gap-4 items-center group cursor-pointer hover:border-cyan-400/40 min-w-[320px] lg:min-w-[380px]"
      onClick={() => navigate(`/marketplace/store/${store.id}`)}
    >
      {/* Store Logo */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-zinc-900 border border-[var(--pm-border)] overflow-hidden flex-shrink-0">
        <img 
          src={store.logo} 
          alt={store.name} 
          className="w-full h-full object-cover p-1"
        />
      </div>

      {/* Store Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="font-black text-white text-lg truncate group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter">
            {store.name}
          </h4>
          {store.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-black text-white">{store.rating}</span>
          </div>
          <div className="h-3 w-[1px] bg-[var(--pm-border)]" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded-full">
            {store.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter">Powered by</span>
           <span className="text-[9px] font-black uppercase text-cyan-400 tracking-tighter italic">{store.portal}</span>
        </div>
      </div>

      {/* Action */}
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-all">
        <ArrowRight className="w-5 h-5" />
      </div>
    </motion.div>
  );
};
