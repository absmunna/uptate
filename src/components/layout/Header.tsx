import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, Search, Bell, Plus, ShoppingCart, ArrowLeft,
  ShieldCheck, Store, User as UserIcon, MessageSquare,
  Languages, MapPin, Loader2, Navigation, Settings2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMe, useGetCart } from "@workspace/api-client-react";
import { Sidebar } from "./Sidebar";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { useLocation as useUserLocation } from "@/features/location/LocationContext";
import { useCartStore } from "@/modules/cart/cartStore";
import { ThemeSwitcher, ThemeToggleBtn, LanguageSwitcher, LanguageToggleBtn } from "@/components/theme/ThemeSwitcher";
import { BackButton } from "@/components/ui/PremiumButtons";

function getTabsForContext(pathname: string, role?: string) {
  const isRetail = pathname.startsWith("/b2c");
  const isB2b = pathname === "/" || pathname.startsWith("/b2b") || pathname.startsWith("/marketplace");
  const isLocal = pathname.startsWith("/local");

  if (isRetail) {
    return [
      { href: "/b2c",         labelKey: "nav.explore",    match: (l: string) => l === "/b2c" },
      { href: "/categories",  labelKey: "nav.categories", match: (l: string) => l === "/categories" },
      { href: "/vendors",     labelKey: "nav.vendors",    match: (l: string) => l === "/vendors" },
      { href: "/cart",        labelKey: "nav.cart",       match: (l: string) => l.startsWith("/cart") },
    ];
  }

  if (isLocal) {
    return [
      { href: "/local",       labelKey: "nav.local",      match: (l: string) => l === "/local" },
      { href: "/local/shops", labelKey: "nav.vendors",    match: (l: string) => l.startsWith("/local/shops") },
    ];
  }

  // Default B2B / global tabs
  const tabs = [
    { href: "/",            labelKey: "nav.explore",    match: (l: string) => l === "/" },
    { href: "/marketplace", labelKey: "nav.market",     match: (l: string) => l.startsWith("/marketplace") },
    { href: "/categories",  labelKey: "nav.categories", match: (l: string) => l === "/categories" },
    { href: "/vendors",     labelKey: "nav.vendors",    match: (l: string) => l === "/vendors" },
    { href: "/demand",      labelKey: "nav.demands",    match: (l: string) => l.startsWith("/demand") },
    { href: "/video",       labelKey: "nav.videos",     match: (l: string) => l.startsWith("/video") },
    { href: "/export",      labelKey: "nav.global",     match: (l: string) => l.startsWith("/export") },
    { href: "/b2b",         labelKey: "nav.b2b",        match: (l: string) => l.startsWith("/b2b") },
    { href: "/logistics",   labelKey: "nav.logistics",  match: (l: string) => l.startsWith("/logistics") },
  ];

  return tabs;
}

