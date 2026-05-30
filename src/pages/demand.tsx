import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useListDemands, getListDemandsQueryKey, useCreateDemand, useListCategories, getListCategoriesQueryKey, CreateDemandBodyUrgency } from "@workspace/api-client-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, Clock, MapPin, Users, X, ChevronRight, FileText,
  Zap, Search, Filter, Flame, BadgeCheck, Send, DollarSign,
  Tag, AlertCircle, TrendingUp, ArrowRight, Star
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/lib/format";

const URGENCY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  low:    { label: "Low",    color: "text-zinc-400",    bg: "bg-zinc-500/10",    border: "border-zinc-500/20" },
  normal: { label: "Normal", color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  high:   { label: "High",   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  urgent: { label: "Urgent", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  medium: { label: "Medium", color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
};

export default function Demand() {
  const qc = useQueryClient();
  const { data: demands, isLoading } = useListDemands({}, { query: { queryKey: getListDemandsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createDemand = useCreateDemand();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "", description: "", budget: "", categoryId: "", location: "", urgency: "normal" as CreateDemandBodyUrgency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDemand.mutate(
      { data: { title: formData.title, description: formData.description, budget: Number(formData.budget), categoryId: formData.categoryId, location: formData.location || undefined, urgency: formData.urgency } },
      {
        onSuccess: () => {
          toast.success("Demand posted!");
          setShowModal(false);
          qc.invalidateQueries({ queryKey: getListDemandsQueryKey() });
          setFormData({ title: "", description: "", budget: "", categoryId: "", location: "", urgency: "normal" });
        },
        onError: () => toast.error("Failed to post demand. Please try again.")
      }
    );
  };

  const filtered = demands?.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    const matchUrgency = urgencyFilter === "all" || d.urgency === urgencyFilter;
    return matchSearch && matchUrgency;
  });

  const urgentItems = filtered?.filter(d => d.urgency === "urgent" || d.urgency === "high");
  const regularItems = filtered?.filter(d => d.urgency !== "urgent" && d.urgency !== "high");

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="demand" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="demand" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-5 bg-gradient-to-br from-violet-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">📋</div>
              <div>
                <h1 className="text-base font-black text-white">Demand Board</h1>
                <p className="text-[11px] text-zinc-400">Post what you need, vendors respond</p>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-violet-500 hover:bg-violet-400 text-white text-[11px] font-black transition-all shadow-[0_4px_16px_rgba(139,92,246,0.4)]">
              <Plus className="w-3.5 h-3.5" /> Post
            </button>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[
              { label: "Active Demands", value: `${demands?.length || 0}+`, icon: FileText, color: "text-violet-400" },
              { label: "Avg Responses", value: "4.2", icon: Users, color: "text-cyan-400" },
              { label: "Match Rate", value: "87%", icon: BadgeCheck, color: "text-emerald-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <Icon className={cn("w-4 h-4", color)} />
                <p className={cn("text-[11px] font-black", color)}>{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-violet-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search demands..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button onClick={() => setShowModal(true)} className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-violet-400" />
          </button>
        </div>

        {/* Urgency Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {["all", "urgent", "high", "normal", "medium", "low"].map(u => (
            <button key={u} onClick={() => setUrgencyFilter(u)} className={cn("px-3 py-1.5 rounded-2xl text-[10px] font-black whitespace-nowrap border transition-all capitalize", urgencyFilter === u ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              {u === "all" ? "All" : (URGENCY_META[u]?.label || u)}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />)}
          </div>
        )}

        {/* Urgent / High Priority Section */}
        {!isLoading && urgentItems && urgentItems.length > 0 && urgencyFilter === "all" && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">High Priority</p>
            </div>
            <div className="space-y-2">
              {urgentItems.map((demand, i) => <DemandCard key={demand.id} demand={demand} index={i} />)}
            </div>
          </div>
        )}

        {/* All Demands */}
        {!isLoading && (
          <div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">
              {urgencyFilter === "all" ? `${regularItems?.length || 0} More Demands` : `${filtered?.length || 0} Demands`}
            </p>
            <div className="space-y-2">
              {(urgencyFilter === "all" ? regularItems : filtered)?.map((demand, i) => (
                <DemandCard key={demand.id} demand={demand} index={i} />
              ))}
              {!filtered?.length && !isLoading && (
                <div className="py-16 text-center">
                  <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-[13px] font-black text-zinc-600">No demands yet</p>
                  <p className="text-[11px] text-zinc-700 mt-1">Be the first to post a demand!</p>
                  <button onClick={() => setShowModal(true)} className="mt-4 px-5 py-2.5 rounded-2xl bg-violet-500 text-white text-[11px] font-black">Post Demand</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Demand Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl max-h-[90vh] overflow-y-auto">
              <div className="px-5 pt-5 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-white">Post a Demand</h3>
                  <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Title *</label>
                    <input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Need 500 custom t-shirts" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-violet-500/40 placeholder-zinc-600" />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Description *</label>
                    <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Describe your requirement in detail..." rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none resize-none focus:border-violet-500/40 placeholder-zinc-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Budget (৳) *</label>
                      <input required type="number" min="1" value={formData.budget} onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. 50000" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-violet-500/40 placeholder-zinc-600" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Urgency</label>
                      <select value={formData.urgency} onChange={e => setFormData(p => ({ ...p, urgency: e.target.value as CreateDemandBodyUrgency }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-violet-500/40">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Category</label>
                      <select value={formData.categoryId} onChange={e => setFormData(p => ({ ...p, categoryId: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-violet-500/40">
                        <option value="">Select...</option>
                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Location</label>
                      <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Dhaka" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-violet-500/40 placeholder-zinc-600" />
                    </div>
                  </div>

                  <button type="submit" disabled={createDemand.isPending} className="w-full py-4 rounded-2xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {createDemand.isPending ? "Posting..." : "Post Demand"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DemandCard({ demand, index }: { demand: any; index: number }) {
  const meta = URGENCY_META[demand.urgency] || URGENCY_META.normal;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link to={`/demand/${demand.id}`}>
        <div className="flex gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] transition-all">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-[12px] font-black text-white line-clamp-2 leading-tight">{demand.title}</p>
              <span className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-black border shrink-0 whitespace-nowrap", meta.color, meta.bg, meta.border)}>
                {meta.label}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 line-clamp-2 mb-2">{demand.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] font-black text-violet-400">
                <DollarSign className="w-3 h-3" />
                {demand.budget ? formatBDT(demand.budget) : "Open Budget"}
              </span>
              {demand.matchCount > 0 && (
                <span className="flex items-center gap-1 text-[9px] text-zinc-500">
                  <Users className="w-3 h-3" /> {demand.matchCount} Matches
                </span>
              )}
              {demand.location && (
                <span className="flex items-center gap-1 text-[9px] text-zinc-500">
                  <MapPin className="w-3 h-3" /> {demand.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-[9px] text-zinc-600">
                <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(demand.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0 self-center" />
        </div>
      </Link>
    </motion.div>
  );
}
