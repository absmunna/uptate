import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, MapPin, Search, Filter, Clock, Users, Ticket,
  Star, Heart, Share2, X, ChevronRight, BadgeCheck,
  Music, Mic, Gamepad2, BookOpen, Utensils, Palette,
  Trophy, Briefcase, Zap, Check, Tag
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type EventCategory = "all" | "music" | "business" | "food" | "sports" | "arts" | "tech" | "education";

type Event = {
  id: string; title: string; organizer: string; category: EventCategory;
  date: string; time: string; venue: string; city: string;
  price: number | null; maxAttendees: number; attendees: number;
  image: string; description: string; tags: string[];
  featured?: boolean; free?: boolean; online?: boolean;
};

const EVENTS: Event[] = [
  {
    id: "e1", title: "Dhaka Music Festival 2026", organizer: "Bangladesh Music Foundation",
    category: "music", date: "Jun 15, 2026", time: "5:00 PM", venue: "Army Stadium", city: "Dhaka",
    price: 500, maxAttendees: 10000, attendees: 7832,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=70",
    description: "The biggest music festival in Bangladesh featuring 30+ artists across 3 stages. Live performances by top Bangladeshi and international musicians.",
    tags: ["Music", "Festival", "Live"], featured: true,
  },
  {
    id: "e2", title: "Startup Bangladesh Summit 2026", organizer: "BASIS",
    category: "business", date: "Jun 20, 2026", time: "9:00 AM", venue: "Bangabandhu Convention Center", city: "Dhaka",
    price: 2000, maxAttendees: 2000, attendees: 1456,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70",
    description: "The premier startup and tech business event in South Asia. Keynotes, investor meetings, pitch competitions and networking.",
    tags: ["Startup", "Tech", "Networking"], featured: true,
  },
  {
    id: "e3", title: "Dhaka Food Carnival", organizer: "F&B Association BD",
    category: "food", date: "Jun 25, 2026", time: "11:00 AM", venue: "Hatirjheel Amphitheater", city: "Dhaka",
    price: 200, maxAttendees: 5000, attendees: 3200,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=70",
    description: "Over 100 food stalls, live cooking shows, chef competitions and culinary workshops. Best street food in one place.",
    tags: ["Food", "Carnival", "Street Food"],
  },
  {
    id: "e4", title: "International Cricket League BD", organizer: "BCB Events",
    category: "sports", date: "Jul 1, 2026", time: "2:00 PM", venue: "Sher-e-Bangla National Stadium", city: "Dhaka",
    price: 300, maxAttendees: 25000, attendees: 22000,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=70",
    description: "T20 exhibition matches featuring Bangladesh national cricketers and international stars.",
    tags: ["Cricket", "Sports", "T20"],
  },
  {
    id: "e5", title: "Webinar: AI & Future of Work", organizer: "TechBD",
    category: "tech", date: "Jun 18, 2026", time: "7:00 PM", venue: "Online (Zoom)", city: "Online",
    price: null, maxAttendees: 1000, attendees: 654,
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=70",
    description: "Free webinar exploring AI's impact on jobs, automation trends and how to future-proof your career.",
    tags: ["AI", "Career", "Free"], free: true, online: true,
  },
  {
    id: "e6", title: "Dhaka Art Biennale", organizer: "Bengal Foundation",
    category: "arts", date: "Jul 5, 2026", time: "10:00 AM", venue: "Bengal Shilpalaya", city: "Dhaka",
    price: 150, maxAttendees: 3000, attendees: 1876,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=70",
    description: "Contemporary art exhibition featuring 50+ artists from Bangladesh and South Asia. Paintings, sculptures and digital art.",
    tags: ["Art", "Gallery", "Culture"],
  },
];

const CAT_FILTERS: { id: EventCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",       label: "All",       icon: Calendar },
  { id: "music",     label: "Music",     icon: Music },
  { id: "business",  label: "Business",  icon: Briefcase },
  { id: "food",      label: "Food",      icon: Utensils },
  { id: "sports",    label: "Sports",    icon: Trophy },
  { id: "tech",      label: "Tech",      icon: Zap },
  { id: "arts",      label: "Arts",      icon: Palette },
  { id: "education", label: "Education", icon: BookOpen },
];

