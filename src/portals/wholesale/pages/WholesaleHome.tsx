import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package, Building2, Search, Star, MapPin, Shield, ChevronRight,
  Truck, TrendingDown, BadgeCheck, Phone, FileText, Factory,
  Globe, Tag, X, Boxes, ArrowRight, Check, Sparkles, Info,
  BarChart3, Users, ShoppingBag, Clock
} from "lucide-react";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type WholesaleCategory = { id: string; label: string; emoji: string; count: number };
type PriceTier = { moq: number; price: number; unit: string; label: string };
type WholesaleProduct = {
  id: string; name: string; category: string; priceTiers: PriceTier[];
  minOrderQty: number; inStock: boolean; rating: number; reviews: number;
  supplier: string; location: string; leadTime: string; verified: boolean;
  image: string; description: string; certification?: string;
};

const CATEGORIES: WholesaleCategory[] = [
  { id: "all", label: "All Categories", emoji: "📦", count: 1240 },
  { id: "textiles", label: "Textiles", emoji: "👕", count: 420 },
  { id: "electronics", label: "Electronics", emoji: "⚡", count: 156 },
  { id: "food", label: "Food & FMCG", emoji: "🍱", count: 280 },
  { id: "construction", label: "Construction", emoji: "🏗️", count: 98 },
  { id: "chemicals", label: "Chemicals", emoji: "🧪", count: 67 },
  { id: "plastics", label: "Plastics", emoji: "🧴", count: 120 },
  { id: "agriculture", label: "Agriculture", emoji: "🌾", count: 99 },
];

const PRODUCTS: WholesaleProduct[] = [
  {
    id: "w1", name: "Ready-Made Garments (T-Shirts)", category: "textiles",
    priceTiers: [
      { moq: 100, price: 180, unit: "pcs", label: "Starter" },
      { moq: 500, price: 150, unit: "pcs", label: "Business" },
      { moq: 2000, price: 110, unit: "pcs", label: "Enterprise" },
    ],
    minOrderQty: 100, inStock: true, rating: 4.8, reviews: 312,
    supplier: "Dhaka Garments Ltd.", location: "Gazipur, Dhaka",
    leadTime: "14 days", verified: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
    description: "100% cotton ready-made T-shirts, export quality. Custom branding available.", certification: "BSCI, ISO 9001",
  },
  {
    id: "w2", name: "Ceramic Tiles (60x60cm)", category: "construction",
    priceTiers: [
      { moq: 100, price: 85, unit: "pcs", label: "Standard" },
      { moq: 500, price: 70, unit: "pcs", label: "Bulk" },
      { moq: 2000, price: 58, unit: "pcs", label: "Factory" },
    ],
    minOrderQty: 100, inStock: true, rating: 4.7, reviews: 189,
    supplier: "Bangladesh Tiles Corp", location: "Keraniganj, Dhaka",
    leadTime: "7 days", verified: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    description: "High-quality ceramic floor tiles with HD print finish. Multiple designs available.",
  },
  {
    id: "w3", name: "Rice (Miniket 50kg bags)", category: "food",
    priceTiers: [
      { moq: 10, price: 3200, unit: "bags", label: "Retail" },
      { moq: 50, price: 2900, unit: "bags", label: "Distributor" },
      { moq: 200, price: 2600, unit: "bags", label: "Wholesaler" },
    ],
    minOrderQty: 10, inStock: true, rating: 4.9, reviews: 567,
    supplier: "Nawabganj Rice Mill", location: "Nawabganj, Rajshahi",
    leadTime: "3 days", verified: true,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=300&q=80",
    description: "Premium Miniket rice, machine cleaned and triple-polished.",
  },
  {
    id: "w4", name: "PVC Pipe (Various Sizes)", category: "plastics",
    priceTiers: [
      { moq: 50, price: 380, unit: "pcs", label: "Standard" },
      { moq: 200, price: 320, unit: "pcs", label: "Bulk" },
      { moq: 1000, price: 270, unit: "pcs", label: "Industrial" },
    ],
    minOrderQty: 50, inStock: true, rating: 4.6, reviews: 134,
    supplier: "National Plastics BD", location: "Narayanganj",
    leadTime: "5 days", verified: false,
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&q=80",
    description: "Durable PVC pipes for plumbing and construction, BSTI certified.",
  },
  {
    id: "w5", name: "LED Bulb (9W, Warm White)", category: "electronics",
    priceTiers: [
      { moq: 100, price: 120, unit: "pcs", label: "Retail" },
      { moq: 500, price: 95, unit: "pcs", label: "Wholesale" },
      { moq: 2000, price: 72, unit: "pcs", label: "Factory" },
    ],
    minOrderQty: 100, inStock: true, rating: 4.5, reviews: 89,
    supplier: "Lumex Electronics BD", location: "Motijheel, Dhaka",
    leadTime: "2 days", verified: true,
    image: "https://images.unsplash.com/photo-1558618047-3c3d7e8e3e5e?w=300&q=80",
    description: "Energy-saving LED bulbs with 3-year warranty. OEM packaging available.",
  },
  {
    id: "w6", name: "Organic Fertilizer (50kg)", category: "agriculture",
    priceTiers: [
      { moq: 20, price: 1200, unit: "bags", label: "Farmer" },
      { moq: 100, price: 950, unit: "bags", label: "Dealer" },
      { moq: 500, price: 800, unit: "bags", label: "Distributor" },
    ],
    minOrderQty: 20, inStock: true, rating: 4.8, reviews: 234,
    supplier: "Green Farm Inputs BD", location: "Bogura",
    leadTime: "4 days", verified: true,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",
    description: "100% organic fertilizer, BADC certified. Improves soil health and yield.",
  },
];

