import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Cpu, Search, Filter, Star, ShoppingCart, Heart, Zap, BadgeCheck, ChevronRight, Smartphone, Monitor, Laptop, Headphones, Camera, Tv, Watch } from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ElecCategory = "all" | "phone" | "laptop" | "tv" | "audio" | "camera" | "wearable" | "accessories";

type Product = {
  id: string; title: string; brand: string; category: ElecCategory;
  price: number; originalPrice?: number; rating: number; reviews: number;
  image: string; stock: string; specs: string[]; badge?: string;
};

const PRODUCTS: Product[] = [
  { id: "e1", title: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "phone", price: 145000, originalPrice: 165000, rating: 4.9, reviews: 3420, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=70", stock: "In Stock", specs: ["6.8\" QHD+", "200MP Camera", "5000mAh", "12GB RAM"], badge: "Best Seller" },
  { id: "e2", title: "Apple MacBook Air M3", brand: "Apple", category: "laptop", price: 185000, originalPrice: 200000, rating: 4.9, reviews: 1870, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=70", stock: "In Stock", specs: ["13.6\" Retina", "8GB RAM", "256GB SSD", "18hr Battery"], badge: "New" },
  { id: "e3", title: "Sony WH-1000XM5", brand: "Sony", category: "audio", price: 32000, originalPrice: 38000, rating: 4.8, reviews: 2140, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=70", stock: "In Stock", specs: ["ANC", "30hr Battery", "Hi-Res Audio", "Multipoint"], badge: "Top Rated" },
  { id: "e4", title: "Samsung 55\" QLED 4K TV", brand: "Samsung", category: "tv", price: 95000, originalPrice: 110000, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=70", stock: "In Stock", specs: ["55\"", "QLED 4K", "120Hz", "Smart TV"] },
  { id: "e5", title: "iPhone 15 Pro", brand: "Apple", category: "phone", price: 160000, rating: 4.9, reviews: 4500, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=70", stock: "Limited", specs: ["6.1\" Super Retina", "A17 Pro", "48MP Triple", "Titanium"], badge: "Hot" },
  { id: "e6", title: "Canon EOS R6 Mark II", brand: "Canon", category: "camera", price: 280000, originalPrice: 310000, rating: 4.8, reviews: 567, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=70", stock: "In Stock", specs: ["40MP", "4K 60fps", "IBIS", "Full-Frame"] },
  { id: "e7", title: "Apple Watch Series 9", brand: "Apple", category: "wearable", price: 55000, originalPrice: 62000, rating: 4.8, reviews: 1230, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=70", stock: "In Stock", specs: ["45mm", "Always-On", "ECG", "Crash Detection"] },
  { id: "e8", title: "Dell XPS 15 2024", brand: "Dell", category: "laptop", price: 175000, originalPrice: 195000, rating: 4.7, reviews: 780, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=70", stock: "In Stock", specs: ["15.6\" OLED", "Intel Core Ultra 9", "16GB DDR5", "RTX 4070"] },
];

const CAT_FILTERS: { id: ElecCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",         label: "All",         icon: Cpu },
  { id: "phone",       label: "Phones",      icon: Smartphone },
  { id: "laptop",      label: "Laptops",     icon: Laptop },
  { id: "tv",          label: "TVs",         icon: Tv },
  { id: "audio",       label: "Audio",       icon: Headphones },
  { id: "camera",      label: "Cameras",     icon: Camera },
  { id: "wearable",    label: "Wearables",   icon: Watch },
  { id: "accessories", label: "Accessories", icon: Zap },
];

const BADGE_COLORS: Record<string, string> = {
  "Best Seller": "bg-amber-500/90 text-black",
  "New": "bg-blue-500/90 text-white",
  "Top Rated": "bg-violet-500/90 text-white",
  "Hot": "bg-red-500/90 text-white",
};

export default function ElectronicsPortal() {
  const [category, setCategory] = useState<ElecCategory>("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === "all" || p.category === category;
    const q = search.toLowerCase();
    return matchCat && (!q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="electronics" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="electronics" />
      </div>
      <div className="px-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-blue-500/20 p-5 bg-gradient-to-br from-blue-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">💻</div>
            <div><h1 className="text-base font-black text-white">Tech Store</h1><p className="text-[11px] text-zinc-400">Phones, laptops, TVs &amp; more</p></div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[{ label: "Products", value: "15,000+", emoji: "📱" }, { label: "Brands", value: "200+", emoji: "🏷️" }, { label: "Warranty", value: "Official", emoji: "🛡️" }].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-blue-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-blue-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="iPhone, MacBook, Samsung..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-blue-500/15 border-blue-500/30 text-blue-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Products</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <div className="relative h-40 overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {product.badge && <div className={cn("absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[8px] font-black", BADGE_COLORS[product.badge] || "bg-zinc-600 text-white")}>{product.badge}</div>}
                <button onClick={() => setSaved(p => { const n = new Set(p); n.has(product.id) ? n.delete(product.id) : n.add(product.id); return n; })} className={cn("absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center", saved.has(product.id) ? "bg-red-500/10 border-red-500/30" : "bg-black/40 border-white/20")}>
                  <Heart className={cn("w-3.5 h-3.5", saved.has(product.id) ? "text-red-500 fill-red-500" : "text-white")} />
                </button>
                <span className={cn("absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md text-[8px] font-black", product.stock === "Limited" ? "bg-red-500/80 text-white" : "bg-emerald-500/80 text-white")}>{product.stock}</span>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] text-zinc-500 mb-0.5">{product.brand}</p>
                <p className="text-[11px] font-black text-white line-clamp-2 mb-1">{product.title}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-zinc-400">{product.rating}</span>
                  <span className="text-[9px] text-zinc-600">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[13px] font-black text-blue-400">৳{product.price.toLocaleString()}</p>
                    {product.originalPrice && <p className="text-[9px] text-zinc-600 line-through">৳{product.originalPrice.toLocaleString()}</p>}
                  </div>
                  <button onClick={() => { setCart(p => new Set([...p, product.id])); toast.success("Added to cart!"); }} className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all", cart.has(product.id) ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-blue-500/20 border border-blue-500/30")}>
                    <ShoppingCart className={cn("w-4 h-4", cart.has(product.id) ? "text-emerald-400" : "text-blue-400")} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
