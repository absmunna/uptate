import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase, MapPin, Clock, Star, Search, Filter,
  ChevronRight, BadgeCheck, Zap, X, Check, Building2,
  Users, DollarSign, Calendar, BookOpen, Heart, Share2,
  Send, TrendingUp, Flame, ArrowRight, Award
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type JobType = "full_time" | "part_time" | "contract" | "remote" | "freelance";
type Category = "all" | "tech" | "retail" | "manufacturing" | "logistics" | "services" | "education" | "healthcare" | "finance";

type Job = {
  id: string; title: string; company: string; logo: string;
  location: string; salary: string; type: JobType; category: string;
  posted: string; deadline: string; applicants: number;
  skills: string[]; description: string; requirements: string[];
  featured?: boolean; verified?: boolean; urgent?: boolean;
};

const JOBS: Job[] = [
  {
    id: "j1", title: "Senior React Developer", company: "TechBD Solutions", logo: "💻",
    location: "Gulshan, Dhaka", salary: "৳80,000–120,000/mo", type: "full_time", category: "tech",
    posted: "2 days ago", deadline: "June 15, 2026", applicants: 127,
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    description: "Join our growing team to build next-generation e-commerce platforms for Bangladesh's largest brands.",
    requirements: ["5+ years React experience", "Bachelor's in CS or related", "Strong TypeScript skills"],
    featured: true, verified: true,
  },
  {
    id: "j2", title: "E-Commerce Sales Manager", company: "PaikarMart", logo: "🛒",
    location: "Banani, Dhaka", salary: "৳55,000–75,000/mo", type: "full_time", category: "retail",
    posted: "1 day ago", deadline: "June 10, 2026", applicants: 89,
    skills: ["Sales", "Negotiation", "Vendor Management", "Excel"],
    description: "Lead our B2B sales operations and grow our merchant onboarding pipeline across Bangladesh.",
    requirements: ["3+ years B2B sales experience", "Strong communication in Bengali & English", "Track record of meeting targets"],
    featured: true, verified: true, urgent: true,
  },
  {
    id: "j3", title: "Garments Quality Inspector", company: "BD Fashion Group", logo: "👕",
    location: "Gazipur, Dhaka", salary: "৳25,000–35,000/mo", type: "full_time", category: "manufacturing",
    posted: "3 days ago", deadline: "June 20, 2026", applicants: 214,
    skills: ["Quality Control", "Garments knowledge", "AQL standards"],
    description: "Inspect finished garments and ensure compliance with international buyer standards.",
    requirements: ["2+ years in garments QC", "Knowledge of international standards", "Diploma or higher preferred"],
    verified: true,
  },
  {
    id: "j4", title: "Delivery Executive (Rider)", company: "PaikarRide", logo: "🛵",
    location: "Dhaka Metro", salary: "৳18,000–30,000/mo", type: "full_time", category: "logistics",
    posted: "Today", deadline: "June 5, 2026", applicants: 543,
    skills: ["Driving", "Navigation", "Communication", "Time Management"],
    description: "Join our fleet of delivery riders and earn competitive pay with flexible hours.",
    requirements: ["Valid motorcycle license", "Smartphone capable of running apps", "Knowledge of Dhaka roads"],
    urgent: true,
  },
  {
    id: "j5", title: "Graphic Designer (Remote)", company: "Creative Studio BD", logo: "🎨",
    location: "Remote – Bangladesh", salary: "৳30,000–50,000/mo", type: "remote", category: "services",
    posted: "5 days ago", deadline: "June 25, 2026", applicants: 176,
    skills: ["Illustrator", "Photoshop", "Figma", "Brand Design"],
    description: "Design stunning visuals for our international clients from the comfort of your home.",
    requirements: ["3+ years design experience", "Strong portfolio", "Proficiency in Adobe suite"],
  },
  {
    id: "j6", title: "Primary School Teacher (Math)", company: "Sunrise Academy", logo: "📚",
    location: "Sylhet City", salary: "৳22,000–30,000/mo", type: "full_time", category: "education",
    posted: "1 week ago", deadline: "July 1, 2026", applicants: 62,
    skills: ["Teaching", "Math", "Communication", "Patience"],
    description: "Teach mathematics to students in classes 3–7 with a focus on conceptual learning.",
    requirements: ["B.Ed or equivalent", "2+ years teaching experience", "Strong math background"],
  },
  {
    id: "j7", title: "Digital Marketing Specialist", company: "GrowthHive BD", logo: "📊",
    location: "Dhanmondi, Dhaka", salary: "৳40,000–60,000/mo", type: "full_time", category: "tech",
    posted: "4 days ago", deadline: "June 18, 2026", applicants: 98,
    skills: ["SEO", "Facebook Ads", "Google Ads", "Analytics"],
    description: "Drive digital growth for our portfolio of Bangladeshi brands through data-driven campaigns.",
    requirements: ["3+ years digital marketing", "Proven ROI track record", "Meta and Google certified preferred"],
    verified: true,
  },
  {
    id: "j8", title: "Accounts Officer", company: "Rupali Finance Ltd", logo: "💰",
    location: "Motijheel, Dhaka", salary: "৳35,000–50,000/mo", type: "full_time", category: "finance",
    posted: "2 days ago", deadline: "June 12, 2026", applicants: 143,
    skills: ["Tally", "MS Excel", "Tax Filing", "Bank Reconciliation"],
    description: "Manage day-to-day accounting operations for a fast-growing NBFI.",
    requirements: ["CA Intermediate or BBA Finance", "2+ years accounting experience", "Knowledge of Bangladesh tax law"],
    verified: true,
  },
];

