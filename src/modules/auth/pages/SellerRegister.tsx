import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Store, User, Phone, Mail, Lock, Eye, EyeOff,
  MapPin, Wallet, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, ArrowRight, Building2, BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";
import { useTranslation } from "../../../hooks/useTranslation";
import { ThemeLangSwitcher } from "../../../components/navigation/ThemeLangSwitcher";

const SELLER_TYPES = ["retail", "wholesale", "service"] as const;
const STEPS = [
  { id: 1, label: "Account",   labelBn: "অ্যাকাউন্ট",  Icon: User },
  { id: 2, label: "Shop",      labelBn: "দোকান",        Icon: Store },
  { id: 3, label: "Payout",    labelBn: "পেআউট",        Icon: Wallet },
];

export default function SellerRegister() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const isBn = lang === 'BN';
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "",
    shopName: "", type: "retail" as typeof SELLER_TYPES[number],
    category: "", location: "",
    payoutKind: "mobile" as "mobile" | "bank",
    payoutAccount: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const canNext = () => {
    if (step === 1) return form.fullName && form.phone && form.password.length >= 6;
    if (step === 2) return form.shopName;
    return form.payoutAccount;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep((s) => s + 1); return; }
    setBusy(true);
    try {
      await authService.register({
        name: form.fullName,
        email: form.email || `${form.phone}@paikarmart.com`,
        password: form.password,
        role: "seller",
      });
      toast.success(isBn ? "সেলার অ্যাকাউন্ট তৈরি হয়েছে!" : "Seller account created!");
      navigate("/login");
    } catch {
      toast.error(isBn ? "রেজিস্ট্রেশন ব্যর্থ" : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-[var(--pm-bg)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeLangSwitcher />
      </div>

      <div className="w-full max-w-[460px] mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
            <Store className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {isBn ? "বিক্রেতা হিসেবে যোগ দিন" : "Become a Seller"}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {isBn ? "কোটি ক্রেতার কাছে পণ্য বিক্রি করুন" : "Reach crores of buyers on PaikarMart"}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8 select-none">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            const Icon = s.Icon;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    done   ? "bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" :
                    active ? "bg-cyan-500/15 border-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.3)]" :
                             "bg-slate-900 border-slate-800",
                  )}>
                    {done
                      ? <CheckCircle2 className="h-5 w-5 text-white" />
                      : <Icon className={cn("h-4 w-4", active ? "text-cyan-400" : "text-white/40")} />
                    }
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider uppercase mt-1",
                    active ? "text-cyan-400" : done ? "text-emerald-400" : "text-white/30",
                  )}>
                    {isBn ? s.labelBn : s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-1 mb-5 transition-colors",
                    step > s.id ? "bg-emerald-500" : "bg-slate-850",
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <GlassCard className="p-6 border border-slate-800">
          <form onSubmit={submit} className="space-y-4">

            {/* Step 1: Account info */}
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "পুরো নাম" : "Full Name"}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input value={form.fullName} onChange={set("fullName")} placeholder={isBn ? "আপনার নাম" : "Your name"} required className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "মোবাইল" : "Phone"}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" required className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "পাসওয়ার্ড" : "Password"}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 6 characters" required className="pl-10 pr-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Shop details */}
            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "দোকানের নাম" : "Shop Name"}</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input value={form.shopName} onChange={set("shopName")} placeholder={isBn ? "আপনার দোকানের নাম" : "Your shop name"} required className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "দোকানের ধরন" : "Shop Type"}</label>
                  <select value={form.type} onChange={set("type")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-cyan-500">
                    <option value="retail" className="bg-slate-900">{isBn ? "খুচরা (Retail)" : "Retail"}</option>
                    <option value="wholesale" className="bg-slate-900">{isBn ? "পাইকারি (Wholesale)" : "Wholesale"}</option>
                    <option value="service" className="bg-slate-900">{isBn ? "সেবা (Service)" : "Service"}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "প্রাথমিক ক্যাটাগরি" : "Primary Category"}</label>
                  <input value={form.category} onChange={set("category")} placeholder={isBn ? "যেমন: পোশাক, ইলেকট্রনিক্স" : "e.g. Fashion, Electronics"} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "অবস্থান" : "Location"}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input value={form.location} onChange={set("location")} placeholder={isBn ? "শহর, জেলা" : "City, District"} className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Payout */}
            {step === 3 && (
              <>
                <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 mb-2">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-cyan-200/80">
                      {isBn
                        ? "আপনার উপার্জন bKash, Nagad, Rocket বা ব্যাংক অ্যাকাউন্টে পাঠানো হবে।"
                        : "Your earnings will be sent to your bKash, Nagad, Rocket or bank account."
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">{isBn ? "পেআউট পদ্ধতি" : "Payout Method"}</label>
                  <select value={form.payoutKind} onChange={set("payoutKind")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-cyan-500">
                    <option value="mobile" className="bg-slate-900">{isBn ? "মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)" : "Mobile Wallet (bKash/Nagad/Rocket)"}</option>
                    <option value="bank" className="bg-slate-900">{isBn ? "ব্যাংক অ্যাকাউন্ট" : "Bank Account"}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60 font-bold">
                    {form.payoutKind === "mobile"
                      ? (isBn ? "মোবাইল নম্বর" : "Mobile Number")
                      : (isBn ? "অ্যাকাউন্ট নম্বর" : "Account Number")
                    }
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                    <input
                      value={form.payoutAccount}
                      onChange={set("payoutAccount")}
                      placeholder={form.payoutKind === "mobile" ? "01XXXXXXXXX" : (isBn ? "অ্যাকাউন্ট নম্বর" : "Account number")}
                      required
                      className="pl-10 w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className={cn("flex gap-3 mt-2", step > 1 ? "justify-between" : "justify-end")}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-slate-800 rounded-2xl h-11 px-5 text-white/60 hover:text-white text-sm font-semibold flex items-center bg-slate-950/30">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {isBn ? "পেছনে" : "Back"}
                </button>
              )}
              <button
                type="submit"
                disabled={!canNext() || busy}
                className="h-11 flex-1 font-bold bg-gradient-to-r from-cyan-600 to-blue-700 hover:opacity-95 text-white rounded-2xl text-sm transition-all"
              >
                {busy
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" />{isBn ? "তৈরি হচ্ছে…" : "Creating…"}</>
                  : step < 3
                    ? <>{isBn ? "পরবর্তী" : "Next"} <ChevronRight className="h-4 w-4 ml-1 inline" /></>
                    : <>{isBn ? "সেলার অ্যাকাউন্ট খুলুন" : "Create Seller Account"} <ArrowRight className="h-4 w-4 ml-1 inline" /></>
                }
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/50">
          {isBn ? "ক্রেতা হিসেবে যোগ দিতে? " : "Just want to buy? "}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            {isBn ? "বায়ার অ্যাকাউন্ট" : "Buyer account"}
          </Link>
          {" · "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            {isBn ? "লগইন করুন" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
