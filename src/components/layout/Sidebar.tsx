import { Link, useLocation } from "react-router-dom";
import {
  User, LayoutDashboard, ShoppingBag, Heart, Package, FileText,
  Store, ShieldCheck, Wallet, PlaySquare, Settings as SettingsIcon,
  LogOut, Home, Tag, Users as UsersIcon, Plus, Zap, Gift, Globe, Factory, Truck, MapPin,
  Lock, Edit3, CreditCard, HelpCircle, BadgeCheck
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { ThemeSwitcher, LanguageSwitcher } from "@/components/theme/ThemeSwitcher";
import { cn } from "@/lib/utils";
import * as React from "react";

interface SidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

interface Item {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "primary" | "danger" | "settings";
}

function useMenuItems() {
  const { role, isAuthenticated, logout } = useAuth();
  const { lang } = useLanguage();
  const location = useLocation();
  const isSeller = role === "seller" || role === "admin" || role === "wholesale" || role === "factory" || role === "rural" || role === "nearby_shop";
  const isAdmin  = role === "admin" || role === "super_admin";

  const isRetail = location.pathname.startsWith("/b2c");
  const isLocal = location.pathname.startsWith("/local");

  const sections: { title: string; items: Item[] }[] = [];

  // 1. DISCOVER SECTION
  if (isRetail) {
    sections.push({
      title: lang === "bn" ? "খুচরা বাজার (B2C)" : "Retail (B2C)",
      items: [
        { href: "/b2c",          label: lang === "bn" ? "খুচরা হোম" : "Retail Home",   Icon: Home },
        { href: "/categories",   label: lang === "bn" ? "ক্যাটাগরি" : "Categories",    Icon: Tag },
        { href: "/vendors",      label: lang === "bn" ? "ব্র্যান্ড শপ" : "Brand Shops",   Icon: Store },
      ]
    });
  } else if (isLocal) {
    sections.push({
      title: lang === "bn" ? "লোকাল শপ পোর্টাল" : "Local Shops",
      items: [
        { href: "/local",        label: lang === "bn" ? "আসপাশের দোকান" : "Local Stores",  Icon: MapPin },
        { href: "/categories",   label: lang === "bn" ? "ক্যাটাগরি" : "Categories",        Icon: Tag },
      ]
    });
  } else {
    sections.push({
      title: lang === "bn" ? "এক্সপ্লোর ও ডিল" : "Discover Feed",
      items: [
        { href: "/",           label: lang === "bn" ? "হোম ফিড" : "Home Feed",     Icon: Home },
        { href: "/marketplace",label: lang === "bn" ? "পাইকারি মার্কেট" : "Marketplace",   Icon: ShoppingBag },
        { href: "/categories", label: lang === "bn" ? "ক্যাটাগরি সমূহ" : "Categories",    Icon: Tag },
        { href: "/vendors",    label: lang === "bn" ? "অনুমোদিত বিক্রেতা" : "Vendors",       Icon: UsersIcon },
        { href: "/reels",      label: lang === "bn" ? "রিলস ও সোর্টস" : "Reels / Stories",   Icon: PlaySquare },
        { href: "/video",      label: lang === "bn" ? "ভিডিও কনটেন্ট" : "Brand Videos", Icon: PlaySquare },
        { href: "/export",     label: lang === "bn" ? "গ্লোবাল এক্সপোর্ট" : "Global Export", Icon: Globe },
        { href: "/b2b",        label: lang === "bn" ? "বি২বি ড্যাশবোর্ড" : "B2B Hub",       Icon: Factory },
        { href: "/logistics",  label: lang === "bn" ? "লজিস্টিকস ও রোড" : "Logistics Hub",     Icon: Truck },
      ],
    });
  }

  // 2. MY ACTIVITY & CHANNELS
  sections.push({
    title: lang === "bn" ? "আমার অ্যাক্টিভিটি" : "My Activity",
    items: [
      { href: "/profile",              label: lang === "bn" ? "আমার প্রোফাইল" : "My Profile",         Icon: User },
      { href: "/orders",               label: lang === "bn" ? "আমার অর্ডারসমূহ" : "My Orders",       Icon: Package },
      { href: "/cart",                 label: lang === "bn" ? "কার্ট লিস্ট" : "Cart",            Icon: ShoppingBag },
      { href: "/profile?tab=wishlist", label: lang === "bn" ? "পছন্দের তালিকা" : "Wishlist",        Icon: Heart },
      { href: "/profile?tab=demands",  label: lang === "bn" ? "আমার চাহিদা (B2B Demands)" : "My Demands",      Icon: FileText },
      { href: "/wallet",               label: lang === "bn" ? "সুপার পিকে কয়েন ওয়ালেট" : "PK Coin Wallet",  Icon: Wallet },
    ],
  });

  // 3. SELLING PORTAL
  sections.push({
    title: lang === "bn" ? "বিক্রেতা কর্নার (Wholesale)" : "Wholesale Selling",
    items: isSeller
      ? [
          { href: "/seller",             label: lang === "bn" ? "সেলার ড্যাশবোর্ড" : "Seller Dashboard", Icon: LayoutDashboard, variant: "primary" as const },
          { href: "/seller/products/new",label: lang === "bn" ? "নতুন প্রোডাক্ট আপলোড" : "Create Product",   Icon: Plus },
          { href: "/profile?tab=posts",  label: lang === "bn" ? "আমার প্রোডাক্টস ও পোস্ট" : "My Products",       Icon: Store },
        ]
      : [
          { href: "/auth/seller-register",    label: lang === "bn" ? "অনলাইন বিক্রেতা হোন" : "Become a Seller",     Icon: Store,    variant: "primary" as const },
          { href: "/auth/wholesale-register", label: lang === "bn" ? "পাইকারি হোলসেলার রেজিস্ট্রেশন" : "Wholesale Register",  Icon: Package,  variant: "primary" as const },
          { href: "/auth/factory-register",   label: lang === "bn" ? "ম্যানুফ্যাকচারার কারখানা রেজিস্ট্রেশন" : "Factory Register",    Icon: Factory,  variant: "primary" as const },
          { href: "/auth/rural-register",     label: lang === "bn" ? "গ্রামীণ কুটির শিল্প বিক্রেতা" : "Rural Shopkeeper",    Icon: MapPin,   variant: "primary" as const },
        ],
  });

  // 4. ROLE-BASED DYNAMIC SETTINGS (Moved from Profile Settings per Request!)
  const settingsItems: Item[] = [];
  
  if (isSeller) {
    settingsItems.push(
      { href: "/profile?action=edit",      label: lang === "bn" ? "শপ ও প্রোফাইল এডিট" : "Edit Shop & Profile", Icon: Edit3, variant: "settings" },
      { href: "/profile?action=addresses", label: lang === "bn" ? "গুদাম ও আউটলেট ঠিকানা" : "Warehouse & Outlet Addresses", Icon: MapPin, variant: "settings" },
      { href: "/profile?action=verify",    label: lang === "bn" ? "ট্রেড লাইসেন্স ও ভেরিফিকেশন" : "Trade License & Verification", Icon: BadgeCheck, variant: "settings" },
      { href: "/wallet",                   label: lang === "bn" ? "আউটলেট পেমেন্ট সেটিংস" : "Payout & Bank Settings", Icon: CreditCard, variant: "settings" },
      { href: "/profile?action=password",  label: lang === "bn" ? "নিরাপত্তা ও পাসওয়ার্ড" : "Security & Password", Icon: Lock, variant: "settings" }
    );
  } else if (isAdmin) {
    settingsItems.push(
      { href: "/admin/settings",           label: lang === "bn" ? "প্ল্যাটফর্ম মাস্টার কনফিগ" : "Platform Master Config", Icon: SettingsIcon, variant: "settings" },
      { href: "/admin/users",              label: lang === "bn" ? "ইউজার ও পারমিশন কন্ট্রোল" : "User & Permissions Patrol", Icon: UsersIcon, variant: "settings" },
      { href: "/admin",                    label: lang === "bn" ? "অর্থ উইথড্রয়াল অনুমোদন" : "Commission & Payout Rules", Icon: ShieldCheck, variant: "settings" },
      { href: "/profile?action=password",  label: lang === "bn" ? "নিরাপত্তা ও পাসওয়ার্ড" : "SuperAdmin Password Reset", Icon: Lock, variant: "settings" }
    );
  } else {
    // Standard buyer/user settings
    settingsItems.push(
      { href: "/profile?action=edit",      label: lang === "bn" ? "প্রোফাইল তথ্য এডিট" : "Edit Profile Info", Icon: Edit3, variant: "settings" },
      { href: "/profile?action=addresses", label: lang === "bn" ? "ডেলিভারি শিপিং ঠিকানা" : "Shipping Delivery Address", Icon: MapPin, variant: "settings" },
      { href: "/wallet",                   label: lang === "bn" ? "সংরক্ষিত পেমেন্ট মেথড" : "Saved Payment Methods", Icon: CreditCard, variant: "settings" },
      { href: "/auth/seller-register",    label: lang === "bn" ? "পাইকারি বিক্রেতায় উন্নত হোন" : "Upgrade to Seller Account", Icon: Store, variant: "settings" },
      { href: "/profile?action=password",  label: lang === "bn" ? "নিরাপত্তা ও পাসওয়ার্ড" : "Account Password Change", Icon: Lock, variant: "settings" }
    );
  }

  sections.push({
    title: lang === "bn" ? "ডায়নামিক সেটিংস (রোলের ভিত্তিতে)" : "Settings (Based on Role: " + (role ?? "Guest") + ")",
    items: settingsItems
  });

  return { sections, isAuthenticated, logout };
}

function MenuLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { sections, isAuthenticated, logout } = useMenuItems();
  const { lang, setLang } = useLanguage();

  let linkIndexOffset = 0;

  return (
    <div className="flex flex-col gap-4 pb-8">
      {sections.map((section) => {
        const currentOffset = linkIndexOffset;
        linkIndexOffset += section.items.length;
        
        return (
        <div key={section.title} className="flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-widest text-primary/75 font-black mb-1.5 px-2.5 flex items-center gap-1.5 border-l-2 border-primary/50 py-0.5">
            {section.title}
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item, index) => {
              const globalIndex = currentOffset + index;
              const Icon = item.Icon;
              const active =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href.split("?")[0] ?? item.href)) ||
                (item.href.includes("action=") && location.search === item.href.slice(item.href.indexOf("?")));
              
              return (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-300 border border-transparent animate-in fade-in slide-in-from-left-4",
                    item.variant === "primary"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                      : item.variant === "settings"
                        ? "bg-foreground/[0.01] hover:bg-foreground/[0.05] text-foreground/80 border border-foreground/[0.04]"
                        : active
                          ? "bg-primary/10 text-primary border-primary/25 font-semibold"
                          : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground/95",
                  )}
                  style={{ animationFillMode: "both", animationDelay: `${globalIndex * 25}ms` }}
                >
                  <Icon className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    item.variant === "primary" ? "text-primary" : active ? "text-primary" : "text-foreground/65",
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
      )})}

      {/* 5. VISUAL INTEGRATED APPEARANCE CONFIG */}
      <div className="h-px bg-border/60 my-1.5" />
      
      <div className="px-2">
        <ThemeSwitcher />
      </div>

      <div className="h-px bg-border/60 my-1.5" />

      {/* 6. DYNAMIC LANGUAGE CONTROLLER */}
      <div className="px-2">
        <LanguageSwitcher />
      </div>

      <div className="h-px bg-border/60 my-1.5" />

      {/* Upgrade card */}
      <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Gift className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Premium Business</span>
        </div>
        <p className="text-[11px] text-foreground/75 mb-2">
          {lang === "bn" ? "পাইকারি রিটেল এনালিটিক্স ও প্রিমিয়াম ব্যানার লক খুলুন" : "Unlock wholesale retail distribution analytics"}
        </p>
        <div className="text-[11px] font-bold text-primary cursor-pointer hover:text-primary/80">
          {lang === "bn" ? "আপগ্রেড করুন →" : "Upgrade →"}
        </div>
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => { logout?.(); onNavigate?.(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-rose-400/80 hover:bg-rose-500/8 hover:text-rose-400 transition-all w-full text-left border border-transparent hover:border-rose-500/15 font-bold cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>{lang === "bn" ? "লগ আউট করুন" : "Logout Account"}</span>
        </button>
      ) : (
        <Link
          to="/auth/login"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all font-bold"
        >
          <User className="h-4 w-4 text-primary" />
          <span>{lang === "bn" ? "লগইন / রেজিস্টার" : "Login / Register"}</span>
        </Link>
      )}
    </div>
  );
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { lang } = useLanguage();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-card/95 backdrop-blur-3xl border border-border text-foreground w-[260px] max-w-[75vw] p-4 overflow-y-auto no-scrollbar !fixed !inset-y-auto !top-[60px] !bottom-[80px] !h-auto ml-3 rounded-3xl shadow-2xl transition-all duration-300 ease-out z-[100]"
      >
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="font-extrabold text-[16px] bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              PaikarMart
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <MenuLinks onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:block w-[240px] shrink-0 sticky top-24 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto no-scrollbar pr-1 z-30">
      <div className="rounded-3xl border border-border bg-card/85 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="p-3">
          <MenuLinks />
        </div>
      </div>
    </aside>
  );
}
