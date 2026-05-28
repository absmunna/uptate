import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language/LanguageContext";
import { safeStorage } from "@/utils/storage";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BackButton, CloseButton } from "@/components/ui/PremiumButtons";
import {
  Search, X, ArrowLeft, Clock, TrendingUp, SlidersHorizontal,
  Star, MapPin, Store, Tag, ChevronRight, Mic, Barcode,
  CheckCircle2, Sparkles, Filter, Package,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ── safeStorage history ── */
const HIST_KEY = "pm.search.history.v1";
function getHistory(): string[] {
  try { return JSON.parse(safeStorage.getItem(HIST_KEY) || "[]"); } catch { return []; }
}
function pushHistory(q: string) {
  const h = [q, ...getHistory().filter((x) => x !== q)].slice(0, 10);
  safeStorage.setItem(HIST_KEY, JSON.stringify(h));
}
function clearHistory() { safeStorage.setItem(HIST_KEY, "[]"); }

/* ── debounce ── */
function useDebounce<T>(v: T, ms: number): T {
  const [dv, setDv] = React.useState(v);
  React.useEffect(() => {
    const t = setTimeout(() => setDv(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return dv;
}

/* ── types ── */
type Product = { id: string; title: string; price: number; compareAtPrice?: number; images: string[]; rating: number; location?: string; vendor?: { name: string }; category?: { name: string } };
type Vendor  = { id: string; slug: string; name: string; avatarUrl?: string; location?: string; rating: number; verified: boolean; tagline?: string };
type Category = { id: string; name: string; slug: string; icon: string; productCount: number };
type SearchResult = { query: string; products: Product[]; vendors: Vendor[]; categories: Category[]; tagSuggestions: string[]; trending: string[]; totalProducts: number; totalVendors: number; totalCategories: number };

const SORT_OPTS = [
  { v: "",           en: "Relevant",   bn: "প্রাসঙ্গিক" },
  { v: "newest",     en: "Newest",     bn: "নতুন" },
  { v: "price_asc",  en: "Price ↑",    bn: "দাম কম" },
  { v: "price_desc", en: "Price ↓",    bn: "দাম বেশি" },
  { v: "rating",     en: "Top rated",  bn: "সেরা রেটিং" },
];
type ResultTab = "all" | "products" | "vendors" | "categories";
const TABS: { v: ResultTab; en: string; bn: string }[] = [
  { v: "all",        en: "All",        bn: "সব" },
  { v: "products",   en: "Products",   bn: "পণ্য" },
  { v: "vendors",    en: "Shops",      bn: "দোকান" },
  { v: "categories", en: "Categories", bn: "ক্যাটাগরি" },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("q") || "";
  });
  const [sort, setSort]           = React.useState("");
  const [tab, setTab]             = React.useState<ResultTab>("all");
  const [minPrice, setMinPrice]   = React.useState("");
  const [maxPrice, setMaxPrice]   = React.useState("");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [history, setHistory]     = React.useState<string[]>(getHistory);
  const [results, setResults]     = React.useState<SearchResult | null>(null);
  const [loading, setLoading]     = React.useState(false);
  const [listening, setListening] = React.useState(false);

  const dQuery = useDebounce(query, 320);

  /* ── fetch search ── */
  React.useEffect(() => {
    const params = new URLSearchParams({ q: dQuery, type: tab === "all" ? "all" : tab, sort });
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    setLoading(true);
    fetch(`${BASE}/api/search?${params}`)
      .then((r) => r.json())
      .then((d: SearchResult) => { setResults(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [dQuery, sort, tab, minPrice, maxPrice]);

  /* ── focus input on mount ── */
  React.useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const commit = (q: string) => {
    if (!q.trim()) return;
    pushHistory(q);
    setHistory(getHistory());
    setQuery(q);
  };

  /* ── voice search ── */
  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = isBn ? "bn-BD" : "en-US";
    rec.onstart = () => setListening(true);
    rec.onend   = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      commit(text);
    };
    rec.start();
  };

  const hasQuery = query.trim().length > 0;
  const showSuggestions = !hasQuery;
  const trending  = results?.trending  ?? [];
  const tags      = results?.tagSuggestions ?? [];
  const products  = results?.products  ?? [];
  const vendors   = results?.vendors   ?? [];
  const cats      = results?.categories ?? [];

  const countBadge = (n: number) => n > 0 ? <span className="ml-1 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-bold">{n}</span> : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Sticky search header ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-[var(--pm-border)] px-3 py-2.5 flex items-center gap-2">
        <BackButton size="md" className="flex-shrink-0 border-[var(--pm-border)]" onBack={() => navigate("/")} />

        <div className="flex-1 relative">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors", hasQuery ? "text-primary" : "text-foreground/35")} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commit(query); }}
            placeholder={isBn ? "পণ্য, দোকান, ক্যাটাগরি খুঁজুন…" : "Search products, shops, categories…"}
            className="w-full bg-foreground/[0.07] border border-foreground/[0.09] focus:border-primary/50 rounded-full h-10 pl-9 pr-16 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:shadow-[0_0_0_3px_rgba(var(--primary),0.1)] transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {hasQuery && (
              <CloseButton size="sm" variant="ghost" className="h-6 w-6 rounded-full hover:bg-foreground/10" onClose={() => setQuery("")} />
            )}
            <button
              onClick={startVoice}
              className={cn("h-6 w-6 flex items-center justify-center rounded-full transition-all", listening ? "bg-rose-500 text-white animate-pulse" : "text-foreground/40 hover:text-foreground")}
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filter button */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn("flex-shrink-0 h-9 px-3 flex items-center gap-1.5 rounded-xl border transition-all text-sm font-medium",
            filtersOpen || minPrice || maxPrice || sort
              ? "bg-primary/15 border-primary/35 text-primary"
              : "bg-foreground/[0.06] border-foreground/[0.09] text-foreground/60 hover:text-foreground")}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isBn ? "ফিল্টার" : "Filter"}</span>
        </button>
      </div>

      {/* ── Filters panel ── */}
      {filtersOpen && (
        <div className="border-b border-border bg-card px-4 py-3 space-y-3">
          {/* Sort */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isBn ? "সাজান" : "Sort By"}</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTS.map((o) => (
                <button
                  key={o.v}
                  onClick={() => setSort(o.v)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    sort === o.v ? "bg-primary/15 border-primary/35 text-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/25 hover:text-foreground")}
                >
                  {isBn ? o.bn : o.en}
                </button>
              ))}
            </div>
          </div>
          {/* Price range */}
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isBn ? "দামের পরিসীমা (৳)" : "Price Range (৳)"}</p>
            <div className="flex items-center gap-2">
              <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder={isBn ? "সর্বনিম্ন" : "Min"} type="number" className="h-8 text-xs bg-background" />
              <span className="text-muted-foreground text-xs">—</span>
              <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder={isBn ? "সর্বোচ্চ" : "Max"} type="number" className="h-8 text-xs bg-background" />
              {(minPrice || maxPrice) && (
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="h-8 px-3 rounded-lg bg-foreground/8 text-xs text-foreground/60 hover:text-foreground transition-colors border border-border">
                  {isBn ? "মুছুন" : "Clear"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Result tabs ── */}
      {hasQuery && (
        <div className="flex items-center gap-4 px-4 pt-3 pb-0 overflow-x-auto no-scrollbar border-b border-border">
          {TABS.map((t) => {
            const count = t.v === "all" ? (results?.totalProducts ?? 0) + (results?.totalVendors ?? 0) :
                          t.v === "products" ? results?.totalProducts ?? 0 :
                          t.v === "vendors"  ? results?.totalVendors  ?? 0 :
                          results?.totalCategories ?? 0;
            return (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                className={cn("shrink-0 pb-2 pt-0.5 border-b-2 text-sm font-medium transition-all flex items-center whitespace-nowrap",
                  tab === t.v ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                {isBn ? t.bn : t.en}
                {countBadge(count)}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 px-4 py-4 space-y-5 pb-24">

        {/* ── Empty state: history + trending ── */}
        {showSuggestions && (
          <>
            {/* Search history */}
            {history.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">{isBn ? "সাম্প্রতিক সার্চ" : "Recent Searches"}</span>
                  </div>
                  <button onClick={() => { clearHistory(); setHistory([]); }} className="text-[11px] text-primary hover:text-primary/80 transition-colors">
                    {isBn ? "মুছুন" : "Clear all"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h) => (
                    <button
                      key={h}
                      onClick={() => setQuery(h)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border hover:border-primary/30 hover:bg-primary/5 text-sm text-foreground/70 transition-all"
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {h}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Trending */}
            {trending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{isBn ? "ট্রেন্ডিং সার্চ" : "Trending Searches"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {trending.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => { setQuery(t); commit(t); }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-muted to-muted/50 border border-border hover:border-primary/30 text-sm text-foreground/80 hover:text-foreground transition-all text-left"
                    >
                      <span className={cn("text-[10px] font-black w-4 shrink-0",
                        i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                      )}>#{i + 1}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* AI smart suggestions */}
            <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-600/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{isBn ? "AI স্মার্ট সাজেশন" : "AI Smart Suggestions"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { q: isBn ? "সেরা দামের ফোন" : "Best price phones",        icon: "📱" },
                  { q: isBn ? "পাইকারি কাপড়"  : "Wholesale fabric",         icon: "🧵" },
                  { q: isBn ? "ইলেকট্রনিক্স"   : "Electronics deals",        icon: "⚡" },
                  { q: isBn ? "তাজা খাবার"     : "Fresh groceries near me",  icon: "🥦" },
                ].map((s) => (
                  <button
                    key={s.q}
                    onClick={() => { setQuery(s.q); commit(s.q); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left text-foreground/70 hover:text-foreground"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="leading-tight">{s.q}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── Loading ── */}
        {hasQuery && loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Tag chips (while typing) ── */}
        {hasQuery && !loading && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => { setQuery(t); commit(t); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
              >
                <Tag className="h-3 w-3" />
                {t}
              </button>
            ))}
          </div>
        )}

        {/* ── Categories ── */}
        {hasQuery && !loading && (tab === "all" || tab === "categories") && cats.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isBn ? "ক্যাটাগরি" : "Categories"}</p>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <Link key={c.id} to={`/marketplace?categoryId=${c.id}`}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border hover:border-primary/40 text-sm text-foreground/80 hover:text-foreground transition-all cursor-pointer">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">({c.productCount})</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Vendors ── */}
        {hasQuery && !loading && (tab === "all" || tab === "vendors") && vendors.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isBn ? "দোকান" : "Shops"}</p>
            <div className="space-y-2">
              {vendors.slice(0, tab === "all" ? 3 : 20).map((v) => (
                <Link key={v.id} to={`/vendors/${v.slug ?? v.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/[0.03] transition-all cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center border border-border shrink-0 overflow-hidden">
                      {v.avatarUrl
                        ? <img src={v.avatarUrl} alt={v.name} className="h-full w-full object-cover" />
                        : <Store className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground truncate">{v.name}</span>
                        {v.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {v.location && <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{v.location}</span>}
                        <span className="text-[11px] text-amber-400 flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-current" />{v.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))}
              {tab === "all" && vendors.length > 3 && (
                <button onClick={() => setTab("vendors")} className="w-full py-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  {isBn ? `আরও ${vendors.length - 3}টি দোকান দেখুন` : `View ${vendors.length - 3} more shops`} →
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── Products ── */}
        {hasQuery && !loading && (tab === "all" || tab === "products") && products.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{isBn ? "পণ্য" : "Products"}</p>
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <Link key={p.id} to={`/marketplace/product/${p.id}`}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="h-32 bg-muted overflow-hidden relative">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>
                      }
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight mb-1">{p.title}</p>
                      <p className="text-sm font-bold text-primary">৳{p.price.toLocaleString()}</p>
                      {p.compareAtPrice && <p className="text-[10px] text-muted-foreground line-through">৳{p.compareAtPrice.toLocaleString()}</p>}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-2.5 w-2.5 text-amber-400 fill-current" />
                        <span className="text-[10px] text-muted-foreground">{p.rating?.toFixed(1)}</span>
                        {p.location && <span className="text-[10px] text-muted-foreground ml-auto truncate">{p.location}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── No results ── */}
        {hasQuery && !loading && results && products.length === 0 && vendors.length === 0 && cats.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground/50 mb-1">
              {isBn ? `"${query}" এর কোনো ফলাফল নেই` : `No results for "${query}"`}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {isBn ? "অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন" : "Try different keywords or browse categories"}
            </p>
            <Link to="/categories">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/20 transition-all cursor-pointer">
                <Filter className="h-3.5 w-3.5" />
                {isBn ? "সব ক্যাটাগরি দেখুন" : "Browse all categories"}
              </div>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
