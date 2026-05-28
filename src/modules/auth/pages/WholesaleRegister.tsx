import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Building2, Package, Wallet, CheckCircle2,
  ChevronRight, ChevronLeft, Store, Link2, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";
import { useTranslation } from "../../../hooks/useTranslation";
import { ThemeLangSwitcher } from "../../../components/navigation/ThemeLangSwitcher";

const WHOLESALE_MARKETS = [
  "ইসলামপুর (Islampur), ঢাকা",
  "খাতুনগঞ্জ (Khatunganj), চট্টগ্রাম",
  "চকবাজার, ঢাকা",
  "বাবুরহাট (Baburhat), নরসিংদী",
  "নবাবপুর ইলেকট্রনিক মার্কেট, ঢাকা",
  "মৌলভীবাজার, ঢাকা",
  "গাউছিয়া মার্কেট, ঢাকা",
  "কামরাঙ্গীরচর, ঢাকা",
  "টঙ্গী বিসিক শিল্প এলাকা, গাজীপুর",
  "সৈয়দপুর কাপড়ের হাট, নীলফামারী",
  "পাবনা হ্যামলেট এরিয়া",
  "আড়তদার অ্যাসোসিয়েশন",
];

const PRODUCT_CATEGORIES = [
  "পোশাক ও ফ্যাশন সামগ্রী",
  "কসমেটিকস ও বিউটি কেয়ার",
  "খাদ্য ও মুদি পণ্য",
  "ইলেকট্রনিক্স ও গেজেটস",
  "গৃহস্থালি ও আসবাবপত্র",
  "ওষুধ ও মেডিকেল কিটস",
  "জুতা ও লেদার গুডস",
  "অন্যান্য",
];

const STEPS = [
  { id: 1, label: "পাইকারি ব্যবসায়ী তথ্য", Icon: Building2 },
  { id: 2, label: "পণ্য ও সোর্সিং",  Icon: Package },
  { id: 3, label: "লেনদেন ও ব্যাংক", Icon: Wallet },
  { id: 4, label: "রিভিউ",         Icon: CheckCircle2 },
];

type Form = {
  fullName: string; phone: string; email: string; password: string;
  shopName: string; market: string; shopAddress: string; district: string;
  tradeLicense: string; tin: string;
  productCategories: string[]; sourceFactory: string; sourceDescription: string;
  moq: string; priceTier1Qty: string; priceTier1Price: string;
  priceTier2Qty: string; priceTier2Price: string;
  priceTier3Qty: string; priceTier3Price: string;
  deliveryRadius: string; paymentMethod: string; bankAccount: string;
};

const INIT: Form = {
  fullName: "", phone: "", email: "", password: "",
  shopName: "", market: "", shopAddress: "", district: "ঢাকা", tradeLicense: "", tin: "",
  productCategories: [], sourceFactory: "", sourceDescription: "",
  moq: "", priceTier1Qty: "", priceTier1Price: "",
  priceTier2Qty: "", priceTier2Price: "",
  priceTier3Qty: "", priceTier3Price: "",
  deliveryRadius: "", paymentMethod: "mobile", bankAccount: "",
};

