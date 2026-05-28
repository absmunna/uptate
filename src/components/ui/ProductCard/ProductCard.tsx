import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Store } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';

export interface Product {
    id: string | number;
    name: string;
    price: string | number;
    originalPrice?: string | number;
    rating?: string | number;
    reviews?: string | number;
    image?: string;
    vendorName?: string; // Added vendor context
    isWholesale?: boolean; // Added wholesale badge
  }

export const ProductCard: React.FC<{ 
  product: Product, 
  className?: string, 
  onClick?: () => void,
  action?: React.ReactNode
}> = ({ product, className = "", onClick, action }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className={`rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden flex flex-col justify-between relative shrink-0 ${className} group ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ y: -8, borderColor: 'var(--pm-accent)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative">
        {product.originalPrice && (
          <span className="absolute top-2 left-2 z-10 bg-[var(--pm-accent)] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
            {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% off
          </span>
        )}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10 p-2 bg-[var(--pm-bg)]/80 backdrop-blur-md rounded-full text-[var(--pm-text-secondary)] hover:text-[var(--pm-accent)] transition-colors border border-[var(--pm-border)]"
        >
          <Heart className="w-4 h-4" />
        </button>
        <div 
          className="bg-[var(--pm-surface-hover)] flex items-center justify-center overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
        >
            <img 
                src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
            />
        </div>
        
        <div className="p-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--pm-text-secondary)]">
              <Store className="w-3 h-3" />
              <span className="truncate">{product.vendorName || "Paikar Store"}</span>
          </div>

          <h3 className="text-xs font-black text-[var(--pm-text)] leading-snug line-clamp-2 min-h-[32px] group-hover:text-[var(--pm-accent)] transition-colors">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] text-[var(--pm-text-secondary)] font-bold">{product.rating || "4.5"}</span>
              </div>
              {product.isWholesale && (
                <span className="text-[9px] font-black bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] px-1.5 py-0.5 rounded-md">Wholesale</span>
              )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-black text-[var(--pm-text)] tracking-tight">৳{product.price}</p>
            {product.originalPrice && (
              <p className="text-[10px] text-[var(--pm-text-secondary)] line-through font-bold">৳{product.originalPrice}</p>
            )}
          </div>
        </div>
      </div>
      {action && (
        <div 
          className="p-3 pt-0 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {action}
        </div>
      )}
    </motion.div>
  );
};
