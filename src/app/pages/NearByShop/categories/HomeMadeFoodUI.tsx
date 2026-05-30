import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils, Star, Clock, MapPin, ShoppingCart, Plus, Minus,
  X, ChevronRight, Flame, Leaf, CheckCircle2, BadgeCheck,
  Heart, Filter, Sparkles, Phone, MessageCircle, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Dish = {
  id: string;
  name: string;
  nameLocal: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  prepTime: string;
  isVeg: boolean;
  isSpicy?: boolean;
  tags: string[];
  chefName: string;
  image: string;
  available: boolean;
  popular?: boolean;
};

type Chef = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  minOrder: number;
  avatar: string;
  speciality: string;
  verified: boolean;
  dishes: Dish[];
  isOpen: boolean;
};

const CHEFS: Chef[] = [
  {
    id: 'c1',
    name: 'Amma\'s Kitchen',
    location: 'Dhanmondi, Dhaka',
    rating: 4.9,
    reviews: 412,
    deliveryTime: '25–35 min',
    minOrder: 150,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&q=80',
    speciality: 'Traditional Bangladeshi',
    verified: true,
    isOpen: true,
    dishes: [
      {
        id: 'd1', name: 'Beef Bhuna Khichuri', nameLocal: 'গরুর ভুনা খিচুড়ি',
        price: 120, originalPrice: 150, rating: 4.9, reviews: 201,
        prepTime: '20 min', isVeg: false, isSpicy: true, popular: true,
        tags: ['Traditional', 'Comfort Food'],
        chefName: "Amma's Kitchen",
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80',
        available: true
      },
      {
        id: 'd2', name: 'Chicken Rezala', nameLocal: 'চিকেন রেজালা',
        price: 180, rating: 4.8, reviews: 156,
        prepTime: '25 min', isVeg: false, isSpicy: false, popular: true,
        tags: ['Mughal', 'Rich Gravy'],
        chefName: "Amma's Kitchen",
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&q=80',
        available: true
      },
      {
        id: 'd3', name: 'Lal Saag Bhorta', nameLocal: 'লাল শাক ভর্তা',
        price: 60, rating: 4.7, reviews: 89,
        prepTime: '15 min', isVeg: true,
        tags: ['Healthy', 'Veg'],
        chefName: "Amma's Kitchen",
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80',
        available: true
      },
    ]
  },
  {
    id: 'c2',
    name: 'Dadi\'s Home Meals',
    location: 'Mirpur, Dhaka',
    rating: 4.8,
    reviews: 287,
    deliveryTime: '30–45 min',
    minOrder: 200,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    speciality: 'Noakhali Cuisine',
    verified: true,
    isOpen: true,
    dishes: [
      {
        id: 'd4', name: 'Hilsa Curry', nameLocal: 'ইলিশ মাছের ঝোল',
        price: 280, rating: 5.0, reviews: 312,
        prepTime: '30 min', isVeg: false, popular: true,
        tags: ['Hilsa', 'Special'],
        chefName: "Dadi's Home Meals",
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80',
        available: true
      },
      {
        id: 'd5', name: 'Shutki Bhorta', nameLocal: 'শুটকি ভর্তা',
        price: 80, rating: 4.6, reviews: 134,
        prepTime: '10 min', isVeg: false, isSpicy: true,
        tags: ['Traditional', 'Dry Fish'],
        chefName: "Dadi's Home Meals",
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80',
        available: true
      },
    ]
  },
  {
    id: 'c3',
    name: 'Maa\'s Tiffin Box',
    location: 'Uttara, Dhaka',
    rating: 4.7,
    reviews: 189,
    deliveryTime: '20–30 min',
    minOrder: 120,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    speciality: 'Tiffin & Lunch Packs',
    verified: false,
    isOpen: false,
    dishes: [
      {
        id: 'd6', name: 'Office Tiffin Set', nameLocal: 'অফিস টিফিন',
        price: 120, rating: 4.7, reviews: 156,
        prepTime: '15 min', isVeg: false,
        tags: ['Value', 'Office Meal', 'Set'],
        chefName: "Maa's Tiffin Box",
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80',
        available: false
      },
    ]
  }
];

type CartItem = { dish: Dish; qty: number };

