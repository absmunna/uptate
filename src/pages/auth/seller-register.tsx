import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import {
  Store, User, Phone, Mail, Lock, Eye, EyeOff,
  MapPin, Wallet, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, ArrowRight, Building2, BadgeCheck,
  AlertCircle, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SELLER_TYPES = ["retail", "wholesale", "service"] as const;
const STEPS = [
  { id: 1, label: "Account",   labelBn: "অ্যাকাউন্ট",  Icon: User },
  { id: 2, label: "Shop",      labelBn: "দোকান",        Icon: Store },
  { id: 3, label: "Payout",    labelBn: "পেআউট",        Icon: Wallet },
];

const BD_PHONE_RE = /^01[3-9]\d{8}$/;
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validatePhone(v: string) {
  if (!v) return "মোবাইল নম্বর দিন";
  if (!BD_PHONE_RE.test(v.replace(/\s|-/g, ""))) return "সঠিক ১১ সংখ্যার নম্বর দিন (01XXXXXXXXX)";
  return null;
}
function validatePassword(v: string) {
  if (v.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (!PW_RE.test(v)) return "পাসওয়ার্ডে অক্ষর ও সংখ্যা উভয়ই থাকতে হবে";
  return null;
}

export default function SellerRegisterPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "",
    shopName: "", type: "retail" as typeof SELLER_TYPES[number],
    category: "", location: "",
    address: "",
    tradeLicenseNo: "",
    payoutKind: "mobile" as "mobile" | "bank",
    payoutAccount: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const setErr = (k: string, v: string | null) =>
    setFieldErrors((s) => ({ ...s, [k]: v }));

  const validateStep1 = () => {
    const errs: Record<string, string | null> = {
      fullName: form.fullName.trim().length < 2 ? "পুরো নাম দিন" : null,
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
    };
    setFieldErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  const canNext = () => {
    if (step === 1) return form.fullName && form.phone && form.password.length >= 8;
    if (step === 2) return form.shopName && form.address;
    return form.payoutAccount;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!form.shopName) { setErr("shopName", "দোকানের নাম দিন"); return; }
      if (!form.address) { setErr("address", "ব্যবসার ঠিকানা দিন"); return; }
      setStep(3);
      return;
    }
    // Step 3 submit
    if (!form.payoutAccount) { setErr("payoutAccount", "পেআউট তথ্য দিন"); return; }
    if (!termsChecked) {
      toast.error(isBn ? "শর্তাবলীতে সম্মত হতে হবে" : "Please accept the Terms & Conditions");
      return;
    }
    setBusy(true);
    try {
      await auth.registerSeller({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        seller: {
          shopName: form.shopName,
          type: form.type,
          category: form.category || undefined,
          location: form.location || undefined,
          address: form.address,
          nidOrTradeLicense: form.tradeLicenseNo || undefined,
          payoutMethod: { kind: form.payoutKind, details: { account: form.payoutAccount } },
        },
      });
      toast.success(isBn ? "সেলার অ্যাকাউন্ট তৈরি হয়েছে!" : "Seller account created!");
      navigate("/seller");
    } catch (err: any) {
      toast.error(isBn ? "রেজিস্ট্রেশন ব্যর্থ। আবার চেষ্টা করুন।" : "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const FieldError = ({ k }: { k: string }) =>
    fieldErrors[k] ? (
      <p className="flex items-center gap-1 text-[11px] text-destructive mt-0.5">
        <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors[k]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-[460px] mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
          <Store className="h-7 w-7 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-black text-foreground">
          {isBn ? "বিক্রেতা হিসেবে যোগ দিন" : "Become a Seller"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isBn ? "কোটি ক্রেতার কাছে পণ্য বিক্রি করুন" : "Reach crores of buyers on PaikarMart"}
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-0 mb-6">
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
                  active ? "bg-primary/15 border-primary shadow-[0_0_12px_rgba(var(--neon-cyan),0.3)]" :
                           "bg-muted border-border",
                )}>
                  {done
                    ? <CheckCircle2 className="h-5 w-5 text-white" />
                    : <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                  }
                </div>
                <span className={cn(
                  "text-[10px] font-semibold",
                  active ? "text-primary" : done ? "text-emerald-400" : "text-muted-foreground",
                )}>
                  {isBn ? s.labelBn : s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("w-12 h-0.5 mx-1 mb-5 transition-colors", step > s.id ? "bg-emerald-500" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xl p-6">
        <form onSubmit={submit} className="space-y-4" noValidate>

          {/* Step 1: Account */}
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "পুরো নাম" : "Full Name"}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input value={form.fullName} onChange={set("fullName")} placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"} className={cn("pl-10 h-11 bg-background", fieldErrors.fullName && "border-destructive")} />
                </div>
                <FieldError k="fullName" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "মোবাইল নম্বর" : "Phone Number"}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" maxLength={11} className={cn("pl-10 h-11 bg-background", fieldErrors.phone && "border-destructive")} />
                </div>
                <FieldError k="phone" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" className="pl-10 h-11 bg-background" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "পাসওয়ার্ড" : "Password"}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder={isBn ? "কমপক্ষে ৮ অক্ষর, অক্ষর+সংখ্যা" : "Min 8 chars, letters + numbers"} className={cn("pl-10 pr-10 h-11 bg-background", fieldErrors.password && "border-destructive")} />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError k="password" />
              </div>
            </>
          )}

          {/* Step 2: Shop details */}
          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "দোকানের নাম" : "Shop Name"} *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input value={form.shopName} onChange={set("shopName")} placeholder={isBn ? "আপনার দোকানের নাম" : "Your shop name"} className={cn("pl-10 h-11 bg-background", fieldErrors.shopName && "border-destructive")} />
                </div>
                <FieldError k="shopName" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "দোকানের ধরন" : "Shop Type"}</Label>
                <Select value={form.type} onValueChange={(v) => setForm((s) => ({ ...s, type: v as typeof SELLER_TYPES[number] }))}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">{isBn ? "খুচরা (Retail)" : "Retail"}</SelectItem>
                    <SelectItem value="wholesale">{isBn ? "পাইকারি (Wholesale)" : "Wholesale"}</SelectItem>
                    <SelectItem value="service">{isBn ? "সেবা (Service)" : "Service"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* BD Compliance: Physical address required */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "ব্যবসার ঠিকানা" : "Business Address"} *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input value={form.address} onChange={set("address")} placeholder={isBn ? "পূর্ণ ব্যবসার ঠিকানা, জেলা" : "Full business address, district"} className={cn("pl-10 h-11 bg-background", fieldErrors.address && "border-destructive")} />
                </div>
                <FieldError k="address" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "ট্রেড লাইসেন্স / NID নম্বর" : "Trade License / NID No."}</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input value={form.tradeLicenseNo} onChange={set("tradeLicenseNo")} placeholder={isBn ? "ট্রেড লাইসেন্স বা NID নম্বর" : "Trade license or NID number"} className="pl-10 h-11 bg-background" />
                </div>
                <p className="text-[10px] text-muted-foreground">{isBn ? "e-CAB নির্দেশিকা: বিক্রেতার পরিচয় যাচাইয়ের জন্য প্রয়োজন" : "Required for merchant identity verification per e-CAB guidelines"}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "প্রাথমিক ক্যাটাগরি" : "Primary Category"}</Label>
                <Input value={form.category} onChange={set("category")} placeholder={isBn ? "যেমন: পোশাক, ইলেকট্রনিক্স" : "e.g. Fashion, Electronics"} className="h-11 bg-background" />
              </div>
            </>
          )}

          {/* Step 3: Payout + Terms */}
          {step === 3 && (
            <>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mb-2">
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-amber-200/80">
                    {isBn
                      ? "আপনার উপার্জন bKash, Nagad, Rocket বা ব্যাংক অ্যাকাউন্টে পাঠানো হবে।"
                      : "Your earnings will be sent to your bKash, Nagad, Rocket or bank account."}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">{isBn ? "পেআউট পদ্ধতি" : "Payout Method"}</Label>
                <Select value={form.payoutKind} onValueChange={(v) => setForm((s) => ({ ...s, payoutKind: v as "mobile" | "bank" }))}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">{isBn ? "মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)" : "Mobile Wallet (bKash/Nagad/Rocket)"}</SelectItem>
                    <SelectItem value="bank">{isBn ? "ব্যাংক অ্যাকাউন্ট" : "Bank Account"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground/80">
                  {form.payoutKind === "mobile" ? (isBn ? "মোবাইল নম্বর" : "Mobile Number") : (isBn ? "অ্যাকাউন্ট নম্বর" : "Account Number")}
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={form.payoutAccount}
                    onChange={set("payoutAccount")}
                    placeholder={form.payoutKind === "mobile" ? "01XXXXXXXXX" : (isBn ? "অ্যাকাউন্ট নম্বর" : "Account number")}
                    className={cn("pl-10 h-11 bg-background", fieldErrors.payoutAccount && "border-destructive")}
                  />
                </div>
                <FieldError k="payoutAccount" />
              </div>

              {/* Legal consent */}
              <div className="flex items-start gap-2.5 pt-2">
                <Checkbox
                  id="seller-terms"
                  checked={termsChecked}
                  onCheckedChange={(v) => setTermsChecked(!!v)}
                  className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="seller-terms" className="text-[11px] text-muted-foreground leading-snug cursor-pointer">
                  {isBn
                    ? <>আমি PaikarMart-এর <Link href="/terms" className="text-primary">বিক্রেতা শর্তাবলী</Link>, <Link href="/refund-policy" className="text-primary">রিফান্ড নীতি</Link> ও <Link href="/privacy" className="text-primary">গোপনীয়তা নীতি</Link> পড়েছি ও সম্মত আছি। e-CAB ডিজিটাল কমার্স নির্দেশিকা মেনে চলার অঙ্গীকার করছি।</>
                    : <>I have read and agree to PaikarMart's <Link href="/terms" className="text-primary">Seller Terms</Link>, <Link href="/refund-policy" className="text-primary">Refund Policy</Link> & <Link href="/privacy" className="text-primary">Privacy Policy</Link>. I commit to comply with e-CAB Digital Commerce Guidelines.</>
                  }
                </label>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className={cn("flex gap-3 mt-2", step > 1 ? "justify-between" : "justify-end")}>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="h-11 px-5">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {isBn ? "পেছনে" : "Back"}
              </Button>
            )}
            <Button
              type="submit"
              disabled={!canNext() || busy}
              className="h-11 flex-1 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 border-0 text-white"
            >
              {busy
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{isBn ? "তৈরি হচ্ছে…" : "Creating…"}</>
                : step < 3
                  ? <>{isBn ? "পরবর্তী" : "Next"} <ChevronRight className="h-4 w-4 ml-1" /></>
                  : <>{isBn ? "সেলার অ্যাকাউন্ট খুলুন" : "Create Seller Account"} <ArrowRight className="h-4 w-4 ml-1" /></>
              }
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isBn ? "ক্রেতা হিসেবে যোগ দিতে? " : "Just want to buy? "}
        <Link href="/auth/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
          {isBn ? "বায়ার অ্যাকাউন্ট" : "Buyer account"}
        </Link>
        {" · "}
        <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
          {isBn ? "লগইন করুন" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
