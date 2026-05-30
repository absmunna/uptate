import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf, Sun, Droplets, Thermometer, ShoppingCart, Star,
  MapPin, Search, Filter, ChevronRight, BadgeCheck, Package,
  TrendingUp, Zap, X, Check, Phone, Calendar, Truck, Users,
  CloudRain, Wind, BarChart3, Wheat, Fish, Flower2
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AgroCategory = "all" | "crops" | "livestock" | "fishery" | "organic" | "agri-inputs" | "equipment";
type AgroProduct = {
  id: string; name: string; nameBn: string; category: AgroCategory;
  price: number; unit: string; origin: string; seller: string;
  rating: number; orders: number; image: string;
  certified?: boolean; organic?: boolean; seasonal?: boolean;
  description: string; moq: number;
};

const AGRO_PRODUCTS: AgroProduct[] = [
  {
    id: "a1", name: "Premium Hilsa Fish", nameBn: "ইলিশ মাছ (প্রিমিয়াম)",
    category: "fishery", price: 1200, unit: "kg", origin: "Chandpur, Bangladesh",
    seller: "Padma Fresh Fisheries", rating: 4.9, orders: 2340,
    image: "https://images.unsplash.com/photo-1509978778156-518eea30166b?w=400&q=70",
    certified: true, seasonal: true,
    description: "Premium Padma Hilsa – the king of Bengali fish. Fresh, direct from Chandpur fishermen.", moq: 2,
  },
  {
    id: "a2", name: "Organic Basmati Rice", nameBn: "জৈব বাসমতি চাল",
    category: "crops", price: 95, unit: "kg", origin: "Dinajpur, Bangladesh",
    seller: "Dinajpur Agro Cooperative", rating: 4.7, orders: 1870,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=70",
    organic: true, certified: true,
    description: "Long-grain organic basmati from the renowned rice belt of Dinajpur.", moq: 25,
  },
  {
    id: "a3", name: "Farm Fresh Potato", nameBn: "তাজা আলু (ফার্ম থেকে)",
    category: "crops", price: 28, unit: "kg", origin: "Munshiganj, Dhaka",
    seller: "Munshiganj Potato Farmers", rating: 4.5, orders: 4120,
    image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=70",
    description: "Direct farm-to-market potatoes from Munshiganj – always fresh and affordable.", moq: 50,
  },
  {
    id: "a4", name: "Fresh Organic Vegetables Box", nameBn: "জৈব সবজি বাক্স",
    category: "organic", price: 450, unit: "box", origin: "Manikganj, Dhaka",
    seller: "Green Earth Organics", rating: 4.8, orders: 980,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=70",
    organic: true, certified: true,
    description: "Weekly box of 8 seasonal organic vegetables, pesticide-free, direct from certified farms.", moq: 1,
  },
  {
    id: "a5", name: "Deshi Cow Milk (Raw)", nameBn: "দেশি গরুর কাঁচা দুধ",
    category: "livestock", price: 90, unit: "litre", origin: "Sirajganj, Bangladesh",
    seller: "Sirajganj Dairy Farm", rating: 4.6, orders: 3200,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=70",
    certified: true,
    description: "Pure raw milk from grass-fed deshi cows in Sirajganj. Collected daily, chilled and delivered.", moq: 5,
  },
  {
    id: "a6", name: "Urea Fertilizer (46% N)", nameBn: "ইউরিয়া সার",
    category: "agri-inputs", price: 24, unit: "kg", origin: "Bangladesh",
    seller: "Agro Input BD", rating: 4.4, orders: 5600,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=70",
    description: "High-purity urea fertilizer for rice, wheat, and vegetable cultivation. Government approved.", moq: 50,
  },
  {
    id: "a7", name: "Power Tiller (15 HP)", nameBn: "পাওয়ার টিলার (১৫ এইচপি)",
    category: "equipment", price: 95000, unit: "unit", origin: "China / BD Assembled",
    seller: "Farm Equipment BD", rating: 4.7, orders: 340,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=70",
    certified: true,
    description: "15 HP 2-wheel power tiller, ideal for small and medium farms. With 1-year warranty.", moq: 1,
  },
  {
    id: "a8", name: "Bangladesh Rose (Red)", nameBn: "বাংলাদেশি লাল গোলাপ",
    category: "organic", price: 15, unit: "stem", origin: "Savar, Dhaka",
    seller: "Savar Flower Farm", rating: 4.8, orders: 8900,
    image: "https://images.unsplash.com/photo-1548043020-c7b94f1b41e9?w=400&q=70",
    description: "Fresh-cut red roses from Savar's famous flower belt. Available in bulk for events and retail.", moq: 100,
  },
];

