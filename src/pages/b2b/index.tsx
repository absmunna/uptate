import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Factory, Store, MapPin, Users, ArrowDown, ArrowRight,
  Globe, Truck, Wallet, BarChart3, ShieldCheck, Package,
  CheckCircle2, Zap, ChevronRight, BadgePercent,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHAIN_STEPS = [
  {
    id: 1, label: "কারখানা", sublabel: "Factory / Manufacturer",
    icon: Factory, color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30", textColor: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    desc: "পণ্য উৎপাদন করে পাইকারদের কাছে পাঠায়",
    features: ["Export license verified", "Bulk supply", "B2B invoice"],
    href: "/auth/factory-register", cta: "Factory Register",
  },
  {
    id: 2, label: "পাইকারি বিক্রেতা", sublabel: "Wholesale · Islampur / Khatunganj",
    icon: Store, color: "from-emerald-500/20 to-teal-600/20",
    border: "border-emerald-500/30", textColor: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    desc: "কারখানা থেকে বাল্কে কিনে খুচরা ও গ্রামীণ বিক্রেতাদের কাছে সরবরাহ করে",
    features: ["Price tiers (MOQ)", "Factory sourcing", "Order tracking"],
    href: "/auth/wholesale-register", cta: "Wholesale Register",
  },
  {
    id: 3, label: "গ্রামীণ দোকানদার", sublabel: "Rural Shopkeeper · হাটবাজার",
    icon: MapPin, color: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30", textColor: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    desc: "স্থানীয় হাটবাজারে বিক্রি করে, অনলাইনে গ্রাহকদের কাছ থেকে অর্ডার নেয়",
    features: ["Hat-day schedule", "Local area orders", "Cash on delivery"],
    href: "/auth/rural-register", cta: "Rural Register",
  },
  {
    id: 4, label: "গ্রাহক", sublabel: "Customer · Local Buyer",
    icon: Users, color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30", textColor: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    desc: "লোকেশন অনুযায়ী কাছের দোকান, দাম, ও পণ্য খুঁজে অর্ডার দেয়",
    features: ["Location-based search", "Price comparison", "Order tracking"],
    href: "/local", cta: "কাছের দোকান খুঁজুন",
  },
];

const FOUR_MODELS = [
  {
    Icon: Package, title: "সেলার রেজিস্ট্রেশন ও পণ্য লিস্টিং",
    color: "text-cyan-400", bg: "bg-cyan-500/8", border: "border-cyan-500/20",
    points: [
      "কারখানা / পাইকারি / গ্রামীণ — তিনটি আলাদা রেজিস্ট্রেশন ফর্ম",
      "পণ্য আপলোড, দাম ও স্টক আপডেট",
      "Price tier সিস্টেম (MOQ ভিত্তিক ছাড়)",
      "ফ্যাক্টরি সোর্স লিংকিং",
    ],
  },
  {
    Icon: Truck, title: "ডাইনামিক লজিস্টিক ক্যালকুলেশন",
    color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20",
    points: [
      "দূরত্ব ও ওজন ভিত্তিক ডেলিভারি চার্জ",
      "Google Maps Distance Matrix API",
      "রোড ফ্রেইট রেট: ৳৬-১২/টন-কিমি",
      "পিকআপ পয়েন্ট → গন্তব্য অটো ক্যালকুলেট",
    ],
  },
  {
    Icon: Zap, title: "ফিল্টারিং ও রাইডার ম্যাচিং",
    color: "text-amber-400", bg: "bg-amber-500/8", border: "border-amber-500/20",
    points: [
      "রাইডার নিজের গন্তব্য অনুযায়ী পিকআপ খুঁজে",
      "লোকেশন রেডিয়াস ফিল্টার",
      "ডেলিভারি রিকোয়েস্ট ম্যাচিং বোর্ড",
      "রিয়েল-টাইম স্ট্যাটাস আপডেট",
    ],
  },
  {
    Icon: BadgePercent, title: "কমিশন ও পেমেন্ট মডেল",
    color: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20",
    points: [
      "Factory→Wholesale: ৩% প্ল্যাটফর্ম ফি",
      "Wholesale→Rural: ৫% কমিশন",
      "Rural→Customer: ৮% কমিশন",
      "bKash / Nagad / Bank — সব পদ্ধতি",
    ],
  },
];