const ROLE_BADGE: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  admin:            { label: "Admin",       cls: "bg-purple-500/15 text-purple-300 border-purple-500/25",   Icon: ShieldCheck },
  super_admin:      { label: "Super Admin", cls: "bg-rose-500/15 text-rose-300 border-rose-500/25",        Icon: ShieldCheck },
  seller:           { label: "Seller",      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", Icon: Store },
  wholesale:        { label: "Wholesale",   cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", Icon: Store },
  factory:          { label: "Factory",     cls: "bg-blue-500/15 text-blue-300 border-blue-500/25",         Icon: Store },
  digital_seller:   { label: "Digital",     cls: "bg-violet-500/15 text-violet-300 border-violet-500/25",   Icon: Store },
  rural:            { label: "Rural",       cls: "bg-amber-500/15 text-amber-300 border-amber-500/25",      Icon: Store },
  nearby_shop:      { label: "Shop",        cls: "bg-orange-500/15 text-orange-300 border-orange-500/25",   Icon: Store },
  moderator:        { label: "Mod",         cls: "bg-amber-500/15 text-amber-300 border-amber-500/25",      Icon: ShieldCheck },
  buyer:            { label: "Buyer",       cls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",         Icon: UserIcon },
  user:             { label: "Buyer",       cls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",         Icon: UserIcon },
  rider:            { label: "Rider",       cls: "bg-sky-500/15 text-sky-300 border-sky-500/25",            Icon: UserIcon },
  service_provider: { label: "Service",     cls: "bg-teal-500/15 text-teal-300 border-teal-500/25",         Icon: UserIcon },
};

function RoleBadge({ role }: { role: string }) {
  const badge = ROLE_BADGE[role];
  if (!badge || role === "guest") {
    return <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-foreground/8 text-foreground/50 border border-foreground/10">Guest</span>;
  }
  const { label, cls, Icon } = badge;
  return (
    <span className={`hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${cls}`}>
      <Icon className="h-2.5 w-2.5" />{label}
    </span>
  );
}

/* ── Icon Button — styled pill with hover glow ── */
function IconBtn({
  href, onClick, children, badge, badgeColor = "bg-rose-500", className,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  className?: string;
}) {
  const cls = cn(
    "relative flex items-center justify-center h-9 w-9 rounded-xl",
    "text-foreground/60 hover:text-foreground",
    "hover:bg-foreground/8 active:bg-foreground/12",
    "border border-transparent hover:border-foreground/8",
    "transition-all duration-150 cursor-pointer",
    className,
  );
  const inner = (
    <>
      {children}
      {badge != null && (
        <span className={cn(
          "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center",
          "text-[9px] font-bold text-white shadow-lg",
          badgeColor,
        )}>
          {badge}
        </span>
      )}
    </>
  );
  if (href) return <Link to={href}><div className={cls}>{inner}</div></Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

/* ── Floating Settings Panel ── */
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2.5 w-76 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-3xl shadow-2xl z-[200] p-4.5 flex flex-col gap-4.5 animate-in fade-in slide-in-from-top-3 duration-300"
    >
      {/* Header and Details for Theme selection */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-[13px] font-black text-foreground flex items-center gap-1.5 leading-none">
          <Settings2 className="w-3.5 h-3.5 text-primary" />
          {t("theme.title")}
        </h4>
        <p className="text-[10px] text-muted-foreground leading-normal">
          {t("theme.desc")}
        </p>
      </div>

      <ThemeSwitcher onClose={onClose} defaultOpen={true} />

      <div className="h-px bg-border/60" />

      {/* Header and Details for Language selection */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-[13px] font-black text-foreground leading-none">
          {t("lang.title")}
        </h4>
        <p className="text-[10px] text-muted-foreground leading-normal">
          {t("lang.desc")}
        </p>
      </div>

      <LanguageSwitcher onClose={onClose} />
    </div>
  );
}

/* ── Location chip ── */
function LocationChip() {
  const { displayName, isDetecting, detect } = useUserLocation();
  return (
    <button
      onClick={detect}
      title="Detect location"
      className="hidden md:flex items-center gap-1 px-2 h-7 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] hover:bg-foreground/10 transition-all max-w-[130px] group"
    >
      {isDetecting
        ? <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" />
        : <Navigation className="h-3 w-3 text-primary shrink-0 group-hover:scale-110 transition-transform" />
      }
      <span className="text-[11px] text-foreground/60 truncate font-medium">{displayName}</span>
    </button>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { data: user } = useGetMe();
  const { getTotalItems } = useCartStore();
  const { role } = useAuth();
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
  };

  const isHome = location.pathname === "/";
  const isInner = location.pathname !== "/";
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const cartCount = getTotalItems();

  return (
    <>
      {/* ── FIXED header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-panel border-b border-foreground/[0.07]">

        {/* ── Row 1: Logo + Search + Actions ── */}
        <div className="flex h-[52px] items-center px-3 md:px-5 gap-2 max-w-[1400px] mx-auto">

          {/* Left */}
          <div className="flex items-center gap-1 shrink-0">
            {isInner && (
              <BackButton size="sm" className="mr-1 shadow-inner border-[var(--pm-border)]" onBack={goBack} />
            )}
            <IconBtn onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-[18px] w-[18px]" />
            </IconBtn>

            <Link to="/" className="flex items-center gap-1.5 shrink-0 ml-1">
              <span className="font-extrabold text-[15px] md:text-[17px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-blue)] to-primary">
                PaikarMart
              </span>
              <RoleBadge role={role} />
            </Link>
          </div>

          {/* Location chip */}
          <LocationChip />

          {/* Search — desktop: inline bar, mobile: icon only */}
          {/* Desktop search bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 min-w-0 max-w-lg mx-auto relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none transition-colors",
              searchFocused ? "text-primary" : "text-foreground/35",
            )} />
            <input
              type="search"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { setSearchFocused(true); }}
              onBlur={() => setSearchFocused(false)}
              onClick={() => navigate(`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`)}
              readOnly
              className={cn(
                "w-full bg-foreground/[0.07] border rounded-full h-9 pl-9 pr-4 text-sm cursor-pointer",
                "text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-200",
                searchFocused
                  ? "border-primary/50 shadow-[0_0_0_3px_rgba(var(--primary),0.08)]"
                  : "border-foreground/[0.09] hover:border-primary/25",
              )}
            />
          </form>

          {/* Mobile search icon */}
          <div className="flex-1 sm:hidden" />
          <IconBtn
            onClick={() => navigate("/search")}
            className="sm:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </IconBtn>

          {/* Action icons */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Messages */}
            <IconBtn href="/notifications" className="hidden sm:flex">
              <MessageSquare className="h-[17px] w-[17px]" />
            </IconBtn>

            {/* Notifications — animated dot */}
            <IconBtn href="/notifications">
              <Bell className="h-[17px] w-[17px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500">
                <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60" />
              </span>
            </IconBtn>

            {/* Cart */}
            <IconBtn
              href="/cart"
              badge={cartCount > 0 ? (cartCount > 9 ? "9+" : cartCount) : undefined}
              badgeColor="bg-primary text-primary-foreground"
            >
              <ShoppingCart className="h-[17px] w-[17px]" />
            </IconBtn>

            {/* Create */}
            <Link to={role === "seller" || role === "admin" ? "/seller/products/new" : "/auth/seller-register"} className="hidden sm:flex ml-1">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-primary flex items-center justify-center neon-glow-sm hover:opacity-90 active:scale-95 transition-all border border-white/20 cursor-pointer">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </Link>

            {/* Lang toggle */}
            <div className="hidden md:block">
              <LanguageToggleBtn onClick={() => setSettingsOpen((v) => !v)} />
            </div>

            {/* Theme btn */}
            <div className="relative ml-1 hidden md:block">
              <ThemeToggleBtn onClick={() => setSettingsOpen((v) => !v)} />
              {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
            </div>

            {/* Avatar */}
            <Link to="/profile" className="ml-1.5">
              <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary/30 hover:border-primary/60 shadow-[0_0_10px_rgba(var(--neon-cyan),0.15)] hover:shadow-[0_0_16px_rgba(var(--neon-cyan),0.3)] transition-all duration-200">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-blue-900/60 text-primary text-xs font-bold">
                  {user?.fullName?.[0] ?? "G"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        {/* ── Row 2: Tab bar removed per request ── */}
      </header>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  );
}