export default function EventsPortal() {
  const [category, setCategory] = useState<EventCategory>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Event | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const filtered = EVENTS.filter(e => {
    const matchCat = category === "all" || e.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(e => e.featured);
  const rest = filtered.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="events" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="events" />
      </div>
      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-pink-500/20 p-5 bg-gradient-to-br from-pink-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-2xl">🎉</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarEvents</h1>
              <p className="text-[11px] text-zinc-400">Concerts, expos, sports & more</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[{ label: "Events", value: "500+", emoji: "🎊" }, { label: "Cities", value: "32", emoji: "🏙️" }, { label: "This Month", value: "48", emoji: "📅" }].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-pink-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-pink-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Event name, city..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-pink-400" />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-pink-500/15 border-pink-500/30 text-pink-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Featured Events */}
        {featured.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">🔥 Featured</p>
            <div className="space-y-3">
              {featured.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} saved={saved.has(event.id)} booked={booked.has(event.id)} onSave={id => setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })} onOpen={() => setSelected(event)} featured />
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Events</p>
        <div className="space-y-2.5">
          {rest.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} saved={saved.has(event.id)} booked={booked.has(event.id)} onSave={id => setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })} onOpen={() => setSelected(event)} />
          ))}
        </div>
      </div>

      {/* Event Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="h-52 relative overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
                {selected.free && <div className="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-emerald-500/90 text-[10px] font-black text-white">FREE</div>}
                {selected.online && <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-xl bg-blue-500/80 text-[9px] font-black text-white">🌐 Online</div>}
              </div>
              <div className="px-4 pb-8">
                <h2 className="text-lg font-black text-white mb-1">{selected.title}</h2>
                <p className="text-[11px] text-zinc-500 mb-4">by {selected.organizer}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-pink-400" /><span className="text-[12px] text-zinc-300">{selected.date} · {selected.time}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400" /><span className="text-[12px] text-zinc-300">{selected.venue}, {selected.city}</span></div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-400" /><span className="text-[12px] text-zinc-300">{selected.attendees.toLocaleString()} attending · {selected.maxAttendees.toLocaleString()} capacity</span></div>
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-5">{selected.description}</p>
                <div className="flex items-center justify-between mb-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <div><p className="text-[9px] text-zinc-600">Ticket Price</p><p className="text-xl font-black text-pink-400">{selected.free ? "FREE" : `৳${selected.price?.toLocaleString()}`}</p></div>
                  <div className="w-px h-10 bg-white/10" />
                  <div><p className="text-[9px] text-zinc-600">Availability</p><p className="text-[12px] font-black text-emerald-400">{selected.maxAttendees - selected.attendees} left</p></div>
                </div>
                {booked.has(selected.id) ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] text-center flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Registered!</div>
                ) : (
                  <button onClick={() => { setBooked(p => new Set([...p, selected.id])); toast.success("You're registered for the event!"); setSelected(null); }} className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Ticket className="w-4 h-4" /> {selected.free ? "Register Free" : "Book Ticket"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCard({ event: e, index, saved, booked, onSave, onOpen, featured }: {
  event: Event; index: number; saved: boolean; booked: boolean;
  onSave: (id: string) => void; onOpen: () => void; featured?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} onClick={onOpen} className={cn("overflow-hidden rounded-2xl border cursor-pointer transition-all", featured ? "border-pink-500/20" : "border-white/[0.05] hover:border-white/[0.10]")}>
      <div className="relative h-36 overflow-hidden">
        <img src={e.image} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {e.free && <span className="px-2 py-0.5 rounded-lg bg-emerald-500/90 text-[9px] font-black text-white">FREE</span>}
          {e.online && <span className="px-2 py-0.5 rounded-lg bg-blue-500/80 text-[9px] font-black text-white">Online</span>}
          {featured && <span className="px-2 py-0.5 rounded-lg bg-pink-500/90 text-[9px] font-black text-white">Featured</span>}
        </div>
        <button onClick={ev => { ev.stopPropagation(); onSave(e.id); }} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center", saved ? "bg-red-500/10 border-red-500/30" : "bg-black/40 border-white/20")}>
          <Heart className={cn("w-4 h-4", saved ? "text-red-500 fill-red-500" : "text-white")} />
        </button>
        <div className="absolute bottom-3 left-3">
          <p className="text-[12px] font-black text-white">{e.title}</p>
          <p className="text-[9px] text-white/70">{e.date} · {e.city}</p>
        </div>
      </div>
      <div className="p-3 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] text-zinc-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attendees.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          {booked && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-black text-emerald-400">Registered</span>}
          <span className="text-[11px] font-black text-pink-400">{e.free ? "FREE" : `৳${e.price}`}</span>
        </div>
      </div>
    </motion.div>
  );
}
