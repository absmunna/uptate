import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pill, Search, Star, Clock, MapPin, ShieldCheck, Plus, Minus,
  X, AlertTriangle, Truck, BadgeCheck, Upload, Heart,
  Thermometer, Syringe, Eye, Baby, Stethoscope, Leaf
} from "lucide-react";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Med = {
  id: string; name: string; generic: string; brand: string; category: string;
  price: number; unit: string; requiresRx: boolean; inStock: boolean;
  rating: number; reviews: number; image: string; description: string;
};

const DRUG_CATS = [
  { id: "all", label: "All", icon: Pill },
  { id: "pain", label: "Pain Relief", icon: Thermometer },
  { id: "cardiac", label: "Cardiac", icon: Heart },
  { id: "diabetes", label: "Diabetes", icon: Stethoscope },
  { id: "injection", label: "Injection", icon: Syringe },
  { id: "eye", label: "Eye Care", icon: Eye },
  { id: "baby", label: "Baby", icon: Baby },
  { id: "vitamins", label: "Vitamins", icon: Leaf },
];

const MEDICINES: Med[] = [
  { id: "p1", name: "Napa 500mg", generic: "Paracetamol", brand: "Beximco", category: "pain", price: 4, unit: "tablet", requiresRx: false, inStock: true, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", description: "Pain relief & fever reducer" },
  { id: "p2", name: "Fexo 120mg", generic: "Fexofenadine", brand: "Incepta", category: "pain", price: 10, unit: "tablet", requiresRx: false, inStock: true, rating: 4.7, reviews: 567, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&q=80", description: "Antihistamine for allergies" },
  { id: "p3", name: "Losartan 50mg", generic: "Losartan K", brand: "ACI", category: "cardiac", price: 14, unit: "tablet", requiresRx: true, inStock: true, rating: 4.8, reviews: 890, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&q=80", description: "For high blood pressure" },
  { id: "p4", name: "Aspirin 75mg", generic: "Aspirin", brand: "Bayer", category: "cardiac", price: 8, unit: "tablet", requiresRx: false, inStock: true, rating: 4.6, reviews: 1230, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", description: "Blood thinner & pain relief" },
  { id: "p5", name: "Metformin 500mg", generic: "Metformin HCl", brand: "Square", category: "diabetes", price: 6, unit: "tablet", requiresRx: true, inStock: true, rating: 4.9, reviews: 1456, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&q=80", description: "Oral diabetes medication" },
  { id: "p6", name: "Insulin Pen (Novo)", generic: "Insulin Glargine", brand: "Novo Nordisk", category: "injection", price: 1200, unit: "pen", requiresRx: true, inStock: true, rating: 4.9, reviews: 340, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", description: "Long-acting insulin" },
  { id: "p7", name: "Optifit Eye Drops", generic: "Carboxymethylcellulose", brand: "Alcon", category: "eye", price: 180, unit: "bottle", requiresRx: false, inStock: true, rating: 4.7, reviews: 289, image: "https://images.unsplash.com/photo-1576671414121-aa2d60f985a3?w=200&q=80", description: "Lubricating drops for dry eyes" },
  { id: "p8", name: "Baby Napa Syrup", generic: "Paracetamol", brand: "Beximco", category: "baby", price: 45, unit: "bottle", requiresRx: false, inStock: true, rating: 4.8, reviews: 678, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&q=80", description: "Fever & pain relief for children" },
  { id: "p9", name: "Vitamin D3 1000IU", generic: "Cholecalciferol", brand: "Aristopharma", category: "vitamins", price: 200, unit: "30 caps", requiresRx: false, inStock: true, rating: 4.8, reviews: 445, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&q=80", description: "Daily vitamin D supplement" },
  { id: "p10", name: "Zinc 20mg", generic: "Zinc Sulfate", brand: "Renata", category: "vitamins", price: 80, unit: "strip", requiresRx: false, inStock: false, rating: 4.6, reviews: 231, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", description: "Immune support mineral" },
];

type CartItem = { med: Med; qty: number };

export function PharmacyHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [rxWarning, setRxWarning] = useState<string | null>(null);
  const [showRxUpload, setShowRxUpload] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.med.price * i.qty, 0);

  const addToCart = (med: Med) => {
    if (med.requiresRx) { setRxWarning(med.id); return; }
    setCart(prev => {
      const ex = prev.find(i => i.med.id === med.id);
      if (ex) return prev.map(i => i.med.id === med.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { med, qty: 1 }];
    });
    toast.success(`${med.name} added`, { duration: 1400 });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const ex = prev.find(i => i.med.id === id);
      if (ex && ex.qty > 1) return prev.map(i => i.med.id === id ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.med.id !== id);
    });
  };

  const getQty = (id: string) => cart.find(i => i.med.id === id)?.qty || 0;

  const filtered = MEDICINES.filter(m => {
    const matchCat = activeCategory === "all" || m.category === activeCategory;
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.generic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="pharmacy" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="pharmacy" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 bg-gradient-to-br from-emerald-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0">💊</div>
            <div>
              <h1 className="text-lg font-black text-white">Online Pharmacy</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">Genuine medicines — fast & safe delivery</p>
            </div>
          </div>
          <div className="relative z-10 flex gap-2 mt-4">
            <button
              onClick={() => setShowRxUpload(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-black text-emerald-400"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Prescription
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-black text-zinc-400">
              <Truck className="w-3.5 h-3.5" /> Free Delivery
            </button>
          </div>
        </motion.div>

        {/* Prescription Warning Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-300/80 leading-relaxed">
            Items marked <span className="text-amber-400 font-black">Rx</span> require a valid doctor's prescription. Upload to unlock these items.
          </p>
        </div>

        {/* Search */}
        <div className="mt-4 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-emerald-500/40 transition-all">
          <Search className="w-4 h-4 text-emerald-400" />
          <input type="text" placeholder="Search by name or generic..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold" />
          {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-zinc-500" /></button>}
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {DRUG_CATS.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                  isActive ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className="w-3 h-3" />{cat.label}
              </button>
            );
          })}
        </div>

        {/* Medicine Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filtered.map((med, i) => {
            const qty = getQty(med.id);
            const showWarn = rxWarning === med.id;
            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "rounded-2xl border p-3 bg-white/[0.02] transition-all",
                  !med.inStock ? "border-white/[0.03] opacity-50" : "border-white/[0.06] hover:border-emerald-500/20"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                      <p className="text-[11px] font-black text-white leading-tight">{med.name}</p>
                      {med.requiresRx && (
                        <span className="px-1 py-0.5 rounded bg-red-500/20 text-[8px] font-black text-red-400 border border-red-500/30">Rx</span>
                      )}
                    </div>
                    <p className="text-[9px] text-zinc-500">{med.generic}</p>
                    <p className="text-[9px] text-zinc-600">{med.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-zinc-400">{med.rating} ({med.reviews})</span>
                </div>
                {showWarn && (
                  <div className="mb-2 p-2 rounded-xl bg-red-500/8 border border-red-500/20 text-[9px] text-red-400">
                    Upload prescription to order
                    <button onClick={() => setRxWarning(null)} className="ml-1 text-zinc-600 underline">Dismiss</button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-emerald-400">৳{med.price}</span>
                    <span className="text-[9px] text-zinc-600 ml-0.5">/{med.unit}</span>
                  </div>
                  {med.inStock ? (
                    qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-1.5 py-1">
                        <button onClick={() => removeFromCart(med.id)}><Minus className="w-3 h-3 text-emerald-400" /></button>
                        <span className="text-[10px] font-black text-white w-3 text-center">{qty}</span>
                        <button onClick={() => addToCart(med)}><Plus className="w-3 h-3 text-emerald-400" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(med)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1",
                          med.requiresRx ? "bg-amber-500/15 border border-amber-500/30 text-amber-400" : "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(52,211,153,0.3)]"
                        )}
                      >
                        {med.requiresRx ? "Rx" : <><Plus className="w-3 h-3" />Add</>}
                      </button>
                    )
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-bold">Out of Stock</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-[84px] left-4 right-4 z-[200]">
            <button onClick={() => setShowCart(true)} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_32px_rgba(52,211,153,0.35)] transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center"><span className="text-[11px] font-black text-white">{totalItems}</span></div>
                <span className="text-[12px] font-black text-white uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-white">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rx Upload Modal */}
      <AnimatePresence>
        {showRxUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowRxUpload(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-6">
              <h3 className="text-base font-black text-white mb-2">Upload Prescription</h3>
              <p className="text-[11px] text-zinc-400 mb-5">Upload a clear photo of your doctor's prescription to unlock Rx medicines.</p>
              <div className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all bg-emerald-500/5">
                <Upload className="w-8 h-8 text-emerald-400" />
                <p className="text-[12px] font-black text-white">Tap to upload photo</p>
                <p className="text-[10px] text-zinc-500">JPG, PNG, PDF • Max 5MB</p>
              </div>
              <button onClick={() => { setShowRxUpload(false); toast.success("Prescription uploaded! Review takes ~15 min."); }} className="w-full mt-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-[12px]">Submit Prescription</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
