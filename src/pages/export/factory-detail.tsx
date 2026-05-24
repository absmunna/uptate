import { useParams, Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Factory, Globe, BadgeCheck, MapPin, Star, Users, Package,
  ArrowLeft, Mail, Phone, ExternalLink, Shield, Truck, Calendar,
  Lock, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

// Matches data in index.tsx — in production fetched from API
const FACTORY_DATA: Record<string, any> = {
  f1: {
    id: "f1", companyName: "Dhaka Textile Industries Ltd.", district: "Dhaka",
    companyAddress: "Plot 12, BSCIC Industrial Area, Gazipur", postcode: "1700",
    productCategories: ["Readymade Garments (RMG)", "Home Textiles"],
    exportCountries: ["USA", "UK", "Germany", "France", "Italy", "Canada"],
    certifications: ["ISO 9001", "OEKO-TEX", "BSCI", "WRAP", "SEDEX"],
    employees: "2,400", established: "1996", minOrderQty: "5,000 pcs/style",
    productionCapacity: "150,000 pcs/month", annualRevenue: "$12M",
    membershipBody: "BGMEA", membershipNo: "BGMEA-4821",
    verified: true, rating: 4.8, reviewCount: 34,
    description: "Dhaka Textile Industries is one of Bangladesh's leading woven & knit garment manufacturers with 30+ years of export experience. We supply directly to major retailers and brands across the USA, UK, and EU with full compliance documentation and ethical sourcing certification.\n\nOur modern facility in Gazipur BSCIC Industrial Zone is equipped with German cutting machines, Japanese sewing equipment, and a fully automated finishing line.",
    contactName: "MD. Kamal Hossain",
    website: "https://dhaka-textile-bd.com",
    // PUBLIC fields only — contact shown only to registered users
  },
  f2: {
    id: "f2", companyName: "Chittagong Leather Works", district: "Chittagong",
    companyAddress: "EPZ Road, Chittagong Export Processing Zone", postcode: "4200",
    productCategories: ["Leather & Leather Goods", "Footwear"],
    exportCountries: ["Italy", "Spain", "Japan", "UAE", "South Korea"],
    certifications: ["ISO 9001", "LEED", "SEDEX"],
    employees: "850", established: "2003", minOrderQty: "500 pairs",
    productionCapacity: "40,000 units/month", annualRevenue: "$4.5M",
    membershipBody: "LFMEAB", verified: true, rating: 4.6, reviewCount: 21,
    description: "Premium leather goods & footwear manufacturer specializing in EU market compliance. REACH-compliant. Tannery-to-shelf integrated supply chain with in-house QC laboratory.",
    contactName: "Farhana Begum",
    website: "https://clt-leather.com",
  },
  f3: {
    id: "f3", companyName: "Sylhet Agro Exports", district: "Sylhet",
    companyAddress: "Moulvibazar Road, Sylhet", postcode: "3100",
    productCategories: ["Agro Products", "Frozen Food / Seafood"],
    exportCountries: ["UK", "USA", "UAE", "Saudi Arabia", "Australia", "Canada"],
    certifications: ["Halal", "FDA", "ISO 14001"],
    employees: "320", established: "2009", minOrderQty: "1 FCL",
    productionCapacity: "200 MT/month", annualRevenue: "$6.2M",
    membershipBody: "FBCCI", verified: true, rating: 4.9, reviewCount: 52,
    description: "Certified Halal & FDA-approved agro exporter. We specialize in fresh & frozen hilsa, shrimp, organic rice, and spices. HACCP-certified cold chain facility.",
    contactName: "Rafiqul Islam",
    website: "",
  },
  f4: {
    id: "f4", companyName: "Rajshahi Silk & Fabrics", district: "Rajshahi",
    companyAddress: "Silk Factory Road, Rajshahi", postcode: "6000",
    productCategories: ["Textile Fabrics", "Handicrafts"],
    exportCountries: ["India", "Japan", "South Korea"],
    certifications: ["GOTS", "OEKO-TEX"],
    employees: "180", established: "2011", minOrderQty: "500 meters",
    productionCapacity: "15,000 meters/month", annualRevenue: "$800K",
    membershipBody: "BTMA", verified: false, rating: 4.4, reviewCount: 12,
    description: "Traditional Rajshahi silk & hand-loom fabrics with modern export packaging and dyeing standards.",
    contactName: "Nasrin Akhter",
    website: "",
  },
};

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      {Icon && <Icon className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">{label}</div>
        <div className="text-sm text-white/80">{value || "—"}</div>
      </div>
    </div>
  );
}

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const f = FACTORY_DATA[id ?? ""];

  if (!f) {
    return (
      <div className="py-16 text-center text-white/40">
        Factory not found. <Link href="/export" className="text-cyan-400 hover:underline">Back to Export Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-0 md:px-4 py-4 flex flex-col gap-5">
      {/* Back */}
      <Link href="/export" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Export Marketplace
      </Link>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 p-6 md:p-8 bg-gradient-to-br from-[#040d1e] to-[#071428]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border border-cyan-500/30 flex items-center justify-center shrink-0 neon-glow-sm">
            <Factory className="h-8 w-8 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{f.companyName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1 text-sm text-white/45">
                    <MapPin className="h-3.5 w-3.5" />{f.district}, Bangladesh
                  </div>
                  {f.membershipBody && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50">{f.membershipBody} {f.membershipNo && `· ${f.membershipNo}`}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                {f.verified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold neon-glow-sm">
                    <BadgeCheck className="h-3.5 w-3.5" /> PaikarMart Verified
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-bold">{f.rating}</span>
                  <span className="text-white/35">({f.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{f.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Stats grid */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Factory Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Employees",    value: f.employees,          Icon: Users,      color: "text-cyan-400" },
                { label: "Established",  value: f.established,        Icon: Calendar,   color: "text-blue-400" },
                { label: "MOQ",          value: f.minOrderQty,        Icon: Package,    color: "text-purple-400" },
                { label: "Capacity/mo",  value: f.productionCapacity, Icon: Factory,    color: "text-emerald-400" },
                { label: "Annual Export",value: f.annualRevenue,      Icon: Globe,      color: "text-amber-400" },
                { label: "Ships to",     value: `${f.exportCountries.length} countries`, Icon: Truck, color: "text-rose-400" },
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <Icon className={cn("h-4 w-4 mb-1.5", color)} />
                  <div className="text-sm font-bold text-white truncate">{value}</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Product categories */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3">Product Categories</h2>
            <div className="flex flex-wrap gap-2">
              {f.productCategories.map((cat: string) => (
                <span key={cat} className="px-3 py-1.5 rounded-xl border border-blue-500/25 bg-blue-500/8 text-blue-300 text-xs font-medium">{cat}</span>
              ))}
            </div>
          </GlassCard>

          {/* Certifications */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3">Quality Certifications</h2>
            <div className="flex flex-wrap gap-2">
              {f.certifications.map((cert: string) => (
                <div key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/8 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />{cert}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Export countries */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3">
              <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-cyan-400" /> Export Destinations</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {f.exportCountries.map((c: string) => (
                <span key={c} className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-white/60 text-xs">{c}</span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right — contact + inquiry */}
        <div className="flex flex-col gap-4">
          {/* Contact card */}
          <GlassCard className="p-5 border border-cyan-500/15">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Contact & Inquiry</h2>

            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <InfoRow label="Contact Person" value={f.contactName} icon={Users} />
                <InfoRow label="Location" value={`${f.companyAddress}, ${f.district} ${f.postcode}`} icon={MapPin} />
                {f.website && <InfoRow label="Website" value={f.website} icon={Globe} />}

                <button className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold neon-glow-sm hover:from-cyan-400 hover:to-blue-500 transition-all">
                  <Mail className="h-4 w-4" /> Send Inquiry
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/25 text-cyan-300 text-sm font-medium hover:bg-cyan-500/8 transition-all">
                  <Phone className="h-4 w-4" /> Request Quote
                </button>
                {f.website && (
                  <a href={f.website} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 text-white/40 hover:text-white/60 text-xs transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Visit Website
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/50 mb-4">Login to view contact details and send an inquiry.</p>
                <Link href="/auth/login">
                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold neon-glow-sm hover:from-cyan-400 hover:to-blue-500 transition-all">
                    Log In to Contact
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="w-full mt-2 py-2 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/25 hover:text-white/70 transition-all">
                    Create Free Account
                  </button>
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Verification shield */}
          <div className="p-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Export Compliance</span>
            </div>
            <ul className="space-y-1.5">
              {["Export License verified by admin", "Business registration confirmed", "Trade license on file", "Bank account verified"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[11px] text-emerald-200/70">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Register CTA */}
          <div className="p-4 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 text-center">
            <Globe className="h-6 w-6 text-cyan-400/70 mx-auto mb-2" />
            <p className="text-xs text-white/45 mb-3">Are you a factory owner? Join our export network.</p>
            <Link href="/auth/factory-register">
              <button className="w-full py-2 rounded-xl border border-cyan-500/25 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/8 transition-all">
                Register as Exporter →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
