import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBasket, Search, Plus, Minus, Star, Clock, Leaf,
  Sparkles, Tag, X, ChevronRight, ShoppingCart, Truck,
  Filter, Flame, Heart, Package, BadgeCheck, Percent
} from "lucide-react";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type GroceryCategory = { id: string; label: string; emoji: string; count: number };
type GroceryProduct = {
  id: string; name: string; nameLocal?: string; category: string;
  price: number; originalPrice?: number; unit: string;
  rating: number; reviews: number; inStock: boolean;
  isOrganic?: boolean; isFeatured?: boolean; discount?: number;
  image: string; supermarket: string;
};

const CATEGORIES: GroceryCategory[] = [
  { id: "all", label: "All Items", emoji: "🛒", count: 320 },
  { id: "vegetables", label: "Vegetables", emoji: "🥦", count: 84 },
  { id: "fruits", label: "Fruits", emoji: "🍎", count: 62 },
  { id: "dairy", label: "Dairy & Eggs", emoji: "🥛", count: 38 },
  { id: "meat", label: "Meat & Fish", emoji: "🐟", count: 45 },
  { id: "grains", label: "Rice & Grains", emoji: "🌾", count: 26 },
  { id: "spices", label: "Spices", emoji: "🌶️", count: 40 },
  { id: "snacks", label: "Snacks", emoji: "🍿", count: 53 },
  { id: "beverages", label: "Drinks", emoji: "🧃", count: 32 },
];

