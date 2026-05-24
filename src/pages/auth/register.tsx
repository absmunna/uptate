import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  User, Phone, Mail, Lock, Eye, EyeOff, Loader2,
  ArrowRight, CheckCircle2, UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  { en: "Track orders in real time",     bn: "রিয়েল টাইমে অর্ডার ট্র্যাক করুন" },
  { en: "Earn PK Coin on every purchase",bn: "প্রতিটি কেনাকাটায় PK কয়েন জিতুন" },
  { en: "Post demands & get quotes",      bn: "ডিমান্ড পোস্ট করুন ও কোটেশন পান" },
  { en: "Access wholesale prices",        bn: "পাইকারি দামে পণ্য কিনুন" },
];

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error(isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await auth.registerUser(form);
      toast.success(isBn ? "অ্যাকাউন্ট তৈরি হয়েছে!" : "Account created successfully!");
      navigate("/");
    } catch {
      toast.error(isBn ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Registration failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 border border-emerald-500/30 mb-4">
          <UserPlus className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-foreground">
          {isBn ? "নতুন অ্যাকা���ন্ট খুলুন" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isBn ? "PaikarMart-এ যোগ দিন বিনামূল্যে" : "Join PaikarMart for free"}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-start gap-1.5 p-2 rounded-xl bg-muted/60 border border-border">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-foreground/70 leading-tight">{isBn ? b.bn : b.en}</span>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl p-6">
        <form onSubmit={submit} className="space-y-4">
          {/* Full name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "পুরো নাম" : "Full Name"}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={form.fullName}
                onChange={set("fullName")}
                placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                required
                className="pl-10 h-11 bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                required
                className="pl-10 h-11 bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder={isBn ? "আপনার ইমেইল" : "your@email.com"}
                className="pl-10 h-11 bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "পাসওয়ার্ড" : "Password"}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder={isBn ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                required
                className="pl-10 pr-10 h-11 bg-background border-border focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength hint */}
            {form.password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[1,2,3,4].map((n) => (
                  <div key={n} className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    form.password.length >= n * 3 ? (form.password.length >= 10 ? "bg-emerald-500" : "bg-amber-500") : "bg-border",
                  )} />
                ))}
              </div>
            )}
          </div>

          {/* TOS */}
          <p className="text-[11px] text-muted-foreground">
            {isBn
              ? "অ্যাকাউন্ট তৈরি করে আপনি আমাদের "
              : "By creating an account you agree to our "}
            <span className="text-primary cursor-pointer">{isBn ? "শর্তাবলী" : "Terms"}</span>
            {isBn ? " ও " : " & "}
            <span className="text-primary cursor-pointer">{isBn ? "গোপনীয়তা নীতিতে" : "Privacy Policy"}</span>
            {isBn ? " সম্মত হচ্ছেন" : ""}.
          </p>

          {/* Submit */}
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 border-0 shadow-lg transition-all text-white"
          >
            {busy
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{isBn ? "তৈরি হচ্ছে…" : "Creating…"}</>
              : <>{isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"} <ArrowRight className="h-4 w-4 ml-2" /></>
            }
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-5 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {isBn ? "আগেই অ্যাকাউন্ট আছে? " : "Already have an account? "}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "লগইন করুন" : "Sign in"}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          {isBn ? "বিক্রেতা হতে চান? " : "Want to sell? "}
          <Link href="/auth/seller-register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "সেলার রেজিস্ট্রেশন" : "Seller registration"}
          </Link>
        </p>
      </div>
    </div>
  );
}
