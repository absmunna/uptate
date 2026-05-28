import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language/LanguageContext";
import { toast } from "sonner";
import { Phone, Loader2, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const BD_PHONE_RE = /^01[3-9]\d{8}$/;

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\s|-/g, "");
  if (!cleaned) return "মোবাইল নম্বর দিন";
  if (!BD_PHONE_RE.test(cleaned)) return "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
  return null;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePhone(phone);
    setPhoneErr(pe);
    if (pe) return;

    setBusy(true);
    try {
      // Simulate API call for OTP request
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(isBn ? "ওটিপি (OTP) পাঠানো হয়েছে!" : "OTP sent successfully!");
      // Proceed to Next Step (e.g. OTP Verification)
    } catch (err: any) {
      toast.error(isBn ? "অনুরোধ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-8">
      <Link 
        to="/auth/login" 
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {isBn ? "লগইন পেজে ফিরে যান" : "Back to login"}
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-[#00a859]/20 to-emerald-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)]">
          <ShieldCheck className="h-7 w-7 text-[#00a859]" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          {isBn 
            ? "আপনার অ্যাকাউন্টের সাথে যুক্ত মোবাইল নম্বরটি দিন। আমরা একটি ওটিপি (OTP) পাঠাব।" 
            : "Enter the mobile number associated with your account. We'll send you an OTP."}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md shadow-xl dark:shadow-2xl p-6">
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-zinc-900 dark:text-white">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr(null); }}
                onBlur={() => setPhoneErr(validatePhone(phone))}
                placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                maxLength={11}
                className={cn(
                  "pl-10 h-12 bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 rounded-xl focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859] transition-all text-zinc-900 dark:text-white", 
                  phoneErr && "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>
            {phoneErr && (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />{phoneErr}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00a859] to-emerald-600 hover:opacity-90 border-0 shadow-[0_4px_12px_rgba(0,168,89,0.3)] transition-all mt-2 text-white"
          >
            {busy
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{isBn ? "অনুগ্রহ করে অপেক্ষা করুন..." : "Please wait..."}</>
              : <>{isBn ? "পরবর্তী ধাপে যান" : "Next Step"} <ArrowRight className="h-4 w-4 ml-2" /></>
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
