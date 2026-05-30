import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Utensils, Search, Star, Clock, MapPin, X, Plus, Minus,
  Flame, Heart, ShoppingCart, Check, ChevronRight,
  Sparkles, Tag, Bike, Percent, Filter, Leaf
} from "lucide-react";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FoodCat = { id: string; label: string; emoji: string };
type FoodItem = { id: string; name: string; nameLocal?: string; price: number; image: string; category: string; veg?: boolean; spicy?: boolean; popular?: boolean };
type Restaurant = {
  id: string; name: string; cuisine: string; rating: number; reviews: number;
  deliveryTime: string; deliveryFee: number; minOrder: number;
  distance: string; isOpen: boolean; banner: string; logo: string;
  promo?: string; items: FoodItem[]; category: string;
};

const FOOD_CATS: FoodCat[] = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "bangladeshi", label: "Deshi", emoji: "🍛" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "chinese", label: "Chinese", emoji: "🥢" },
  { id: "biryani", label: "Biryani", emoji: "🍚" },
  { id: "chicken", label: "Chicken", emoji: "🍗" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: "r1", name: "Fakruddin's Biriyani", cuisine: "Bangladeshi, Mughlai",
    rating: 4.9, reviews: 2340, deliveryTime: "35–45 min", deliveryFee: 30, minOrder: 200,
    distance: "1.2 km", isOpen: true, category: "bangladeshi",
    banner: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=80&q=80",
    promo: "20% OFF first order",
    items: [
      { id: "f1a", name: "Kacchi Biriyani", nameLocal: "কাচ্চি বিরিয়ানি", price: 420, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=150&q=80", category: "biryani", spicy: true, popular: true },
      { id: "f1b", name: "Tehari (Special)", nameLocal: "তেহারি", price: 280, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=150&q=80", category: "biryani" },
      { id: "f1c", name: "Borhani (250ml)", price: 50, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=150&q=80", category: "beverages" },
    ],
  },
  {
    id: "r2", name: "Burger Shack BD", cuisine: "Burgers, American",
    rating: 4.7, reviews: 876, deliveryTime: "20–30 min", deliveryFee: 40, minOrder: 250,
    distance: "0.8 km", isOpen: true, category: "burgers",
    banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=80&q=80",
    items: [
      { id: "f2a", name: "Smash Burger (Double)", price: 320, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&q=80", category: "burgers", popular: true },
      { id: "f2b", name: "Crispy Chicken Burger", price: 260, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=150&q=80", category: "chicken" },
      { id: "f2c", name: "Loaded Fries", price: 150, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&q=80", category: "snacks" },
    ],
  },
  {
    id: "r3", name: "Pizzalicious Dhaka", cuisine: "Pizza, Italian",
    rating: 4.6, reviews: 554, deliveryTime: "30–45 min", deliveryFee: 60, minOrder: 350,
    distance: "2.1 km", isOpen: true, category: "pizza",
    banner: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&q=80",
    promo: "Buy 1 Get 1 Free",
    items: [
      { id: "f3a", name: "Chicken Supreme Pizza (12\")", price: 750, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80", category: "pizza", popular: true },
      { id: "f3b", name: "Margherita Pizza (10\")", price: 550, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=150&q=80", category: "pizza", veg: true },
    ],
  },
  {
    id: "r4", name: "Golden Dragon Chinese", cuisine: "Chinese, Thai",
    rating: 4.5, reviews: 321, deliveryTime: "25–40 min", deliveryFee: 50, minOrder: 300,
    distance: "3.0 km", isOpen: false, category: "chinese",
    banner: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=80&q=80",
    items: [
      { id: "f4a", name: "Beef Fried Rice", price: 280, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=150&q=80", category: "chinese" },
      { id: "f4b", name: "Chili Chicken (Dry)", price: 320, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=150&q=80", category: "chicken", spicy: true },
    ],
  },
  {
    id: "r5", name: "Ambrosia Desserts", cuisine: "Desserts, Bakes",
    rating: 4.8, reviews: 678, deliveryTime: "25–35 min", deliveryFee: 35, minOrder: 200,
    distance: "1.5 km", isOpen: true, category: "desserts",
    banner: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80",
    logo: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&q=80",
    items: [
      { id: "f5a", name: "Molten Choco Lava", price: 190, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=150&q=80", category: "desserts", popular: true },
      { id: "f5b", name: "Mango Cheesecake Slice", price: 160, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=150&q=80", category: "desserts" },
      { id: "f5c", name: "Tiramisu Cup", price: 140, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&q=80", category: "desserts" },
    ],
  },
];

type CartItem = { item: FoodItem; restaurantId: string; qty: number };

const RestaurantCard = ({
  restaurant, onAddItem, cart
}: {
  restaurant: Restaurant;
  onAddItem: (item: FoodItem, restaurantId: string) => void;
  cart: CartItem[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const getQty = (itemId: string) => cart.find(c => c.item.id === itemId)?.qty || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-3xl border overflow-hidden bg-white/[0.02] transition-all", restaurant.isOpen ? "border-white/[0.06]" : "border-white/[0.03] opacity-60")}
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        <img src={restaurant.banner} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {restaurant.promo && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-xl bg-orange-500 text-[9px] font-black text-white flex items-center gap-1">
            <Percent className="w-2.5 h-2.5" />{restaurant.promo}
          </div>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-sm text-[11px] font-black text-zinc-300 uppercase tracking-widest border border-white/10">Closed Now</span>
          </div>
        )}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
        >
          <Heart className={cn("w-4 h-4", liked ? "text-red-500 fill-red-500" : "text-white")} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          <div>
            <h3 className="text-[14px] font-black text-white">{restaurant.name}</h3>
            <p className="text-[10px] text-zinc-300">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-black text-white">{restaurant.rating}</span>
          </div>
        </div>
      </div>

      {/* Meta Row */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <Clock className="w-3 h-3 text-orange-400" />{restaurant.deliveryTime}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <Bike className="w-3 h-3 text-orange-400" />৳{restaurant.deliveryFee} delivery
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <MapPin className="w-3 h-3 text-zinc-500" />{restaurant.distance}
        </div>
        <span className="ml-auto text-[9px] text-zinc-600">Min ৳{restaurant.minOrder}</span>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-3 space-y-3">
        {(expanded ? restaurant.items : restaurant.items.slice(0, 2)).map(item => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <p className="text-[11px] font-black text-white">{item.name}</p>
                  {item.veg && <Leaf className="w-3 h-3 text-emerald-400" />}
                  {item.spicy && <Flame className="w-3 h-3 text-red-400" />}
                  {item.popular && <Sparkles className="w-3 h-3 text-amber-400" />}
                </div>
                {item.nameLocal && <p className="text-[9px] text-zinc-600 mb-1">{item.nameLocal}</p>}
                <p className="text-[12px] font-black text-orange-400">৳{item.price}</p>
              </div>
              {restaurant.isOpen && (
                qty > 0 ? (
                  <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl px-2 py-1">
                    <button onClick={() => {/* remove */}}><Minus className="w-3 h-3 text-orange-400" /></button>
                    <span className="text-[11px] font-black text-white w-4 text-center">{qty}</span>
                    <button onClick={() => onAddItem(item, restaurant.id)}><Plus className="w-3 h-3 text-orange-400" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddItem(item, restaurant.id)}
                    className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-400 flex items-center justify-center shrink-0 transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                )
              )}
            </div>
          );
        })}
        {restaurant.items.length > 2 && (
          <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-orange-400 hover:text-orange-300 transition-colors">
            {expanded ? "Show Less" : `+${restaurant.items.length - 2} More Items`}
            <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-90")} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export function FoodHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addItem = (item: FoodItem, restaurantId: string) => {
    const existingRestaurant = cart.length > 0 ? cart[0].restaurantId : null;
    if (existingRestaurant && existingRestaurant !== restaurantId) {
      toast.error("Clear your cart first to order from a different restaurant");
      return;
    }
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id);
      if (ex) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, restaurantId, qty: 1 }];
    });
    toast.success(`${item.name} added`, { duration: 1300 });
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  const filtered = RESTAURANTS.filter(r => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const matchSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="food" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="food" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-orange-500/20 p-5 bg-gradient-to-br from-orange-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-3xl shrink-0">🍽️</div>
              <div>
                <h1 className="text-lg font-black text-white">Food Delivery</h1>
                <p className="text-[11px] text-zinc-400 mt-0.5">Restaurants near you — fast & fresh</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2 mt-4">
            {[
              { emoji: "⚡", label: "30 min", sublabel: "Avg Delivery" },
              { emoji: "🏪", label: "80+", sublabel: "Restaurants" },
              { emoji: "🎁", label: "Free", sublabel: "First Delivery" },
            ].map(({ emoji, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-xl">{emoji}</span>
                <p className="text-[11px] font-black text-white">{label}</p>
                <p className="text-[8px] text-zinc-500">{sublabel}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-orange-500/40 transition-all mb-4">
          <Search className="w-4 h-4 text-orange-400" />
          <input type="text" placeholder="Search restaurants or food..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold" />
          {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-zinc-500" /></button>}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {FOOD_CATS.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                  isActive ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                )}
              >
                {cat.emoji} {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Restaurant List */}
        <div className="mt-4 space-y-4">
          {filtered.map(r => (
            <RestaurantCard key={r.id} restaurant={r} onAddItem={addItem} cart={cart} />
          ))}
        </div>
      </div>

      {/* Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-[84px] left-4 right-4 z-[200]">
            <button onClick={() => setShowCart(true)} className="w-full h-14 bg-orange-500 hover:bg-orange-400 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_32px_rgba(249,115,22,0.4)] transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center"><span className="text-[11px] font-black text-white">{totalItems}</span></div>
                <span className="text-[12px] font-black text-white uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-white">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowCart(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white">Order Summary</h3>
                <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {cart.map(({ item, qty }) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-orange-400 font-bold">৳{item.price * qty}</p>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-bold">×{qty}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Subtotal</span><span className="text-white font-black">৳{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Delivery</span><span className="text-emerald-400 font-black">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-white">Total</span>
                  <span className="text-xl font-black text-orange-400">৳{totalPrice}</span>
                </div>
                <button onClick={() => { setShowCart(false); toast.success("Order placed! Arriving in 30 min 🛵"); setCart([]); }} className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-black rounded-2xl text-[13px] uppercase tracking-wide transition-all">
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
