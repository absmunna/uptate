import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, MapPin, Search, Filter, BedDouble, Bath,
  Square, Star, BadgeCheck, Heart, Share2, X, Phone,
  Camera, ChevronRight, Home, TreePine, Warehouse, Building,
  TrendingUp, DollarSign, Calendar, Wifi, Car
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PropType = "all" | "apartment" | "house" | "commercial" | "land" | "villa";
type ListingType = "buy" | "rent";

type Property = {
  id: string; title: string; address: string; area: string;
  price: number; listingType: ListingType; propType: PropType;
  beds: number; baths: number; sqft: number;
  images: string[]; agent: string; agentPhone: string;
  rating: number; verified: boolean; featured?: boolean;
  amenities: string[]; description: string;
};

const PROPERTIES: Property[] = [
  {
    id: "p1", title: "Modern Apartment in Gulshan 2", address: "Road 11, Gulshan 2, Dhaka",
    area: "Gulshan", price: 95000, listingType: "rent", propType: "apartment",
    beds: 3, baths: 2, sqft: 1800,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=70"],
    agent: "Dhaka Realty BD", agentPhone: "01711-000001", rating: 4.8, verified: true, featured: true,
    amenities: ["AC", "Lift", "Generator", "Parking", "Security"],
    description: "Beautifully furnished 3-bed apartment in prime Gulshan 2 location. Modern kitchen, 24/7 security.",
  },
  {
    id: "p2", title: "Duplex Villa in Bashundhara", address: "Block B, Bashundhara R/A, Dhaka",
    area: "Bashundhara", price: 22000000, listingType: "buy", propType: "villa",
    beds: 5, baths: 4, sqft: 4500,
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=70"],
    agent: "Elite Properties BD", agentPhone: "01711-000002", rating: 4.9, verified: true, featured: true,
    amenities: ["Swimming Pool", "Garden", "Gym", "Parking", "Home Theatre"],
    description: "Stunning duplex villa with private pool and garden in the prestigious Bashundhara Residential Area.",
  },
  {
    id: "p3", title: "Commercial Space in Motijheel", address: "Dilkusha C/A, Motijheel, Dhaka",
    area: "Motijheel", price: 150000, listingType: "rent", propType: "commercial",
    beds: 0, baths: 3, sqft: 3200,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70"],
    agent: "BD Corporate Realty", agentPhone: "01711-000003", rating: 4.6, verified: true,
    amenities: ["24/7 Power", "AC", "Lift", "CCTV", "Parking"],
    description: "Prime commercial space in Motijheel business hub. Ideal for corporate offices and showrooms.",
  },
  {
    id: "p4", title: "Studio Flat in Dhanmondi", address: "Sat Masjid Road, Dhanmondi, Dhaka",
    area: "Dhanmondi", price: 25000, listingType: "rent", propType: "apartment",
    beds: 1, baths: 1, sqft: 650,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70"],
    agent: "HomeFind BD", agentPhone: "01711-000004", rating: 4.3, verified: false,
    amenities: ["AC", "WiFi Included", "Water Heater", "Security"],
    description: "Cozy fully-furnished studio flat in Dhanmondi, walking distance from restaurants and shopping.",
  },
  {
    id: "p5", title: "Plot in Rajshahi City", address: "New Town, Rajshahi City",
    area: "Rajshahi", price: 3500000, listingType: "buy", propType: "land",
    beds: 0, baths: 0, sqft: 5445,
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70"],
    agent: "Rajshahi Land Brokers", agentPhone: "01711-000005", rating: 4.5, verified: true,
    amenities: ["Registered", "Clear Title", "Road Access", "Utilities Available"],
    description: "Residential plot in upcoming Rajshahi New Town. All utilities available. Perfect for construction.",
  },
  {
    id: "p6", title: "Family Home in Chittagong", address: "GEC Circle, Chittagong",
    area: "Chittagong", price: 8500000, listingType: "buy", propType: "house",
    beds: 4, baths: 3, sqft: 3000,
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70"],
    agent: "Port City Homes", agentPhone: "01711-000006", rating: 4.7, verified: true,
    amenities: ["Garden", "Parking", "Generator", "Rooftop", "Security"],
    description: "Well-maintained family home near GEC Circle. Spacious rooms, large garden and rooftop terrace.",
  },
];

const TYPE_FILTERS: { id: PropType; label: string; icon: React.ElementType }[] = [
  { id: "all",        label: "All",        icon: Building2 },
  { id: "apartment",  label: "Apartment",  icon: Building },
  { id: "house",      label: "House",      icon: Home },
  { id: "villa",      label: "Villa",      icon: TreePine },
  { id: "commercial", label: "Commercial", icon: Warehouse },
  { id: "land",       label: "Land",       icon: Square },
];

