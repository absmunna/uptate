import { Link, useLocation } from "react-router-dom";
import {
  Home, PlaySquare, Store, ShoppingBag, User, FileText, MapPin, Grid3X3,
  LayoutDashboard, ShieldCheck, Wallet, Building2, Briefcase,
  MessageSquare, Crown, Truck, Globe, Pill, ShoppingBasket, Utensils, Hotel,
  Building, GraduationCap, Heart, Leaf, DollarSign, Calendar, Car,
  Cpu, Shirt, Signal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMe, useGetCart } from "@workspace/api-client-react";
import { useSeller } from "@/seller/SellerContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/reels", label: "Reels", icon: PlaySquare },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/local", label: "Nearby", icon: MapPin },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/demand", label: "Demands", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

const PORTAL_NAV = [
  { href: "/messages",  label: "Messages",  icon: MessageSquare },
  { href: "/wallet",    label: "Wallet",    icon: Wallet },
  { href: "/b2b",       label: "B2B Trade", icon: Building2 },
  { href: "/services",  label: "Services",  icon: Briefcase },
  { href: "/pk-store",  label: "PK Store",  icon: Crown },
  { href: "/logistics", label: "Logistics", icon: Truck },
  { href: "/export",    label: "Export",    icon: Globe },
  { href: "/pharmacy",    label: "Pharmacy",  icon: Pill },
];

const SELLER_NAV = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/verification", label: "Verification", icon: ShieldCheck },
];

export function DesktopNav() {
  const { pathname } = useLocation();
  const { data: user } = useGetMe();
  const { data: cart } = useGetCart();
  const { isSeller } = useSeller();

  const getIsActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="hidden lg:flex flex-col gap-1 w-[260px] shrink-0 sticky top-[64px] h-[calc(100dvh-64px)] overflow-y-auto py-6 px-4 no-scrollbar border-r border-[var(--pm-border)] bg-[var(--pm-surface)]">
      {/* User Identity Pills */}
      <Link to="/profile" className="flex items-center gap-3 p-3 mb-6 rounded-2xl bg-[var(--pm-elevated)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 transition-all group">
        <Avatar className="h-12 w-12 border border-[var(--pm-border)] shrink-0 shadow-inner">
          <AvatarImage src={user?.avatarUrl} className="object-cover" />
          <AvatarFallback className="bg-[var(--pm-surface)] text-[var(--pm-text)]">{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-black text-[var(--pm-text)] truncate leading-none">{user?.name ?? "Guest User"}</p>
          <p className="text-[10px] text-[var(--pm-text-secondary)] uppercase tracking-widest mt-1">@{user?.handle ?? "—"}</p>
        </div>
      </Link>

      <div className="space-y-1 mt-2">
        {NAV.map((item) => {
          const active = getIsActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                active 
                  ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20" 
                  : "text-[var(--pm-text-secondary)] hover:bg-[var(--pm-elevated)] hover:text-[var(--pm-text)]"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active ? "text-[var(--pm-accent)]" : "text-[var(--pm-text-secondary)]")} />
              <span className="truncate">{item.label}</span>
              {item.href === "/marketplace" && cart && cart.itemCount > 0 && (
                <span className="ml-auto text-xs bg-[var(--pm-accent)] text-[var(--pm-text)] rounded-full px-2 py-0.5 font-bold">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-[var(--pm-border)] my-6" />

      <p className="text-[10px] uppercase tracking-widest text-[var(--pm-text-secondary)]/50 font-black px-4 mb-2">Portal Hub</p>
      
      <div className="grid grid-cols-4 gap-2 px-2">
        {PORTAL_NAV.map((item) => {
          const active = getIsActive(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[var(--pm-elevated)] transition-colors group">
              <div className={cn("p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] group-hover:border-[var(--pm-accent)]/30 transition-all", active && "border-[var(--pm-accent)]/50 bg-[var(--pm-accent)]/5")}>
                 <Icon className={cn("w-5 h-5", active ? "text-[var(--pm-accent)]" : "text-[var(--pm-text-secondary)]")} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-[var(--pm-border)] my-6" />

      <p className="text-[10px] uppercase tracking-widest text-[var(--pm-text-secondary)]/50 font-black px-4 mb-2">Vendor Hub</p>
      {isSeller ? (
        <div className="space-y-1">
          {SELLER_NAV.map((item) => {
            const active = getIsActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-all group">
                <Icon className={cn("w-5 h-5", active ? "text-[var(--pm-accent)]" : "text-[var(--pm-text-secondary)]")} />
                <span className={cn("text-sm font-medium", active ? "text-[var(--pm-accent)]" : "text-[var(--pm-text-secondary)]")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <Link to="/seller/verification" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-text)] font-semibold text-sm hover:opacity-90 transition-all">
          <ShieldCheck className="w-5 h-5" />
          <span>Become a Seller</span>
        </Link>
      )}
    </nav>
  );
}

