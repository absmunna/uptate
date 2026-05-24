import { Link } from "wouter";
import { TrendingUp, Star, Zap, ArrowRight, MapPin, Store, Package } from "lucide-react";
import { useLanguage } from "@/features/language/LanguageContext";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { cn } from "@/lib/utils";
import * as React from "react";

const TRENDING = [
  { rank: 1, label: "গার্মেন্টস ফ্যাব্রিক",   href: "/marketplace?q=garments",   hot: true  },
  { rank: 2, label: "ইলেকট্রনিক্স পাইকারি",  href: "/marketplace?q=electronics",hot: false },
  { rank: 3, label: "প্লাস্টিক দানা",         href: "/marketplace?q=plastic",    hot: false },
  { rank: 4, label: "কৃষি সরঞ্জাম",          href: "/marketplace?q=agri",       hot: true  },
  { rank: 5, label: "পোশাক রিসেলার",          href: "/marketplace?q=clothing",   hot: false },
];

const TOP_SELLERS = [
  { name: "Dhaka Fabric House",   rating: 4.9, orders: 1240, avatar: "D" },
  { name: "BD Electronics Co.",   rating: 4.8, orders:  980, avatar: "B" },
  { name: "Agro Fresh Ltd",       rating: 4.7, orders:  750, avatar: "A" },
];

const QUICK_CATS = [
  { label: "পোশাক",   href: "/categories?c=clothing",  color: "from-rose-500/20 to-pink-500/10"      },
  { label: "ইলেকট্রনিক্স", href: "/categories?c=electronics", color: "from-blue-500/20 to-cyan-500/10" },
  { label: "খাদ্য",   href: "/categories?c=food",      color: "from-emerald-500/20 to-green-500/10"  },
  { label: "ফার্নিচার", href: "/categories?c=furniture",color: "from-amber-500/20 to-yellow-500/10"   },
  { label: "কৃষি",    href: "/categories?c=agri",      color: "from-lime-500/20 to-green-600/10"     },
  { label: "বিউটি",   href: "/categories?c=beauty",    color: "from-purple-500/20 to-violet-500/10"  },
];

export function DesktopRightPanel() {
  const { t } = useLanguage();

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[260px] shrink-0 sticky top-28 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pr-1 no-scrollbar">

      {/* Trending searches */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{t("home.trending")}</span>
        </div>
        <div className="flex flex-col gap-1">
          {TRENDING.map((item) => (
            <Link
              key={item.rank}
              href={item.href}
              className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="w-5 text-[11px] font-bold text-muted-foreground text-right">{item.rank}</span>
              <span className="flex-1 text-[13px] text-foreground/75 group-hover:text-foreground transition-colors truncate">
                {item.label}
              </span>
              {item.hot && <Zap className="h-3 w-3 text-amber-400 shrink-0" />}
            </Link>
          ))}
        </div>
        <Link href="/marketplace" className="flex items-center gap-1 mt-3 text-[12px] text-primary hover:text-primary/80 font-medium transition-colors">
          {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Top Sellers */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Store className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Top Sellers</span>
        </div>
        <div className="flex flex-col gap-3">
          {TOP_SELLERS.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-foreground truncate">{s.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] text-muted-foreground">{s.rating}</span>
                  <span className="text-[10px] text-muted-foreground/60">· {s.orders} orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/vendors" className="flex items-center gap-1 mt-3 text-[12px] text-primary hover:text-primary/80 font-medium transition-colors">
          সব বিক্রেতা <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Quick Categories */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{t("nav.categories")}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_CATS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center border border-border hover:border-primary/30 transition-all group bg-gradient-to-br",
                c.color,
              )}
            >
              <span className="text-[11px] font-semibold text-foreground/75 group-hover:text-foreground transition-colors leading-tight">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Nearby badge */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-blue-600/10 border border-primary/20 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Dhaka, BD</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">আপনার কাছের ১৮৪টি দোকান অনলাইনে আছে</p>
        <Link
          href="/local"
          className="block w-full text-center text-[12px] font-bold py-2 rounded-xl bg-primary/15 hover:bg-primary/25 text-primary border border-primary/25 transition-all"
        >
          কাছের দোকান দেখুন
        </Link>
      </div>

      {/* Theme & Language panel */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <ThemeSwitcher />
      </div>

    </aside>
  );
}