export default function RealEstatePortal() {
  const [listingType, setListingType] = useState<ListingType>("rent");
  const [propType, setPropType] = useState<PropType>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = PROPERTIES.filter(p => {
    const matchListing = p.listingType === listingType;
    const matchType = propType === "all" || p.propType === propType;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
    return matchListing && matchType && matchSearch;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const formatPrice = (p: Property) => {
    if (p.listingType === "rent") return `৳${p.price.toLocaleString()}/mo`;
    const crore = p.price / 10000000;
    if (crore >= 1) return `৳${crore.toFixed(1)} Cr`;
    return `৳${(p.price / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="real-estate" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="real-estate" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-indigo-500/20 p-5 bg-gradient-to-br from-indigo-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">🏠</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarProperty</h1>
              <p className="text-[11px] text-zinc-400">Find your dream property in Bangladesh</p>
            </div>
          </div>
          {/* Buy/Rent Toggle */}
          <div className="relative z-10 flex gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-3">
            {(["rent", "buy"] as ListingType[]).map(t => (
              <button key={t} onClick={() => setListingType(t)} className={cn("flex-1 py-2 rounded-xl text-[12px] font-black capitalize transition-all", t === listingType ? "bg-indigo-500 text-white shadow-lg" : "text-zinc-500 hover:text-white")}>
                For {t === "buy" ? "Sale" : "Rent"}
              </button>
            ))}
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[
              { label: "Listings", value: "12,000+", emoji: "🏢" },
              { label: "Agents", value: "800+", emoji: "🤝" },
              { label: "Districts", value: "64", emoji: "🗺️" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-indigo-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-indigo-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Area, property type..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-indigo-400" />
          </button>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {TYPE_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPropType(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", propType === id ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Featured</p>
            <div className="space-y-3">
              {featured.map((prop, i) => (
                <PropertyCard key={prop.id} property={prop} index={i} saved={saved.has(prop.id)} onSave={id => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; })} onOpen={() => setSelected(prop)} formatPrice={formatPrice} featured />
              ))}
            </div>
          </div>
        )}

        {/* All */}
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{filtered.length} Properties</p>
          <div className="space-y-3">
            {rest.map((prop, i) => (
              <PropertyCard key={prop.id} property={prop} index={i} saved={saved.has(prop.id)} onSave={id => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; })} onOpen={() => setSelected(prop)} formatPrice={formatPrice} />
            ))}
            {!filtered.length && (
              <div className="py-16 text-center">
                <Building2 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-[13px] font-black text-zinc-600">No properties found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="h-56 relative overflow-hidden">
                <img src={selected.images[0]} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] via-transparent to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute top-5 right-5 flex gap-2">
                  <button className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"><Share2 className="w-4 h-4 text-white" /></button>
                </div>
              </div>
              <div className="px-4 pb-8">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-lg font-black text-white">{selected.title}</h2>
                  {selected.verified && <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <p className="text-[11px] text-zinc-500">{selected.address}</p>
                </div>
                <p className="text-2xl font-black text-indigo-400 mb-4">{formatPrice(selected)}</p>
                <div className="flex gap-3 mb-5">
                  {selected.beds > 0 && <div className="flex items-center gap-1 text-[11px] text-zinc-400"><BedDouble className="w-4 h-4" />{selected.beds} Beds</div>}
                  {selected.baths > 0 && <div className="flex items-center gap-1 text-[11px] text-zinc-400"><Bath className="w-4 h-4" />{selected.baths} Baths</div>}
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400"><Square className="w-4 h-4" />{selected.sqft.toLocaleString()} sqft</div>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{selected.description}</p>
                <div className="mb-5">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.amenities.map(a => <span key={a} className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400">{a}</span>)}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
                  <p className="text-[11px] font-black text-white">{selected.agent}</p>
                  <div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><p className="text-[9px] text-zinc-400">{selected.rating} Rating</p></div>
                </div>
                <button onClick={() => toast.success(`Calling ${selected.agent}...`)} className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Contact Agent
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyCard({ property: p, index, saved, onSave, onOpen, formatPrice, featured }: {
  property: Property; index: number; saved: boolean; onSave: (id: string) => void;
  onOpen: () => void; formatPrice: (p: Property) => string; featured?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={onOpen} className={cn("overflow-hidden rounded-2xl border cursor-pointer transition-all", featured ? "border-indigo-500/20" : "border-white/[0.05] hover:border-white/[0.10]")}>
      <div className="relative h-44 overflow-hidden">
        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black", p.listingType === "rent" ? "bg-cyan-500/90 text-white" : "bg-amber-500/90 text-black")}>
            For {p.listingType === "buy" ? "Sale" : "Rent"}
          </span>
          {featured && <span className="px-2 py-0.5 rounded-lg bg-violet-500/90 text-[9px] font-black text-white">Featured</span>}
        </div>
        <button onClick={e => { e.stopPropagation(); onSave(p.id); }} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-all", saved ? "bg-red-500/10 border-red-500/30" : "bg-black/40 border-white/20")}>
          <Heart className={cn("w-4 h-4", saved ? "text-red-500 fill-red-500" : "text-white")} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <p className="text-base font-black text-white">{formatPrice(p)}</p>
          <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-[10px] font-black text-white">{p.rating}</span></div>
        </div>
      </div>
      <div className="p-3.5 bg-white/[0.02]">
        <div className="flex items-start gap-2 justify-between mb-1">
          <p className="text-[12px] font-black text-white line-clamp-1">{p.title}</p>
          {p.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
        </div>
        <div className="flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-zinc-600" /><p className="text-[10px] text-zinc-500 truncate">{p.area}</p></div>
        <div className="flex items-center gap-3 text-[9px] text-zinc-500">
          {p.beds > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.beds} bed</span>}
          {p.baths > 0 && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.baths} bath</span>}
          <span className="flex items-center gap-1"><Square className="w-3 h-3" />{p.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </motion.div>
  );
}
