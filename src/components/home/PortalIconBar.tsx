import { Link } from "wouter";
import {
  ShoppingBag, Warehouse, NavigationIcon, MonitorPlay, BadgePercent,
  Radio, PackageCheck, Wallet, Globe2, Truck, MessageSquarePlus, Zap,
} from "lucide-react";
import { useLanguage } from "@/features/language/LanguageContext";
import { cn } from "@/lib/utils";

type Portal = {
  id: string;
  labelKey: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  dot?: string;
  pulse?: boolean;
};

const PORTALS: Portal[] = [
  { id: "shop",      labelKey: "portal.marketplace", href: "/marketplace",            Icon: ShoppingBag,      gradient: "from-cyan-500 to-blue-600",       glow: "rgba(34,211,238,0.35)" },
  { id: "wholesale", labelKey: "portal.wholesale",   href: "/b2b",                    Icon: Warehouse,        gradient: "from-blue-600 to-indigo-700",     glow: "rgba(99,102,241,0.35)" },
  { id: "nearby",    labelKey: "portal.nearby",      href: "/local",                  Icon: NavigationIcon,   gradient: "from-emerald-500 to-teal-600",    glow: "rgba(16,185,129,0.35)",  dot: "bg-emerald-400" },
  { id: "video",     labelKey: "nav.videos",         href: "/video",                  Icon: MonitorPlay,      gradient: "from-purple-500 to-violet-700",   glow: "rgba(168,85,247,0.35)",  dot: "bg-rose-500" },
  { id: "deals",     labelKey: "nav.demands",        href: "/demand",                 Icon: MessageSquarePlus,gradient: "from-amber-500 to-orange-600",    glow: "rgba(245,158,11,0.35)" },
  { id: "flash",     labelKey: "nav.explore",        href: "/marketplace?sort=trending", Icon: Zap,           gradient: "from-yellow-400 to-amber-500",    glow: "rgba(234,179,8,0.35)",   dot: "bg-yellow-300", pulse: true },
  { id: "live",      labelKey: "portal.retail",      href: "/reels",                  Icon: Radio,            gradient: "from-rose-500 to-red-600",        glow: "rgba(239,68,68,0.35)",   dot: "bg-red-400", pulse: true },
  { id: "orders",    labelKey: "profile.orders",     href: "/orders",                 Icon: PackageCheck,     gradient: "from-sky-500 to-blue-600",        glow: "rgba(14,165,233,0.35)" },
  { id: "wallet",    labelKey: "nav.home",           href: "/wallet",                 Icon: Wallet,           gradient: "from-green-500 to-emerald-600",   glow: "rgba(34,197,94,0.35)" },
  { id: "export",    labelKey: "nav.global",         href: "/export",                 Icon: Globe2,           gradient: "from-teal-500 to-cyan-600",       glow: "rgba(20,184,166,0.35)" },
  { id: "logistics", labelKey: "nav.logistics",      href: "/logistics",              Icon: Truck,            gradient: "from-orange-500 to-amber-600",    glow: "rgba(249,115,22,0.35)" },
  { id: "deals2",    labelKey: "nav.categories",     href: "/marketplace?sort=discount", Icon: BadgePercent,  gradient: "from-pink-500 to-rose-600",       glow: "rgba(236,72,153,0.35)" },
];

const LABELS: Record<string, string> = {
  "portal.marketplace": "শপ",
  "portal.wholesale":   "পাইকারি",
  "portal.nearby":      "কাছের",
  "nav.videos":         "ভিডিও",
  "nav.demands":        "ডিমান্ড",
  "nav.explore":        "ফ্ল্যাশ",
  "portal.retail":      "লাইভ",
  "profile.orders":     "অর্ডার",
  "nav.home":           "ওয়ালেট",
  "nav.global":         "গ্লোবাল",
  "nav.logistics":      "লজিস্টিক",
  "nav.categories":     "ডিলস",
};

export function PortalIconBar() {
  const { lang } = useLanguage();

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-3 md:px-0 py-2.5">
      {PORTALS.map((p) => {
        const Icon = p.Icon;
        const label = lang === "bn" ? (LABELS[p.labelKey] ?? p.labelKey) : p.labelKey.split(".").pop() ?? p.id;
        return (
          <Link key={p.id} href={p.href}>
            <div className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group w-[52px]">
              {/* Icon tile */}
              <div
                className={cn(
                  "relative w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br flex items-center justify-center",
                  "group-hover:scale-110 group-active:scale-95 transition-all duration-200",
                  "shadow-lg",
                  p.gradient,
                )}
                style={{ boxShadow: `0 4px 14px ${p.glow}` }}
              >
                <Icon className="h-[22px] w-[22px] text-white drop-shadow-sm" />

                {/* Live / active dot */}
                {p.dot && (
                  <span className={cn("absolute top-1 right-1 h-2 w-2 rounded-full border border-white/40", p.dot)}>
                    {p.pulse && <span className={cn("absolute inset-0 rounded-full animate-ping opacity-75", p.dot)} />}
                  </span>
                )}

                {/* Gloss overlay */}
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>

              {/* Label */}
              <span className="text-[10px] text-foreground/55 group-hover:text-foreground/90 font-medium whitespace-nowrap transition-colors leading-tight">
                {label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
