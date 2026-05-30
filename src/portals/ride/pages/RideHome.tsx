import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Car, Bike, MapPin, Navigation, Clock, Star, BadgeCheck,
  Zap, Shield, ArrowRight, Users, Package, Truck,
  ChevronRight, Check, X, Phone, Sparkles, Locate
} from "lucide-react";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { StoryBar } from "@/components/feed/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RideType = { id: string; label: string; icon: any; desc: string; basePrice: number; priceUnit: string; eta: string; capacity: string; color: string; gradient: string };
type Driver = { id: string; name: string; rating: number; trips: number; vehicle: string; plate: string; avatar: string; distance: string; eta: string };

const RIDE_TYPES: RideType[] = [
  { id: "bike", label: "Moto", icon: Bike, desc: "Fastest · Solo ride", basePrice: 30, priceUnit: "km", eta: "3–6 min", capacity: "1", color: "text-amber-400", gradient: "from-amber-500/20 to-orange-600/10" },
  { id: "car", label: "Car AC", icon: Car, desc: "Comfortable · Cool ride", basePrice: 65, priceUnit: "km", eta: "6–10 min", capacity: "4", color: "text-cyan-400", gradient: "from-cyan-500/20 to-blue-600/10" },
  { id: "suv", label: "SUV", icon: Car, desc: "Premium · Spacious", basePrice: 110, priceUnit: "km", eta: "8–12 min", capacity: "6", color: "text-purple-400", gradient: "from-purple-500/20 to-violet-600/10" },
  { id: "micro", label: "Micro", icon: Users, desc: "Group travel · Budget", basePrice: 90, priceUnit: "km", eta: "10–15 min", capacity: "8", color: "text-emerald-400", gradient: "from-emerald-500/20 to-green-600/10" },
  { id: "pickup", label: "Pickup", icon: Truck, desc: "Goods · Light cargo", basePrice: 120, priceUnit: "km", eta: "10–20 min", capacity: "½ ton", color: "text-orange-400", gradient: "from-orange-500/20 to-red-600/10" },
  { id: "delivery", label: "Parcel", icon: Package, desc: "Same-day delivery", basePrice: 50, priceUnit: "parcel", eta: "20–45 min", capacity: "5 kg", color: "text-lime-400", gradient: "from-lime-500/20 to-green-600/10" },
];

const BD_PLACES = [
  "Gulshan-2 Circle, Dhaka",
  "Farmgate, Dhaka",
  "Dhanmondi-27, Dhaka",
  "Mirpur-10, Dhaka",
  "Motijheel, Dhaka",
  "Airport Road, Dhaka",
  "Uttara Sector-7, Dhaka",
  "Bashundhara City, Dhaka",
  "Shahbag, Dhaka",
  "Banani, Dhaka",
];

