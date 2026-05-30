import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  Home, ShoppingBag, MapPin, Grid3X3, Store, PlaySquare,
  FileText, Wallet, Briefcase, Building2,
  MessageSquare, Crown, Truck, Globe, Pill, ShoppingBasket, Utensils, Hotel,
  Building, GraduationCap, Heart, Leaf, DollarSign, Calendar, Car,
  Cpu, Shirt, Signal, Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PORTALS = [
  { href: "/",            icon: Home,          label: "Feed",       color: "from-violet-500 to-purple-600", exact: true },
  { href: "/marketplace", icon: ShoppingBag,   label: "Shop",       color: "from-cyan-500 to-blue-600" },
  { href: "/local",       icon: MapPin,        label: "Nearby",     color: "from-emerald-500 to-teal-600" },
  { href: "/retail",      icon: Store,         label: "Retail",     color: "from-pink-500 to-rose-600" },
  { href: "/b2b",         icon: Building2,     label: "B2B",        color: "from-blue-500 to-indigo-600" },
  { href: "/services",    icon: Wrench,        label: "Services",   color: "from-amber-500 to-orange-600" },
  { href: "/vendors",     icon: Store,         label: "Vendors",    color: "from-lime-500 to-green-600" },
  { href: "/categories",  icon: Grid3X3,       label: "Categories", color: "from-zinc-500 to-slate-600" },
  { href: "/reels",       icon: PlaySquare,    label: "Reels",      color: "from-red-500 to-rose-600" },
  { href: "/demand",      icon: FileText,      label: "Demands",    color: "from-violet-500 to-purple-600" },
  { href: "/messages",    icon: MessageSquare, label: "Messages",   color: "from-sky-500 to-blue-600" },
  { href: "/wallet",      icon: Wallet,        label: "Wallet",     color: "from-yellow-500 to-amber-600" },
  { href: "/pk-store",    icon: Crown,         label: "PK Store",   color: "from-yellow-400 to-orange-500" },
  { href: "/logistics",   icon: Truck,         label: "Logistics",  color: "from-orange-500 to-amber-600" },
  { href: "/export",      icon: Globe,         label: "Export",     color: "from-blue-500 to-cyan-600" },
  { href: "/pharmacy",    icon: Pill,          label: "Pharmacy",   color: "from-green-500 to-emerald-600" },
  { href: "/grocery",     icon: ShoppingBasket,label: "Grocery",    color: "from-lime-500 to-green-600" },
  { href: "/food",        icon: Utensils,      label: "Food",       color: "from-orange-500 to-red-600" },
  { href: "/hotel",       icon: Hotel,         label: "Hotels",     color: "from-purple-500 to-violet-600" },
  { href: "/ride",        icon: Car,           label: "Ride",       color: "from-cyan-500 to-sky-600" },
  { href: "/real-estate", icon: Building,      label: "Property",   color: "from-indigo-500 to-blue-600" },
  { href: "/jobs",        icon: Briefcase,     label: "Jobs",       color: "from-teal-500 to-cyan-600" },
  { href: "/education",   icon: GraduationCap, label: "Learn",      color: "from-indigo-500 to-violet-600" },
  { href: "/healthcare",  icon: Heart,         label: "Health",     color: "from-rose-500 to-pink-600" },
  { href: "/agriculture", icon: Leaf,          label: "Krishi",     color: "from-green-600 to-emerald-700" },
  { href: "/finance",     icon: DollarSign,    label: "Finance",    color: "from-yellow-500 to-green-600" },
  { href: "/events",      icon: Calendar,      label: "Events",     color: "from-pink-500 to-purple-600" },
  { href: "/auto",        icon: Car,           label: "Auto",       color: "from-gray-500 to-zinc-600" },
  { href: "/electronics", icon: Cpu,           label: "Electronics",color: "from-blue-500 to-indigo-600" },
  { href: "/fashion",     icon: Shirt,         label: "Fashion",    color: "from-pink-500 to-rose-600" },
  { href: "/telecom",     icon: Signal,        label: "Telecom",    color: "from-sky-500 to-blue-600" },
];

export function PortalIconBar({ context }: { context?: string }) {
  const { pathname } = useLocation();

  return (
    <div className="overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-1.5 min-w-max px-1">
        {PORTALS.map((p, i) => {
          const active = p.exact ? pathname === p.href : pathname.startsWith(p.href) && p.href !== "/";
          const Icon = p.icon;
          return (
            <motion.div
              key={p.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
            >
              <Link
                to={p.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition-all duration-200 min-w-[52px] group relative",
                  active
                    ? "text-white"
                    : "text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]"
                )}
              >
                {/* Active glow background */}
                {active && (
                  <motion.div
                    layoutId="portal-active-bg"
                    className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20", p.color)}
                    style={{ zIndex: -1 }}
                  />
                )}

                {/* Icon container */}
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  active
                    ? `bg-gradient-to-br ${p.color} shadow-[0_4px_12px_rgba(0,0,0,0.3)]`
                    : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                )}>
                  <Icon className={cn("w-4 h-4", active ? "text-white" : "")} />
                </div>

                <span className={cn(
                  "text-[9px] font-bold leading-none whitespace-nowrap transition-colors",
                  active ? "text-white" : "text-[var(--pm-text-secondary)] group-hover:text-[var(--pm-text)]"
                )}>
                  {p.label}
                </span>

                {/* Active dot indicator */}
                {active && (
                  <motion.div
                    layoutId="portal-dot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--pm-accent)]"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
