import { Link } from "react-router-dom";
import {
  ShoppingBag, Warehouse, NavigationIcon, MonitorPlay, BadgePercent,
  Radio, PackageCheck, Wallet, Globe2, Truck, MessageSquarePlus, Zap,
  Wrench, Car, Store, Sparkles, Bike, Package, Laptop, Code, Palette, Search as SearchIcon, PlayCircle, Building2, Plane, FileText,
  Shirt, Layers, FlaskConical, Settings
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
  { id: "wholesale", labelKey: "portal.wholesale",   href: "/b2b",                    Icon: Warehouse,        gradient: "", glow: "" },
  { id: "retail",    labelKey: "portal.retail",      href: "/b2c",                    Icon: ShoppingBag,      gradient: "", glow: "" },
  { id: "services",  labelKey: "portal.services",    href: "/services",               Icon: Wrench,           gradient: "", glow: "" },
  { id: "nearby",    labelKey: "portal.nearby",      href: "/local",                  Icon: NavigationIcon,   gradient: "", glow: "", dot: "bg-emerald-400" },
  { id: "transport", labelKey: "portal.transport",   href: "/transport",              Icon: Car,              gradient: "", glow: "", dot: "bg-blue-400" },
  { id: "travel",    labelKey: "portal.travel",      href: "/travel",                 Icon: Building2,        gradient: "", glow: "", dot: "bg-cyan-400" },
  { id: "digital_srv", labelKey: "portal.digital_srv", href: "/digital-services",       Icon: Laptop,           gradient: "", glow: "", dot: "bg-rose-400" },
  
  // Additional dynamic portals
  { id: "demands",   labelKey: "nav.demands",        href: "/demand",                 Icon: MessageSquarePlus,gradient: "", glow: "" },
  { id: "videos",    labelKey: "nav.videos",         href: "/video",                  Icon: MonitorPlay,      gradient: "", glow: "", dot: "bg-rose-500" },
  { id: "global",    labelKey: "nav.global",         href: "/export",                 Icon: Globe2,           gradient: "", glow: "" },
];

const LABELS: Record<string, string> = {
  "portal.wholesale":   "হোলসেল",
  "portal.retail":      "রিটেইল",
  "portal.services":    "সার্ভিসেস",
  "portal.nearby":      "কাছের শপ",
  "portal.transport":   "ট্রান্সপোর্ট",
  "portal.travel":      "ট্রাভেল/বুকিং",
  "portal.digital_srv": "ডিজিটাল সার্ভিস",
  "nav.videos":         "ভিডিও",
  "nav.demands":        "ডিমান্ড",
  "nav.explore":        "ফ্ল্যাশ",
  "profile.orders":     "অর্ডার",
  "nav.home":           "ওয়ালেট",
  "nav.global":         "গ্লোবাল",
  "nav.logistics":      "লজিস্টিক",
  "nav.categories":     "ডিলস",
};

const RETAIL_PORTALS: Portal[] = [
  { id: "all",    labelKey: "সব পণ্য",        href: "/b2c",                 Icon: ShoppingBag,      gradient: "", glow: "" },
  { id: "fashion",labelKey: "ফ্যাশন",         href: "/b2c?cat=fashion",     Icon: Store,            gradient: "", glow: "" },
  { id: "tech",   labelKey: "ইলেকট্রনিক্স",  href: "/b2c?cat=tech",        Icon: MonitorPlay,      gradient: "", glow: "" },
  { id: "grocery",labelKey: "গ্রোসারি",       href: "/b2c?cat=grocery",     Icon: ShoppingBag,      gradient: "", glow: "" },
  { id: "beauty", labelKey: "হেলথ স্পা",      href: "/b2c?cat=beauty",      Icon: Sparkles,         gradient: "", glow: "" },
  { id: "home",   labelKey: "হোম ডেকোর",      href: "/b2c?cat=home",        Icon: Warehouse,        gradient: "", glow: "" },
];

