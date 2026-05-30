import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Signal, Phone, Wifi, Zap, Star, Check, ChevronRight,
  Smartphone, Globe, MessageSquare, Video, X, BadgeCheck,
  Users, Shield, Gauge
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TelecomCategory = "all" | "mobile" | "internet" | "bundle" | "international";
type Operator = "all" | "grameenphone" | "robi" | "banglalink" | "teletalk" | "airtel";

type TelecomPlan = {
  id: string; name: string; operator: Operator; category: TelecomCategory;
  price: number; duration: string; data?: string; voice?: string; sms?: string;
  validity: string; features: string[]; popular?: boolean; badge?: string;
  color: string;
};

const OPERATOR_META: Record<string, { name: string; color: string; logo: string }> = {
  grameenphone: { name: "Grameenphone", color: "text-blue-400", logo: "🔵" },
  robi:         { name: "Robi",         color: "text-red-400",  logo: "🔴" },
  banglalink:   { name: "Banglalink",   color: "text-orange-400", logo: "🟠" },
  teletalk:     { name: "Teletalk",     color: "text-green-400", logo: "🟢" },
  airtel:       { name: "Airtel",       color: "text-rose-400",  logo: "🔺" },
};

const PLANS: TelecomPlan[] = [
  { id: "t1", name: "GP Social Pack", operator: "grameenphone", category: "mobile", price: 49, duration: "30 days", data: "3GB", voice: "100 min", sms: "50 SMS", validity: "30 days", features: ["Facebook", "WhatsApp", "YouTube", "TikTok"], popular: true, badge: "Best Value", color: "from-blue-500/20 to-indigo-600/10 border-blue-500/20" },
  { id: "t2", name: "Robi Unlimited", operator: "robi", category: "mobile", price: 199, duration: "30 days", data: "Unlimited*", voice: "Unlimited", sms: "Unlimited", validity: "30 days", features: ["All Social Media", "HD Video", "Hotspot", "5G Ready"], badge: "Popular", color: "from-red-500/20 to-rose-600/10 border-red-500/20" },
  { id: "t3", name: "BL 5G Premium", operator: "banglalink", category: "mobile", price: 349, duration: "28 days", data: "30GB", voice: "500 min", sms: "500 SMS", validity: "28 days", features: ["5G Network", "4K Streaming", "100+ Countries SMS", "Priority Support"], popular: true, color: "from-orange-500/20 to-amber-600/10 border-orange-500/20" },
  { id: "t4", name: "Home WiFi 30Mbps", operator: "grameenphone", category: "internet", price: 800, duration: "30 days", data: "Unlimited", validity: "30 days", features: ["30 Mbps Speed", "Unlimited FUP", "Free Router", "24/7 Support"], color: "from-cyan-500/20 to-blue-600/10 border-cyan-500/20" },
  { id: "t5", name: "GP+Robi Bundle", operator: "grameenphone", category: "bundle", price: 599, duration: "30 days", data: "50GB + 20GB Robi", voice: "Unlimited GP", validity: "30 days", features: ["2 Operators", "Cricket Streaming", "GPAY", "Business SMS"], badge: "New", color: "from-violet-500/20 to-purple-600/10 border-violet-500/20" },
  { id: "t6", name: "ISD World Pack", operator: "robi", category: "international", price: 250, duration: "7 days", voice: "300 min (USA/UK)", validity: "7 days", features: ["USA", "UK", "Canada", "Australia", "KSA", "UAE"], color: "from-teal-500/20 to-cyan-600/10 border-teal-500/20" },
  { id: "t7", name: "Teletalk Basic", operator: "teletalk", category: "mobile", price: 19, duration: "7 days", data: "1GB", voice: "30 min", sms: "10 SMS", validity: "7 days", features: ["Government Service Access", "mGov Apps", "Secure Network"], color: "from-green-500/20 to-emerald-600/10 border-green-500/20" },
  { id: "t8", name: "Airtel Speed 20GB", operator: "airtel", category: "mobile", price: 149, duration: "30 days", data: "20GB", voice: "200 min", sms: "100 SMS", validity: "30 days", features: ["4G LTE", "Netflix Partner", "Night Booster", "Free Caller Tune"], color: "from-rose-500/20 to-pink-600/10 border-rose-500/20" },
];

const CAT_FILTERS: { id: TelecomCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",           label: "All",          icon: Signal },
  { id: "mobile",        label: "Mobile",       icon: Smartphone },
  { id: "internet",      label: "Internet",     icon: Wifi },
  { id: "bundle",        label: "Bundle",       icon: Zap },
  { id: "international", label: "ISD",          icon: Globe },
];

const OP_FILTERS: { id: Operator; label: string }[] = [
  { id: "all",          label: "All" },
  { id: "grameenphone", label: "GP" },
  { id: "robi",         label: "Robi" },
  { id: "banglalink",   label: "BL" },
  { id: "teletalk",     label: "Teletalk" },
  { id: "airtel",       label: "Airtel" },
];

