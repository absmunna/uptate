import * as React from "react";
import { Link } from "wouter";
import {
  ShoppingBag, Warehouse, NavigationIcon, MonitorPlay, BadgePercent,
  Radio, PackageCheck, Wallet, Globe2, Truck, MessageSquarePlus, Zap,
  LayoutDashboard, ShieldCheck, Eye, EyeOff, ChevronRight, Loader2,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { useLocation } from "@/features/location/LocationContext";
import { useListCategories, getListCategoriesQueryKey, useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

/* ── Portal app definitions (trimmed to 12 essential) ── */
type PortalApp = {
  id: string;
  label: string;
  labelBn: string;
  sublabel: string;
  sublabelBn: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  badge?: string;
  badgePulse?: boolean;
};

const CORE_APPS: PortalApp[] = [
  {
    id: "marketplace", label: "Marketplace",  labelBn: "মার্কেটপ্লেস",
    sublabel: "All Products", sublabelBn: "সব পণ্য",
    href: "/marketplace",
    Icon: ShoppingBag,
    gradient: "from-cyan-500 to-blue-600",  glow: "rgba(34,211,238,0.4)",
  },
  {
    id: "wholesale", label: "Wholesale",  labelBn: "পাইকারি",
    sublabel: "Bulk Orders", sublabelBn: "বাল্ক অর্ডার",
    href: "/b2b",
    Icon: Warehouse,
    gradient: "from-blue-600 to-indigo-700", glow: "rgba(99,102,241,0.4)",
  },
  {
    id: "nearby", label: "Nearby",  labelBn: "কাছের দোকান",
    sublabel: "Local Shops", sublabelBn: "আশেপাশের দোকান",
    href: "/local",
    Icon: NavigationIcon,
    gradient: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.4)",
  },
  {
    id: "digital", label: "Digital",  labelBn: "ডিজিটাল",
    sublabel: "Video & Courses", sublabelBn: "কোর্স ও ভিডিও",
    href: "/video",
    Icon: MonitorPlay,
    gradient: "from-purple-500 to-violet-700", glow: "rgba(168,85,247,0.4)",
  },
  {
    id: "deals", label: "Deals",  labelBn: "ডিলস",
    sublabel: "Best Discounts", sublabelBn: "সেরা ছাড়",
    href: "/marketplace?sort=discount",
    Icon: BadgePercent,
    gradient: "from-rose-500 to-pink-600", glow: "rgba(244,63,94,0.4)",
    badge: "HOT",
  },
  {
    id: "flash", label: "Flash Sale",  labelBn: "ফ্ল্যাশ সেল",
    sublabel: "Limited Time", sublabelBn: "সীমিত সময়",
    href: "/marketplace?sort=trending",
    Icon: Zap,
    gradient: "from-yellow-400 to-amber-500", glow: "rgba(234,179,8,0.4)",
    badge: "⚡",
  },
  {
    id: "live", label: "Live",  labelBn: "লাইভ শপিং",
    sublabel: "Watch & Buy", sublabelBn: "দেখুন ও কিনুন",
    href: "/reels",
    Icon: Radio,
    gradient: "from-red-500 to-rose-600", glow: "rgba(239,68,68,0.4)",
    badge: "LIVE", badgePulse: true,
  },
  {
    id: "orders", label: "Orders",  labelBn: "অর্ডার",
    sublabel: "Track Orders", sublabelBn: "অর্ডার ট্র্যাক",
    href: "/orders",
    Icon: PackageCheck,
    gradient: "from-sky-500 to-blue-600", glow: "rgba(14,165,233,0.4)",
  },
  {
    id: "wallet", label: "Wallet",  labelBn: "ওয়ালেট",
    sublabel: "PK Coin & Pay", sublabelBn: "পেমেন্ট ও কয়েন",
    href: "/wallet",
    Icon: Wallet,
    gradient: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.4)",
  },
  {
    id: "export", label: "Global",  labelBn: "গ্লোবাল",
    sublabel: "Export Market", sublabelBn: "এক্সপোর্ট মার্কেট",
    href: "/export",
    Icon: Globe2,
    gradient: "from-teal-500 to-cyan-600", glow: "rgba(20,184,166,0.4)",
  },
  {
    id: "logistics", label: "Logistics",  labelBn: "লজিস্টিক",
    sublabel: "Delivery & Freight", sublabelBn: "ডেলিভারি",
    href: "/logistics",
    Icon: Truck,
    gradient: "from-orange-500 to-amber-600", glow: "rgba(249,115,22,0.4)",
  },
  {
    id: "demand", label: "Demands",  labelBn: "ডিমান্ড",
    sublabel: "Post a Request", sublabelBn: "চাহিদা পোস্ট করুন",
    href: "/demand",
    Icon: MessageSquarePlus,
    gradient: "from-violet-500 to-purple-700", glow: "rgba(139,92,246,0.4)",
  },
];

