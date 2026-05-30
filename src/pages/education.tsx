import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, Search, Filter, Star, Clock, Users,
  BookOpen, Play, Award, BadgeCheck, X, ChevronRight,
  Laptop, Globe, Code, Calculator, Palette, Music,
  Video, Check, Lock, Zap, TrendingUp
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CourseCategory = "all" | "tech" | "business" | "design" | "language" | "academic" | "arts" | "skills";
type CourseLevel = "beginner" | "intermediate" | "advanced";

type Course = {
  id: string; title: string; instructor: string; category: CourseCategory;
  level: CourseLevel; price: number; originalPrice?: number;
  rating: number; students: number; duration: string; lessons: number;
  image: string; description: string; tags: string[];
  free?: boolean; popular?: boolean; new?: boolean;
  language: string;
};

const COURSES: Course[] = [
  {
    id: "c1", title: "Complete Web Development Bootcamp 2026", instructor: "Tanvir Ahmed",
    category: "tech", level: "beginner", price: 1200, originalPrice: 4999,
    rating: 4.9, students: 28400, duration: "42 hours", lessons: 385,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&q=70",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB from scratch. Build 10+ real projects.",
    tags: ["HTML", "CSS", "JavaScript", "React"], popular: true,
    language: "Bangla & English",
  },
  {
    id: "c2", title: "Digital Marketing Masterclass", instructor: "Sadia Islam",
    category: "business", level: "beginner", price: 800, originalPrice: 2999,
    rating: 4.7, students: 15600, duration: "28 hours", lessons: 210,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=500&q=70",
    description: "Master SEO, Facebook Ads, Google Ads, Instagram marketing and email marketing with real campaigns.",
    tags: ["SEO", "Facebook Ads", "Google Ads"], popular: true,
    language: "Bangla",
  },
  {
    id: "c3", title: "Graphic Design with Adobe Suite", instructor: "Farhan Hossain",
    category: "design", level: "beginner", price: 950, originalPrice: 3500,
    rating: 4.8, students: 9800, duration: "35 hours", lessons: 280,
    image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=500&q=70",
    description: "Master Illustrator, Photoshop and InDesign. Create professional logos, posters and branding.",
    tags: ["Photoshop", "Illustrator", "Figma"],
    language: "Bangla",
  },
  {
    id: "c4", title: "Spoken English for Professionals", instructor: "Nafisa Rahman",
    category: "language", level: "intermediate", price: 0,
    rating: 4.6, students: 45000, duration: "20 hours", lessons: 120,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=70",
    description: "Boost your professional English communication skills. Business emails, presentations and interviews.",
    tags: ["English", "Communication", "IELTS"], free: true, popular: true,
    language: "Bangla",
  },
  {
    id: "c5", title: "Python for Data Science & ML", instructor: "Rakibul Hasan",
    category: "tech", level: "intermediate", price: 1500, originalPrice: 5999,
    rating: 4.8, students: 12300, duration: "50 hours", lessons: 420,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=70",
    description: "Learn Python, Pandas, NumPy, Matplotlib, Scikit-learn and build real ML models.",
    tags: ["Python", "Machine Learning", "Data Science"], new: true,
    language: "Bangla & English",
  },
  {
    id: "c6", title: "HSC Physics Complete Course", instructor: "Prof. Abdul Karim",
    category: "academic", level: "beginner", price: 600,
    rating: 4.7, students: 32000, duration: "80 hours", lessons: 640,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&q=70",
    description: "Complete HSC Physics curriculum with board exam preparation and practice tests.",
    tags: ["HSC", "Physics", "Board Exam"],
    language: "Bangla",
  },
  {
    id: "c7", title: "Freelancing on Fiverr & Upwork", instructor: "Mehedi Hassan",
    category: "skills", level: "beginner", price: 500, originalPrice: 1999,
    rating: 4.9, students: 67000, duration: "15 hours", lessons: 95,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=70",
    description: "Start earning from international freelancing platforms. Profile setup, proposals, client management.",
    tags: ["Fiverr", "Upwork", "Freelancing"], popular: true,
    language: "Bangla",
  },
  {
    id: "c8", title: "Video Editing with Premiere Pro", instructor: "Shafiqul Islam",
    category: "arts", level: "beginner", price: 700, originalPrice: 2500,
    rating: 4.6, students: 8900, duration: "25 hours", lessons: 180,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=70",
    description: "Master Premiere Pro from beginner to pro. YouTube content, commercials and social media videos.",
    tags: ["Premiere Pro", "Video Editing", "YouTube"],
    language: "Bangla",
  },
];

