import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { MapPin, Building2, Package, CheckCircle2, ChevronRight, ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";
import { ThemeLangSwitcher } from "../../../components/navigation/ThemeLangSwitcher";

const HAT_DAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];
const PRODUCT_CATEGORIES = [
  "মুদিখানা", "কাপড় ও পোশাক", "কৃষি সামগ্রী", "ইলেকট্রনিক্স",
  "ওষুধ", "হার্ডওয়্যার", "শাকসবজি ও ফল", "মৎস্য ও মাংস",
  "শিশু সামগ্রী", "গৃহস্থালি", "অন্যান্য",
];
const DIVISIONS = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

const STEPS = [
  { id: 1, label: "দোকানদার তথ্য", Icon: Building2 },
  { id: 2, label: "লোকেশন ও হাট",  Icon: MapPin },
  { id: 3, label: "পণ্য তালিকা",    Icon: Package },
  { id: 4, label: "কনফার্ম",        Icon: CheckCircle2 },
];

type Form = {
  fullName: string; phone: string; email: string; password: string;
  shopName: string; village: string; union: string;
  upazila: string; district: string; division: string;
  hatName: string; hatDay: string; hatDay2: string;
  productCategories: string[]; supplySource: string;
  nidNumber: string; payoutMethod: string; payoutAccount: string;
};

const INIT: Form = {
  fullName: "", phone: "", email: "", password: "",
  shopName: "", village: "", union: "", upazila: "", district: "", division: "",
  hatName: "", hatDay: "", hatDay2: "",
  productCategories: [], supplySource: "", nidNumber: "",
  payoutMethod: "mobile", payoutAccount: "",
};