const TYPE_META: Record<JobType | string, { label: string; color: string }> = {
  full_time:  { label: "Full Time",  color: "text-emerald-400" },
  part_time:  { label: "Part Time",  color: "text-blue-400" },
  contract:   { label: "Contract",   color: "text-amber-400" },
  remote:     { label: "Remote",     color: "text-violet-400" },
  freelance:  { label: "Freelance",  color: "text-cyan-400" },
};

const CAT_FILTERS: { id: Category; label: string }[] = [
  { id: "all",           label: "All Jobs" },
  { id: "tech",          label: "Tech & IT" },
  { id: "retail",        label: "Retail" },
  { id: "manufacturing", label: "Factory" },
  { id: "logistics",     label: "Logistics" },
  { id: "services",      label: "Services" },
  { id: "education",     label: "Education" },
  { id: "healthcare",    label: "Healthcare" },
  { id: "finance",       label: "Finance" },
];

export default function JobsPortal() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [showApply, setShowApply] = useState(false);
  const [cvName, setCvName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const filtered = JOBS.filter(j => {
    const matchCat = activeCategory === "all" || j.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(j => j.featured);
  const rest = filtered.filter(j => !j.featured);

  const toggleSave = (id: string) => {
    setSavedJobs(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      toast.success(n.has(id) ? "Job saved!" : "Job removed");
      return n;
    });
  };

  const handleApply = () => {
    if (!cvName) { toast.error("Enter your name to apply"); return; }
    if (selectedJob) {
      setApplied(prev => new Set([...prev, selectedJob.id]));
      toast.success(`Application submitted to ${selectedJob.company}!`);
      setShowApply(false);
      setCvName("");
      setCoverLetter("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="jobs" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="jobs" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-teal-500/20 p-5 bg-gradient-to-br from-teal-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl">💼</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarJobs</h1>
              <p className="text-[11px] text-zinc-400">Find your next opportunity in Bangladesh</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[
              { label: "Open Roles", value: "4,800+", emoji: "💼" },
              { label: "Top Employers", value: "1,200+", emoji: "🏢" },
              { label: "Placements", value: "92%", emoji: "✅" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-teal-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-teal-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, company, location..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-teal-400" />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("px-3.5 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", activeCategory === cat.id ? "bg-teal-500/15 border-teal-500/30 text-teal-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Jobs */}
        {featured.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Featured Roles</p>
            </div>
            <div className="space-y-2">
              {featured.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} saved={savedJobs.has(job.id)} applied={applied.has(job.id)} onSave={toggleSave} onOpen={() => setSelectedJob(job)} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{filtered.length} Jobs</p>
          <div className="space-y-2">
            {rest.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} saved={savedJobs.has(job.id)} applied={applied.has(job.id)} onSave={toggleSave} onOpen={() => setSelectedJob(job)} />
            ))}
            {!filtered.length && (
              <div className="py-16 text-center">
                <Briefcase className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-[13px] font-black text-zinc-600">No jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Sheet */}
      <AnimatePresence>
        {selectedJob && !showApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelectedJob(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="px-4 pt-6 pb-28">
                <div className="flex items-center justify-between mb-5">
                  <button onClick={() => setSelectedJob(null)} className="w-9 h-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => toggleSave(selectedJob.id)} className={cn("w-9 h-9 rounded-2xl border flex items-center justify-center transition-all", savedJobs.has(selectedJob.id) ? "bg-amber-500/10 border-amber-500/30" : "bg-white/[0.04] border-white/[0.08]")}>
                      <Heart className={cn("w-4 h-4", savedJobs.has(selectedJob.id) ? "text-amber-400 fill-amber-400" : "text-zinc-400")} />
                    </button>
                    <button onClick={() => toast.success("Link copied!")} className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-3xl shrink-0">{selectedJob.logo}</div>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedJob.title}</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      <p className="text-[12px] text-zinc-400">{selectedJob.company}</p>
                      {selectedJob.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-600" />
                      <p className="text-[10px] text-zinc-500">{selectedJob.location}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { label: "Salary", value: selectedJob.salary, icon: DollarSign },
                    { label: "Type", value: TYPE_META[selectedJob.type]?.label || selectedJob.type, icon: Briefcase },
                    { label: "Posted", value: selectedJob.posted, icon: Clock },
                    { label: "Deadline", value: selectedJob.deadline, icon: Calendar },
                    { label: "Applicants", value: `${selectedJob.applicants}+`, icon: Users },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-[9px] text-zinc-600">{label}</p>
                        <p className="text-[11px] font-black text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[10px] font-black text-teal-400">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Job Description</p>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Requirements</p>
                  <div className="space-y-1.5">
                    {selectedJob.requirements.map(req => (
                      <div key={req} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-zinc-400">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {applied.has(selectedJob.id) ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Applied Successfully
                  </div>
                ) : (
                  <button onClick={() => setShowApply(true)} className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-black text-[13px] uppercase tracking-widest transition-all shadow-[0_8px_32px_rgba(20,184,166,0.35)] flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Apply Modal */}
        {showApply && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-white">Apply for {selectedJob.title}</h3>
                <button onClick={() => setShowApply(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <p className="text-[11px] font-black text-white">{selectedJob.company}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">{selectedJob.location} · {selectedJob.salary}</p>
              </div>
              <div className="mb-4">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Full Name</label>
                <input value={cvName} onChange={e => setCvName(e.target.value)} placeholder="Your full name" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-teal-500/40" />
              </div>
              <div className="mb-4">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Cover Letter (Optional)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Why are you a good fit for this role?" rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none resize-none focus:border-teal-500/40" />
              </div>
              <button onClick={handleApply} disabled={!cvName} className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Submit Application
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function JobCard({ job, index, saved, applied, onSave, onOpen, featured }: {
  job: Job; index: number; saved: boolean; applied: boolean;
  onSave: (id: string) => void; onOpen: () => void; featured?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className={cn("flex gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer", featured ? "border-teal-500/20 bg-gradient-to-br from-teal-500/5 to-transparent" : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10]")}
      onClick={onOpen}
    >
      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl shrink-0">{job.logo}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[12px] font-black text-white truncate">{job.title}</p>
          {job.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
          {job.urgent && <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-400 shrink-0">URGENT</span>}
        </div>
        <p className="text-[10px] text-zinc-500">{job.company} · {job.location}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md border", TYPE_META[job.type]?.color, "border-current/20 bg-current/5")}>{TYPE_META[job.type]?.label}</span>
          <span className="text-[10px] font-black text-teal-400">{job.salary.split("–")[0]}+</span>
          <span className="text-[9px] text-zinc-600">{job.posted}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button onClick={e => { e.stopPropagation(); onSave(job.id); }} className={cn("w-7 h-7 rounded-xl border flex items-center justify-center transition-all", saved ? "bg-amber-500/10 border-amber-500/30" : "bg-white/[0.04] border-white/[0.06]")}>
          <Heart className={cn("w-3.5 h-3.5", saved ? "text-amber-400 fill-amber-400" : "text-zinc-500")} />
        </button>
        {applied && <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"><Check className="w-3 h-3 text-emerald-400" /></div>}
        <span className="text-[9px] text-zinc-600">{job.applicants} apps</span>
      </div>
    </motion.div>
  );
}
