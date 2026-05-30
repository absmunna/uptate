import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign, TrendingUp, PieChart, BarChart3, CreditCard,
  Shield, Search, Filter, Star, ChevronRight, X, Check,
  Banknote, Percent, Clock, Users, BadgeCheck, Calculator,
  ArrowUpRight, ArrowDownRight, Wallet, Landmark, Send,
  RefreshCw, Lock, Zap, Phone
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FinCategory = "all" | "savings" | "loans" | "insurance" | "investment" | "mfs" | "remittance";

type FinProduct = {
  id: string; name: string; provider: string; category: FinCategory;
  description: string; rate?: string; benefit: string;
  minAmount?: number; maxAmount?: number;
  rating: number; users: string; verified: boolean;
  icon: string; color: string; tags: string[];
  featured?: boolean;
};

const FIN_PRODUCTS: FinProduct[] = [
  {
    id: "f1", name: "Super Savings Account", provider: "Brac Bank",
    category: "savings", description: "High-yield savings with 7.5% annual interest. Zero maintenance fee, instant access.",
    rate: "7.5% p.a.", benefit: "Zero fees · Instant access",
    minAmount: 1000, rating: 4.8, users: "2.3M+", verified: true,
    icon: "💰", color: "from-emerald-500/20 to-green-600/10 border-emerald-500/20",
    tags: ["High Interest", "No Fee", "Mobile Access"], featured: true,
  },
  {
    id: "f2", name: "SME Business Loan", provider: "Dutch-Bangla Bank",
    category: "loans", description: "Quick business loans for SMEs. Up to ৳50 Lakh with minimum documentation.",
    rate: "9% – 13% p.a.", benefit: "Up to ৳50L · 5 days approval",
    minAmount: 50000, maxAmount: 5000000, rating: 4.6, users: "450K+", verified: true,
    icon: "🏦", color: "from-blue-500/20 to-indigo-600/10 border-blue-500/20",
    tags: ["SME", "Quick Approval", "Collateral-Free"],
  },
  {
    id: "f3", name: "bKash Savings (DPS)", provider: "bKash / Eastern Bank",
    category: "mfs", description: "Save directly from your bKash. 8% annual return on monthly deposits.",
    rate: "8% p.a.", benefit: "From ৳100/month · Auto-save",
    minAmount: 100, rating: 4.7, users: "5.8M+", verified: true,
    icon: "📱", color: "from-pink-500/20 to-rose-600/10 border-pink-500/20",
    tags: ["bKash", "DPS", "Micro-Savings"], featured: true,
  },
  {
    id: "f4", name: "Life Insurance Plan", provider: "MetLife Bangladesh",
    category: "insurance", description: "Protect your family with comprehensive life insurance. Coverage from ৳5 Lakh.",
    benefit: "Coverage from ৳5L · Tax benefit",
    minAmount: 500, rating: 4.5, users: "1.2M+", verified: true,
    icon: "🛡️", color: "from-violet-500/20 to-purple-600/10 border-violet-500/20",
    tags: ["Life Cover", "Tax Saving", "Family Protection"],
  },
  {
    id: "f5", name: "Mutual Fund (ICB)", provider: "ICB Asset Management",
    category: "investment", description: "Invest in diversified equity and bond mutual funds. SIP from ৳1,000/month.",
    rate: "12–18% avg returns", benefit: "Expert managed · High liquidity",
    minAmount: 1000, rating: 4.4, users: "320K+", verified: true,
    icon: "📈", color: "from-amber-500/20 to-orange-600/10 border-amber-500/20",
    tags: ["Mutual Fund", "SIP", "High Returns"],
  },
  {
    id: "f6", name: "Send Money Abroad", provider: "Western Union / DBBL",
    category: "remittance", description: "Send money to 200+ countries instantly. Best exchange rates guaranteed.",
    rate: "Best rates guaranteed", benefit: "Instant · 200+ countries",
    rating: 4.7, users: "890K+", verified: true,
    icon: "🌍", color: "from-cyan-500/20 to-blue-600/10 border-cyan-500/20",
    tags: ["International", "Instant", "Best Rate"],
  },
  {
    id: "f7", name: "Personal Loan", provider: "City Bank",
    category: "loans", description: "Personal loans for any need. Up to ৳20 Lakh, 24-hour approval.",
    rate: "12% – 16% p.a.", benefit: "Up to ৳20L · 24hr approval",
    maxAmount: 2000000, rating: 4.5, users: "670K+", verified: true,
    icon: "💳", color: "from-rose-500/20 to-pink-600/10 border-rose-500/20",
    tags: ["Personal Loan", "Fast Approval", "No Collateral"],
  },
  {
    id: "f8", name: "Nagad DPS & Savings", provider: "Bangladesh Post Office / Nagad",
    category: "mfs", description: "Save using Nagad. Backed by Bangladesh government. 7.5% guaranteed return.",
    rate: "7.5% guaranteed", benefit: "Govt-backed · 100% secure",
    minAmount: 500, rating: 4.8, users: "10M+", verified: true,
    icon: "📮", color: "from-orange-500/20 to-amber-600/10 border-orange-500/20",
    tags: ["Nagad", "Government", "Safe"],
  },
];