function toggle<T>(arr: T[], val: T) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function RuralRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(s => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({
        name: form.fullName,
        email: form.email || `${form.phone}@paikarmart.com`,
        password: form.password,
        role: "seller",
      });
      toast.success("গ্রামীণ দোকান নিবন্ধিত হয়েছে!", { description: "আপনার অ্যাকাউন্ট শীঘ্রই সক্রিয় হবে।" });
      navigate("/login");
    } catch {
      toast.error("নিবন্ধন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-[var(--pm-bg)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeLangSwitcher />
      </div>

      <div className="max-w-2xl w-full mx-auto py-8">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.2)]">
            <MapPin className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">গ্রামীণ দোকানদার নিবন্ধন</h1>
            <p className="text-sm text-white/50">Rural Shopkeeper · হাটবাজার থেকে অনলাইনে</p>
          </div>
        </div>

        <GlassCard className="p-6 border border-slate-800">
          {/* Stepper */}
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => {
              const done = s.id < step;
              const active = s.id === step;
              const Icon = s.Icon;
              return (
                <div key={s.id} className="flex items-center gap-1 flex-1 min-w-[120px]">
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center border transition-all shrink-0",
                    done ? "bg-amber-500 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]" :
                    active ? "bg-amber-500/15 border-amber-400/50" : "bg-white/5 border-white/10"
                  )}>
                    <Icon className={cn("h-4 w-4", done ? "text-white" : active ? "text-amber-300" : "text-white/25")} />
                  </div>
                  <span className={cn("text-[10px] font-bold tracking-tight truncate max-w-[85px] block", active ? "text-amber-300" : done ? "text-white/50" : "text-white/20")}>{s.label}</span>
                  {i < STEPS.length - 1 && <div className={cn("h-px flex-1 min-w-[8px]", done ? "bg-amber-500/40" : "bg-white/8")} />}
                </div>
              );
            })}
          </div>

          <form onSubmit={submit}>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">দোকানদারের ব্যক্তিগত তথ্য</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">পূর্ণ নাম *</label>
                    <input value={form.fullName} onChange={set("fullName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-amber-500 placeholder:text-white/10" placeholder="মো. করিম" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">মোবাইল নম্বর *</label>
                    <input value={form.phone} onChange={set("phone")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-amber-500 placeholder:text-white/10" placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">পাসওয়ার্ড *</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-white text-sm outline-none focus:border-amber-500" placeholder="কমপক্ষে ৬ সংখ্যা" />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">দোকানের নাম *</label>
                    <input value={form.shopName} onChange={set("shopName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-amber-500 placeholder:text-white/10" placeholder="করিম স্টোর" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">জাতীয় পরিচয়পত্র (NID)</label>
                    <input value={form.nidNumber} onChange={set("nidNumber")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="১০ বা ১৩ সংখ্যার NID নম্বর" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">পেআউট পদ্ধতি</label>
                    <select value={form.payoutMethod} onChange={set("payoutMethod")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                      <option value="mobile">bKash / Nagad</option>
                      <option value="bank">ব্যাংক</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">একাউন্ট নম্বর *</label>
                    <input value={form.payoutAccount} onChange={set("payoutAccount")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-amber-500" placeholder="01XXXXXXXXX" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">দোকানের লোকেশন ও হাটবাজার</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">গ্রাম *</label>
                    <input value={form.village} onChange={set("village")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="গ্রামের নাম" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">ইউনিয়ন / পৌরসভা</label>
                    <input value={form.union} onChange={set("union")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="ইউনিয়নের নাম" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">উপজেলা</label>
                    <input value={form.upazila} onChange={set("upazila")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="উপজেলা" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">জেলা *</label>
                    <input value={form.district} onChange={set("district")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="জেলা" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">বিভাগ</label>
                    <select value={form.division} onChange={set("division")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-4">
                  <div className="text-xs font-semibold text-amber-300 mb-3 uppercase tracking-wider">হাটবাজারের তথ্য</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs text-white/60 font-bold">হাটের নাম</label>
                      <input value={form.hatName} onChange={set("hatName")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="যেমন: বেগমগঞ্জ হাট, সোনারগাঁও হাট" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/60 font-bold">হাটের দিন ১</label>
                      <select value={form.hatDay} onChange={set("hatDay")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                        <option value="">বার নির্বাচন করুন</option>
                        {HAT_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/60 font-bold">হাটের দিন ২ (ঐচ্ছিক)</label>
                      <select value={form.hatDay2} onChange={set("hatDay2")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                        <option value="">দ্বিতীয় বার</option>
                        {HAT_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">পণ্যের ধরন ও সরবরাহ উৎস</h2>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/60">আপনি কী ধরনের পণ্য বিক্রি করেন?</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map(cat => (
                      <button type="button" key={cat}
                        onClick={() => setForm(s => ({ ...s, productCategories: toggle(s.productCategories, cat) }))}
                        className={cn("px-2.5 py-1.5 rounded-xl text-xs border transition-all",
                          form.productCategories.includes(cat)
                            ? "border-amber-500 text-amber-300 bg-amber-500/10"
                            : "border-slate-800 text-white/40 bg-slate-950/30 hover:border-slate-700"
                        )}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-white/60 font-bold">মাল কোথা থেকে কিনেন? (সরবরাহ উৎস)</label>
                  <input value={form.supplySource} onChange={set("supplySource")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="যেমন: ঢাকার ইসলামপুর থেকে পাইকারি কিনি" />
                </div>
                <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 text-xs text-amber-200/70 leading-relaxed">
                  <strong className="text-amber-300">পরবর্তী ধাপে:</strong> নিবন্ধনের পর আপনি পাইকারি বিক্রেতাদের সাথে সরাসরি লিংক করতে পারবেন এবং অনলাইনে অর্ডার নিতে পারবেন।
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">তথ্য যাচাই করুন</h2>
                {[
                  { t: "দোকানদার", rows: [["নাম", form.fullName], ["ফোন", form.phone], ["দোকান", form.shopName]] },
                  { t: "লোকেশন", rows: [
                    ["গ্রাম", form.village], ["উপজেলা", form.upazila],
                    ["জেলা", form.district], ["হাট", form.hatName || "—"],
                    ["হাটের দিন", [form.hatDay, form.hatDay2].filter(Boolean).join(", ") || "—"],
                  ]},
                  { t: "পণ্য", rows: [
                    ["ক্যাটাগরি", form.productCategories.join(", ") || "—"],
                    ["সরবরাহ উৎস", form.supplySource || "—"],
                  ]},
                ].map(({ t, rows }) => (
                  <div key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">{t}</div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {rows.map(([k, v]) => (
                        <div key={k}><span className="text-white/35 block text-[10px]">{k}</span><span className="text-white/75 font-semibold truncate block">{v}</span></div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-5 border-t border-slate-850">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="text-sm text-white/55 flex items-center bg-transparent border-0 hover:text-white transition-all">
                  <ChevronLeft className="h-4 w-4 mr-1" /> পেছনে
                </button>
              ) : <div />}
              {step < 4 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 rounded-2xl py-3 px-6 text-white font-bold text-sm shadow-[0_0_16px_rgba(245,158,11,0.3)] flex items-center">
                  পরবর্তী <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 rounded-2xl py-3 px-8 text-white font-bold text-sm shadow-[0_0_16px_rgba(245,158,11,0.3)] flex items-center">
                  {loading ? "নিবন্ধন হচ্ছে…" : "নিবন্ধন সম্পন্ন করুন"}
                </button>
              )}
            </div>

          </form>
        </GlassCard>

        {/* Footer */}
        <p className="mt-6 text-xs text-white/40 text-center">
          পাইকারি বিক্রেতা? <Link to="/auth/wholesale-register" className="text-amber-400 hover:underline">Wholesale Register</Link>
          &nbsp;·&nbsp; কারখানা? <Link to="/auth/factory-register" className="text-amber-400 hover:underline">Factory Register</Link>
        </p>
      </div>
    </div>
  );
}
