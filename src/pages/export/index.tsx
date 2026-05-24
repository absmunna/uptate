import { useState } from "react";
import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Globe, Factory, BadgeCheck, Search, Filter, ChevronRight,
  Users, Package, ArrowUpRight, MapPin, Star, Shield, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";

// Demo data — in production this comes from API
const DEMO_FACTORIES = [
  {
    id: "f1", companyName: "Dhaka Textile Industries Ltd.", district: "Dhaka",
    productCategories: ["Readymade Garments (RMG)", "Home Textiles"],
    exportCountries: ["USA", "UK", "Germany", "France"],
    certifications: ["ISO 9001", "OEKO-TEX", "BSCI", "WRAP"],
    employees: "2,400", established: "1996", minOrderQty: "5,000 pcs/style",
    membershipBody: "BGMEA", verified: true, rating: 4.8, reviewCount: 34,
    description: "30+ years of export experience. Specializing in woven & knit garments for EU/US buyers.",
    annualRevenue: "$12M", productionCapacity: "150,000 pcs/month",
  },
  {
    id: "f2", companyName: "Chittagong Leather Works", district: "Chittagong",
    productCategories: ["Leather & Leather Goods", "Footwear"],
    exportCountries: ["Italy", "Spain", "Japan", "UAE"],
    certifications: ["ISO 9001", "LEED", "SEDEX"],
    employees: "850", established: "2003", minOrderQty: "500 pairs",
    membershipBody: "LFMEAB", verified: true, rating: 4.6, reviewCount: 21,
    description: "Premium leather goods & footwear manufacturer. EU REACH compliant. Tannery-to-shelf supply chain.",
    annualRevenue: "$4.5M", productionCapacity: "40,000 units/month",
  },
  {
    id: "f3", companyName: "Sylhet Agro Exports", district: "Sylhet",
    productCategories: ["Agro Products", "Frozen Food / Seafood"],
    exportCountries: ["UK", "USA", "UAE", "Saudi Arabia", "Australia"],
    certifications: ["Halal", "FDA", "ISO 14001"],
    employees: "320", established: "2009", minOrderQty: "1 FCL",
    membershipBody: "FBCCI", verified: true, rating: 4.9, reviewCount: 52,
    description: "Certified Halal & FDA-approved agro exporter. Fresh & frozen hilsa, shrimp, and organic produce.",
    annualRevenue: "$6.2M", productionCapacity: "200 MT/month",
  },
  {
    id: "f4", companyName: "Rajshahi Silk & Fabrics", district: "Rajshahi",
    productCategories: ["Textile Fabrics", "Handicrafts"],
    exportCountries: ["India", "Japan", "South Korea"],
    certifications: ["GOTS", "OEKO-TEX"],
    employees: "180", established: "2011", minOrderQty: "500 meters",
    membershipBody: "BTMA", verified: false, rating: 4.4, reviewCount: 12,
    description: "Traditional Rajshahi silk & hand-loom fabrics with modern export packaging.",
    annualRevenue: "$800K", productionCapacity: "15,000 meters/month",
  },
];

const ALL_CATEGORIES = [...new Set(DEMO_FACTORIES.flatMap((f) => f.productCategories))];