function toggle<T>(arr: T[], val: T) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function WholesaleRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const setVal = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({
        name: form.fullName,
        email: form.email || `${form.phone}@paikarmart.com`,
        password: form.password,
        role: "wholesaler",
      });
      toast.success("Wholesale Merchant Registered!", {
        description: "আপনার একাউন্ট সফলভাবে তৈরি হয়েছে। লগইন করুন।"
      });
      navigate("/login");
    } catch {
      toast.error("নিবন্ধন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
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
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-600/25 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.2)]">
            <Store className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">পাইকারি বিক্রেতা নিবন্ধন</h1>
            <p className="text-sm text-white/50">Wholesale Merchant · ঐতিহ্যবাহী পাইকারি বাজার ডিজিটাল</p>
          </div>
        </div>

        <GlassCard className="p-6 border border-slate-800">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto gap-2 pb-2">
            {STEPS.map((s, i) => {
              const done = s.id < step;
              const active = s.id === step;
              const Icon = s.Icon;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center border transition-all shrink-0",
                      done ? "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :
                      active ? "bg-emerald-500/15 border-emerald-400/50" : "bg-white/5 border-white/10"
                    )}>
                      <Icon className={cn("h-4 w-4", done ? "text-white" : active ? "text-emerald-300" : "text-white/25")} />
                    </div>
                    <span className={cn("text-[11px] font-bold tracking-tight truncate max-w-[85px] block", 
                      active ? "text-emerald-300" : done ? "text-white/50" : "text-white/20"
                    )}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={cn("h-px flex-1 min-w-[8px]", done ? "bg-emerald-500/40" : "bg-white/8")} />}
                </div>
              );
            })}
          </div>

          <form onSubmit={submit}>

            {/* Step 1: Merchant Info */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-sm font-black text-[var(--pm-text-secondary)] uppercase tracking-wider">১. পাইকারি দোকান ও মালিকের তথ্য</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">মালিকের পুরো নাম *</label>
                    <input value={form.fullName} onChange={setVal("fullName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all placeholder:text-white/10" placeholder="মো. আব্দুর রহমান" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">মোবাইল নম্বর *</label>
                    <input type="tel" value={form.phone} onChange={setVal("phone")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all placeholder:text-white/10" placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">পাসওয়ার্ড *</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={form.password} onChange={setVal("password")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="কমপক্ষে ৬ সংখ্যা" />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">ইমেইল (ঐচ্ছিক)</label>
                    <input type="email" value={form.email} onChange={setVal("email")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="merchant@paikarmart.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">দোকান/ব্যবসা প্রতিষ্ঠানের নাম *</label>
                    <input value={form.shopName} onChange={setVal("shopName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="মেসার্স রহমান ব্রাদার্স" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">মার্কেট/পাইকারি মোকাম *</label>
                    <select value={form.market} onChange={setVal("market")} required className="w-full bg-slate-950/65 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all">
                      <option value="" disabled className="bg-slate-900">পাইকারি মোকাম সিলেক্ট করুন</option>
                      {WHOLESALE_MARKETS.map(m => (
                        <option key={m} value={m} className="bg-slate-900">{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">দোকানের ঠিকানা (মার্কেট ও গলি নম্বর) *</label>
                    <input value={form.shopAddress} onChange={setVal("shopAddress")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="দোকান নং ১১২/এ, গলি ৪, ইসলামপুর" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">ট্রেড লাইসেন্স নম্বর (টিন বা এনআইডিও দিতে পারেন) *</label>
                    <input value={form.tradeLicense} onChange={setVal("tradeLicense")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="TL-XXXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">জেলা *</label>
                    <input value={form.district} onChange={setVal("district")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="ঢাকা" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Sourcing and Products */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-sm font-black text-[var(--pm-text-secondary)] uppercase tracking-wider">২. পণ্যের ক্যাটাগরি ও সোর্সিং তথ্য</h2>
                <div className="space-y-2">
                  <label className="text-xs text-white/60 font-bold">পণ্যের ধরন (ক্যাটাগরি সমূহ সিলেক্ট করুন)</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map(cat => {
                      const on = form.productCategories.includes(cat);
                      return (
                        <button type="button" key={cat} onClick={() => setForm(s => ({ ...s, productCategories: toggle(s.productCategories, cat) }))}
                          className={cn("px-3 py-1.5 rounded-xl text-xs border transition-all",
                            on ? "border-emerald-500 text-emerald-300 bg-emerald-500/10" : "border-slate-800 text-white/40 hover:border-slate-600 bg-slate-950/40"
                          )}>{cat}</button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">সোর্সিং সোর্স (আপনি মূলত কোথা থেকে পণ্য আনেন?)</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input value={form.sourceDescription} onChange={setVal("sourceDescription")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="যেমন: টেক্সটাইল মিল বা কারখানা থেকে সরাসরি সংগ্রহ করি" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">কারখানার আইডি (যদি সরাসরি সোর্সিং যুক্ত থাকে - ঐচ্ছিক)</label>
                    <input value={form.sourceFactory} onChange={setVal("sourceFactory")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="ফ্যাক্টরি আইডি লিখুন" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 font-bold">ডেলিভারি এরিয়া / রেডিয়াস (কিলোমিটারে)</label>
                    <input type="number" value={form.deliveryRadius} onChange={setVal("deliveryRadius")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="১০ কিমি" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payout and Banking */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-sm font-black text-[var(--pm-text-secondary)] uppercase tracking-wider">৩. মূল্য নির্ধারণ ও ব্যাংকিং তথ্য</h2>
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs leading-relaxed">
                  <strong>পাইকারি প্রাইস টিয়ার:</strong> বায়ারদের বেশি পণ্য কিনতে উৎসাহিত করতে পাইকারি দামে বিক্রির জন্য ৩ টি পৃথক স্তর সেট করুন।
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/30 space-y-3">
                    <span className="text-xs font-bold text-cyan-400">স্তব ১ (ডিফল্ট)</span>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-white/50">MOQ (নূন্যতম ক্রয়ের সংখ্যা) *</label>
                      <input value={form.moq} onChange={setVal("moq")} required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none" placeholder="১০ টি" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/30 space-y-3">
                    <span className="text-xs font-bold text-emerald-400">পেআউট মাধ্যম</span>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-white/50">প্রকার সিলেক্ট করুন</label>
                      <select value={form.paymentMethod} onChange={setVal("paymentMethod")} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm outline-none">
                        <option value="mobile" className="bg-slate-900">মোবাইল ব্যাংকিং (bKash/Nagad)</option>
                        <option value="bank" className="bg-slate-900">ট্রেড বাংক অ্যাকাউন্ট</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60 font-bold">পেআউটের হিসাব/ব্যাংক একাউন্ট নম্বর *</label>
                    <input value={form.bankAccount} onChange={setVal("bankAccount")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="যেমন: বিকাশ বা ব্যাংক কটন নং" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review and Submit */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">৪. তথ্য যাচাই করে সাবমিট করুন</h2>
                <div className="space-y-3 text-xs leading-relaxed text-white/80">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                    <p className="text-emerald-400 font-bold">মালিক ও ব্যবসায়ী:</p>
                    <p>নাম: {form.fullName}</p>
                    <p>ফোন: {form.phone}</p>
                    <p>দোকান: {form.shopName}</p>
                    <p>মোকাম: {form.market}</p>
                    <p>ট্রেড লাইসেন্স: {form.tradeLicense}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                    <p className="text-emerald-400 font-bold">পণ্য ও ক্যাটাগরি:</p>
                    <p>ক্যাটাগরি সমূহ: {form.productCategories.join(", ") || "কোনটি সিলেক্ট করেননি"}</p>
                    <p>ডেলিভারি এরিয়া: {form.deliveryRadius || "—"} কিমি</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form control buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="text-sm text-white/60 hover:text-white transition-colors flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" /> ফিরে যান
                </button>
              ) : <div />}

              {step < 4 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                  পরবর্তী ধাপ <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন"}
                </button>
              )}
            </div>

          </form>

          <p className="mt-6 text-xs text-white/40 text-center">
            ক্রেতা বায়ার হতে চান? <Link to="/register" className="text-emerald-400 font-semibold hover:underline">বায়ার একাউন্ট তৈরি করুন</Link>
          </p>

        </GlassCard>
      </div>
    </div>
  );
}
