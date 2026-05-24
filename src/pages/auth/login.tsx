import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  Phone, Lock, Eye, EyeOff, Loader2, Store, ShieldCheck,
  ArrowRight, Sparkles, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await auth.loginWithPhone(phone, password);
      toast.success(isBn ? "সফলভাবে লগইন হয়েছে!" : "Logged in successfully!");
      navigate("/");
    } catch {
      toast.error(isBn ? "লগইন ব্যর্থ হয়েছে" : "Login failed. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-6">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-600/20 border border-primary/30 mb-4 shadow-[0_0_24px_rgba(var(--neon-cyan),0.15)]">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-foreground">
          {isBn ? "পুনরায় স্বাগতম!" : "Welcome back!"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isBn ? "আপনার PaikarMart অ্যাকাউন্টে লগইন করুন" : "Sign in to your PaikarMart account"}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl p-6">
        <form onSubmit={submit} className="space-y-4">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                required
                className="pl-10 h-11 bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground/80">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <button type="button" className="text-[12px] text-primary hover:text-primary/80 transition-colors font-medium">
                {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10 pr-10 h-11 bg-background border-border focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 text-sm font-bold bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 border-0 shadow-lg neon-glow-sm transition-all mt-2"
          >
            {busy
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{isBn ? "লগইন হচ্ছে…" : "Signing in…"}</>
              : <>{isBn ? "লগইন করুন" : "Sign In"} <ArrowRight className="h-4 w-4 ml-2" /></>
            }
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground font-medium">
            {isBn ? "অথবা" : "OR"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Quick demo login */}
        <p className="text-[10px] text-muted-foreground text-center mb-1.5">{isBn ? "ডেমো অ্যাকাউন্ট দিয়ে চেষ্টা করুন:" : "Try with demo accounts:"}</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setPhone("01700000001"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-purple-500/25 bg-purple-500/8 hover:bg-purple-500/15 text-foreground/70 hover:text-foreground transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span className="text-[11px] font-semibold text-purple-300">{isBn ? "অ্যাডমিন" : "Admin"}</span>
          </button>
          <button
            onClick={() => { setPhone("01700000002"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/15 text-foreground/70 hover:text-foreground transition-all"
          >
            <Store className="h-4 w-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-300">{isBn ? "সেলার" : "Seller"}</span>
          </button>
          <button
            onClick={() => { setPhone("01700000004"); setPassword("demo123"); }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15 text-foreground/70 hover:text-foreground transition-all"
          >
            <User className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-semibold text-cyan-300">{isBn ? "বায়ার" : "Buyer"}</span>
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-5 space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          {isBn ? "নতুন ব্যবহারকারী? " : "New here? "}
          <Link href="/auth/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "অ্যাকাউন্ট খুলুন" : "Create account"}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          {isBn ? "বিক্রি করতে চান? " : "Want to sell? "}
          <Link href="/auth/seller-register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "বিক্রেতা হন" : "Become a seller"}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          {isBn ? "কারখানা মা��িক? " : "Factory owner? "}
          <Link href="/auth/factory-register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "ফ্যাক্টরি রেজিস্ট্রেশন" : "Register factory"}
          </Link>
        </p>
      </div>
    </div>
  );
}