const SELLER_APP: PortalApp = {
  id: "seller", label: "Seller Hub",  labelBn: "সেলার হাব",
  sublabel: "Dashboard", sublabelBn: "ড্যাশবোর্ড",
  href: "/seller",
  Icon: LayoutDashboard,
  gradient: "from-fuchsia-500 to-pink-600", glow: "rgba(217,70,239,0.4)",
};
const ADMIN_APP: PortalApp = {
  id: "admin", label: "Admin",  labelBn: "অ্যাডমিন",
  sublabel: "Control Panel", sublabelBn: "কন্ট্রোল প্যানেল",
  href: "/admin",
  Icon: ShieldCheck,
  gradient: "from-slate-500 to-slate-700", glow: "rgba(100,116,139,0.4)",
};

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  Fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80",
  "Home & Living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  Beauty: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80",
  Sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
  Food: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
};
const CAT_FALLBACK = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80";
const CAT_GRADIENTS = [
  "from-purple-900/90 to-purple-800/60",
  "from-blue-900/90 to-blue-800/60",
  "from-teal-900/90 to-teal-800/60",
  "from-rose-900/90 to-rose-800/60",
  "from-amber-900/90 to-amber-800/60",
  "from-indigo-900/90 to-indigo-800/60",
];

function AppTile({ app, isBn }: { app: PortalApp; isBn: boolean }) {
  const Icon = app.Icon;
  return (
    <Link href={app.href}>
      <div className="flex flex-col items-center gap-2 cursor-pointer group">
        <div
          className={cn(
            "relative w-full aspect-square rounded-[18px] bg-gradient-to-br flex items-center justify-center",
            "group-hover:scale-105 group-active:scale-95 transition-all duration-200 shadow-xl",
            app.gradient,
          )}
          style={{ boxShadow: `0 6px 20px ${app.glow}` }}
        >
          <Icon className="h-7 w-7 text-white drop-shadow" />

          {/* Gloss */}
          <div className="absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

          {/* Badge */}
          {app.badge && (
            <span className={cn(
              "absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full",
              "bg-rose-500 text-white text-[8px] font-extrabold flex items-center justify-center",
              "border border-white/30 shadow-lg",
            )}>
              {app.badgePulse && <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60" />}
              <span className="relative z-10">{app.badge}</span>
            </span>
          )}
        </div>

        <div className="text-center">
          <span className="text-[11px] text-foreground/70 font-semibold group-hover:text-foreground transition-colors leading-tight block">
            {isBn ? app.labelBn : app.label}
          </span>
          <span className="text-[9px] text-foreground/35 leading-tight block mt-0.5">
            {isBn ? app.sublabelBn : app.sublabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Portals() {
  const { user, isAuthenticated, role } = useAuth();
  const { lang } = useLanguage();
  const { displayName, isDetecting, detect } = useLocation();
  const isBn = lang === "bn";
  const [balanceVisible, setBalanceVisible] = React.useState(true);

  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const { data: products } = useListProducts({ sort: "newest" } as any, { query: { queryKey: getListProductsQueryKey({ sort: "newest" } as any) } });

  const isSeller = role === "seller" || role === "factory";
  const isAdmin  = role === "admin";
  const apps = [
    ...CORE_APPS,
    ...(isSeller ? [SELLER_APP] : []),
    ...(isAdmin  ? [ADMIN_APP]  : []),
  ];

  const cats = (categories ?? []).slice(0, 6);
  const recs = (products  ?? []).slice(0, 6);

  const walletBalance = "12,458.75";

  return (
    <div className="flex flex-col gap-0 pb-10 max-w-[520px] mx-auto w-full">

      {/* ━━ WELCOME CARD ━━ */}
      <section className="px-3 md:px-0 pt-3">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Top bar with gradient */}
          <div className="h-[56px] bg-gradient-to-r from-primary/30 via-primary/10 to-transparent relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
          </div>

          <div className="px-4 pb-4 -mt-4">
            {/* Name + location */}
            <div className="flex items-end justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {isBn ? "স্বাগতম 👋" : "Welcome back 👋"}
                </p>
                <h2 className="text-[18px] font-black text-foreground mt-0.5 truncate">
                  {isAuthenticated ? (user?.fullName ?? "User") : (isBn ? "গেস্ট ইউজার" : "Guest User")}
                </h2>
                <button
                  onClick={detect}
                  className="flex items-center gap-1 mt-1 group"
                  title="Re-detect location"
                >
                  {isDetecting
                    ? <Loader2 className="h-3 w-3 text-primary animate-spin" />
                    : <Navigation className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
                  }
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                    {displayName}
                  </span>
                </button>
              </div>
              {/* Wallet mini card */}
              <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 px-3 py-2.5 flex items-center gap-2 shrink-0">
                <Wallet className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wide">Wallet</p>
                  <p className="text-[14px] font-black text-foreground leading-tight">
                    {balanceVisible ? `৳${walletBalance}` : "৳••••"}
                  </p>
                </div>
                <button
                  onClick={() => setBalanceVisible((v) => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  {balanceVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ APP GRID ━━ */}
      <section className="px-3 md:px-0 pt-4">
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          {apps.map((app) => (
            <AppTile key={app.id} app={app} isBn={isBn} />
          ))}
        </div>
      </section>

      {/* ━━ FEATURED CATEGORIES ━━ */}
      {cats.length > 0 && (
        <section className="px-3 md:px-0 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-foreground">
              {isBn ? "ক্যাটাগরি" : "Categories"}
            </h3>
            <Link href="/categories">
              <span className="text-[12px] text-primary font-medium flex items-center gap-0.5 hover:text-primary/80">
                {isBn ? "সব দেখুন" : "View All"} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {cats.map((cat, i) => {
              const img = CATEGORY_IMAGES[cat.name] ?? CAT_FALLBACK;
              return (
                <Link key={cat.id} href="/categories">
                  <div className="shrink-0 w-[105px] cursor-pointer group">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                      <img src={img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]}`} />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] font-bold text-white truncate">{cat.name}</p>
                        <p className="text-[8px] text-white/55 mt-0.5">{(1000 + i * 234).toLocaleString()} পণ্য</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━ RECOMMENDED ━━ */}
      {recs.length > 0 && (
        <section className="px-3 md:px-0 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-foreground">
              {isBn ? "আপনার জন্য" : "Recommended"}
            </h3>
            <Link href="/marketplace">
              <span className="text-[12px] text-primary font-medium flex items-center gap-0.5 hover:text-primary/80">
                {isBn ? "সব দেখুন" : "View All"} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recs.map((p) => (
              <Link key={p.id} href={`/marketplace/product/${p.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      : <div className="w-full h-full skeleton-shimmer" />
                    }
                    {((p as any).discount ?? 0) > 0 && (
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-lg bg-rose-500 text-white">-{(p as any).discount}%</span>
                    )}
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-[12px] text-foreground/85 font-medium truncate">{p.title}</p>
                    <span className="text-[13px] font-bold text-primary">৳{Number(p.price ?? 0).toFixed(0)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