const CAT_FILTERS: { id: FinCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",        label: "All",        icon: DollarSign },
  { id: "savings",    label: "Savings",    icon: Wallet },
  { id: "loans",      label: "Loans",      icon: Landmark },
  { id: "mfs",        label: "MFS",        icon: Phone },
  { id: "insurance",  label: "Insurance",  icon: Shield },
  { id: "investment", label: "Investment", icon: TrendingUp },
  { id: "remittance", label: "Remittance", icon: Send },
];

const MARKET_DATA = [
  { label: "DSEX", value: "6,284", change: "+1.2%", up: true },
  { label: "USD/BDT", value: "110.5", change: "+0.3%", up: true },
  { label: "Gold (gm)", value: "৳7,840", change: "-0.4%", up: false },
  { label: "Inflation", value: "9.1%", change: "-0.2%", up: false },
];

export default function FinancePortal() {
  const [category, setCategory] = useState<FinCategory>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FinProduct | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const filtered = FIN_PRODUCTS.filter(p => {
    const matchCat = category === "all" || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="finance" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="finance" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-amber-500/20 p-5 bg-gradient-to-br from-amber-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">💳</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarFinance</h1>
              <p className="text-[11px] text-zinc-400">Banking, savings & investment</p>
            </div>
          </div>

          {/* Live Market Ticker */}
          <div className="relative z-10 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {MARKET_DATA.map(({ label, value, change, up }) => (
              <div key={label} className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <div>
                  <p className="text-[8px] text-zinc-600">{label}</p>
                  <p className="text-[11px] font-black text-white">{value}</p>
                </div>
                <span className={cn("text-[9px] font-black flex items-center gap-0.5", up ? "text-emerald-400" : "text-red-400")}>
                  {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {change}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-amber-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Savings, loans, investment..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && category === "all" && (
          <div className="mb-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">⭐ Recommended</p>
            <div className="space-y-2.5">
              {featured.map((product, i) => (
                <FinCard key={product.id} product={product} index={i} applied={applied.has(product.id)} onOpen={() => setSelected(product)} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Products</p>
          <div className="space-y-2.5">
            {(category === "all" ? rest : filtered).map((product, i) => (
              <FinCard key={product.id} product={product} index={i} applied={applied.has(product.id)} onOpen={() => setSelected(product)} />
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <div className="px-5 pt-5 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-white">{selected.name}</h3>
                  <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>
                <div className={cn("flex items-center gap-3 p-4 rounded-2xl border bg-gradient-to-br mb-4", selected.color)}>
                  <span className="text-4xl">{selected.icon}</span>
                  <div>
                    <p className="text-[13px] font-black text-white">{selected.provider}</p>
                    {selected.verified && <div className="flex items-center gap-1 mt-0.5"><BadgeCheck className="w-3.5 h-3.5 text-cyan-400" /><span className="text-[9px] text-cyan-400">Verified Institution</span></div>}
                  </div>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{selected.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selected.rate && <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"><p className="text-[9px] text-zinc-600">Interest Rate</p><p className="text-[13px] font-black text-amber-400 mt-0.5">{selected.rate}</p></div>}
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"><p className="text-[9px] text-zinc-600">Users</p><p className="text-[13px] font-black text-amber-400 mt-0.5">{selected.users}</p></div>
                  {selected.minAmount && <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"><p className="text-[9px] text-zinc-600">Min Amount</p><p className="text-[13px] font-black text-white mt-0.5">৳{selected.minAmount.toLocaleString()}</p></div>}
                  {selected.maxAmount && <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"><p className="text-[9px] text-zinc-600">Max Amount</p><p className="text-[13px] font-black text-white mt-0.5">৳{(selected.maxAmount/100000).toFixed(1)}L</p></div>}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {selected.tags.map(t => <span key={t} className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400">{t}</span>)}
                </div>
                {applied.has(selected.id) ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Application Submitted
                  </div>
                ) : (
                  <button onClick={() => { setApplied(prev => new Set([...prev, selected.id])); toast.success("Application submitted!"); setSelected(null); }} className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" /> Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FinCard({ product, index, applied, onOpen, featured }: {
  product: FinProduct; index: number; applied: boolean; onOpen: () => void; featured?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={onOpen} className={cn("flex gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all", featured ? "border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent" : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10]")}>
      <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br", product.color)}>
        {product.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[12px] font-black text-white truncate">{product.name}</p>
          {product.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
        </div>
        <p className="text-[9px] text-zinc-500 mb-1">{product.provider}</p>
        <div className="flex items-center gap-2">
          {product.rate && <span className="text-[10px] font-black text-amber-400">{product.rate}</span>}
          <span className="text-[9px] text-zinc-500">· {product.benefit}</span>
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        <div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-[9px] text-zinc-400">{product.rating}</span></div>
        {applied && <Check className="w-4 h-4 text-emerald-400" />}
        <span className="text-[9px] text-zinc-600">{product.users}</span>
      </div>
    </motion.div>
  );
}