export default function ExportMarketplace() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = DEMO_FACTORIES.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.companyName.toLowerCase().includes(q) || f.productCategories.some((c) => c.toLowerCase().includes(q)) || f.district.toLowerCase().includes(q);
    const matchCat = !activeCategory || f.productCategories.includes(activeCategory);
    const matchVerified = !verifiedOnly || f.verified;
    return matchSearch && matchCat && matchVerified;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#040d1e] via-[#071428] to-[#040a18] p-6 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.08)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">PaikarMart Global</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Bangladesh's B2B<br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"> Export Marketplace</span>
          </h1>
          <p className="text-sm md:text-base text-white/55 max-w-xl mb-6">
            Connect directly with verified Bangladeshi manufacturers, factories, and exporters.
            Source authentic products with full compliance documentation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/auth/factory-register">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold neon-glow-sm hover:from-cyan-400 hover:to-blue-500 transition-all">
                <Factory className="h-4 w-4" /> Register as Exporter
              </button>
            </Link>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/8 transition-all">
              <ArrowUpRight className="h-4 w-4" /> Find a Supplier
            </button>
          </div>
        </div>
        {/* Trust stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-8">
          {[
            { label: "Verified Exporters", value: "120+", Icon: BadgeCheck, color: "text-cyan-400" },
            { label: "Export Countries", value: "40+",   Icon: Globe,       color: "text-blue-400" },
            { label: "B2B Transactions",  value: "$2M+",  Icon: Package,     color: "text-purple-400" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white/4 rounded-xl p-3 border border-white/[0.07]">
              <Icon className={cn("h-4 w-4 mb-1", color)} />
              <div className={cn("text-xl font-bold", color)}>{value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, product, district…"
              className="w-full bg-white/5 border border-white/8 hover:border-cyan-400/25 focus:border-cyan-400/40 rounded-xl h-10 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 h-10 rounded-xl border text-sm font-medium transition-all shrink-0",
              verifiedOnly ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-white/10 text-white/50 hover:border-white/25",
            )}
          >
            <Shield className="h-3.5 w-3.5" /> Verified
          </button>
        </div>
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs border transition-all", !activeCategory ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-white/10 text-white/45 hover:border-white/25")}
          >All</button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn("shrink-0 px-3 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap", activeCategory === cat ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-white/10 text-white/45 hover:border-white/25")}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Factory listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="md:col-span-2 py-16 text-center text-white/35 border border-dashed border-white/10 rounded-2xl">
            No factories found. <button onClick={() => { setSearch(""); setActiveCategory(null); }} className="text-cyan-400 hover:underline">Clear filters</button>
          </div>
        )}
        {filtered.map((f) => (
          <Link key={f.id} href={`/export/factory/${f.id}`}>
            <GlassCard className="h-full p-5 cursor-pointer border border-white/[0.07] hover:border-cyan-400/25 transition-all group" hoverEffect>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Factory className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">{f.companyName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-white/30" />
                      <span className="text-xs text-white/40">{f.district}</span>
                      {f.membershipBody && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/40">{f.membershipBody}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {f.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] text-cyan-300 font-semibold">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{f.rating}</span>
                    <span className="text-white/30">({f.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-3">{f.description}</p>

              {/* Product categories */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {f.productCategories.map((cat) => (
                  <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-300">{cat}</span>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 mb-3">
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider">Employees</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1 mt-0.5"><Users className="h-3 w-3 text-cyan-400/60" />{f.employees}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider">Est.</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{f.established}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider">MOQ</div>
                  <div className="text-xs font-semibold text-white mt-0.5 truncate">{f.minOrderQty}</div>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mb-3">
                {f.certifications.slice(0, 4).map((cert) => (
                  <span key={cert} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/8 border border-emerald-500/20 text-emerald-300">{cert}</span>
                ))}
                {f.certifications.length > 4 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">+{f.certifications.length - 4}</span>
                )}
              </div>

              {/* Export countries */}
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Truck className="h-3 w-3 text-white/25" />
                <span>Ships to: {f.exportCountries.slice(0, 4).join(", ")}{f.exportCountries.length > 4 ? ` +${f.exportCountries.length - 4}` : ""}</span>
              </div>

              <div className="flex justify-end mt-3">
                <span className="flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  View Profile <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* CTA for non-authenticated */}
      {!isAuthenticated && (
        <GlassCard className="p-6 text-center border border-cyan-500/15">
          <Globe className="h-10 w-10 text-cyan-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-2">Are you an international buyer?</h3>
          <p className="text-sm text-white/50 mb-4">Create a free account to contact factories, request quotes, and access verified export documentation.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/auth/register">
              <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold neon-glow-sm hover:from-cyan-400 hover:to-blue-500 transition-all">
                Sign Up as Buyer
              </button>
            </Link>
            <Link href="/auth/factory-register">
              <button className="px-5 py-2 rounded-xl border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/8 transition-all">
                Register Factory
              </button>
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
