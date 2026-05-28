import React from 'react';
import { Heart, ShoppingCart, Zap, Share2, Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { MarketplaceItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: MarketplaceItem;
}

export const MarketplaceProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative bg-[var(--pm-surface)] rounded-[24px] border border-[var(--pm-border)] overflow-hidden transition-all hover:border-cyan-400/30"
    >
      {/* Portal Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
          {product.portal}
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="aspect-square relative overflow-hidden bg-zinc-900 cursor-pointer"
        onClick={() => navigate(`/marketplace/product/${product.id}`)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider truncate">
            {product.storeName}
          </span>
          <div className="flex items-center gap-0.5 text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black text-white">{product.rating}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white line-clamp-2 min-h-[40px] leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Current Price</span>
            <span className="text-lg font-black text-white">৳{product.price}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-3 border-t border-[var(--pm-border)] bg-black/20">
        <div className="flex items-center gap-3">
          <button className="text-zinc-500 hover:text-rose-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{product.reviewCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-cyan-400 transition-all"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button 
            className="h-8 px-3 rounded-lg bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1"
            title="Quick Buy"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