const B2B_PORTALS: Portal[] = [
  { id: "b2b_all",       labelKey: "সব আইটেম",     href: "/b2b",                 Icon: Warehouse,      gradient: "", glow: "" },
  { id: "b2b_rmg",       labelKey: "গার্মেন্টস",    href: "/b2b?cat=rmg",         Icon: Shirt,          gradient: "", glow: "" },
  { id: "b2b_yarn",      labelKey: "সুতা-ফেব্রিক্স", href: "/b2b?cat=yarn",        Icon: Layers,         gradient: "", glow: "" },
  { id: "b2b_agro",      labelKey: "এগ্রো ও ফুড",   href: "/b2b?cat=agro",        Icon: Store,          gradient: "", glow: "" },
  { id: "b2b_tech",      labelKey: "ইলেকট্রনিক্স", href: "/b2b?cat=tech",        Icon: MonitorPlay,    gradient: "", glow: "" },
  { id: "b2b_chemical",  labelKey: "কেমিক্যাল",    href: "/b2b?cat=chemical",    Icon: FlaskConical,   gradient: "", glow: "" },
  { id: "b2b_package",   labelKey: "প্যাকিং লট",    href: "/b2b?cat=package",     Icon: Package,        gradient: "", glow: "" },
  { id: "b2b_machinery", labelKey: "মেশিনারি",     href: "/b2b?cat=machinery",   Icon: Settings,       gradient: "", glow: "" },
  { id: "b2b_auto",      labelKey: "অটো পার্টস",    href: "/b2b?cat=auto",        Icon: Car,            gradient: "", glow: "" },
  { id: "b2b_factory",   labelKey: "ফ্যাক্টরি",      href: "/b2b?cat=factory",     Icon: Truck,          gradient: "", glow: "" },
];

const LOCAL_PORTALS: Portal[] = [
  { id: "loc_all",       labelKey: "সব শপ",        href: "/local",               Icon: NavigationIcon, gradient: "", glow: "" },
  { id: "loc_homemade",  labelKey: "হোম মেইড",     href: "/local?cat=homemade",  Icon: Store,          gradient: "", glow: "" },
  { id: "loc_pharmacy",  labelKey: "ফার্মেসি",      href: "/local?cat=pharmacy",  Icon: Sparkles,       gradient: "", glow: "" },
  { id: "loc_food",      labelKey: "রেস্টুরেন্ট",    href: "/local?cat=food",      Icon: ShoppingBag,    gradient: "", glow: "" },
  { id: "loc_hotel",     labelKey: "হোটেল",        href: "/local?cat=hotel",     Icon: Warehouse,      gradient: "", glow: "" },
  { id: "loc_services",  labelKey: "সার্ভিসেস",     href: "/local?cat=services",  Icon: Wrench,         gradient: "", glow: "" },
];

const SERVICES_PORTALS: Portal[] = [
  { id: "srv_all",       labelKey: "সব সার্ভিস",   href: "/services",            Icon: Wrench,         gradient: "", glow: "" },
  { id: "srv_home",      labelKey: "ক্লিনিং",        href: "/services?cat=home",   Icon: Sparkles,       gradient: "", glow: "" },
  { id: "srv_fix",       labelKey: "ইলেকট্রিক",      href: "/services?cat=fix",    Icon: Zap,            gradient: "", glow: "" },
  { id: "srv_plumbing",  labelKey: "প্লাম্বিং",       href: "/services?cat=plumbing",Icon: Warehouse,      gradient: "", glow: "" },
];