const CAT_FILTERS: { id: AgroCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: "all",         label: "All",        icon: Leaf,      color: "text-emerald-400" },
  { id: "crops",       label: "Crops",      icon: Wheat,     color: "text-amber-400" },
  { id: "fishery",     label: "Fishery",    icon: Fish,      color: "text-blue-400" },
  { id: "livestock",   label: "Livestock",  icon: Sun,       color: "text-orange-400" },
  { id: "organic",     label: "Organic",    icon: Flower2,   color: "text-green-400" },
  { id: "agri-inputs", label: "Inputs",     icon: Package,   color: "text-violet-400" },
  { id: "equipment",   label: "Equipment",  icon: Zap,       color: "text-cyan-400" },
];

const WEATHER = { temp: 32, humidity: 78, wind: 14, rain: "40%", condition: "Partly Cloudy" };

export default function AgriculturePortal() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AgroCategory>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<AgroProduct | null>(null);
  const [qty, setQty] = useState(1);

  const filtered = AGRO_PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = search.toLowerCase();
    return matchCat && (!q || p.name.toLowerCase().includes(q) || p.nameBn.includes(q) || p.origin.toLowerCase().includes(q));
  });

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);

  const addToCart = (id: string, quantity: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + quantity }));
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="agriculture" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="agriculture" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero with Weather */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 bg-gradient-to-br from-emerald-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">🌾</div>
            <div>
              <h1 className="text-base font-black text-white">Krishi Bazaar</h1>
              <p className="text-[11px] text-zinc-400">কৃষি পণ্য, উপকরণ ও কৃষি তথ্য</p>
            </div>
            {cartCount > 0 && (
              <div className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-black text-emerald-400">{cartCount}</span>
              </div>
            )}
          </div>

          {/* Weather Widget */}
          <div className="relative z-10 flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-3xl">⛅</div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-white">{WEATHER.condition} · Dhaka</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Thermometer className="w-3 h-3" />{WEATHER.temp}°C</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Droplets className="w-3 h-3" />{WEATHER.humidity}%</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1"><CloudRain className="w-3 h-3" />{WEATHER.rain}</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Wind className="w-3 h-3" />{WEATHER.wind} km/h</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-zinc-600">Good day for</p>
              <p className="text-[10px] font-black text-emerald-400">Irrigation</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Products", value: "12,000+", emoji: "🌱" },
              { label: "Farmers", value: "48,000+", emoji: "👨‍🌾" },
              { label: "Districts", value: "64", emoji: "🗺️" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[10px] font-black text-emerald-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-emerald-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="কৃষি পণ্য খুঁজুন..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", activeCategory === cat.id ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Products</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setSelectedProduct(product); setQty(product.moq); }}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all text-left cursor-pointer"
            >
              <div className="relative h-28 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.organic && <span className="px-1.5 py-0.5 rounded-md bg-green-500/90 text-[8px] font-black text-white">ORGANIC</span>}
                  {product.seasonal && <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-[8px] font-black text-black">SEASONAL</span>}
                </div>
                {product.certified && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                    <BadgeCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-black text-white leading-tight line-clamp-1">{product.name}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{product.nameBn}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                  <p className="text-[9px] text-zinc-600 truncate">{product.origin.split(",")[0]}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[13px] font-black text-emerald-400">৳{product.price.toLocaleString()}<span className="text-[8px] text-zinc-600">/{product.unit}</span></span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[9px] text-zinc-400">{product.rating}</span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); addToCart(product.id, product.moq); }} className="w-full mt-2 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Sheet */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setSelectedProduct(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl overflow-hidden">
              <div className="h-48 relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] to-transparent" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="px-4 pb-6">
                <h3 className="text-base font-black text-white mb-0.5">{selectedProduct.name}</h3>
                <p className="text-[11px] text-zinc-500 mb-2">{selectedProduct.nameBn}</p>
                <p className="text-[12px] text-zinc-400 mb-4 leading-relaxed">{selectedProduct.description}</p>
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <p className="text-[9px] text-zinc-600">Price per {selectedProduct.unit}</p>
                    <p className="text-2xl font-black text-emerald-400">৳{selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600">Min Order</p>
                    <p className="text-[14px] font-black text-white">{selectedProduct.moq} {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600">Rating</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <p className="text-[13px] font-black text-white">{selectedProduct.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-[10px] text-zinc-500">Quantity ({selectedProduct.unit})</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(q => Math.max(selectedProduct.moq, q - selectedProduct.moq))} className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white font-black">−</button>
                    <span className="text-[14px] font-black text-white w-10 text-center">{qty}</span>
                    <button onClick={() => setQty(q => q + selectedProduct.moq)} className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white font-black">+</button>
                  </div>
                  <p className="ml-auto text-[13px] font-black text-emerald-400">৳{(qty * selectedProduct.price).toLocaleString()}</p>
                </div>
                <button onClick={() => { addToCart(selectedProduct.id, qty); setSelectedProduct(null); }} className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart · ৳{(qty * selectedProduct.price).toLocaleString()}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
