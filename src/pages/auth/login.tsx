import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  Phone, Lock, Eye, EyeOff, Loader2,
  ArrowRight, Sparkles, AlertCircle,
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
  const [, navigate] = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

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
      navigate("/");
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
    <div className="w-full max-w-[420px] mx-auto px-4 py-6">
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

      <div className="rounded-2xl border border-border bg-card shadow-xl p-6">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-foreground/80">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(null); }}
                onBlur={() => setPhoneErr(validatePhone(phone))}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                maxLength={11}
                className={cn("pl-10 h-11 bg-background border-border focus:border-primary", phoneErr && "border-destructive")}
              />
            </div>
            {phoneErr && (
              <p className="flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />{phoneErr}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground/80">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <Link href="/auth/forgot-password" className="text-[12px] text-primary hover:text-primary/80 transition-colors font-medium">
                {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPassErr(null); }}
                onBlur={() => setPassErr(validatePassword(password))}
                placeholder="••••••••"
                className={cn("pl-10 pr-10 h-11 bg-background border-border focus:border-primary", passErr && "border-destructive")}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passErr && (
              <p className="flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />{passErr}
              </p>
            )}
          </div>

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
      </div>

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
          {isBn ? "কারখানা মালিক? " : "Factory owner? "}
          <Link href="/auth/factory-register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {isBn ? "ফ্যাক্টরি রেজিস্ট্রেশন" : "Register factory"}
          </Link>
        </p>
      </div>
    </div>
  );
}
