import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Star, ShieldCheck, Flame, ShoppingBag, Plus, Minus, Store } from 'lucide-react';
import { Product } from '../components/ProductCard';
import { ProductCard } from '../../../components/ui/ProductCard';
import { useCartStore, useNotificationStore } from '../../../store';
import { toast } from 'sonner';

interface B2CDealsProps {
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const B2CDeals: React.FC<B2CDealsProps> = ({ 
  products, 
  onBack,
  onSelectProduct
}) => {
  const [timeLeft, setTimeLeft] = useState({ hr: 3, min: 45, sec: 12 });
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Active deals listing (all products that are either marked as flash sale or have significant discount rates)
  const dealsProducts = products.filter(p => p.isFlashSale || (p.originalPrice && p.originalPrice > p.price));

  // Ticking countdown timer algorithm
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.sec > 0) {
          return { ...prev, sec: prev.sec - 1 };
        } else if (prev.min > 0) {
          return { ...prev, min: prev.min - 1, sec: 59 };
        } else if (prev.hr > 0) {
          return { hr: prev.hr - 1, min: 59, sec: 59 };
        } else {
          return { hr: 3, min: 59, sec: 59 }; // Refresh loop
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      portal: 'b2c',
      coinCashback: product.coinCashback
    });
    addNotification(`"${product.name}" কার্টে যোগ করা হয়েছে!`, 'success');
    toast.success("অফার পণ্যটি সফলভাবে কার্টে রাখা হয়েছে।");
  };

  return (
    <div className="w-full bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] pb-24 text-left">
      {/* Deals Header bar */}
      <div className="sticky top-16 z-50 bg-[var(--pm-bg)]/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-white/[0.08]">
        <button 
          onClick={onBack}
          className="p-2 -ml-1 rounded-full hover:bg-white/5 text-[var(--pm-text)] transition-colors active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text-secondary)]">হট ফ্ল্যাশ ডিলস</span>
      </div>

      {/* Hero Banner with Big Countdown timer clock */}
      <div className="px-4 py-5 bg-gradient-to-br from-red-600/10 via-orange-600/5 to-transparent border-b border-white/[0.06]">
        <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-3xl bg-red-500/10 border border-red-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-10 shrink-0">
            <Zap className="w-24 h-24 text-red-500 stroke-[3]" />
          </div>

          <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm select-none animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>সীমাবদ্ধ সময়ের সুবর্ণ সুযোগ</span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-white leading-tight">২৫% থেকে ৬০% পর্যন্ত সর্বোচ্চ ধামাকা ছাড়!</h1>

          {/* Clock Ticker Numbers */}
          <div className="flex items-center gap-2 text-white select-none">
            <span className="text-[10px] text-[var(--pm-text-secondary)] font-bold uppercase mr-1">শেষ হতে বাকি:</span>
            <div className="flex gap-1 font-mono font-black text-xs">
              <span className="bg-red-600 px-2 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.hr).padStart(2, '0')}
              </span>
              <span className="text-red-500 self-center font-bold">:</span>
              <span className="bg-red-600 px-2 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.min).padStart(2, '0')}
              </span>
              <span className="text-red-500 self-center font-bold">:</span>
              <span className="bg-red-600 px-2 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.sec).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Offer grids list with Claim Levels Progress Indicator slider bar on each item */}
      <div className="px-4 mt-6 space-y-5">
        <h3 className="text-[11px] font-black text-white uppercase tracking-wider select-none">লাইভ ডিল কালেকশনস</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {dealsProducts.map((prod, index) => {
            const hasQty = cartItems.find((itmKey: any) => itmKey.id === prod.id)?.quantity || 0;
            // Simulated claim percentages e.g., index-based progress variations
            const claimedPercent = (index * 13 + 37) % 100;
            const itemsLeft = Math.max(2, Math.round((100 - claimedPercent) * 0.15));

            return (
              <div 
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group p-3 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-white/[0.06] transition-all cursor-pointer flex gap-3.5 relative overflow-hidden"
              >
                {/* 1:1 Small Img box */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded uppercase">
                    -{prod.originalPrice ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : 35}%
                  </span>
                </div>

                {/* Information Block with live Progress indicator claimed and Quick Add to shopping basket */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white hover:text-[var(--pm-accent)] leading-snug truncate">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[9px] text-[var(--pm-text-secondary)] font-bold select-none">
                      <Store className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{prod.seller.name}</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-red-500">৳{prod.price.toLocaleString()}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-[var(--pm-text-secondary)] line-through">৳{prod.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Claims Stock Level slider progress bar indicators */}
                  <div className="space-y-1 mt-1.5 select-none">
                    <div className="flex items-center justify-between text-[8px] font-extrabold text-[var(--pm-text-secondary)] uppercase">
                      <span className="text-red-400 font-black">{claimedPercent}% দাবি করা হয়েছে</span>
                      <span>{itemsLeft} পিস বাকি</span>
                    </div>
                    {/* Linear fill slider */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-orange-500" style={{ width: `${claimedPercent}%` }} />
                    </div>
                  </div>

                  {/* Add to Basket button */}
                  <button
                    onClick={(e) => handleQuickAdd(prod, e)}
                    className="mt-2 w-full h-8 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold text-[9px] uppercase tracking-wide rounded-xl border border-red-500/20 flex items-center justify-center gap-1.5 transition-all outline-none"
                  >
                    <ShoppingBag className="w-3 h-3 shrink-0" />
                    কার্টে ঝালিয়ে নিন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
