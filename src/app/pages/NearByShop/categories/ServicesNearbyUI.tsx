import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench, Star, Clock, MapPin, X, ChevronRight, BadgeCheck,
  Phone, MessageCircle, Check, Zap, Hammer, Paintbrush,
  Tv, Wifi, Droplets, Sofa, ShieldCheck, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ServiceType = { id: string; label: string; icon: any; color: string };
type ServiceProvider = {
  id: string; name: string; type: string; category: string;
  rating: number; reviews: number; price: string; priceUnit: string;
  distance: string; area: string; available: boolean; verified: boolean;
  completedJobs: number; responseTime: string; avatar: string; description: string;
};

const SERVICE_TYPES: ServiceType[] = [
  { id: "all", label: "All Services", icon: Wrench, color: "text-amber-400" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "text-yellow-400" },
  { id: "plumbing", label: "Plumbing", icon: Droplets, color: "text-blue-400" },
  { id: "painting", label: "Painting", icon: Paintbrush, color: "text-pink-400" },
  { id: "ac", label: "AC Repair", icon: Tv, color: "text-cyan-400" },
  { id: "wifi", label: "Internet", icon: Wifi, color: "text-purple-400" },
  { id: "furniture", label: "Furniture", icon: Sofa, color: "text-orange-400" },
  { id: "carpenter", label: "Carpenter", icon: Hammer, color: "text-lime-400" },
];

const PROVIDERS: ServiceProvider[] = [
  {
    id: "sp1", name: "Rakib Electric Works", type: "Electrician", category: "electrical",
    rating: 4.9, reviews: 412, price: "400", priceUnit: "visit", distance: "0.7 km", area: "Banani",
    available: true, verified: true, completedJobs: 890, responseTime: "15 min",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70",
    description: "Expert electrician for wiring, panel, socket repair & installation."
  },
  {
    id: "sp2", name: "Karim Plumbing Services", type: "Plumber", category: "plumbing",
    rating: 4.7, reviews: 234, price: "500", priceUnit: "visit", distance: "1.2 km", area: "Dhanmondi",
    available: true, verified: true, completedJobs: 456, responseTime: "30 min",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70",
    description: "Water pipe repair, bathroom fitting, drainage cleaning & installation."
  },
  {
    id: "sp3", name: "Color Master BD", type: "Painter", category: "painting",
    rating: 4.8, reviews: 189, price: "800", priceUnit: "room", distance: "2.0 km", area: "Gulshan",
    available: false, verified: true, completedJobs: 320, responseTime: "1 hr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70",
    description: "Interior & exterior painting with premium Berger/Asian Paints. 1-year warranty."
  },
  {
    id: "sp4", name: "Cool Tech AC", type: "AC Technician", category: "ac",
    rating: 4.6, reviews: 167, price: "600", priceUnit: "unit", distance: "0.9 km", area: "Mirpur",
    available: true, verified: false, completedJobs: 234, responseTime: "45 min",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=70",
    description: "AC installation, servicing, gas refill for all brands. Same-day service."
  },
  {
    id: "sp5", name: "NetFix BD", type: "Internet Technician", category: "wifi",
    rating: 4.7, reviews: 98, price: "350", priceUnit: "visit", distance: "1.5 km", area: "Mohakhali",
    available: true, verified: true, completedJobs: 145, responseTime: "1 hr",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70",
    description: "WiFi router setup, LAN wiring, network troubleshooting & CCTV."
  },
  {
    id: "sp6", name: "Royal Furniture Repair", type: "Carpenter", category: "carpenter",
    rating: 4.8, reviews: 121, price: "500", priceUnit: "job", distance: "3.0 km", area: "Uttara",
    available: true, verified: true, completedJobs: 189, responseTime: "2 hrs",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=70",
    description: "Furniture repair, custom wardrobes, kitchen cabinets & door fitting."
  },
];

const BookingModal = ({ provider, onClose }: { provider: ServiceProvider; onClose: () => void }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [booked, setBooked] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
        {!booked ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Book Service</h3>
                <p className="text-[10px] text-zinc-500">{provider.name} · ৳{provider.price}/{provider.priceUnit}</p>
              </div>
              <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-amber-500/40 [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"].map(t => (
                    <button key={t} onClick={() => setTime(t)} className={cn("py-2 rounded-xl text-[10px] font-black border transition-all", time === t ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500")}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Special Instructions</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Describe the issue..." rows={2} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none resize-none" />
              </div>
            </div>
            <button onClick={() => { if (date && time) { setBooked(true); } else { toast.error("Pick a date and time"); } }} className="w-full mt-4 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[12px] uppercase tracking-wide transition-all">
              Confirm Booking
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Check className="w-8 h-8 text-amber-400" />
            </motion.div>
            <div>
              <h4 className="text-lg font-black text-white">Booking Confirmed!</h4>
              <p className="text-xs text-zinc-400 mt-1">{provider.name} will arrive on {date} at {time}</p>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 text-[11px] font-black text-white">Done</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const ServicesNearbyUI: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [activeType, setActiveType] = useState("all");
  const [bookingProvider, setBookingProvider] = useState<ServiceProvider | null>(null);

  const filtered = PROVIDERS.filter(p => {
    const matchType = activeType === "all" || p.category === activeType;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const activeTypeData = SERVICE_TYPES.find(t => t.id === activeType);

  return (
    <div className="px-4 py-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {SERVICE_TYPES.map(st => {
          const Icon = st.icon;
          const isActive = activeType === st.id;
          return (
            <motion.button key={st.id} whileTap={{ scale: 0.94 }} onClick={() => setActiveType(st.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                isActive ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="w-3 h-3" />{st.label}
            </motion.button>
          );
        })}
      </div>

      {/* Provider Cards */}
      <div className="space-y-3">
        {filtered.map((provider, i) => (
          <motion.div key={provider.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("rounded-2xl border p-4 bg-white/[0.02] transition-all", provider.available ? "border-white/[0.06]" : "border-white/[0.03] opacity-60")}
          >
            <div className="flex gap-3">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                  <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                {provider.available && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[var(--pm-bg)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[12px] font-black text-white">{provider.name}</p>
                  {provider.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <p className="text-[10px] text-amber-400 font-bold mb-1">{provider.type}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-zinc-400">{provider.rating} ({provider.reviews})</span>
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] text-zinc-500"><MapPin className="w-3 h-3" />{provider.area} · {provider.distance}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-black text-white">৳{provider.price}</p>
                <p className="text-[9px] text-zinc-600">/{provider.priceUnit}</p>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 mt-2 mb-3 leading-relaxed">{provider.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-[9px] text-zinc-600">
                <span className="flex items-center gap-0.5"><ShieldCheck className="w-3 h-3 text-amber-400" />{provider.completedJobs} jobs</span>
                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />Responds in {provider.responseTime}</span>
              </div>
              {provider.available ? (
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[10px] font-black text-zinc-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                  </button>
                  <button onClick={() => setBookingProvider(provider)} className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[10px] font-black text-black flex items-center gap-1 transition-all">
                    <Calendar className="w-3 h-3" /> Book
                  </button>
                </div>
              ) : (
                <span className="text-[9px] text-zinc-600 font-bold">Unavailable</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {bookingProvider && <BookingModal provider={bookingProvider} onClose={() => setBookingProvider(null)} />}
      </AnimatePresence>
    </div>
  );
};
