import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench, Zap, Home, Sparkles, Star, ChevronRight, X,
  ShieldCheck, Clock, MapPin, Phone, Calendar, CheckCircle2,
  ArrowLeft, MessageCircle, Camera, Laptop, Scissors, Car,
  Heart, Package, BookOpen, Music, Utensils, Paintbrush,
  Wifi, Hammer, Droplets, Wind, Flame, Cpu, User,
  BadgeCheck, ThumbsUp, Send, AlertCircle
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";

type ServiceCategory = {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  border: string;
  count: number;
};

type ServiceProvider = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  availability: string;
  location: string;
  responseTime: string;
  verified: boolean;
  featured?: boolean;
  image: string;
  skills: string[];
  completedJobs: number;
  bio: string;
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "all", icon: Sparkles, label: "All Services", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", count: 240 },
  { id: "home", icon: Home, label: "Home Services", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", count: 86 },
  { id: "repair", icon: Wrench, label: "Repair & Fix", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", count: 54 },
  { id: "electric", icon: Zap, label: "Electrical", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", count: 32 },
  { id: "beauty", icon: Scissors, label: "Beauty & Spa", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", count: 28 },
  { id: "tech", icon: Laptop, label: "Tech & IT", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", count: 41 },
  { id: "transport", icon: Car, label: "Transport", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", count: 19 },
  { id: "health", icon: Heart, label: "Healthcare", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", count: 23 },
  { id: "education", icon: BookOpen, label: "Education", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", count: 37 },
  { id: "cleaning", icon: Droplets, label: "Cleaning", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", count: 15 },
  { id: "plumbing", icon: Hammer, label: "Plumbing", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", count: 20 },
  { id: "ac", icon: Wind, label: "AC & HVAC", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", count: 12 },
];

const SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: "sp1", name: "Kamal Electricals", category: "electric", rating: 4.9, reviews: 312,
    startingPrice: 350, availability: "Available Now", location: "Dhanmondi, Dhaka",
    responseTime: "< 30 min", verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80",
    skills: ["Wiring", "Panel Upgrade", "AC Installation", "Emergency Fix"],
    completedJobs: 892, bio: "15 years of certified electrical work across residential & commercial projects."
  },
  {
    id: "sp2", name: "CleanPro BD", category: "cleaning", rating: 4.8, reviews: 201,
    startingPrice: 800, availability: "Next 2 hrs", location: "Gulshan, Dhaka",
    responseTime: "< 1 hr", verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80",
    skills: ["Deep Clean", "Sofa Wash", "Tile Polish", "Kitchen Detail"],
    completedJobs: 540, bio: "Professional home cleaning team with eco-friendly materials."
  },
  {
    id: "sp3", name: "TechFix Dhaka", category: "tech", rating: 4.7, reviews: 189,
    startingPrice: 500, availability: "Today", location: "Uttara, Dhaka",
    responseTime: "< 2 hrs", verified: true,
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&q=80",
    skills: ["PC Repair", "Data Recovery", "Network Setup", "CCTV Install"],
    completedJobs: 410, bio: "Certified IT engineers for all your tech repair and setup needs."
  },
  {
    id: "sp4", name: "Glamour Home Salon", category: "beauty", rating: 4.9, reviews: 445,
    startingPrice: 600, availability: "Available Now", location: "Mirpur, Dhaka",
    responseTime: "< 45 min", verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&q=80",
    skills: ["Haircut", "Facial", "Makeup", "Bridal", "Mehndi"],
    completedJobs: 1230, bio: "Premium home beauty services by trained professionals."
  },
  {
    id: "sp5", name: "AquaFix Plumbing", category: "plumbing", rating: 4.6, reviews: 98,
    startingPrice: 400, availability: "Today", location: "Mohammadpur, Dhaka",
    responseTime: "< 1 hr", verified: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    skills: ["Pipe Repair", "Water Heater", "Bathroom Fitting", "Drain Clean"],
    completedJobs: 285, bio: "Fast, reliable plumbing solutions with 100% satisfaction guarantee."
  },
  {
    id: "sp6", name: "CoolAir HVAC", category: "ac", rating: 4.8, reviews: 167,
    startingPrice: 900, availability: "Tomorrow", location: "Banani, Dhaka",
    responseTime: "Same day", verified: true,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80",
    skills: ["AC Service", "AC Install", "Gas Refill", "Split Unit"],
    completedJobs: 620, bio: "Expert AC technicians for all brands and models."
  },
  {
    id: "sp7", name: "Healthy Home Doctor", category: "health", rating: 4.9, reviews: 312,
    startingPrice: 1200, availability: "Available Now", location: "Bashundhara, Dhaka",
    responseTime: "< 1 hr", verified: true, featured: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80",
    skills: ["Home Visit", "Blood Test", "Vaccination", "Elder Care"],
    completedJobs: 750, bio: "Registered doctors and nurses for home healthcare needs."
  },
  {
    id: "sp8", name: "ProTutor Academy", category: "education", rating: 4.7, reviews: 220,
    startingPrice: 500, availability: "Available Now", location: "Wari, Dhaka",
    responseTime: "< 2 hrs", verified: true,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80",
    skills: ["Math", "English", "Science", "Board Prep", "IELTS"],
    completedJobs: 980, bio: "Experienced tutors for all grades and competitive exams."
  },
];

type BookingStep = "info" | "schedule" | "confirm" | "done";

function ServiceBookingModal({ provider, onClose }: { provider: ServiceProvider; onClose: () => void }) {
  const [step, setStep] = useState<BookingStep>("info");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");

  const times = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-BD", { weekday: "short", month: "short", day: "numeric" });
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full max-w-[500px] bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10">
                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{provider.name}</h3>
                <p className="text-[10px] text-[var(--pm-text-secondary)]">Starting ৳{provider.startingPrice}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 px-5 pt-4 shrink-0">
            {(["info", "schedule", "confirm"] as BookingStep[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                  step === s ? "bg-[var(--pm-accent)] text-white shadow-[0_0_12px_rgba(167,139,250,0.5)]"
                    : ["info", "schedule", "confirm", "done"].indexOf(step) > i ? "bg-emerald-500 text-white" : "bg-white/5 text-zinc-600"
                )}>
                  {["info", "schedule", "confirm", "done"].indexOf(step) > i ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                </div>
                {i < 2 && <div className={cn("flex-1 h-px", ["info", "schedule", "confirm", "done"].indexOf(step) > i ? "bg-emerald-500/50" : "bg-white/5")} />}
              </React.Fragment>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence mode="wait">
              {step === "info" && (
                <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h4 className="text-sm font-black text-white">Service Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <p className="text-base font-black text-white">{provider.rating}</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{provider.reviews} Reviews</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <p className="text-base font-black text-white">{provider.completedJobs}</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Jobs Done</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <AlertCircle className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0 mt-0.5" />
                    {provider.bio}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Skills & Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 text-[10px] font-bold text-[var(--pm-accent)]">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Your Address</p>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Enter your full address..."
                      className="w-full bg-transparent text-[11px] text-white placeholder-zinc-600 outline-none font-semibold"
                    />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Special Notes (Optional)</p>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Describe your issue or requirements..."
                      rows={3}
                      className="w-full bg-transparent text-[11px] text-white placeholder-zinc-600 outline-none font-semibold resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {step === "schedule" && (
                <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h4 className="text-sm font-black text-white">Pick Date & Time</h4>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Available Dates</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {dates.map(d => (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={cn(
                            "shrink-0 px-4 py-3 rounded-2xl border text-center transition-all",
                            selectedDate === d
                              ? "bg-[var(--pm-accent)] border-[var(--pm-accent)] shadow-[0_0_16px_rgba(167,139,250,0.4)]"
                              : "bg-white/[0.03] border-white/[0.06] hover:border-white/20"
                          )}
                        >
                          <p className={cn("text-[10px] font-black", selectedDate === d ? "text-white" : "text-zinc-400")}>{d.split(" ")[0]}</p>
                          <p className={cn("text-sm font-black", selectedDate === d ? "text-white" : "text-zinc-300")}>{d.split(" ")[2]}</p>
                          <p className={cn("text-[9px]", selectedDate === d ? "text-white/70" : "text-zinc-600")}>{d.split(" ")[1]}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Time Slot</p>
                    <div className="grid grid-cols-3 gap-2">
                      {times.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "py-2.5 rounded-xl border text-[11px] font-black transition-all",
                            selectedTime === t
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:border-white/20"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "confirm" && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h4 className="text-sm font-black text-white">Confirm Booking</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Provider", value: provider.name },
                      { label: "Date", value: selectedDate || "Not selected" },
                      { label: "Time", value: selectedTime || "Not selected" },
                      { label: "Address", value: address || "Not provided" },
                      { label: "Starting Price", value: `৳${provider.startingPrice}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
                        <span className="text-[11px] font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                  {note && (
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Note</p>
                      <p className="text-[11px] text-zinc-300">{note}</p>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-300/80 leading-relaxed">Final price may vary based on actual service scope. Payment after service completion.</p>
                  </div>
                </motion.div>
              )}

              {step === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">Booking Confirmed!</h4>
                    <p className="text-xs text-zinc-400 max-w-[240px] mx-auto">
                      {provider.name} will contact you within {provider.responseTime}. Check messages for updates.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-zinc-300">Close</button>
                    <button className="flex-1 py-3 rounded-2xl bg-[var(--pm-accent)] text-white text-[11px] font-black flex items-center justify-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Message
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          {step !== "done" && (
            <div className="p-5 border-t border-white/[0.06] flex gap-3 shrink-0">
              {step !== "info" && (
                <button
                  onClick={() => setStep(step === "confirm" ? "schedule" : "info")}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (step === "info") setStep("schedule");
                  else if (step === "schedule") setStep("confirm");
                  else if (step === "confirm") setStep("done");
                }}
                className="flex-1 py-3 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-black text-[12px] uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(167,139,250,0.3)] flex items-center justify-center gap-2"
              >
                {step === "info" ? "Pick Schedule" : step === "schedule" ? "Review Booking" : <><Send className="w-3.5 h-3.5" />Confirm Booking</>}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ServiceProviderCard({ provider, onBook }: { provider: ServiceProvider; onBook: (p: ServiceProvider) => void }) {
  const cat = SERVICE_CATEGORIES.find(c => c.id === provider.category) || SERVICE_CATEGORIES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-4 transition-all duration-300 cursor-pointer group",
        provider.featured
          ? "bg-gradient-to-br from-[var(--pm-surface)] to-[var(--pm-bg)] border-[var(--pm-accent)]/20 shadow-[0_0_24px_rgba(167,139,250,0.08)]"
          : "bg-[var(--pm-surface)]/40 border-white/[0.06] hover:border-white/[0.15]"
      )}
    >
      {provider.featured && (
        <div className="absolute top-0 right-0">
          <div className="px-3 py-1 bg-[var(--pm-accent)] rounded-bl-2xl rounded-tr-3xl text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Top Rated
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {provider.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--pm-bg)] flex items-center justify-center">
              <BadgeCheck className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="text-[13px] font-black text-white leading-tight">{provider.name}</h3>
            <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black border shrink-0", cat.bg, cat.border, cat.color)}>{cat.label}</span>
          </div>

          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-black text-white">{provider.rating}</span>
              <span className="text-[9px] text-zinc-500">({provider.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-400">{provider.responseTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-400 truncate">{provider.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {provider.skills.slice(0, 3).map(s => (
              <span key={s} className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] text-zinc-400 font-bold">{s}</span>
            ))}
            {provider.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] text-zinc-500">+{provider.skills.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500">from </span>
              <span className="text-base font-black text-[var(--pm-accent)]">৳{provider.startingPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black",
                provider.availability === "Available Now" ? "bg-emerald-500/15 text-emerald-400" :
                provider.availability === "Next 2 hrs" ? "bg-amber-500/15 text-amber-400" :
                "bg-zinc-500/15 text-zinc-400"
              )}>
                {provider.availability}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onBook(provider)}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white text-[10px] font-black transition-all shadow-[0_0_12px_rgba(167,139,250,0.25)]"
              >
                Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const SkeletonCard = () => (
  <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-4 animate-pulse flex gap-3">
    <div className="w-16 h-16 rounded-2xl skeleton-shimmer shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
      <div className="h-2.5 w-1/2 rounded-full skeleton-shimmer" />
      <div className="h-2 w-1/3 rounded-full skeleton-shimmer" />
      <div className="h-8 w-full rounded-xl skeleton-shimmer" />
    </div>
  </div>
);

export default function ServicesPortal() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookingTarget, setBookingTarget] = useState<ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = SERVICE_PROVIDERS.filter(p => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-[480px] md:max-w-4xl lg:max-w-6xl mx-auto px-4 pb-28 text-[var(--pm-text)] flex flex-col pt-16">

      {/* Story Bar */}
      <section className="pt-2">
        <StoryBar context="services" />
      </section>

      {/* Portal Icon Bar */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/50 -mx-4 px-4 mt-2">
        <PortalIconBar context="services" />
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 relative overflow-hidden rounded-3xl border border-rose-500/20 p-5 bg-gradient-to-br from-rose-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Wrench className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-[9px] font-black text-rose-400 uppercase tracking-widest">Services Portal</span>
            </div>
            <h1 className="text-lg font-black text-white leading-tight">Expert Pros at Your Door</h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">240+ verified professionals across all categories</p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: ShieldCheck, label: "Verified Pros", color: "text-emerald-400" },
            { icon: Clock, label: "30 min Avg Response", color: "text-amber-400" },
            { icon: ThumbsUp, label: "98% Satisfaction", color: "text-blue-400" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <Icon className={cn("w-4 h-4", color)} />
              <span className="text-[9px] font-black text-zinc-400 text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-[var(--pm-accent)]/50 transition-all">
          <Sparkles className="w-4 h-4 text-[var(--pm-accent)]" />
          <input
            type="text"
            placeholder="Search services or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {SERVICE_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-[10px] font-black transition-all",
                isActive
                  ? `${cat.bg} ${cat.border} ${cat.color} shadow-md`
                  : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
              <span className={cn("text-[8px] px-1 rounded-full", isActive ? "bg-white/20" : "bg-white/5")}>{cat.count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
          {filtered.length} {activeCategory === "all" ? "All" : SERVICE_CATEGORIES.find(c => c.id === activeCategory)?.label} Providers
        </h2>
        <select className="bg-transparent text-[10px] font-black text-zinc-500 outline-none uppercase tracking-widest cursor-pointer">
          <option>Sort: Top Rated</option>
          <option>Sort: Nearest</option>
          <option>Sort: Price Low</option>
        </select>
      </div>

      {/* Provider Cards */}
      <div className="mt-3 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm font-black text-zinc-500">No providers found</p>
            <p className="text-[11px] text-zinc-600">Try a different category or search term</p>
            <button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} className="mt-1 px-4 py-2 rounded-xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 text-[11px] font-black text-[var(--pm-accent)]">
              Clear Filters
            </button>
          </div>
        ) : (
          filtered.map((provider, i) => (
            <motion.div key={provider.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ServiceProviderCard provider={provider} onBook={setBookingTarget} />
            </motion.div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {bookingTarget && (
        <ServiceBookingModal provider={bookingTarget} onClose={() => setBookingTarget(null)} />
      )}
    </div>
  );
}
