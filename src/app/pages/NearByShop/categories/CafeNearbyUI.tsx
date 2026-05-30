import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee, Star, Clock, MapPin, Wifi, X, Plus, Minus,
  Heart, BadgeCheck, Leaf, ChevronRight, Users, Music,
  Flame, Search, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type CafeItem = { id: string; name: string; price: number; image: string; hot?: boolean; cold?: boolean; veg?: boolean; popular?: boolean };
type Cafe = {
  id: string; name: string; area: string; distance: string; rating: number; reviews: number;
  isOpen: boolean; hasWifi: boolean; hasPower: boolean; ambience: string; priceRange: string;
  banner: string; logo: string; tagline: string; items: CafeItem[];
};

const CAFES: Cafe[] = [
  {
    id: "c1", name: "Roastery Coffee Bar", area: "Gulshan-1", distance: "0.5 km",
    rating: 4.9, reviews: 678, isOpen: true, hasWifi: true, hasPower: true, ambience: "Modern", priceRange: "$$",
    banner: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&q=70",
    tagline: "Single origin · Pour over · Cold brew",
    items: [
      { id: "ci1", name: "Pour Over (Ethiopia)", price: 340, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&q=70", hot: true, popular: true },
      { id: "ci2", name: "Nitro Cold Brew", price: 380, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&q=70", cold: true },
      { id: "ci3", name: "Oat Milk Latte", price: 320, image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=120&q=70", hot: true, veg: true },
    ]
  },
  {
    id: "c2", name: "Momo & More Café", area: "Dhanmondi-8", distance: "1.3 km",
    rating: 4.7, reviews: 423, isOpen: true, hasWifi: true, hasPower: false, ambience: "Cozy", priceRange: "$",
    banner: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1551526814-a9265e592c9b?w=80&q=70",
    tagline: "Nepali momos · Chai · Good vibes",
    items: [
      { id: "ci4", name: "Masala Chai (Clay Pot)", price: 60, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&q=70", hot: true, popular: true, veg: true },
      { id: "ci5", name: "Chocolate Momo (10 pcs)", price: 280, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=120&q=70", popular: true },
      { id: "ci6", name: "Matcha Latte", price: 220, image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=120&q=70", cold: true, veg: true },
    ]
  },
  {
    id: "c3", name: "Café de Dhaka", area: "Banani-11", distance: "2.2 km",
    rating: 4.6, reviews: 289, isOpen: false, hasWifi: true, hasPower: true, ambience: "French Bistro", priceRange: "$$$",
    banner: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&q=70",
    tagline: "Artisanal pastries · French press · Jazz nights",
    items: [
      { id: "ci7", name: "Croissant + Cappuccino", price: 480, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=70", popular: true },
      { id: "ci8", name: "Crème Brûlée", price: 350, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=120&q=70", veg: true },
    ]
  },
  {
    id: "c4", name: "Bitto's Street Kafe", area: "Mirpur-1", distance: "0.9 km",
    rating: 4.8, reviews: 1120, isOpen: true, hasWifi: false, hasPower: false, ambience: "Casual Street", priceRange: "$",
    banner: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&q=70",
    tagline: "Budget-friendly · Fast · Always fresh",
    items: [
      { id: "ci9", name: "Cha + Bun", price: 40, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&q=70", hot: true, popular: true, veg: true },
      { id: "ci10", name: "Egg Sandwich", price: 70, image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=120&q=70" },
    ]
  },
];

type CartItem = { item: CafeItem; cafeId: string; qty: number };

export const CafeNearbyUI: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [likedCafes, setLikedCafes] = useState<Set<string>>(new Set());
  const [expandedCafe, setExpandedCafe] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setLikedCafes(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const addItem = (item: CafeItem, cafeId: string) => {
    const existingCafe = cart.length > 0 ? cart[0].cafeId : null;
    if (existingCafe && existingCafe !== cafeId) { toast.error("Clear cart to order from a different café"); return; }
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, cafeId, qty: 1 }];
    });
    toast.success(`${item.name} added!`, { duration: 1200 });
  };

  const removeItem = (itemId: string) => {
    setCart(prev => {
      const ex = prev.find(c => c.item.id === itemId);
      if (ex && ex.qty > 1) return prev.map(c => c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.item.id !== itemId);
    });
  };

  const getQty = (id: string) => cart.find(c => c.item.id === id)?.qty || 0;
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  const filteredCafes = CAFES.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-4 pb-32">
      {/* Vibe Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-pink-500/8 border border-pink-500/20 flex items-center gap-3">
        <Coffee className="w-5 h-5 text-pink-400 shrink-0" />
        <div>
          <p className="text-[11px] font-black text-pink-400">Cafes & Coffee Spots Near You</p>
          <p className="text-[10px] text-zinc-500">Work · Chill · Meet friends · ☕ Good vibes</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCafes.map((cafe, ci) => {
          const isExpanded = expandedCafe === cafe.id;
          const isLiked = likedCafes.has(cafe.id);
          return (
            <motion.div key={cafe.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.06 }}
              className={cn("rounded-3xl border overflow-hidden bg-white/[0.02]", cafe.isOpen ? "border-white/[0.06]" : "border-white/[0.03] opacity-60")}
            >
              {/* Banner */}
              <div className="relative h-32 overflow-hidden">
                <img src={cafe.banner} alt={cafe.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {!cafe.isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-[11px] font-black text-zinc-300 border border-white/10">Closed Now</span>
                  </div>
                )}
                <button onClick={() => toggleLike(cafe.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Heart className={cn("w-4 h-4", isLiked ? "text-red-500 fill-red-500" : "text-white")} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] font-black text-white">{cafe.name}</h3>
                      <p className="text-[10px] text-pink-300">{cafe.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-black text-white">{cafe.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 text-[9px] text-zinc-500 mb-3">
                  <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{cafe.area} · {cafe.distance}</span>
                  {cafe.hasWifi && <span className="flex items-center gap-0.5 text-blue-400"><Wifi className="w-2.5 h-2.5" />WiFi</span>}
                  <span className="text-pink-400 font-bold">{cafe.priceRange}</span>
                  <span className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400">{cafe.ambience}</span>
                </div>

                {/* Menu */}
                <div className="space-y-2">
                  {(isExpanded ? cafe.items : cafe.items.slice(0, 2)).map(item => {
                    const qty = getQty(item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <p className="text-[11px] font-black text-white">{item.name}</p>
                            {item.popular && <Flame className="w-3 h-3 text-red-400" />}
                            {item.veg && <Leaf className="w-3 h-3 text-emerald-400" />}
                            {item.cold && <span className="text-[8px] text-blue-400 font-bold border border-blue-500/30 px-1 rounded">COLD</span>}
                            {item.hot && <span className="text-[8px] text-red-400 font-bold border border-red-500/30 px-1 rounded">HOT</span>}
                          </div>
                          <p className="text-[12px] font-black text-pink-400">৳{item.price}</p>
                        </div>
                        {cafe.isOpen && (
                          qty > 0 ? (
                            <div className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/20 rounded-xl px-1.5 py-1">
                              <button onClick={() => removeItem(item.id)}><Minus className="w-3 h-3 text-pink-400" /></button>
                              <span className="text-[10px] font-black text-white w-3 text-center">{qty}</span>
                              <button onClick={() => addItem(item, cafe.id)}><Plus className="w-3 h-3 text-pink-400" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(item, cafe.id)} className="w-8 h-8 rounded-xl bg-pink-500 hover:bg-pink-400 flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(236,72,153,0.3)]">
                              <Plus className="w-3.5 h-3.5 text-white" />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {cafe.items.length > 2 && (
                  <button onClick={() => setExpandedCafe(isExpanded ? null : cafe.id)} className="w-full mt-2 flex items-center justify-center gap-1 text-[10px] font-black text-pink-400 py-1.5">
                    {isExpanded ? "Show Less" : `+${cafe.items.length - 2} More Items`}
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-[84px] left-4 right-4 z-[200]">
            <button onClick={() => setShowCart(true)} className="w-full h-13 bg-pink-500 rounded-2xl flex items-center justify-between px-5 py-3.5 shadow-[0_8px_32px_rgba(236,72,153,0.35)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center"><span className="text-[11px] font-black text-white">{totalItems}</span></div>
                <span className="text-[12px] font-black text-white uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-white">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white">Your Order ({totalItems})</h3>
                <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {cart.map(({ item, qty }) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-pink-400 font-bold">৳{item.price * qty}</p>
                    </div>
                    <span className="text-[11px] text-zinc-400">×{qty}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-3">
                <div className="flex justify-between"><span className="text-[13px] font-black text-white">Total</span><span className="text-xl font-black text-pink-400">৳{totalPrice}</span></div>
                <button onClick={() => { setShowCart(false); toast.success("Order placed! Ready in 10–15 min ☕"); setCart([]); }} className="w-full py-3.5 bg-pink-500 text-white font-black rounded-2xl text-[13px] uppercase">Place Order</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
