import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { safeStorage } from "@/utils/storage";

export type Lang = "en" | "bn";

const LANG_KEY = "pm.lang.v1";

/* ── Translation map ──────────────────────────────────── */
const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.explore":      { en: "Explore",    bn: "এক্সপ্লোর" },
  "nav.market":       { en: "Market",     bn: "মার্কেট" },
  "nav.local":        { en: "Local",      bn: "লোকাল" },
  "nav.categories":   { en: "Categories", bn: "ক্যাটাগরি" },
  "nav.vendors":      { en: "Vendors",    bn: "বিক্রেতা" },
  "nav.demands":      { en: "Demands",    bn: "ডিমান্ড" },
  "nav.videos":       { en: "Videos",     bn: "ভিডিও" },
  "nav.b2b":          { en: "B2B",        bn: "বি-টু-বি" },
  "nav.logistics":    { en: "Logistics",  bn: "লজিস্টিক" },
  "nav.global":       { en: "Global 🌐",  bn: "গ্লোবাল 🌐" },
  // Bottom nav
  "nav.home":         { en: "Home",       bn: "হোম" },
  "nav.apps":         { en: "Apps",       bn: "অ্যাপস" },
  "nav.cart":         { en: "Cart",       bn: "কার্ট" },
  "nav.account":      { en: "Account",    bn: "অ���যাকাউন্ট" },
  // Auth
  "auth.login":       { en: "Login",      bn: "লগইন" },
  "auth.register":    { en: "Register",   bn: "রেজিস্ট্রেশন" },
  "auth.logout":      { en: "Log Out",    bn: "লগআউট" },
  // Common
  "common.search":    { en: "Search products, brands, sellers…", bn: "পণ্য, ব্র্যান্ড, বিক্রেতা খুঁজুন…" },
  "common.viewAll":   { en: "View All",   bn: "সব দেখুন" },
  "common.shopNow":   { en: "Shop Now",   bn: "এখনই কিনুন" },
  "common.addToCart": { en: "Add to Cart",bn: "কার্টে যোগ করুন" },
  "common.save":      { en: "Save",       bn: "সেভ করুন" },
  "common.cancel":    { en: "Cancel",     bn: "বাতিল" },
  "common.loading":   { en: "Loading…",   bn: "লোড হচ্ছে…" },
  // Home sections
  "home.stories":     { en: "Stories",    bn: "স্টোরিজ" },
  "home.trending":    { en: "Trending Now", bn: "ট্রেন্ডিং" },
  "home.demands":     { en: "Open Demands", bn: "ওপেন ডিমান্ড" },
  "home.arrivals":    { en: "New Arrivals", bn: "নতুন পণ্য" },
  "home.feed":        { en: "Community Feed", bn: "কমিউনিটি ফিড" },
  // Profile
  "profile.orders":   { en: "Orders",     bn: "অর্ডার" },
  "profile.wishlist": { en: "Wishlist",   bn: "উইশলিস্ট" },
  "profile.posts":    { en: "Posts",      bn: "পোস্ট" },
  "profile.settings": { en: "Settings",   bn: "সেটিংস" },
  "profile.editProfile": { en: "Edit Profile", bn: "প্রোফাইল সম্পাদনা" },
  // Portals
  "portal.marketplace": { en: "Marketplace",   bn: "মার্কেটপ্লেস" },
  "portal.wholesale":   { en: "Wholesale",      bn: "পাইকারি" },
  "portal.retail":      { en: "Retail",         bn: "খুচরা" },
  "portal.nearby":      { en: "Nearby Shops",   bn: "কাছের দোকান" },
  "portal.b2b":         { en: "B2B",            bn: "বি-টু-বি" },
  "portal.digital":     { en: "Digital",        bn: "ডিজিটাল" },
  "portal.logistics":   { en: "Logistics",      bn: "লজিস্টিক" },
  // Theme names
  "theme.title":      { en: "Theme Mode",       bn: "থিম মোড" },
  "theme.desc":       { en: "Change background color and brand aesthetic", bn: "ব্যাকগ্রাউন্ড কালার এবং ডিজাইন সেটিং পরিবর্তন করুন" },
  "lang.title":       { en: "Language Options",    bn: "ভাষা পরিবর্তন" },
  "lang.desc":        { en: "Select your preferred layout language", bn: "ডায়নামিক লেআউট এবং কন্টেন্ট ভাষা বাছাই করুন" },
};

/* ── Context ──────────────────────────────────────────── */
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isBn: boolean;
}

const LangContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (safeStorage.getItem(LANG_KEY) as Lang) || "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    safeStorage.setItem(LANG_KEY, l);
    // Apply Bangla font if needed
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "bn" ? "bn" : "en";
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "bn" ? "bn" : "en";
    }
  }, [lang]);

  const value = useMemo<LangCtx>(() => ({
    lang,
    setLang,
    t: (key: string) => TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.["en"] ?? key,
    isBn: lang === "bn",
  }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be inside <LanguageProvider>");
  return ctx;
}