const COMMISSION_FLOW = [
  { from: "কারখানা",    to: "পাইকারি",   rate: "৩%",  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25" },
  { from: "পাইকারি",    to: "গ্রামীণ",   rate: "৫%",  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  { from: "গ্রামীণ",    to: "গ্রাহক",    rate: "৮%",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  { from: "সব লেনদেন", to: "প্ল্যাটফর্ম", rate: "২%", color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/25" },
];

export default function B2BHub() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 md:p-10 bg-gradient-to-br from-[#040c1e] via-[#060f20] to-[#04080f]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">PaikarMart B2B</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            বাংলাদেশের সম্পূর্ণ<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">
              ডিজিটাল সাপ্লাই চেইন
            </span>
          </h1>
          <p className="text-sm text-white/55 leading-relaxed mb-6">
            কারখানা থেকে গ্র��মীণ দোকান পর্যন্ত — প্রতিটি স্তর ডিজিটালি সংযুক্ত। স্বচ্ছ মূল্য, অটো লজিস্টিক, এবং রিয়েল-টাইম ট্র্যাকিং।
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/wholesale-register">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)]">
                <Store className="h-4 w-4" /> পাইকারি রেজিস্ট্রেশন
              </button>
            </Link>
            <Link href="/logistics">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/8 transition-all">
                <Truck className="h-4 w-4" /> লজিস্টিক বোর্ড
              </button>
            </Link>
            <Link href="/export">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/55 text-sm font-semibold hover:border-white/25 transition-all">
                <Globe className="h-4 w-4" /> Export Marketplace
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Supply chain flow */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ArrowDown className="h-4 w-4 text-cyan-400" /> সাপ্লাই চেইন ফ্লো
        </h2>
        <div className="flex flex-col gap-2">
          {CHAIN_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.id}>
                <GlassCard className={cn("p-4 border transition-all hover:scale-[1.01]", s.border, s.glow)} hoverEffect>
                  <div className="flex items-start gap-4">
                    <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", s.color)}>
                      <Icon className={cn("h-5 w-5", s.textColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-xs font-bold uppercase tracking-wider", s.textColor)}>স্তর {s.id}</span>
                            <h3 className="font-bold text-white">{s.label}</h3>
                          </div>
                          <p className="text-[11px] text-white/40 mt-0.5">{s.sublabel}</p>
                        </div>
                        <Link href={s.href}>
                          <button className={cn(
                            "text-xs px-3 py-1.5 rounded-lg border transition-all shrink-0",
                            s.border, s.textColor, "bg-white/[0.03] hover:bg-white/[0.06]"
                          )}>
                            {s.cta} →
                          </button>
                        </Link>
                      </div>
                      <p className="text-xs text-white/55 mt-2 leading-relaxed">{s.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.features.map(f => (
                          <span key={f} className="flex items-center gap-1 text-[10px] text-white/40">
                            <CheckCircle2 className="h-2.5 w-2.5 text-white/25" />{f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
                {i < CHAIN_STEPS.length - 1 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="h-3 w-px bg-white/15" />
                      <ArrowDown className="h-3.5 w-3.5 text-white/20" />
                      <div className="h-1 w-px bg-white/10" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Core Models */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" /> চারটি মূল মডেল
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOUR_MODELS.map(({ Icon, title, color, bg, border, points }) => (
            <div key={title} className={cn("rounded-2xl border p-5", bg, border)}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={cn("h-5 w-5", color)} />
                <h3 className={cn("font-semibold text-sm", color)}>{title}</h3>
              </div>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="text-white/25 mt-0.5 shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Commission model */}
      <GlassCard className="p-5 border border-white/[0.07]">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-purple-400" /> কমিশন ও ফি কাঠামো
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMMISSION_FLOW.map(({ from, to, rate, color, bg, border }) => (
            <div key={from + to} className={cn("rounded-xl border p-3 text-center", bg, border)}>
              <div className={cn("text-2xl font-black mb-1", color)}>{rate}</div>
              <div className="text-[10px] text-white/35 uppercase tracking-wider">প্ল্যাটফর্ম ফি</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-white/55">
                <span>{from}</span>
                <ArrowRight className="h-3 w-3 text-white/25" />
                <span>{to}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/35 mt-3">
          প্রতিটি লেনদেনে প্ল্যাটফর্ম কমিশন স্বয়ংক্রিয়ভাবে কেটে নেওয়া হয়। বিক্রেতারা ��াদের নেট পেমেন্ট ড্যাশবোর্ডে দেখতে পাবেন।
        </p>
      </GlassCard>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "কারখানা রেজিস্ট্রেশন", href: "/auth/factory-register", Icon: Factory, color: "text-cyan-400 border-cyan-500/20" },
          { label: "পাইকারি রেজিস্ট্রেশন", href: "/auth/wholesale-register", Icon: Store, color: "text-emerald-400 border-emerald-500/20" },
          { label: "গ্রামীণ দোকান", href: "/auth/rural-register", Icon: MapPin, color: "text-amber-400 border-amber-500/20" },
          { label: "ডেলিভারি বোর্ড", href: "/logistics", Icon: Truck, color: "text-blue-400 border-blue-500/20" },
        ].map(({ label, href, Icon, color }) => (
          <Link key={href} href={href}>
            <div className={cn(
              "rounded-xl border p-4 text-center cursor-pointer hover:bg-white/5 transition-all",
              color.split(" ")[1]
            )}>
              <Icon className={cn("h-5 w-5 mx-auto mb-2", color.split(" ")[0])} />
              <div className="text-xs text-white/70 font-medium leading-tight">{label}</div>
              <ChevronRight className="h-3 w-3 mx-auto mt-1.5 text-white/25" />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "নিবন্ধিত সেলার",  value: "১,২০০+", Icon: Store,       color: "text-emerald-400" },
          { label: "কারখানা পার্টনার", value: "১২০+",  Icon: Factory,     color: "text-cyan-400" },
          { label: "গ্রামীণ দোকান",    value: "৩,৪০০+", Icon: MapPin,     color: "text-amber-400" },
          { label: "মোট ট্রানজেকশন",  value: "৳২ কোটি+", Icon: Wallet,   color: "text-purple-400" },
        ].map(({ label, value, Icon, color }) => (
          <GlassCard key={label} className="p-4 border border-white/[0.06]">
            <Icon className={cn("h-4 w-4 mb-2", color)} />
            <div className={cn("text-xl font-black", color)}>{value}</div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Verification */}
      <div className="p-5 rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h3 className="font-semibold text-white">যাচাইকরণ প্রক্রিয়া</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { step: "১", title: "আবেদন করুন", desc: "রেজিস্ট্রেশন ফর্ম পূরণ করুন — ট্রেড লাইসেন্স ও NID দিয়ে" },
            { step: "২", title: "যাচাই ২৪ঘণ্টা", desc: "এডমিন টিম তথ্য যাচাই করবে। প্রয়োজনে ডকুমেন্ট চাওয়া হবে" },
            { step: "৩", title: "সক্রিয় অ্যাকাউন্ট", desc: "অনুমোদনের পর ড্যাশবোর্ড সক্রিয় হবে, পণ্য আপলোড করতে পারবেন" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="h-7 w-7 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">{step}</div>
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-white/45 leading-relaxed mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
