import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe, Factory, BadgeCheck, Search, Shield,
  Users, Package, ArrowUpRight, MapPin, Star, Calendar, Truck
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../modules/auth/store/authStore";

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
  const { isAuthenticated } = useAuthStore();
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
    <div className="flex flex-col gap-6 pb-20 px-4 pt-4 text-[var(--pm-text)]">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[rgba(13,13,26,0.95)] via-[rgba(26,26,46,0.95)] to-[rgba(13,13,26,0.95)] p-6 md:p-10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.12)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">PaikarMart Global</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#ffffff] mb-3 leading-tight">
            Bangladesh's B2B<br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"> Export Marketplace</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--pm-text-secondary)] max-w-xl mb-6">
            বাংলাদেশী রপ্তানিকারক ও প্রস্তুতকারক কারখানার সাথে সরাসরি যোগাযোগ স্থাপন করুন। সরাসরি সোর্সিং করুন আন্তর্জাতিক মানের পণ্য।
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth/factory-register">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[#ffffff] text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer">
                <Factory className="h-4 w-4" /> Register as Exporter
              </button>
            </Link>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/8 transition-all cursor-pointer">
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
            <div key={label} className="bg-white/5 rounded-2xl p-3 border border-white/[0.05] flex flex-col items-center text-center">
              <Icon className={cn("h-4 w-4 mb-1", color)} />
              <div className={cn("text-lg font-extrabold", color)}>{value}</div>
              <div className="text-[9px] text-[var(--pm-text-muted)] uppercase tracking-wider font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pm-text-muted)]" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="পণ্য, ক্যাটাগরি বা জেলা দিয়ে খুঁজুন..."
              className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-cyan-400/25 focus:border-cyan-400/40 rounded-full h-10 pl-9 pr-4 text-xs text-[#ffffff] placeholder:text-[var(--pm-text-muted)] outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-full border text-xs font-semibold transition-all shrink-0 cursor-pointer",
              verifiedOnly ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:border-cyan-500/20",
            )}
          >
            <Shield className="h-3.5 w-3.5" /> Verified Exporters
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-xs border transition-all cursor-pointer font-bold",
              !activeCategory ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:border-white/15"
            )}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap cursor-pointer font-bold",
                activeCategory === cat ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" : "border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:border-white/15"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Factory listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="md:col-span-2 py-16 text-center text-[var(--pm-text-muted)] border border-dashed border-[var(--pm-border)] rounded-2xl">
            কোন এক্সপোর্টার ফ্যাক্টরি পাওয়া যায়নি। <button onClick={() => { setSearch(""); setActiveCategory(null); }} className="text-cyan-400 hover:underline cursor-pointer">ফিল্টার মুছুন</button>
          </div>
        )}
        {filtered.map((f) => (
          <Link key={f.id} to={`/export/factory/${f.id}`} className="no-underline">
            <div className="glass-card hover:border-cyan-500/30 p-5 flex flex-col justify-between h-full transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-extrabold text-[#ffffff] line-clamp-1 group-hover:text-cyan-300 transition-colors">{f.companyName}</h3>
                  {f.verified && (
                    <BadgeCheck className="h-5 w-5 text-cyan-400 shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-[var(--pm-text-secondary)] mb-3">
                  <MapPin className="h-3.5 w-3.5 text-cyan-500" />
                  <span>{f.district}, Bangladesh</span>
                </div>

                <p className="text-xs text-[var(--pm-text-secondary)] line-clamp-2 mb-4 leading-relaxed">{f.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.productCategories.map((c) => (
                    <span key={c} className="text-[9px] bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">
                      {c}
                    </span>
                  ))}
                  {f.certifications.slice(0, 3).map((cert) => (
                    <span key={cert} className="text-[9px] bg-white/5 border border-white/5 text-[var(--pm-text-secondary)] px-2 py-0.5 rounded-full font-semibold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom statistics */}
              <div className="pt-3 border-t border-white/5 flex gap-4 text-[10px] text-[var(--pm-text-muted)] justify-between">
                <div>
                  <span className="block text-[var(--pm-text-muted)] uppercase tracking-wider text-[8px] font-black">MINIMUM ORDER</span>
                  <span className="font-extrabold text-[#ffffff]">{f.minOrderQty}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[var(--pm-text-muted)] uppercase tracking-wider text-[8px] font-black">ESTABLISHED</span>
                  <span className="font-extrabold text-[#ffffff]">{f.established}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