const TRANSPORT_PORTALS: Portal[] = [
  { id: "tr_bike",      labelKey: "বাইক",        href: "/transport?cat=bike",      Icon: Bike,           gradient: "", glow: "" },
  { id: "tr_car",       labelKey: "কার",         href: "/transport?cat=car",       Icon: Car,            gradient: "", glow: "" },
  { id: "tr_intercity", labelKey: "আন্তঃশহর",      href: "/transport?cat=intercity", Icon: Globe2,         gradient: "", glow: "" },
  { id: "tr_parcel",    labelKey: "পার্সেল",        href: "/transport?cat=parcel",    Icon: Package,        gradient: "", glow: "" },
  { id: "tr_truck",     labelKey: "ট্রাক/পিকআপ",   href: "/transport?cat=truck",     Icon: Truck,          gradient: "", glow: "" },
  { id: "tr_ambulance", labelKey: "অ্যাম্বুলেন্স",  href: "/transport?cat=ambulance", Icon: Sparkles,      gradient: "", glow: "" },
];

const DIGITAL_SRV_PORTALS: Portal[] = [
  { id: "ds_ebook",     labelKey: "ই-বুক",        href: "/digital-services?cat=ebook",   Icon: FileText,       gradient: "", glow: "" },
  { id: "ds_design",    labelKey: "ডিজাইন",       href: "/digital-services?cat=design",  Icon: Palette,        gradient: "", glow: "" },
  { id: "ds_dev",       labelKey: "ডেভেলপমেন্ট",  href: "/digital-services?cat=dev",     Icon: Code,           gradient: "", glow: "" },
  { id: "ds_seo",       labelKey: "এসইও",         href: "/digital-services?cat=seo",     Icon: SearchIcon,     gradient: "", glow: "" },
  { id: "ds_creator",   labelKey: "ক্রিয়েটরস",     href: "/digital-services?cat=creator", Icon: PlayCircle,     gradient: "", glow: "" },
];

const TRAVEL_PORTALS: Portal[] = [
  { id: "trv_hotel",    labelKey: "হোটেল",        href: "/travel?cat=hotel",     Icon: Building2,      gradient: "", glow: "" },
  { id: "trv_flight",   labelKey: "ফ্লাইটস",      href: "/travel?cat=flight",    Icon: Plane,          gradient: "", glow: "" },
  { id: "trv_package",  labelKey: "প্যাকেজ",       href: "/travel?cat=package",   Icon: Sparkles,       gradient: "", glow: "" },
];

export type PortalIconBarProps = {
  context?: string;
};

export function PortalIconBar({ context = 'feed' }: PortalIconBarProps) {
  const { lang } = useLanguage();
  const portals = context === 'retail' ? RETAIL_PORTALS 
                : context === 'wholesale' ? B2B_PORTALS
                : context === 'local' ? LOCAL_PORTALS
                : context === 'services' ? SERVICES_PORTALS
                : context === 'transport' ? TRANSPORT_PORTALS
                : context === 'digital-services' ? DIGITAL_SRV_PORTALS
                : context === 'travel' ? TRAVEL_PORTALS
                : PORTALS;

  return (
    <div className="flex gap-2 bg-inherit overflow-x-auto no-scrollbar py-0.5 justify-start">
      {portals.map((p) => {
        const Icon = p.Icon;
        const label = lang === "bn" ? (LABELS[p.labelKey] ?? p.labelKey) : p.labelKey.split(".").pop() ?? p.id;
        return (
          <Link key={p.id} to={p.href} className="no-underline">
            <div className="shrink-0 flex flex-col items-center gap-1 cursor-pointer group w-[54px] select-none text-center">
              {/* Ultra-compact sleek outline circle badge */}
              <div
                className={cn(
                  "relative w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center",
                  "group-hover:scale-105 group-hover:bg-white/[0.08] group-hover:border-white/20 active:scale-95 transition-all duration-200"
                )}
              >
                <Icon className="h-4.5 w-4.5 text-white/50 group-hover:text-white transition-colors" />

                {/* Live / active dot */}
                {p.dot && (
                  <span className={cn("absolute top-0 right-0 h-1.5 w-1.5 rounded-full", p.dot)} />
                )}
              </div>

              {/* Minimal label underneath */}
              <span className="text-[9px] text-white/40 group-hover:text-white/85 font-medium whitespace-nowrap transition-colors leading-tight truncate max-w-full">
                {label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
