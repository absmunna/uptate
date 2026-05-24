import { Link, useLocation } from "wouter";
import {
  User, LayoutDashboard, ShoppingBag, Heart, Package, FileText,
  Store, ShieldCheck, Wallet, PlaySquare, Settings as SettingsIcon,
  LogOut, Home, Tag, Users as UsersIcon, Plus, Zap, Gift, Globe, Factory, Truck, MapPin,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import * as React from "react";

interface SidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

interface Item {
  href: string; label: string;
  Icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "primary" | "danger";
}

function useMenuItems() {
  const { role, isAuthenticated, logout } = useAuth();
  const isSeller = role === "seller" || role === "admin";
  const isAdmin  = role === "admin";

  const sections: { title: string; items: Item[] }[] = [
    {
      title: "Discover",
      items: [
        { href: "/",           label: "Home Feed",     Icon: Home },
        { href: "/marketplace",label: "Marketplace",   Icon: ShoppingBag },
        { href: "/categories", label: "Categories",    Icon: Tag },
        { href: "/vendors",    label: "Vendors",       Icon: UsersIcon },
        { href: "/reels",      label: "Reels",         Icon: PlaySquare },
        { href: "/video",      label: "Video Content", Icon: PlaySquare },
        { href: "/export",     label: "Global Export", Icon: Globe },
        { href: "/b2b",        label: "B2B Hub",       Icon: Factory },
        { href: "/logistics",  label: "Logistics",     Icon: Truck },
      ],
    },
    {
      title: "My Activity",
      items: [
        { href: "/profile",              label: "Profile",         Icon: User },
        { href: "/orders",               label: "My Orders",       Icon: Package },
        { href: "/cart",                 label: "Cart",            Icon: ShoppingBag },
        { href: "/profile?tab=wishlist", label: "Wishlist",        Icon: Heart },
        { href: "/profile?tab=demands",  label: "My Demands",      Icon: FileText },
        { href: "/wallet",               label: "PK Coin Wallet",  Icon: Wallet },
      ],
    },
    {
      title: "Selling",
      items: isSeller
        ? [
            { href: "/seller",             label: "Seller Dashboard", Icon: LayoutDashboard, variant: "primary" as const },
            { href: "/seller/products/new",label: "Create Product",   Icon: Plus },
            { href: "/profile?tab=products",label:"My Products",       Icon: Store },
          ]
        : [
            { href: "/auth/seller-register",    label: "Become a Seller",     Icon: Store,    variant: "primary" as const },
            { href: "/auth/wholesale-register", label: "Wholesale Register",  Icon: Package,  variant: "primary" as const },
            { href: "/auth/factory-register",   label: "Factory Register",    Icon: Factory,  variant: "primary" as const },
            { href: "/auth/rural-register",     label: "Rural Shopkeeper",    Icon: MapPin,   variant: "primary" as const },
          ],
    },
  ];

  if (isAdmin) {
    sections.push({
      title: "Admin",
      items: [
        { href: "/admin",         label: "Admin Dashboard", Icon: ShieldCheck, variant: "primary" as const },
        { href: "/admin/users",   label: "Users",           Icon: UsersIcon },
        { href: "/admin/settings",label: "Settings",        Icon: SettingsIcon },
      ],
    });
  }

  return { sections, isAuthenticated, logout };
}

function MenuLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { sections, isAuthenticated, logout } = useMenuItems();

  return (
    <div className="flex flex-col gap-4 pb-8">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5 px-2">
            {section.title}
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const Icon = (item as any).Icon ?? (item as any).icon;
              const active =
                location === item.href ||
                (item.href !== "/" && location.startsWith(item.href.split("?")[0] ?? item.href));
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                    item.variant === "primary"
                      ? "bg-cyan-500/10 hover:bg-cyan-500/18 text-cyan-300 border border-cyan-500/20"
                      : active
                        ? "bg-white/8 text-white border border-white/8"
                        : "text-white/60 hover:bg-white/6 hover:text-white/90",
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0",
                    item.variant === "primary" ? "text-cyan-400" : active ? "text-cyan-400" : "text-white/40",
                  )} />
                  <span className="truncate">{item.label}</span>
                  {item.variant === "primary" && (
                    <Zap className="h-3 w-3 ml-auto text-cyan-400/60" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="h-px bg-white/[0.06] my-1" />

      {/* Upgrade card */}
      <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Gift className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Premium</span>
        </div>
        <p className="text-[11px] text-white/50 mb-2">Unlock advanced features & analytics</p>
        <div className="text-[11px] font-bold text-cyan-400 cursor-pointer hover:text-cyan-300">Upgrade →</div>
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => { logout?.(); onNavigate?.(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400/80 hover:bg-rose-500/8 hover:text-rose-400 transition-all w-full text-left border border-transparent hover:border-rose-500/15"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      ) : (
        <Link
          href="/auth/login"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/18 border border-cyan-500/20 transition-all"
        >
          <User className="h-4 w-4 text-cyan-400" />
          <span>Login / Register</span>
        </Link>
      )}
    </div>
  );
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-[#050a16] border-r border-white/[0.07] text-white w-[290px] max-w-[85vw] p-5 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-primary">
              PaikarMart
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-5">
          <MenuLinks onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0 sticky top-28 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pr-1">
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(5,10,22,0.7)", backdropFilter: "blur(20px)" }}>
        <div className="p-3">
          <MenuLinks />
        </div>
      </div>
    </aside>
  );
}