export function HomeMadeFoodUI({ searchQuery }: { searchQuery: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [expandedChef, setExpandedChef] = useState<string | null>('c1');
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState<'all' | 'veg' | 'popular'>('all');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.dish.price * i.qty, 0);

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      if (existing) return prev.map(i => i.dish.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { dish, qty: 1 }];
    });
    toast.success(`${dish.name} added to cart`, { duration: 1500 });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dishId);
      if (existing && existing.qty > 1) return prev.map(i => i.dish.id === dishId ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.dish.id !== dishId);
    });
  };

  const getQty = (dishId: string) => cart.find(i => i.dish.id === dishId)?.qty || 0;

  const filteredChefs = CHEFS.filter(chef => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return chef.name.toLowerCase().includes(q) ||
        chef.dishes.some(d => d.name.toLowerCase().includes(q));
    }
    return true;
  }).map(chef => ({
    ...chef,
    dishes: chef.dishes.filter(d => {
      if (filter === 'veg') return d.isVeg;
      if (filter === 'popular') return d.popular;
      return true;
    })
  }));

  return (
    <div className="px-4 md:px-6 pb-4">
      {/* Sub-header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <Utensils className="w-4.5 h-4.5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white">Home Made Food</h2>
          <p className="text-[10px] text-zinc-500">Fresh & authentic meals from local cooks</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['all', 'veg', 'popular'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                filter === f
                  ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                  : "bg-white/[0.03] border-white/[0.06] text-zinc-500"
              )}
            >
              {f === 'all' ? 'All' : f === 'veg' ? '🌿 Veg' : '🔥 Popular'}
            </button>
          ))}
        </div>
      </div>

      {/* Chef sections */}
      <div className="space-y-4">
        {filteredChefs.map(chef => (
          <motion.div
            key={chef.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-3xl border overflow-hidden transition-all",
              !chef.isOpen ? "opacity-60" : "border-white/[0.08] bg-white/[0.02]",
              chef.isOpen && "border-orange-500/15"
            )}
          >
            {/* Chef Header */}
            <button
              onClick={() => setExpandedChef(expandedChef === chef.id ? null : chef.id)}
              className="w-full flex items-center gap-3 p-4"
            >
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                  <img src={chef.avatar} alt={chef.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className={cn(
                  "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--pm-bg)]",
                  chef.isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                )} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-black text-white">{chef.name}</span>
                  {chef.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <p className="text-[10px] text-orange-400/80 font-bold">{chef.speciality}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-white">{chef.rating}</span>
                    <span className="text-[9px] text-zinc-600">({chef.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-400">{chef.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-400 truncate max-w-[100px]">{chef.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-full",
                  chef.isOpen ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700/30 text-zinc-500"
                )}>
                  {chef.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
                <span className="text-[9px] text-zinc-500">Min ৳{chef.minOrder}</span>
                <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", expandedChef === chef.id && "rotate-90")} />
              </div>
            </button>

            {/* Dishes */}
            <AnimatePresence>
              {expandedChef === chef.id && chef.dishes.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/[0.05]"
                >
                  <div className="p-3 space-y-3">
                    {chef.dishes.map(dish => {
                      const qty = getQty(dish.id);
                      return (
                        <div key={dish.id} className="flex gap-3 p-3 rounded-2xl bg-black/20 border border-white/[0.04]">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 relative">
                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
                            {dish.popular && (
                              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                <Flame className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-1 mb-0.5">
                              {dish.isVeg && <Leaf className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />}
                              {dish.isSpicy && <Flame className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />}
                              <div>
                                <p className="text-[12px] font-black text-white leading-tight">{dish.name}</p>
                                <p className="text-[9px] text-zinc-500 font-bold">{dish.nameLocal}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <span className="text-[9px] text-zinc-400">{dish.rating} ({dish.reviews})</span>
                              <span className="text-[9px] text-zinc-600">• {dish.prepTime}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {dish.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-[8px] font-bold text-orange-400">{tag}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-base font-black text-orange-400">৳{dish.price}</span>
                                {dish.originalPrice && (
                                  <span className="text-[10px] text-zinc-600 line-through ml-1">৳{dish.originalPrice}</span>
                                )}
                              </div>
                              {chef.isOpen && dish.available ? (
                                <div className="flex items-center gap-1.5">
                                  {qty > 0 ? (
                                    <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-xl px-2 py-1">
                                      <button onClick={() => removeFromCart(dish.id)}>
                                        <Minus className="w-3 h-3 text-orange-400" />
                                      </button>
                                      <span className="text-[11px] font-black text-white w-4 text-center">{qty}</span>
                                      <button onClick={() => addToCart(dish)}>
                                        <Plus className="w-3 h-3 text-orange-400" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(dish)}
                                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-black flex items-center gap-1 transition-all"
                                    >
                                      <Plus className="w-3 h-3" /> Add
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[9px] text-zinc-600 font-bold">{chef.isOpen ? 'Unavailable' : 'Shop Closed'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Cart Sticky Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[84px] left-4 right-4 z-[200]"
          >
            <button
              onClick={() => setShowCart(true)}
              className="w-full h-14 bg-orange-500 hover:bg-orange-400 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_32px_rgba(249,115,22,0.4)] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">{totalItems}</span>
                </div>
                <span className="text-[12px] font-black text-white uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-white">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={e => e.target === e.currentTarget && setShowCart(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white">Your Cart</h3>
                <button onClick={() => setShowCart(false)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {cart.map(({ dish, qty }) => (
                  <div key={dish.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white truncate">{dish.name}</p>
                      <p className="text-[11px] text-orange-400 font-bold">৳{dish.price * qty}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-1">
                      <button onClick={() => removeFromCart(dish.id)}><Minus className="w-3 h-3 text-zinc-400" /></button>
                      <span className="text-[11px] font-black text-white w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(dish)}><Plus className="w-3 h-3 text-zinc-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-black text-orange-400">৳{totalPrice}</span>
                </div>
                <button
                  onClick={() => { setShowCart(false); toast.success('Order placed! Chef will confirm shortly.'); setCart([]); }}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-black rounded-2xl text-[13px] uppercase tracking-wide transition-all shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
