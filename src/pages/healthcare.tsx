import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Search, Filter, Star, MapPin, Clock, BadgeCheck,
  Phone, Calendar, ChevronRight, X, User, Stethoscope,
  Activity, Pill, Microscope, Brain, Eye, Bone, Baby,
  Building2, Video, Check, Send
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Specialty = "all" | "general" | "cardiology" | "neurology" | "orthopedics" | "pediatrics" | "ophthalmology" | "oncology";
type ConsultType = "in-person" | "video";

type Doctor = {
  id: string; name: string; title: string; specialty: Specialty;
  hospital: string; location: string; experience: number;
  fee: number; rating: number; reviews: number;
  nextSlot: string; verified: boolean; available: boolean;
  consultTypes: ConsultType[]; image: string;
};

const DOCTORS: Doctor[] = [
  {
    id: "d1", name: "Dr. Rafiqul Islam", title: "MD, FCPS (Cardiology)", specialty: "cardiology",
    hospital: "National Heart Foundation Hospital", location: "Mirpur, Dhaka",
    experience: 18, fee: 1500, rating: 4.9, reviews: 842, nextSlot: "Today, 4:00 PM",
    verified: true, available: true, consultTypes: ["in-person", "video"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=70",
  },
  {
    id: "d2", name: "Dr. Fatema Akter", title: "MBBS, FCPS (Gynecology)", specialty: "general",
    hospital: "Square Hospital", location: "Panthapath, Dhaka",
    experience: 12, fee: 1200, rating: 4.8, reviews: 1290, nextSlot: "Today, 5:30 PM",
    verified: true, available: true, consultTypes: ["in-person", "video"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=70",
  },
  {
    id: "d3", name: "Dr. Ahmed Reza", title: "MS, FRCS (Orthopedics)", specialty: "orthopedics",
    hospital: "BIRDEM Hospital", location: "Shahbag, Dhaka",
    experience: 22, fee: 2000, rating: 4.9, reviews: 567, nextSlot: "Tomorrow, 10:00 AM",
    verified: true, available: true, consultTypes: ["in-person"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=70",
  },
  {
    id: "d4", name: "Dr. Nasrin Sultana", title: "MD (Neurology)", specialty: "neurology",
    hospital: "National Institute of Neurosciences", location: "Agargaon, Dhaka",
    experience: 16, fee: 1800, rating: 4.7, reviews: 334, nextSlot: "Tomorrow, 2:00 PM",
    verified: true, available: true, consultTypes: ["in-person", "video"],
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=70",
  },
  {
    id: "d5", name: "Dr. Kamal Hossain", title: "FCPS (Pediatrics)", specialty: "pediatrics",
    hospital: "Dhaka Shishu Hospital", location: "Sher-e-Bangla Nagar, Dhaka",
    experience: 14, fee: 900, rating: 4.8, reviews: 2100, nextSlot: "Today, 7:00 PM",
    verified: true, available: true, consultTypes: ["in-person", "video"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=70",
  },
  {
    id: "d6", name: "Dr. Shireen Begum", title: "MS (Ophthalmology)", specialty: "ophthalmology",
    hospital: "National Eye Care Institute", location: "Agargaon, Dhaka",
    experience: 10, fee: 1100, rating: 4.6, reviews: 456, nextSlot: "Day After, 11:00 AM",
    verified: false, available: true, consultTypes: ["in-person"],
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&q=70",
  },
];

const SPECIALTY_FILTERS: { id: Specialty; label: string; icon: React.ElementType }[] = [
  { id: "all",           label: "All",          icon: Stethoscope },
  { id: "general",       label: "General",      icon: Activity },
  { id: "cardiology",    label: "Cardiology",   icon: Heart },
  { id: "neurology",     label: "Neurology",    icon: Brain },
  { id: "orthopedics",   label: "Orthopedics",  icon: Bone },
  { id: "pediatrics",    label: "Pediatrics",   icon: Baby },
  { id: "ophthalmology", label: "Eye Care",     icon: Eye },
  { id: "oncology",      label: "Oncology",     icon: Microscope },
];

export default function HealthcarePortal() {
  const [specialty, setSpecialty] = useState<Specialty>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [showBook, setShowBook] = useState(false);
  const [consultType, setConsultType] = useState<ConsultType>("in-person");
  const [patientName, setPatientName] = useState("");
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const filtered = DOCTORS.filter(d => {
    const matchSpec = specialty === "all" || d.specialty === specialty;
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
    return matchSpec && matchSearch;
  });

  const handleBook = () => {
    if (!patientName) { toast.error("Enter patient name"); return; }
    if (selected) {
      setBooked(prev => new Set([...prev, selected.id]));
      toast.success(`Appointment booked with ${selected.name}!`);
      setShowBook(false);
      setPatientName("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="healthcare" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="healthcare" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-rose-500/20 p-5 bg-gradient-to-br from-rose-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl">❤️‍🩹</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarHealth</h1>
              <p className="text-[11px] text-zinc-400">Top doctors, clinics & telemedicine</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[
              { label: "Doctors", value: "3,000+", emoji: "👨‍⚕️" },
              { label: "Hospitals", value: "500+", emoji: "🏥" },
              { label: "Consultations", value: "98k+", emoji: "✅" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-rose-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-rose-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Doctor, hospital, location..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-rose-400" />
          </button>
        </div>

        {/* Specialty Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {SPECIALTY_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSpecialty(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", specialty === id ? "bg-rose-500/15 border-rose-500/30 text-rose-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Doctors List */}
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Doctors</p>
        <div className="space-y-3">
          {filtered.map((doctor, i) => (
            <motion.div key={doctor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(doctor)} className="flex gap-3 p-3.5 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10] transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/[0.06] shrink-0">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[12px] font-black text-white truncate">{doctor.name}</p>
                  {doctor.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <p className="text-[10px] text-zinc-500 mb-0.5">{doctor.title}</p>
                <p className="text-[9px] text-zinc-600 truncate">{doctor.hospital}</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-[9px] text-zinc-400">{doctor.rating}</span></div>
                  <span className="text-[9px] text-rose-400 font-black">৳{doctor.fee.toLocaleString()}</span>
                  <div className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-zinc-600" /><span className="text-[9px] text-zinc-500">{doctor.nextSlot}</span></div>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end justify-between">
                <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black", doctor.available ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-500")}>
                  {doctor.available ? "Available" : "Busy"}
                </div>
                <div className="flex gap-1">
                  {doctor.consultTypes.includes("video") && <Video className="w-3.5 h-3.5 text-violet-400" />}
                  {doctor.consultTypes.includes("in-person") && <Building2 className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </div>
            </motion.div>
          ))}
          {!filtered.length && (
            <div className="py-16 text-center">
              <Stethoscope className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-[13px] font-black text-zinc-600">No doctors found</p>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Detail & Booking */}
      <AnimatePresence>
        {selected && !showBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="px-4 pt-5 pb-28">
                <div className="flex items-center justify-between mb-5">
                  <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <div className="flex gap-4 mb-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/[0.08] shrink-0">
                    <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2"><h2 className="text-base font-black text-white">{selected.name}</h2>{selected.verified && <BadgeCheck className="w-4 h-4 text-cyan-400" />}</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{selected.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{selected.hospital}</p>
                    <div className="flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-zinc-600" /><p className="text-[9px] text-zinc-600">{selected.location}</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[{ label: "Experience", value: `${selected.experience} yrs` }, { label: "Rating", value: `${selected.rating}/5` }, { label: "Reviews", value: `${selected.reviews}+` }].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                      <p className="text-[13px] font-black text-rose-400">{value}</p>
                      <p className="text-[9px] text-zinc-600 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-black text-white">Next Available</p>
                    <span className="text-[11px] font-black text-emerald-400">{selected.nextSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500">Consultation Fee</p>
                    <span className="text-[14px] font-black text-rose-400">৳{selected.fee.toLocaleString()}</span>
                  </div>
                </div>
                {booked.has(selected.id) ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Appointment Booked
                  </div>
                ) : (
                  <button onClick={() => setShowBook(true)} className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-[13px] uppercase tracking-widest transition-all shadow-[0_8px_32px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showBook && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-white">Book Appointment</h3>
                <button onClick={() => setShowBook(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-4">
                <p className="text-[11px] font-black text-white">{selected.name}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">{selected.nextSlot} · ৳{selected.fee.toLocaleString()}</p>
              </div>
              <div className="flex gap-2 mb-4">
                {selected.consultTypes.map(t => (
                  <button key={t} onClick={() => setConsultType(t)} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[11px] font-black capitalize transition-all", consultType === t ? "bg-rose-500/15 border-rose-500/30 text-rose-400" : "bg-white/[0.03] border-white/[0.06] text-zinc-500")}>
                    {t === "video" ? <><Video className="w-3.5 h-3.5" /> Video</> : <><Building2 className="w-3.5 h-3.5" /> In-Person</>}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Patient Name</label>
                <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter patient's full name" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-rose-500/40 placeholder-zinc-600" />
              </div>
              <button onClick={handleBook} disabled={!patientName} className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Confirm Booking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
