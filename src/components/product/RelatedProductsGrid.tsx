import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
}

interface RelatedProductsGridProps {
  products?: ProductItem[];
}

export const RelatedProductsGrid: React.FC<RelatedProductsGridProps> = ({ products }) => {
  const finalProducts: ProductItem[] = products || [
    {
      id: "p2",
      title: "Handspun Cotton Tangail Saree",
      price: 4500,
      originalPrice: 6000,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
    },
    {
      id: "p3",
      title: "Premium Rajshahi Silk Dupatta",
      price: 2200,
      originalPrice: 3000,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
    },
    {
      id: "p4",
      title: "Soft Cotton Semi-Saree",
      price: 3200,
      originalPrice: 4000,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
    },
    {
      id: "p5",
      title: "Handcrafted Zari Silk Border Saree",
      price: 9500,
      originalPrice: 13500,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      rating: 5.0,
    }
  ];

  const handleAddToCart = (title: string) => {
    toast.success(`Added ${title} to cart!`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {finalProducts.map((p) => (
        <Card key={p.id} className="group overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[var(--pm-accent)] transition-all rounded-2xl flex flex-col h-full">
          {/* 1:1 Image frame */}
          <div className="relative aspect-square w-full bg-[var(--pm-bg)]/80 overflow-hidden shrink-0">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details Row */}
          <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
            <div className="space-y-1">
              <h5 className="text-xs md:text-sm font-medium text-[var(--pm-text)] line-clamp-2 leading-tight group-hover:text-[var(--pm-accent)] transition-colors">
                {p.title}
              </h5>
              {p.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-[var(--pm-text-secondary)] font-bold">{p.rating}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-white">৳{p.price.toLocaleString()}</span>
                {p.originalPrice && (
                  <span className="text-[11px] text-[var(--pm-text-secondary)] line-through">
                    ৳{p.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <Button
                onClick={() => handleAddToCart(p.title)}
                className="w-full h-9 rounded-xl text-[11px] font-semibold bg-[var(--pm-glass)] hover:bg-[var(--pm-accent)] hover:text-white border border-[var(--pm-border)] text-[var(--pm-text)] transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