const PRODUCTS: GroceryProduct[] = [
  { id: "g1", name: "Fresh Hilsa Fish", nameLocal: "ইলিশ মাছ", category: "meat", price: 1200, unit: "kg", rating: 4.9, reviews: 412, inStock: true, isFeatured: true, image: "https://images.unsplash.com/photo-1567168540030-b3bb09fd4003?w=300&q=80", supermarket: "Shwapno" },
  { id: "g2", name: "Country Egg (Deshi)", nameLocal: "দেশি ডিম", category: "dairy", price: 14, unit: "piece", rating: 4.8, reviews: 289, inStock: true, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80", supermarket: "Meena Bazar" },
  { id: "g3", name: "Basmati Rice", nameLocal: "বাসমতি চাল", category: "grains", price: 180, originalPrice: 220, unit: "kg", rating: 4.7, reviews: 156, inStock: true, discount: 18, image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=300&q=80", supermarket: "Shwapno" },
  { id: "g4", name: "Organic Red Tomato", category: "vegetables", price: 80, unit: "kg", rating: 4.6, reviews: 98, inStock: true, isOrganic: true, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80", supermarket: "Unimart" },
  { id: "g5", name: "Fresh Mango (Himsagar)", nameLocal: "হিমসাগর আম", category: "fruits", price: 240, unit: "kg", rating: 5.0, reviews: 521, inStock: true, isFeatured: true, image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=300&q=80", supermarket: "Lavender" },
  { id: "g6", name: "Turmeric Powder", nameLocal: "হলুদ গুঁড়া", category: "spices", price: 120, unit: "250g", rating: 4.5, reviews: 67, inStock: true, image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&q=80", supermarket: "Meena Bazar" },
  { id: "g7", name: "Full Cream Milk", category: "dairy", price: 95, unit: "L", rating: 4.8, reviews: 234, inStock: true, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80", supermarket: "Shwapno" },
  { id: "g8", name: "Chicken (Broiler)", nameLocal: "ব্রয়লার মুরগি", category: "meat", price: 220, unit: "kg", rating: 4.4, reviews: 145, inStock: true, image: "https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=300&q=80", supermarket: "Agora" },
  { id: "g9", name: "Green Chili", nameLocal: "কাঁচা মরিচ", category: "vegetables", price: 40, unit: "250g", rating: 4.3, reviews: 89, inStock: false, image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=300&q=80", supermarket: "Unimart" },
  { id: "g10", name: "Pringles Chips", category: "snacks", price: 380, originalPrice: 450, unit: "can", rating: 4.6, reviews: 312, inStock: true, discount: 16, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80", supermarket: "Shwapno" },
  { id: "g11", name: "Mineral Water 1.5L", category: "beverages", price: 30, unit: "bottle", rating: 4.5, reviews: 567, inStock: true, image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=300&q=80", supermarket: "Meena Bazar" },
  { id: "g12", name: "Mustard Oil", nameLocal: "সরিষার তেল", category: "spices", price: 280, unit: "L", rating: 4.7, reviews: 201, inStock: true, isFeatured: true, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80", supermarket: "Lavender" },
];

type CartItem = { product: GroceryProduct; qty: number };

export function GroceryHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating">("popular");

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (product: GroceryProduct) => {
    if (!product.inStock) return;
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} added`, { duration: 1500 });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === productId);
      if (ex && ex.qty > 1) return prev.map(i => i.product.id === productId ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const getQty = (id: string) => cart.find(i => i.product.id === id)?.qty || 0;

  let filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      {/* Story + Icon Bar */}
      <section className="pt-3 px-4"><StoryBar context="grocery" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="grocery" />
      </div>

      {/* Hero Banner */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-lime-500/20 p-5 bg-gradient-to-br from-lime-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(132,204,22,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center text-3xl shrink-0">🛒</div>
            <div>
              <h1 className="text-lg font-black text-white">Grocery & Essentials</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">Fresh, local & delivered fast</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2 mt-4">
            {[
              { emoji: "🚚", label: "Free Delivery", sublabel: "on ৳500+" },
              { emoji: "⚡", label: "Express 30min", sublabel: "Available" },
              { emoji: "🌿", label: "100% Fresh", sublabel: "Guaranteed" },
            ].map(({ emoji, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-xl">{emoji}</span>
                <p className="text-[9px] font-black text-white leading-tight">{label}</p>
                <p className="text-[8px] text-zinc-500">{sublabel}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-lime-500/40 transition-all">
            <Search className="w-4 h-4 text-lime-400" />
            <input type="text" placeholder="Search groceries..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold" />
            {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-zinc-500" /></button>}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[var(--pm-surface)]/50 border border-white/[0.06] rounded-2xl px-3 text-[10px] font-black text-zinc-400 outline-none [color-scheme:dark]"
          >
            <option value="popular">Popular</option>
            <option value="price-low">Price ↑</option>
            <option value="price-high">Price ↓</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Categories */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-[10px] font-black transition-all",
                  isActive
                    ? "bg-lime-500/15 border-lime-500/30 text-lime-400 shadow-md"
                    : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                )}
              >
                <span>{cat.emoji}</span> {cat.label}
                <span className={cn("text-[8px] px-1 rounded-full", isActive ? "bg-lime-500/20" : "bg-white/5")}>{cat.count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filtered.map((product, i) => {
            const qty = getQty(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "rounded-2xl border overflow-hidden bg-white/[0.02] transition-all",
                  product.inStock ? "border-white/[0.06] hover:border-lime-500/20" : "border-white/[0.03] opacity-50"
                )}
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {product.discount && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-lg bg-red-500 text-[8px] font-black text-white flex items-center gap-0.5">
                      <Percent className="w-2 h-2" />{product.discount}% OFF
                    </div>
                  )}
                  {product.isOrganic && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Leaf className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-black text-white leading-tight mb-0.5 line-clamp-1">{product.name}</p>
                  {product.nameLocal && <p className="text-[9px] text-zinc-500 mb-1">{product.nameLocal}</p>}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-[9px] text-zinc-400">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-lime-400">৳{product.price}</span>
                      <span className="text-[9px] text-zinc-600 ml-0.5">/{product.unit}</span>
                      {product.originalPrice && (
                        <p className="text-[9px] text-zinc-600 line-through">৳{product.originalPrice}</p>
                      )}
                    </div>
                    {product.inStock && (
                      qty > 0 ? (
                        <div className="flex items-center gap-1.5 bg-lime-500/10 border border-lime-500/20 rounded-xl px-1.5 py-1">
                          <button onClick={() => removeFromCart(product.id)}><Minus className="w-3 h-3 text-lime-400" /></button>
                          <span className="text-[10px] font-black text-white w-3 text-center">{qty}</span>
                          <button onClick={() => addToCart(product)}><Plus className="w-3 h-3 text-lime-400" /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-xl bg-lime-500 hover:bg-lime-400 flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(132,204,22,0.3)]">
                          <Plus className="w-3.5 h-3.5 text-black" />
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-[8px] text-zinc-600 mt-1">{product.supermarket}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cart Sticky Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-[84px] left-4 right-4 z-[200]"
          >
            <button
              onClick={() => setShowCart(true)}
              className="w-full h-14 bg-lime-500 hover:bg-lime-400 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_32px_rgba(132,204,22,0.4)] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">{totalItems}</span>
                </div>
                <span className="text-[12px] font-black text-black uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-black">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center"
            onClick={e => e.target === e.currentTarget && setShowCart(false)}
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white">Your Cart ({totalItems})</h3>
                <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {cart.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white truncate">{product.name}</p>
                      <p className="text-[11px] text-lime-400 font-bold">৳{product.price * qty}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-1">
                      <button onClick={() => removeFromCart(product.id)}><Minus className="w-3 h-3 text-zinc-400" /></button>
                      <span className="text-[11px] font-black text-white w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(product)}><Plus className="w-3 h-3 text-zinc-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-3">
                {totalPrice >= 500 ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                    <Truck className="w-3.5 h-3.5" /> Free delivery applied!
                  </div>
                ) : (
                  <div className="text-[10px] text-zinc-500">
                    Add ৳{500 - totalPrice} more for free delivery
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-zinc-400 uppercase">Total</span>
                  <span className="text-xl font-black text-lime-400">৳{totalPrice}</span>
                </div>
                <button
                  onClick={() => { setShowCart(false); toast.success("Order placed! Delivering soon."); setCart([]); }}
                  className="w-full py-3.5 bg-lime-500 hover:bg-lime-400 text-black font-black rounded-2xl text-[13px] uppercase tracking-wide transition-all"
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
