import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, X, Star, Heart, ShoppingCart, Zap,
  TrendingUp, Sparkles, Store, Package, Tag,
  ShoppingBag, Layers, MapPin, Truck, Globe,
  BadgeCheck, MessageSquare, ChevronRight,
  SlidersHorizontal, ArrowRight
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════
   Types
═══════════════════════════════════════════════ */

type MarketplaceCategory = {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  border: string;
  count: number;
};

type MarketplaceProduct = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
  storeName: string;
  storeId: string;
  isVerified?: boolean;
  isTrending?: boolean;
  portal: string;
};

type MarketplaceStoreType = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  isVerified: boolean;
  type: string;
  productCount: number;
  location: string;
};

/* ═══════════════════════════════════════════════
   Data
═══════════════════════════════════════════════ */

const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: "all", icon: Sparkles, label: "All Items", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", count: 1240 },
  { id: "retail", icon: ShoppingBag, label: "Retail", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", count: 380 },
  { id: "b2b", icon: Layers, label: "B2B", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", count: 210 },
  { id: "nearby", icon: MapPin, label: "Nearby", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", count: 156 },
  { id: "services", icon: Zap, label: "Services", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", count: 98 },
  { id: "pk-shop", icon: Store, label: "PK Shop", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", count: 64 },
  { id: "transport", icon: Truck, label: "Transport", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", count: 42 },
  { id: "demand", icon: TrendingUp, label: "Demand", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", count: 85 },
  { id: "brands", icon: Tag, label: "Brands", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", count: 120 },
  { id: "export", icon: Globe, label: "Export", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", count: 35 },
];

const MOCK_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "1", title: "Premium Cotton Polo Shirt - Bulk Offer", price: 450, originalPrice: 650,
    rating: 4.8, reviewCount: 124, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "b2b", storeName: "RK Fabrics Ltd", storeId: "s1", isVerified: true, isTrending: true, portal: "B2B"
  },
  {
    id: "2", title: "Home Made Organic Honey - 500g", price: 650,
    rating: 4.9, reviewCount: 89, imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    category: "nearby", storeName: "Village Organics", storeId: "s2", portal: "Nearby"
  },
  {
    id: "3", title: "Smart Watch Pro Series 7 - Black", price: 2450, originalPrice: 3200,
    rating: 4.7, reviewCount: 342, imageUrl: "https://images.unsplash.com/photo-1546868889-4e0c68a27a8b?w=400",
    category: "retail", storeName: "Tech Hub", storeId: "s3", isVerified: true, isTrending: true, portal: "Retail"
  },
  {
    id: "4", title: "Luxury Travel Bag - Genuine Leather", price: 3800,
    rating: 4.6, reviewCount: 56, imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400",
    category: "retail", storeName: "Elite Leather", storeId: "s4", portal: "Retail"
  },
  {
    id: "5", title: "Smartphone Repair Service - Any Model", price: 999,
    rating: 4.5, reviewCount: 231, imageUrl: "https://images.unsplash.com/photo-1512428559083-a40ea90132c1?w=400",
    category: "services", storeName: "FixIt Now", storeId: "s5", portal: "Services"
  },
  {
    id: "6", title: "Traditional Nakshikatha - Hand Stitched", price: 5500,
    rating: 5.0, reviewCount: 12, imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    category: "pk-shop", storeName: "Heritage Crafts", storeId: "s6", isVerified: true, isTrending: true, portal: "PK Shop"
  },
];

const MOCK_STORES: MarketplaceStoreType[] = [
  { id: "s1", name: "RK Fabrics Ltd", logo: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100", rating: 4.8, isVerified: true, type: "Factory", productCount: 342, location: "Narayanganj" },
  { id: "s2", name: "Village Organics", logo: "https://images.unsplash.com/photo-1506485338023-6ce5f36692df?w=100", rating: 4.9, isVerified: false, type: "Retail", productCount: 56, location: "Mymensingh" },
  { id: "s3", name: "Tech Hub", logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100", rating: 4.7, isVerified: true, type: "Brand", productCount: 128, location: "Dhaka" },
];

/* ═══════════════════════════════════════════════
   Product Card
═══════════════════════════════════════════════ */

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[var(--pm-surface)]/40 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer group"
    >
      {/* Trending Badge */}
      {product.isTrending && (
        <div className="absolute top-0 right-0 z-10">
          <div className="px-3 py-1 bg-orange-500 rounded-bl-2xl rounded-tr-3xl text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" /> Trending
          </div>
        </div>
      )}

      {/* Image */}
      <div
        className="aspect-square relative overflow-hidden bg-zinc-900"
        onClick={() => navigate(`/marketplace/product/${product.id}`)}
      >
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Portal Badge on Image */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white">
          {product.portal}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10"
        >
          <Heart className={cn("w-3.5 h-3.5", liked ? "text-red-500 fill-red-500" : "text-white")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] font-bold text-cyan-400 truncate">{product.storeName}</span>
          {product.isVerified && (
            <BadgeCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          )}
        </div>

        <h3 className="text-[11px] font-black text-white line-clamp-2 min-h-[30px] leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black text-white">{product.rating}</span>
          <span className="text-[9px] text-zinc-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-base font-black text-white">৳{product.price}</span>
            {product.originalPrice && (
              <span className="ml-1.5 text-[10px] text-zinc-500 line-through">৳{product.originalPrice}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center shrink-0 transition-all shadow-[0_4px_12px_rgba(34,211,238,0.3)]"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-black" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Store Card
═══════════════════════════════════════════════ */

function StoreCard({ store }: { store: MarketplaceStoreType }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="shrink-0 w-[200px] p-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-400/20 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {store.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--pm-bg)] flex items-center justify-center">
              <BadgeCheck className="w-2 h-2 text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-[11px] font-black text-white truncate">{store.name}</h4>
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-[9px] font-bold text-white">{store.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{store.type} · {store.productCount} items</span>
        <span className="text-[8px] text-zinc-600">{store.location}</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Skeleton
═══════════════════════════════════════════════ */

const SkeletonCard = () => (
  <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden animate-pulse">
    <div className="aspect-square skeleton-shimmer" />
    <div className="p-3 space-y-2">
      <div className="h-2 w-1/3 rounded-full skeleton-shimmer" />
      <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
      <div className="h-2.5 w-1/2 rounded-full skeleton-shimmer" />
      <div className="h-8 w-full rounded-xl skeleton-shimmer" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════ */

export const MarketplaceHome = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, [activeCategory]);

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-[480px] md:max-w-4xl lg:max-w-6xl mx-auto px-4 pb-28 text-[var(--pm-text)] flex flex-col pt-16">

      {/* Story Bar */}
      <section className="pt-2">
        <StoryBar context="marketplace" />
      </section>

      {/* Portal Icon Bar */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/50 -mx-4 px-4 mt-2">
        <PortalIconBar context="marketplace" />
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 relative overflow-hidden rounded-3xl border border-cyan-500/20 p-5 bg-gradient-to-br from-cyan-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[9px] font-black text-cyan-400 uppercase tracking-widest">Marketplace</span>
            </div>
            <h1 className="text-lg font-black text-white leading-tight">Explore the Best Deals</h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">1,240+ products from verified sellers across all portals</p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: Store, label: "500+ Sellers", color: "text-emerald-400" },
            { icon: TrendingUp, label: "Daily Deals", color: "text-amber-400" },
            { icon: Truck, label: "Fast Delivery", color: "text-blue-400" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <Icon className={cn("w-4 h-4", color)} />
              <span className="text-[9px] font-black text-zinc-400 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-cyan-400/50 transition-all">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search products, suppliers, stores..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {MARKETPLACE_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-[10px] font-black transition-all",
                isActive
                  ? `${cat.bg} ${cat.border} ${cat.color} shadow-md`
                  : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
              <span className={cn("text-[8px] px-1 rounded-full", isActive ? "bg-white/20" : "bg-white/5")}>{cat.count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Featured Stores (horizontal scroll) */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            Featured Suppliers
          </h2>
          <button className="text-[10px] font-black text-cyan-400 flex items-center gap-1 hover:text-white transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {MOCK_STORES.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
          {filtered.length} {activeCategory === "all" ? "All" : MARKETPLACE_CATEGORIES.find(c => c.id === activeCategory)?.label} Products
        </h2>
        <select className="bg-transparent text-[10px] font-black text-zinc-500 outline-none uppercase tracking-widest cursor-pointer">
          <option>Sort: Trending</option>
          <option>Sort: Newest</option>
          <option>Sort: Price Low</option>
          <option>Sort: Price High</option>
          <option>Sort: Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-sm font-black text-zinc-500">No products found</p>
              <p className="text-[11px] text-zinc-600">Try a different category or search term</p>
              <button
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                className="mt-1 px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-[11px] font-black text-cyan-400"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
