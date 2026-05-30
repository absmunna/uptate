import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBasket, Star, Clock, MapPin, Plus, Minus, X,
  ChevronRight, Leaf, BadgeCheck, Truck, Heart, Search,
  Zap, Package, Filter, Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type GroceryItem = { id: string; name: string; nameLocal?: string; price: number; unit: string; image: string; inStock: boolean; isOrganic?: boolean };
type LocalStore = {
  id: string; name: string; area: string; distance: string; rating: number; reviews: number;
  deliveryTime: string; deliveryFee: number; minOrder: number; isOpen: boolean;
  verified: boolean; banner: string; items: GroceryItem[];
};

const STORES: LocalStore[] = [
  {
    id: "ls1", name: "Rahman Fresh Mart", area: "Mirpur-10", distance: "0.4 km",
    rating: 4.8, reviews: 312, deliveryTime: "20–30 min", deliveryFee: 20, minOrder: 150,
    isOpen: true, verified: true,
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
    items: [
      { id: "g1", name: "Tomatoes", nameLocal: "টমেটো", price: 60, unit: "kg", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=120&q=70", inStock: true, isOrganic: true },
      { id: "g2", name: "Deshi Egg", nameLocal: "দেশি ডিম", price: 14, unit: "pcs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=120&q=70", inStock: true },
      { id: "g3", name: "Potato", nameLocal: "আলু", price: 40, unit: "kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&q=70", inStock: true },
      { id: "g4", name: "Onion", nameLocal: "পেঁয়াজ", price: 80, unit: "kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=120&q=70", inStock: true },
    ]
  },
  {
    id: "ls2", name: "Karim Brothers Bazar", area: "Gulshan-2", distance: "1.1 km",
    rating: 4.6, reviews: 187, deliveryTime: "25–35 min", deliveryFee: 30, minOrder: 200,
    isOpen: true, verified: false,
    banner: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80",
    items: [
      { id: "g5", name: "Hilsa Fish", nameLocal: "ইলিশ মাছ", price: 900, unit: "kg", image: "https://images.unsplash.com/photo-1567168540030-b3bb09fd4003?w=120&q=70", inStock: true },
      { id: "g6", name: "Basmati Rice", nameLocal: "বাসমতি চাল", price: 180, unit: "kg", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=120&q=70", inStock: true },
      { id: "g7", name: "Mustard Oil", nameLocal: "সরিষার তেল", price: 280, unit: "L", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&q=70", inStock: false },
    ]
  },
  {
    id: "ls3", name: "Desh Bazar Express", area: "Dhanmondi-27", distance: "2.0 km",
    rating: 4.9, reviews: 543, deliveryTime: "15–25 min", deliveryFee: 0, minOrder: 300,
    isOpen: false, verified: true,
    banner: "https://images.unsplash.com/photo-1556742521-9713bf272865?w=400&q=80",
    items: [
      { id: "g8", name: "Mango (Himsagar)", nameLocal: "হিমসাগর আম", price: 240, unit: "kg", image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=120&q=70", inStock: true },
      { id: "g9", name: "Chicken Breast", nameLocal: "মুরগির বুক", price: 320, unit: "kg", image: "https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=120&q=70", inStock: true },
    ]
  }
];

type CartItem = { item: GroceryItem; storeId: string; qty: number };

export const GroceryNearbyUI: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  const addItem = (item: GroceryItem, storeId: string) => {
    if (!item.inStock) return;
    const existingStore = cart.length > 0 ? cart[0].storeId : null;
    if (existingStore && existingStore !== storeId) {
      toast.error("Clear cart to order from a different store");
      return;
    }
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, storeId, qty: 1 }];
    });
    toast.success(`${item.name} added`, { duration: 1200 });
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

  const filteredStores = STORES.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-4 pb-32">
      {/* Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-lime-500/8 border border-lime-500/20 flex items-center gap-3">
        <ShoppingBasket className="w-5 h-5 text-lime-400 shrink-0" />
        <div>
          <p className="text-[11px] font-black text-lime-400">Local Grocery Stores Near You</p>
          <p className="text-[10px] text-zinc-500">Fresh stock updated daily · Delivery in 15–35 min</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStores.map((store, si) => {
          const isExpanded = expandedStore === store.id;
          return (
            <motion.div key={store.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.06 }}
              className={cn("rounded-3xl border overflow-hidden bg-white/[0.02]", store.isOpen ? "border-white/[0.06]" : "border-white/[0.03] opacity-60")}
            >
              <div className="relative h-28 overflow-hidden">
                <img src={store.banner} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {!store.isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-[11px] font-black text-zinc-300 border border-white/10">Closed</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[13px] font-black text-white">{store.name}</h3>
                      {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[9px] text-zinc-400"><MapPin className="w-2.5 h-2.5" />{store.area} · {store.distance}</span>
                      <span className="flex items-center gap-0.5 text-[9px] text-zinc-400"><Clock className="w-2.5 h-2.5" />{store.deliveryTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] font-black text-white">{store.rating}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center gap-3 mb-3 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-lime-400" />
                    {store.deliveryFee === 0 ? <span className="text-lime-400 font-bold">Free</span> : `৳${store.deliveryFee}`} delivery
                  </span>
                  <span>Min ৳{store.minOrder}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(isExpanded ? store.items : store.items.slice(0, 2)).map(item => {
                    const qty = getQty(item.id);
                    return (
                      <div key={item.id} className={cn("flex items-center gap-2 p-2 rounded-xl border", item.inStock ? "border-white/[0.05] bg-white/[0.02]" : "border-white/[0.02] opacity-50")}>
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-white truncate">{item.name}</p>
                          {item.nameLocal && <p className="text-[8px] text-zinc-600 truncate">{item.nameLocal}</p>}
                          <p className="text-[10px] font-black text-lime-400">৳{item.price}/{item.unit}</p>
                        </div>
                        {item.inStock && store.isOpen && (
                          qty > 0 ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <button onClick={() => addItem(item, store.id)} className="w-5 h-5 rounded-lg bg-lime-500/15 border border-lime-500/30 flex items-center justify-center"><Plus className="w-3 h-3 text-lime-400" /></button>
                              <span className="text-[9px] font-black text-white">{qty}</span>
                              <button onClick={() => removeItem(item.id)} className="w-5 h-5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"><Minus className="w-3 h-3 text-zinc-400" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(item, store.id)} className="w-6 h-6 rounded-xl bg-lime-500 flex items-center justify-center shrink-0">
                              <Plus className="w-3 h-3 text-black" />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {store.items.length > 2 && (
                  <button onClick={() => setExpandedStore(isExpanded ? null : store.id)} className="w-full mt-2 flex items-center justify-center gap-1 text-[10px] font-black text-lime-400 hover:text-lime-300 py-1.5">
                    {isExpanded ? 'Show Less' : `+${store.items.length - 2} More Items`}
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
            <button onClick={() => setShowCart(true)} className="w-full h-13 bg-lime-500 rounded-2xl flex items-center justify-between px-5 py-3.5 shadow-[0_8px_32px_rgba(132,204,22,0.35)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center"><span className="text-[11px] font-black text-white">{totalItems}</span></div>
                <span className="text-[12px] font-black text-black uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-black">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white">Cart ({totalItems})</h3>
                <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {cart.map(({ item, qty }) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10"><img src={item.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-lime-400 font-bold">৳{item.price * qty}</p>
                    </div>
                    <span className="text-[11px] text-zinc-400">×{qty}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-3">
                <div className="flex justify-between"><span className="text-[13px] font-black text-white">Total</span><span className="text-xl font-black text-lime-400">৳{totalPrice}</span></div>
                <button onClick={() => { setShowCart(false); toast.success("Order placed! Delivering in 30 min."); setCart([]); }} className="w-full py-3.5 bg-lime-500 text-black font-black rounded-2xl text-[13px] uppercase">Place Order</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