export default function TelecomPortal() {
  const [category, setCategory] = useState<TelecomCategory>("all");
  const [operator, setOperator] = useState<Operator>("all");
  const [selected, setSelected] = useState<TelecomPlan | null>(null);
  const [activated, setActivated] = useState<Set<string>>(new Set());

  const filtered = PLANS.filter(p => {
    const matchCat = category === "all" || p.category === category;
    const matchOp = operator === "all" || p.operator === operator;
    return matchCat && matchOp;
  });

  const popular = filtered.filter(p => p.popular);
  const rest = filtered.filter(p => !p.popular);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3 px-4"><StoryBar context="telecom" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <PortalIconBar context="telecom" />
      </div>
      <div className="px-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-sky-500/20 p-5 bg-gradient-to-br from-sky-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-2xl">📡</div>
            <div><h1 className="text-base font-black text-white">PaikarTelecom</h1><p className="text-[11px] text-zinc-400">Mobile, internet &amp; ISD packages</p></div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[{ label: "Operators", value: "5", emoji: "📶" }, { label: "Plans", value: "1,200+", emoji: "📦" }, { label: "Users", value: "18M+", emoji: "👥" }].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-sky-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
          {CAT_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCategory(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", category === id ? "bg-sky-500/15 border-sky-500/30 text-sky-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        {/* Operator Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {OP_FILTERS.map(({ id, label }) => (
            <button key={id} onClick={() => setOperator(id)} className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap border transition-all", operator === id ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.02] border-white/[0.04] text-zinc-600")}>
              {id !== "all" && OPERATOR_META[id]?.logo + " "}{label}
            </button>
          ))}
        </div>

        {/* Popular Plans */}
        {popular.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">🔥 Popular</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {popular.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(plan)} className={cn("shrink-0 w-44 p-3.5 rounded-2xl border cursor-pointer bg-gradient-to-br transition-all", plan.color)}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[8px] text-zinc-500">{OPERATOR_META[plan.operator]?.logo} {OPERATOR_META[plan.operator]?.name}</p>
                      <p className="text-[11px] font-black text-white">{plan.name}</p>
                    </div>
                    {plan.badge && <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-[8px] font-black text-black">{plan.badge}</span>}
                  </div>
                  <p className="text-xl font-black text-white mb-1">৳{plan.price}</p>
                  <p className="text-[9px] text-zinc-400 mb-2">{plan.validity}</p>
                  {plan.data && <div className="flex items-center gap-1 mb-0.5"><Wifi className="w-3 h-3 text-sky-400" /><span className="text-[10px] font-black text-sky-400">{plan.data}</span></div>}
                  {plan.voice && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" /><span className="text-[10px] font-black text-emerald-400">{plan.voice}</span></div>}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Plans */}
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Plans</p>
        <div className="space-y-2.5">
          {(rest.length ? rest : filtered).map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(plan)} className={cn("flex gap-3 p-3.5 rounded-2xl border cursor-pointer bg-gradient-to-br transition-all hover:brightness-110", plan.color)}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[9px] text-zinc-500">{OPERATOR_META[plan.operator]?.logo} {OPERATOR_META[plan.operator]?.name}</p>
                  {plan.badge && <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-[7px] font-black text-black">{plan.badge}</span>}
                </div>
                <p className="text-[12px] font-black text-white">{plan.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  {plan.data && <span className="text-[9px] text-sky-400 font-black">{plan.data} data</span>}
                  {plan.voice && <span className="text-[9px] text-emerald-400 font-black">{plan.voice} calls</span>}
                  <span className="text-[9px] text-zinc-500">{plan.validity}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xl font-black text-white">৳{plan.price}</p>
                {activated.has(plan.id) && <div className="flex items-center justify-end gap-1 mt-1"><Check className="w-3 h-3 text-emerald-400" /><span className="text-[9px] text-emerald-400">Active</span></div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Plan Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white">{selected.name}</h3>
                <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <div className={cn("p-4 rounded-2xl border bg-gradient-to-br mb-4", selected.color)}>
                <p className="text-[10px] text-zinc-400 mb-1">{OPERATOR_META[selected.operator]?.logo} {OPERATOR_META[selected.operator]?.name} · {selected.validity}</p>
                <p className="text-3xl font-black text-white">৳{selected.price}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{ l: "Data", v: selected.data || "N/A", i: Wifi }, { l: "Voice", v: selected.voice || "N/A", i: Phone }, { l: "SMS", v: selected.sms || "N/A", i: MessageSquare }].map(({ l, v, i: Icon }) => (
                  <div key={l} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                    <Icon className="w-4 h-4 text-sky-400 mx-auto mb-0.5" />
                    <p className="text-[11px] font-black text-white">{v}</p>
                    <p className="text-[8px] text-zinc-600">{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.features.map(f => <span key={f} className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[10px] font-black text-sky-400">{f}</span>)}
              </div>
              {activated.has(selected.id) ? (
                <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[13px] text-center flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Pack Activated</div>
              ) : (
                <button onClick={() => { setActivated(p => new Set([...p, selected.id])); toast.success(`${selected.name} activated!`); setSelected(null); }} className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" /> Activate Now
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
