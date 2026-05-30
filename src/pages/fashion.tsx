import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Shirt, Search, Heart, ShoppingBag, Star, Filter, ChevronRight, Sparkles, Tag, Check } from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FashionCat = "all" | "men" | "women" | "kids" | "saree" | "panjabi" | "western" | "accessories";

type FashionItem = {
  id: string; title: string; brand: string; category: FashionCat;
  price: number; originalPrice?: number; rating: number; reviews: number;
  image: string; sizes: string[]; colors: string[]; badge?: string;
};

const ITEMS: FashionItem[] = [
  { id: "f1", title: "Muslin Banarasi Saree", brand: "Aarong", category: "saree", price: 8500, originalPrice: 11000, rating: 4.9, reviews: 1230, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70", sizes: ["Free Size"], colors: ["Red", "Blue", "Green", "Gold"], badge: "Best Seller" },
  { id: "f2", title: "Premium Panjabi - Eid Collection", brand: "Rang Bangladesh", category: "panjabi", price: 2200, originalPrice: 3000, rating: 4.8, reviews: 890, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=70", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Beige", "Sky Blue", "Olive"] },
  { id: "f3", title: "Women's Formal Blazer", brand: "Yellow", category: "women", price: 3500, originalPrice: 5000, rating: 4.7, reviews: 450, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=70", sizes: ["XS", "S", "M", "L"], colors: ["Black", "Navy", "Camel"], badge: "New" },
  { id: "f4", title: "Polo T-Shirt Collection", brand: "Le Reve", category: "men", price: 950, originalPrice: 1400, rating: 4.6, reviews: 2100, image: "https://images.unsplash.com/photo-1608278947655-e1b1af5d6012?w=400&q=70", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Navy", "Green", "Gray"] },
  { id: "f5", title: "Jamdani Fusion Kurta", brand: "Aranya Crafts", category: "women", price: 4200, originalPrice: 5500, rating: 4.8, reviews: 670, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=70", sizes: ["S", "M", "L", "XL"], colors: ["Indigo", "Terracotta", "Off-White"] },
  { id: "f6", title: "Kids Festive Set", brand: "Bata", category: "kids", price: 1200, originalPrice: 1800, rating: 4.7, reviews: 340, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=70", sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"], colors: ["Blue", "Pink", "Yellow"] },
  { id: "f7", title: "Denim Jacket - Distressed", brand: "Sailor", category: "western", price: 2800, originalPrice: 4000, rating: 4.6, reviews: 780, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=70", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Medium Wash", "Light Wash", "Dark Wash"] },
  { id: "f8", title: "Handcrafted Leather Bag", brand: "Karika", category: "accessories", price: 3600, originalPrice: 5000, rating: 4.9, reviews: 320, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=70", sizes: ["One Size"], colors: ["Tan", "Black", "Burgundy"], badge: "Handmade" },
];

const BADGE_COLORS: Record<string, string> = {
  "Best Seller": "bg-amber-500/90 text-black",
  "New": "bg-blue-500/90 text-white",
  "Handmade": "bg-rose-500/90 text-white",
};

const CAT_FILTERS: { id: FashionCat; label: string }[] = [
  { id: "all",         label: "All" },
  { id: "women",       label: "Women" },
  { id: "men",         label: "Men" },
  { id: "kids",        label: "Kids" },
  { id: "saree",       label: "Saree" },
  { id: "panjabi",     label: "Panjabi" },
  { id: "western",     label: "Western" },
  { id: "accessories", label: "Bags & Acc." },
];

export default function FashionPortal() {
  const [category, setCategory] = useState<FashionCat>("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = ITEMS.filter(p => {
    const matchCat = category === "all" || p.category === category;
    const q = search.toLowerCase();
    return matchCat && (!q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="fashion" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="fashion" />
      </div>
      <div className="px-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-pink-500/20 p-5 bg-gradient-to-br from-pink-900/15 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.08)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-2xl">👗</div>
            <div><h1 className="text-base font-black text-white">PaikarFashion</h1><p className="text-[11px] text-zinc-400">Saree, panjabi, western &amp; more</p></div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[{ label: "Styles", value: "80,000+", emoji: "✨" }, { label: "Brands", value: "1,500+", emoji: "🏷️" }, { label: "New Daily", value: "500+", emoji: "🆕" }].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-pink-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-pink-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Saree, panjabi, dress..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(({ id, label }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-pink-500/15 border-pink-500/30 text-pink-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
              {label}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Items</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {item.badge && <div className={cn("absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[8px] font-black", BADGE_COLORS[item.badge] || "bg-zinc-600 text-white")}>{item.badge}</div>}
                <button onClick={() => setSaved(p => { const n = new Set(p); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })} className={cn("absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center", saved.has(item.id) ? "bg-red-500/10 border-red-500/30" : "bg-black/40 border-white/20")}>
                  <Heart className={cn("w-3.5 h-3.5", saved.has(item.id) ? "text-red-500 fill-red-500" : "text-white")} />
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-[9px] text-zinc-500 mb-0.5">{item.brand}</p>
                <p className="text-[11px] font-black text-white line-clamp-2 mb-1">{item.title}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-zinc-400">{item.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-black text-pink-400">৳{item.price.toLocaleString()}</p>
                    {item.originalPrice && <p className="text-[9px] text-zinc-600 line-through">৳{item.originalPrice.toLocaleString()}</p>}
                  </div>
                  <button onClick={() => { setCart(p => new Set([...p, item.id])); toast.success("Added to bag!"); }} className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all", cart.has(item.id) ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-pink-500/20 border border-pink-500/30")}>
                    {cart.has(item.id) ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-pink-400" />}
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
