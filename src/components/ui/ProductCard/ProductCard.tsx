import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

export interface Product {
    id: number;
    name: string;
    price: string;
    rating: string;
    reviews: string;
    image?: string;
  }

export const ProductCard: React.FC<{ product: Product, className?: string }> = ({ product, className = "" }) => (
  <motion.div 
    className={`rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden flex flex-col relative shrink-0 ${className} group`}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <button className="absolute top-2 right-2 z-10 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
      <Heart className="w-3.5 h-3.5" />
    </button>
    <div className="h-[160px] bg-[var(--pm-surface-hover)] flex items-center justify-center overflow-hidden">
        <img 
            src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
        />
    </div>
    <div className="p-3 flex flex-col gap-1">
      <h3 className="text-sm font-medium text-[var(--pm-text)] truncate">{product.name}</h3>
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="text-[10px] text-[var(--pm-text-muted)]">{product.rating} ({product.reviews})</span>
      </div>
      <p className="text-sm font-bold text-[var(--pm-accent)] mt-1">{product.price}</p>
    </div>
  </motion.div>
);
