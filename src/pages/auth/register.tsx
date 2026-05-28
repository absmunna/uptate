import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  User, Phone, Mail, Lock, Eye, EyeOff, Loader2,
  ArrowRight, CheckCircle2, UserPlus, AlertCircle, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  { en: "Track orders in real time",      bn: "রিয়েল টাইমে অর্ডার ট্র্যাক করুন" },
  { en: "Earn PK Coin on every purchase", bn: "প্রতিটি কেনাকাটায় PK কয়েন জিতুন" },
  { en: "Post demands & get quotes",      bn: "ডিমান্ড পোস্ট করুন ও কোটেশন পান" },
  { en: "Access wholesale prices",        bn: "পাইকারি দামে পণ্য কিনুন" },
];

const BD_PHONE_RE = /^01[3-9]\d{8}$/;
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validatePhone(v: string) {
  if (!v) return "মোবাইল নম্বর দিন";
  if (!BD_PHONE_RE.test(v.replace(/\s|-/g, ""))) return "সঠিক ১১ সংখ্যার বাংলাদেশি নম্বর দিন (01XXXXXXXXX)";
  return null;
}

function validatePassword(v: string) {
  if (v.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (!PW_RE.test(v)) return "পাসওয়ার্ডে অক্ষর ও সংখ্যা উভয়ই থাকতে হবে";
  return null;
}

function strengthLevel(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z\d]/.test(v)) s++;
  return s;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string | null> = {
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      fullName: form.fullName.trim().length < 2 ? "পুরো নাম দিন" : null,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!termsChecked) {
      toast.error(isBn ? "শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে" : "Please accept the Terms & Privacy Policy");
      return;
    }
    setBusy(true);
    try {
      await auth.registerUser(form);
      toast.success(isBn ? "অ্যাকাউন্ট তৈরি হয়েছে!" : "Account created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(isBn ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const strength = strengthLevel(form.password);
  const strengthColor = ["bg-gray-200 dark:bg-white/10", "bg-rose-500", "bg-amber-500", "bg-[#00a859]/80", "bg-[#00a859]"];

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-8 relative">
      <div className="absolute top-20 right-0 -m-20 w-80 h-80 bg-[#00a859]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 -m-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Link 
        to="/auth/login" 
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6 relative z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        {isBn ? "ফিরে যান" : "Go back"}
      </Link>

      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-[#00a859]/20 to-blue-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)]">
          <UserPlus className="h-7 w-7 text-[#00a859]" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          {isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Create your account"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
          {isBn ? "PaikarMart-এ যোগ দিন বিনামূল্যে" : "Join PaikarMart for free"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-[#00a859] shrink-0 mt-0.5" />
            <span className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-tight font-medium">{isBn ? b.bn : b.en}</span>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 relative z-10">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-zinc-900 dark:text-white">
              {isBn ? "পুরো নাম" : "Full Name"}
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                value={form.fullName}
                onChange={set("fullName")}
                placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                className={cn(
                  "pl-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400", 
                  errors.fullName && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>
            {errors.fullName && <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1 font-medium"><AlertCircle className="h-3.5 w-3.5" />{errors.fullName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-zinc-900 dark:text-white">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                maxLength={11}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                className={cn(
                  "pl-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400", 
                  errors.phone && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>
            {errors.phone && <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1 font-medium"><AlertCircle className="h-3.5 w-3.5" />{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-zinc-900 dark:text-white">
              {isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder={isBn ? "আপনার ইমেইল" : "your@email.com"}
                className="pl-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-zinc-900 dark:text-white">
              {isBn ? "পাসওয়ার্ড" : "Password"}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder={isBn ? "কমপক্ষে ৮ অক্ষর, অক্ষর+সংখ্যা" : "Min 8 chars, letters + numbers"}
                className={cn(
                  "pl-10 pr-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400", 
                  errors.password && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
              <button 
                type="button" 
                onClick={() => setShowPass((v) => !v)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {[1,2,3,4].map((n) => (
                  <div key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors", strength >= n ? strengthColor[strength] : "bg-gray-200 dark:bg-white/10")} />
                ))}
              </div>
            )}
            {errors.password && <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1 font-medium"><AlertCircle className="h-3.5 w-3.5" />{errors.password}</p>}
          </div>

          <div className="flex items-start gap-3 pt-2 pb-1">
            <Checkbox
              id="terms"
              checked={termsChecked}
              onCheckedChange={(v) => setTermsChecked(!!v)}
              className="mt-0.5 border-gray-300 dark:border-white/20 data-[state=checked]:bg-[#00a859] data-[state=checked]:border-[#00a859]"
            />
            <label htmlFor="terms" className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug cursor-pointer">
              {isBn
                ? <>আমি PaikarMart-এর <Link to="/terms" className="text-[#00a859] hover:underline">শর্তাবলী</Link>, <Link to="/refund-policy" className="text-[#00a859] hover:underline">রিফান্ড নীতি</Link> ও <Link to="/privacy" className="text-[#00a859] hover:underline">গোপনীয়তা নীতি</Link> পড়েছি এবং সম্মত আছি।</>
                : <>I have read and agree to PaikarMart's <Link to="/terms" className="text-[#00a859] hover:underline">Terms of Service</Link>, <Link to="/refund-policy" className="text-[#00a859] hover:underline">Refund Policy</Link> & <Link to="/privacy" className="text-[#00a859] hover:underline">Privacy Policy</Link>.</>
              }
            </label>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00a859] to-emerald-600 hover:opacity-90 border-0 shadow-[0_4px_12px_rgba(0,168,89,0.3)] transition-all mt-4 text-white"
          >
            {busy
              ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />{isBn ? "তৈরি হচ্ছে…" : "Creating…"}</>
              : <>{isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"} <ArrowRight className="h-5 w-5 ml-2" /></>
            }
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center space-y-3 relative z-10">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {isBn ? "আগেই অ্যাকাউন্ট আছে? " : "Already have an account? "}
          <Link to="/auth/login" className="text-[#00a859] hover:text-[#00a859]/80 transition-colors">
            {isBn ? "লগইন করুন" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