const CAT_FILTERS: { id: CourseCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",       label: "All",       icon: GraduationCap },
  { id: "tech",      label: "Tech",      icon: Code },
  { id: "business",  label: "Business",  icon: TrendingUp },
  { id: "design",    label: "Design",    icon: Palette },
  { id: "language",  label: "Language",  icon: Globe },
  { id: "academic",  label: "Academic",  icon: BookOpen },
  { id: "arts",      label: "Arts",      icon: Music },
  { id: "skills",    label: "Skills",    icon: Zap },
];

const LEVEL_META: Record<CourseLevel, { label: string; color: string }> = {
  beginner:     { label: "Beginner",     color: "text-emerald-400" },
  intermediate: { label: "Intermediate", color: "text-amber-400" },
  advanced:     { label: "Advanced",     color: "text-red-400" },
};

export default function EducationPortal() {
  const [category, setCategory] = useState<CourseCategory>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());

  const filtered = COURSES.filter(c => {
    const matchCat = category === "all" || c.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const popular = filtered.filter(c => c.popular);
  const rest = filtered.filter(c => !c.popular);

  const handleEnroll = (course: Course) => {
    setEnrolled(prev => new Set([...prev, course.id]));
    toast.success(`Enrolled in "${course.title}"!`);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="education" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="education" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-indigo-500/20 p-5 bg-gradient-to-br from-indigo-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">🎓</div>
            <div>
              <h1 className="text-base font-black text-white">PaikarLearn</h1>
              <p className="text-[11px] text-zinc-400">Bangla courses by top instructors</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[
              { label: "Courses", value: "2,400+", emoji: "📚" },
              { label: "Students", value: "850k+", emoji: "👨‍🎓" },
              { label: "Instructors", value: "1,200+", emoji: "👨‍🏫" },
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Course, instructor, skill..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-indigo-400" />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {CAT_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Popular */}
        {popular.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">🔥 Popular Courses</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {popular.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.97 }} onClick={() => setSelected(course)} className="shrink-0 w-52 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-pointer">
                  <div className="h-28 relative overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {course.free && <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-[8px] font-black text-white">FREE</div>}
                    {!course.free && course.originalPrice && <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-500/90 text-[8px] font-black text-white">{Math.round((1 - course.price/course.originalPrice)*100)}% OFF</div>}
                    {enrolled.has(course.id) && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-black text-white leading-tight line-clamp-2 mb-1">{course.title}</p>
                    <p className="text-[9px] text-zinc-500">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-[9px] text-zinc-400">{course.rating}</span></div>
                      <span className="text-[9px] text-zinc-600">·</span>
                      {course.free ? <span className="text-[10px] font-black text-emerald-400">Free</span> : <span className="text-[10px] font-black text-indigo-400">৳{course.price.toLocaleString()}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Courses</p>
          <div className="space-y-2.5">
            {rest.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(course)} className="flex gap-3 p-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10] transition-all cursor-pointer">
                <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white line-clamp-2 mb-0.5">{course.title}</p>
                  <p className="text-[9px] text-zinc-500 mb-1">{course.instructor}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[8px] font-black", LEVEL_META[course.level].color)}>{LEVEL_META[course.level].label}</span>
                    <span className="text-[8px] text-zinc-600">· {course.duration}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {course.free ? <span className="text-[11px] font-black text-emerald-400">Free</span> : <span className="text-[11px] font-black text-indigo-400">৳{course.price.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="h-48 relative overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/40 border-2 border-white/30 flex items-center justify-center"><Play className="w-6 h-6 text-white ml-1" /></div>
                </div>
              </div>
              <div className="px-4 pb-8">
                <h2 className="text-base font-black text-white mb-1">{selected.title}</h2>
                <p className="text-[11px] text-zinc-500 mb-3">by {selected.instructor}</p>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{selected.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[{ label: "Rating", value: `${selected.rating}/5 ⭐` }, { label: "Students", value: selected.students.toLocaleString() }, { label: "Duration", value: selected.duration }, { label: "Lessons", value: `${selected.lessons}` }, { label: "Level", value: LEVEL_META[selected.level].label }, { label: "Language", value: selected.language }].map(({ label, value }) => (
                    <div key={label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                      <p className="text-[11px] font-black text-indigo-400">{value}</p>
                      <p className="text-[8px] text-zinc-600 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  {selected.free ? (
                    <span className="text-2xl font-black text-emerald-400">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-indigo-400">৳{selected.price.toLocaleString()}</span>
                      {selected.originalPrice && <span className="text-base text-zinc-600 line-through">৳{selected.originalPrice.toLocaleString()}</span>}
                    </>
                  )}
                </div>
                {enrolled.has(selected.id) ? (
                  <button className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Enrolled · Continue Learning
                  </button>
                ) : (
                  <button onClick={() => handleEnroll(selected)} className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    {selected.free ? <><Play className="w-4 h-4" /> Start Free Course</> : <><Zap className="w-4 h-4" /> Enroll Now</>}
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