const NEARBY_DRIVERS: Driver[] = [
  { id: "d1", name: "Rakib Hassan", rating: 4.9, trips: 1230, vehicle: "Toyota Axio (2019)", plate: "Dhaka Metro-Ka 1234", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", distance: "0.4 km", eta: "4 min" },
  { id: "d2", name: "Karim Ahmed", rating: 4.8, trips: 876, vehicle: "Honda CB Hornet 160R", plate: "Dhaka Metro-Ga 5678", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70", distance: "0.7 km", eta: "6 min" },
  { id: "d3", name: "Nilu Akhter", rating: 4.9, trips: 2340, vehicle: "Toyota Noah (2017)", plate: "Dhaka Metro-Na 9012", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", distance: "1.1 km", eta: "9 min" },
];

type BookingStep = 'idle' | 'type' | 'confirm' | 'searching' | 'matched';

export function RideHome() {
  const [pickup, setPickup] = useState("Gulshan-2 Circle, Dhaka");
  const [dropoff, setDropoff] = useState("");
  const [selectedType, setSelectedType] = useState<RideType | null>(null);
  const [step, setStep] = useState<BookingStep>('idle');
  const [matchedDriver, setMatchedDriver] = useState<Driver | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);

  const APPROX_KM = 5.2;
  const estimatedFare = selectedType ? Math.round(selectedType.basePrice * APPROX_KM) : null;

  const handleBook = () => {
    if (!dropoff) { toast.error("Enter a drop-off location"); return; }
    if (!selectedType) { toast.error("Select a ride type"); return; }
    setStep('searching');
    setTimeout(() => {
      setMatchedDriver(NEARBY_DRIVERS[Math.floor(Math.random() * NEARBY_DRIVERS.length)]);
      setStep('matched');
    }, 2500);
  };

  const handleSuggestionSelect = (place: string) => {
    if (activeInput === 'pickup') setPickup(place);
    else setDropoff(place);
    setShowSuggestions(false);
    setActiveInput(null);
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="ride" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="ride" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-500/20 p-5 bg-gradient-to-br from-cyan-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-3xl shrink-0">🛵</div>
            <div>
              <h1 className="text-lg font-black text-white">PaikarRide</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">Bikes, cars, cargo — anywhere in Bangladesh</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2 mt-4">
            {[
              { emoji: "⚡", label: "3 min avg", sub: "Pickup time" },
              { emoji: "🛡️", label: "Insured", sub: "All rides" },
              { emoji: "💰", label: "Fair price", sub: "No surge" },
            ].map(({ emoji, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-xl">{emoji}</span>
                <p className="text-[11px] font-black text-white">{label}</p>
                <p className="text-[8px] text-zinc-500">{sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location Input */}
        <div className="space-y-2 mb-4 relative">
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-cyan-500/40 transition-all">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <input
              type="text" value={pickup}
              onChange={e => setPickup(e.target.value)}
              onFocus={() => { setShowSuggestions(true); setActiveInput('pickup'); }}
              placeholder="Pickup location"
              className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
            />
            <button onClick={() => {}} className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Locate className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-orange-500/40 transition-all">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
            <input
              type="text" value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              onFocus={() => { setShowSuggestions(true); setActiveInput('dropoff'); }}
              placeholder="Where to?"
              className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
            />
            {dropoff && <button onClick={() => setDropoff("")}><X className="w-3 h-3 text-zinc-500" /></button>}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 top-full mt-1 bg-[var(--pm-bg)] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl z-50"
              >
                <div className="p-2">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2 py-1">Nearby Places</p>
                  {BD_PLACES.map(place => (
                    <button key={place} onClick={() => handleSuggestionSelect(place)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-all text-left">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-[11px] text-zinc-300 font-semibold">{place}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => { setShowSuggestions(false); setActiveInput(null); }} className="w-full py-2 text-[10px] font-black text-zinc-600 text-center border-t border-white/[0.04]">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ride Types */}
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Select Ride Type</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {RIDE_TYPES.map(rt => {
            const Icon = rt.icon;
            const isSelected = selectedType?.id === rt.id;
            return (
              <motion.button
                key={rt.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedType(rt)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-center",
                  isSelected ? `bg-gradient-to-br ${rt.gradient} border-cyan-500/30` : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                )}
              >
                <Icon className={cn("w-5 h-5", isSelected ? rt.color : "text-zinc-500")} />
                <div>
                  <p className={cn("text-[11px] font-black", isSelected ? "text-white" : "text-zinc-400")}>{rt.label}</p>
                  <p className="text-[8px] text-zinc-600">{rt.eta}</p>
                </div>
                {isSelected && dropoff && (
                  <div className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400">
                    ~৳{Math.round(rt.basePrice * APPROX_KM)}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Fare Estimate */}
        {selectedType && dropoff && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Estimated Fare</p>
                <p className="text-2xl font-black text-cyan-400 mt-0.5">৳{estimatedFare}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">≈ {APPROX_KM} km · {selectedType.eta} arrival</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Shield className="w-3 h-3 text-emerald-400" /> Insured ride
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Users className="w-3 h-3 text-zinc-500" /> {selectedType.capacity} seat{selectedType.capacity !== "1" ? "s" : ""}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Nearby Drivers */}
        <div className="mb-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Nearby Drivers</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {NEARBY_DRIVERS.map(driver => (
              <div key={driver.id} className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] w-28 text-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30">
                    <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[var(--pm-bg)]" />
                </div>
                <p className="text-[10px] font-black text-white leading-tight">{driver.name.split(' ')[0]}</p>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-zinc-400">{driver.rating}</span>
                </div>
                <span className="text-[9px] text-cyan-400 font-bold">{driver.distance} · {driver.eta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBook}
          disabled={!dropoff || !selectedType}
          className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-black text-[14px] uppercase tracking-widest transition-all shadow-[0_8px_32px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          {!dropoff ? "Enter Destination" : !selectedType ? "Select Ride Type" : "Book Now"}
        </button>
      </div>

      {/* Searching Modal */}
      <AnimatePresence>
        {step === 'searching' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 flex items-center justify-center">
                <Car className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <p className="text-lg font-black text-white">Finding your driver...</p>
              <p className="text-[12px] text-zinc-400">Connecting to nearest verified driver</p>
            </motion.div>
          </motion.div>
        )}

        {step === 'matched' && matchedDriver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-500/30 shrink-0">
                  <img src={matchedDriver.avatar} alt={matchedDriver.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-black text-white">{matchedDriver.name}</p>
                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] text-zinc-400">{matchedDriver.rating} · {matchedDriver.trips} trips</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-cyan-400">{matchedDriver.eta}</p>
                  <p className="text-[9px] text-zinc-600">away</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Car className="w-4 h-4 text-zinc-500" /> {matchedDriver.vehicle}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Shield className="w-4 h-4 text-zinc-500" /> {matchedDriver.plate}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-[12px] flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Driver
                </button>
                <button onClick={() => { setStep('idle'); toast.success("Ride cancelled."); }} className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-[12px]">
                  Cancel
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Estimated fare</span>
                <span className="text-[16px] font-black text-cyan-400">৳{estimatedFare}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
