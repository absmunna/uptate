import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useListProducts, getListProductsQueryKey,
  ListProductsType, ListProductsSort
} from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryChips } from "@/components/product/CategoryChips";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import {
  SlidersHorizontal, ArrowUpDown, Navigation, Search,
  Sparkles, Flame, TrendingUp, Star, Package, X, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_PILLS: { value: ListProductsType | "all"; label: string; emoji: string }[] = [
  { value: "all",       label: "All",        emoji: "🛍️" },
  { value: "retail",    label: "Retail",     emoji: "🏪" },
  { value: "wholesale", label: "Wholesale",  emoji: "📦" },
  { value: "dropship",  label: "Dropship",   emoji: "🚀" },
  { value: "grocery",   label: "Grocery",    emoji: "🥬" },
  { value: "service",   label: "Services",   emoji: "🔧" },
  { value: "hotel",     label: "Travel",     emoji: "✈️" },
];

const SORT_OPTS: { value: ListProductsSort; label: string; icon: React.ElementType }[] = [
  { value: "newest",     label: "Newest",     icon: Sparkles },
  { value: "trending",   label: "Trending",   icon: Flame },
  { value: "price_asc",  label: "Price ↑",    icon: TrendingUp },
  { value: "price_desc", label: "Price ↓",    icon: TrendingUp },
  { value: "rating",     label: "Top Rated",  icon: Star },
];

export default function Marketplace() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const q          = searchParams.get("q") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const type       = (searchParams.get("type") as ListProductsType) || undefined;
  const sort       = (searchParams.get("sort") as ListProductsSort) || undefined;
  const nearMe     = searchParams.get("nearMe") === "true";
  const activeSort = sort ?? "newest";

  const { data: products, isLoading } = useListProducts(
    { q, categoryId, type, sort, nearMe },
    { query: { queryKey: getListProductsQueryKey({ q, categoryId, type, sort, nearMe }) } }
  );

  const setParam = (key: string, value: string | null) => {
    const p = new URLSearchParams(location.search);
    if (value === null) p.delete(key); else p.set(key, value);
    navigate(`/marketplace?${p.toString()}`);
  };

  const hasFilters = !!(type || nearMe || sort || categoryId);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="marketplace" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="marketplace" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-[var(--pm-border)] p-5 bg-gradient-to-br from-[var(--pm-accent)]/15 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--pm-accent),transparent_60%)] opacity-[0.10]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/25 flex items-center justify-center text-xl">
              <ShoppingBag className="w-6 h-6 text-[var(--pm-accent)]" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">{q ? `"${q}"` : "PaikarMart Shop"}</h1>
              <p className="text-[11px] text-zinc-400">
                {products !== undefined ? `${products.length.toLocaleString()} products` : "Loading…"}
                {nearMe && " · Near you"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search bar if coming from search */}
        {q && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <span className="text-[12px] text-zinc-300 flex-1 truncate">"{q}"</span>
            <button onClick={() => navigate("/marketplace")} className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        )}

        {/* Category & Filters Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <CategoryChips activeId={categoryId} />
          </div>
          <button onClick={() => setShowFilters(s => !s)} className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-[11px] font-black transition-all shrink-0", showFilters || hasFilters ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)]" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            {hasFilters && <span className="w-3.5 h-3.5 rounded-full bg-[var(--pm-accent)] text-white text-[8px] flex items-center justify-center font-bold">!</span>}
          </button>
        </div>

        {/* Type Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
          {TYPE_PILLS.map(({ value, label, emoji }) => {
            const active = (value === "all" && !type) || value === type;
            return (
              <button key={value} onClick={() => setParam("type", value === "all" ? null : value)} className={cn("flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-2xl text-[11px] font-black border whitespace-nowrap transition-all", active ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)]" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
                <span className="text-sm">{emoji}</span> {label}
              </button>
            );
          })}
        </div>

        {/* Expanded Filter Panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sort By</p>
              {hasFilters && (
                <button onClick={() => navigate("/marketplace")} className="text-[10px] font-black text-[var(--pm-accent)]">Clear all</button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {SORT_OPTS.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setParam("sort", activeSort === value ? null : value)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black border transition-all", activeSort === value ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)]" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setParam("nearMe", nearMe ? null : "true")} className={cn("flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-black transition-all", nearMe ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
                <Navigation className="w-3.5 h-3.5" /> Near Me
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Header */}
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-3.5 h-3.5 text-zinc-600" />
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            {isLoading ? "Loading…" : `${(products || []).length.toLocaleString()} Products`}
          </p>
          {!isLoading && activeSort && (
            <span className="text-[9px] text-zinc-700">· Sorted by {SORT_OPTS.find(s => s.value === activeSort)?.label || activeSort}</span>
          )}
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
}
