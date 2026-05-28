import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, Sparkles, AlertCircle, UserPlus, Factory, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const BD_PHONE_RE = /^01[3-9]\d{8}$/;

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\s|-/g, "");
  if (!cleaned) return "মোবাইল নম্বর দিন";
  if (!BD_PHONE_RE.test(cleaned)) return "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
  return null;
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  return null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePhone(phone);
    const pw = validatePassword(password);
    setPhoneErr(pe);
    setPassErr(pw);
    if (pe || pw) return;

    setBusy(true);
    try {
      await auth.loginWithPhone(phone.trim(), password);
      toast.success(isBn ? "সফলভাবে লগইন হয়েছে!" : "Logged in successfully!");
      navigate(from);
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("401") || msg.includes("Invalid")) {
        toast.error(isBn ? "মোবাইল নম্বর বা পাসওয়ার্ড ভুল" : "Incorrect phone number or password.");
      } else {
        toast.error(isBn ? "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Login failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-8 relative">
      <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-[#00a859]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {from !== '/' && (
         <button onClick={() => navigate(from)} className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {isBn ? "ফিরে যান" : "Go back"}
         </button>
      )}

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-[#00a859]/20 to-emerald-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)]">
          <Sparkles className="h-7 w-7 text-[#00a859]" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          {isBn ? "পুনরায় স্বাগতম!" : "Welcome back!"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
          {isBn ? "আপনার PaikarMart অ্যাকাউন্টে লগইন করুন" : "Sign in to your PaikarMart account"}
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 relative z-10">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label className="text-sm font-bold text-zinc-900 dark:text-white">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(null); }}
                onBlur={() => setPhoneErr(validatePhone(phone))}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                maxLength={11}
                className={cn(
                  "pl-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400", 
                  phoneErr && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>
            {phoneErr && (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{phoneErr}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-zinc-900 dark:text-white">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <Link to="/auth/forgot-password" className="text-[12px] text-[#00a859] hover:text-[#00a859]/80 transition-colors font-semibold">
                {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400 pointer-events-none" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPassErr(null); }}
                onBlur={() => setPassErr(validatePassword(password))}
                placeholder="••••••••"
                className={cn(
                  "pl-10 pr-10 h-12 rounded-xl bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400", 
                  passErr && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
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
            {passErr && (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{passErr}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00a859] to-emerald-600 hover:opacity-90 border-0 shadow-[0_4px_12px_rgba(0,168,89,0.3)] transition-all mt-4 text-white"
          >
            {busy
              ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />{isBn ? "লগইন হচ্ছে…" : "Signing in…"}</>
              : <>{isBn ? "লগইন করুন" : "Sign In"} <ArrowRight className="h-5 w-5 ml-2" /></>
            }
          </Button>
        </form>
      </div>

      <div className="mt-8 space-y-3 relative z-10">
        <Link to="/auth/register" className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 backdrop-blur-sm transition-all group">
           <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00a859]/10 text-[#00a859]">
                 <UserPlus className="w-5 h-5" />
              </div>
              <div className="text-left">
                 <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#00a859] transition-colors">{isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Create Account"}</h4>
                 <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{isBn ? "নতুন ব্যবহারকারীদের জন্য" : "For new users"}</p>
              </div>
           </div>
           <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#00a859] group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link to="/auth/seller-register" className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 backdrop-blur-sm transition-all group">
           <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                 <UserPlus className="w-5 h-5" />
              </div>
              <div className="text-left">
                 <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">{isBn ? "বিক্রেতা হিসেবে যুক্ত হোন" : "Become a Seller"}</h4>
                 <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{isBn ? "আপনার পণ্য বিক্রি শুরু করুন" : "Start selling your products"}</p>
              </div>
           </div>
           <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link to="/auth/factory-register" className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 backdrop-blur-sm transition-all group">
           <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                 <Factory className="w-5 h-5" />
              </div>
              <div className="text-left">
                 <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">{isBn ? "ফ্যাক্টরি রেজিস্ট্রেশন" : "Register Factory"}</h4>
                 <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{isBn ? "সরাসরি পাইকারি বিক্রি করুন" : "Sell wholesale directly"}</p>
              </div>
           </div>
           <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