type QuoteModal = { product: WholesaleProduct; selectedTier: PriceTier } | null;

const RFQModal = ({ product, tier, onClose }: { product: WholesaleProduct; tier: PriceTier; onClose: () => void }) => {
  const [qty, setQty] = useState(tier.moq.toString());
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }}
        className="w-full max-w-[500px] bg-[var(--pm-bg)] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 flex flex-col max-h-[90vh]"
      >
        {!sent ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Request For Quote</h3>
                <p className="text-[10px] text-zinc-500">{product.name}</p>
              </div>
              <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/8 border border-blue-500/20">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Selected Tier: {tier.label}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">MOQ: {tier.moq} {tier.unit}</span>
                  <span className="text-blue-400 font-black">৳{tier.price}/{tier.unit}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Quantity Needed ({tier.unit})</label>
                  <input type="number" min={tier.moq} value={qty} onChange={e => setQty(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40"
                  />
                  {Number(qty) >= tier.moq && <p className="text-[10px] text-blue-400 mt-1">Est. Value: ৳{(Number(qty) * tier.price).toLocaleString()}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Additional Requirements</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Custom packaging, branding, certification needs..."
                    rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => { setSent(true); toast.success("RFQ sent! Supplier will respond within 4 hrs."); }}
              className="mt-4 w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-[12px] uppercase tracking-wide transition-all shadow-[0_4px_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Send RFQ to Supplier
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h4 className="text-lg font-black text-white">RFQ Sent!</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-[220px] mx-auto">{product.supplier} will contact you with pricing within 4 hours.</p>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 text-[11px] font-black text-white">Close</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export function WholesaleHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rfqModal, setRfqModal] = useState<{ product: WholesaleProduct; tier: PriceTier } | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="wholesale" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="wholesale" />
      </div>

      <div className="px-4 mt-4 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-blue-500/20 p-5 bg-gradient-to-br from-blue-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[9px] font-black text-blue-400 uppercase tracking-widest">B2B Wholesale</span>
              </div>
              <h1 className="text-lg font-black text-white">Bulk Sourcing Hub</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">MOQ pricing, RFQ system & verified factories</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-4 gap-2 mt-4">
            {[
              { icon: Factory, label: "1,200+", sublabel: "Verified Suppliers" },
              { icon: Globe, label: "40+", sublabel: "Export Countries" },
              { icon: BarChart3, label: "৳50Cr+", sublabel: "Monthly GMV" },
              { icon: Users, label: "8,000+", sublabel: "Buyers" },
            ].map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <Icon className="w-4 h-4 text-blue-400" />
                <p className="text-[11px] font-black text-white">{label}</p>
                <p className="text-[8px] text-zinc-500 leading-tight">{sublabel}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="mt-4 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-blue-500/40 transition-all">
          <Search className="w-4 h-4 text-blue-400" />
          <input type="text" placeholder="Search products, suppliers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold" />
          {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-zinc-500" /></button>}
        </div>

        {/* Categories */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                  isActive ? "bg-blue-500/15 border-blue-500/30 text-blue-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
                )}
              >
                {cat.emoji} {cat.label}
                <span className={cn("text-[8px] px-1 rounded-full", isActive ? "bg-blue-500/20" : "bg-white/5")}>{cat.count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Products */}
        <div className="mt-4 space-y-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            >
              <div className="flex gap-3 p-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-[13px] font-black text-white leading-tight flex-1">{product.name}</h3>
                    {product.verified && <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-1.5 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-zinc-400">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-500">{product.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-500">{product.leadTime}</span>
                    </div>
                  </div>
                  {product.certification && (
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                      <Shield className="w-3 h-3 text-cyan-400" />
                      {product.certification}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Tiers */}
              <div className="px-4 pb-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-blue-400" />
                  Volume Pricing Tiers
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {product.priceTiers.map((tier, ti) => (
                    <button
                      key={ti}
                      onClick={() => setRfqModal({ product, tier })}
                      className={cn(
                        "p-2.5 rounded-2xl border text-center transition-all hover:border-blue-500/40 group",
                        ti === 0 ? "border-white/[0.08] bg-white/[0.02]" :
                        ti === 1 ? "border-blue-500/20 bg-blue-500/5" :
                        "border-purple-500/20 bg-purple-500/5"
                      )}
                    >
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">{tier.label}</p>
                      <p className="text-[11px] font-black text-white">৳{tier.price}</p>
                      <p className="text-[8px] text-zinc-600">/{tier.unit}</p>
                      <p className="text-[8px] text-zinc-500 mt-0.5">Min {tier.moq} {tier.unit}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRfqModal({ product, tier: product.priceTiers[1] || product.priceTiers[0] })}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
                  >
                    <FileText className="w-3.5 h-3.5" /> Request Quote
                  </button>
                  <button className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[11px] font-black text-zinc-400 flex items-center gap-1.5 hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RFQ Modal */}
      <AnimatePresence>
        {rfqModal && (
          <RFQModal product={rfqModal.product} tier={rfqModal.tier} onClose={() => setRfqModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
