import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { MapPin, Store, Eye, EyeOff, ChevronRight, ChevronLeft, Package, CheckCircle2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return <div className={cn("space-y-1.5", span2 && "col-span-2")}><Label className="text-white/65 text-xs">{label}</Label>{children}</div>;
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1 mb-7">
      {STEPS.map((s, i) => {
        const done = s.id < step; const active = s.id === step;
        const Icon = s.Icon;
        return (
          <div key={s.id} className="flex items-center gap-1 flex-1">
            <div className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center border transition-all shrink-0",
              done ? "bg-amber-500 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]" :
              active ? "bg-amber-500/15 border-amber-400/50" : "bg-white/5 border-white/10"
            )}>
              <Icon className={cn("h-3.5 w-3.5", done ? "text-white" : active ? "text-amber-300" : "text-white/25")} />
            </div>
            <span className={cn("text-[10px] hidden sm:block truncate", active ? "text-amber-300" : done ? "text-white/50" : "text-white/20")}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={cn("h-px flex-1 min-w-[8px]", done ? "bg-amber-500/40" : "bg-white/8")} />}
          </div>
        );
      })}
    </div>
  );
}

export default function RuralRegisterPage() {
  const [, navigate] = useLocation();
  const { registerSeller } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(s => ({ ...s, [k]: e.target.value }));
  const setSel = (k: keyof Form) => (v: string) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerSeller({
        fullName: form.fullName, phone: form.phone, email: form.email, password: form.password,
        seller: {
          shopName: form.shopName, type: "retail", subType: "rural",
          category: form.productCategories.join(", "),
          location: `${form.village}, ${form.union}, ${form.upazila}, ${form.district}`,
          payoutMethod: { kind: form.payoutMethod as "mobile" | "bank", details: { account: form.payoutAccount } },
        },
      });
      toast.success("গ্রামীণ দোকান নিবন্ধিত হয়েছে!", { description: "আপনার অ্যাকাউন্ট শীঘ্রই সক্রিয় হবে।" });
      navigate("/seller");
    } catch { toast.error("নিবন্ধন ব্যর্থ হয়েছে।"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.2)]">
          <MapPin className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">গ্রামীণ দোকানদার নিবন্ধন</h1>
          <p className="text-sm text-white/45">Rural Shopkeeper · হাটবাজার থেকে অনলাইনে</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <StepBar step={step} />
        <form onSubmit={submit}>

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">দোকানদারের ব্যক্তিগত তথ্য</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="পূর্ণ নাম *" span2><Input value={form.fullName} onChange={set("fullName")} required placeholder="মো. করিম" /></Field>
                <Field label="মোবাইল নম্বর *"><Input value={form.phone} onChange={set("phone")} required placeholder="01XXXXXXXXX" /></Field>
                <Field label="পাসওয়ার্ড *">
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="দোকানের নাম *" span2><Input value={form.shopName} onChange={set("shopName")} required placeholder="করিম স্টোর" /></Field>
                <Field label="জাতীয় পরিচয়পত্র (NID)" span2><Input value={form.nidNumber} onChange={set("nidNumber")} placeholder="১০ বা ১৩ সংখ্যার NID নম্বর" /></Field>
                <Field label="পেআউট পদ্ধতি">
                  <Select value={form.payoutMethod} onValueChange={setSel("payoutMethod")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">bKash / Nagad</SelectItem>
                      <SelectItem value="bank">ব্যাংক</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="একাউন্ট নম্বর *"><Input value={form.payoutAccount} onChange={set("payoutAccount")} required placeholder="01XXXXXXXXX" /></Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">দোকানের লোকেশন ও হাটবাজার</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="গ্রাম *"><Input value={form.village} onChange={set("village")} required placeholder="গ্রামের নাম" /></Field>
                <Field label="ইউনিয়ন / পৌরসভা"><Input value={form.union} onChange={set("union")} placeholder="ইউনিয়নের নাম" /></Field>
                <Field label="উপজেলা"><Input value={form.upazila} onChange={set("upazila")} placeholder="উপজেলা" /></Field>
                <Field label="জেলা *"><Input value={form.district} onChange={set("district")} required placeholder="জেলা" /></Field>
                <Field label="বিভাগ" span2>
                  <Select value={form.division} onValueChange={setSel("division")}>
                    <SelectTrigger><SelectValue placeholder="বিভাগ নির্বাচন করুন" /></SelectTrigger>
                    <SelectContent>{DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <div className="text-xs font-semibold text-amber-300 mb-3 uppercase tracking-wider">হাটবাজারের তথ্য</div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="হাটের নাম" span2><Input value={form.hatName} onChange={set("hatName")} placeholder="যেমন: বেগমগঞ্জ হাট, সোনারগাঁও হাট" /></Field>
                  <Field label="হাটের দিন ১">
                    <Select value={form.hatDay} onValueChange={setSel("hatDay")}>
                      <SelectTrigger><SelectValue placeholder="বার নির্বাচন করুন" /></SelectTrigger>
                      <SelectContent>{HAT_DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="হাটের দিন ২ (ঐচ্ছিক)">
                    <Select value={form.hatDay2} onValueChange={setSel("hatDay2")}>
                      <SelectTrigger><SelectValue placeholder="দ্বিতীয় বার" /></SelectTrigger>
                      <SelectContent>{HAT_DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">পণ্যের ধরন ও সরবরাহ উৎস</h2>
              <div className="space-y-1.5">
                <Label className="text-white/65 text-xs">আপনি কী ধরনের পণ্য বিক্রি করেন?</Label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map(cat => (
                    <button type="button" key={cat}
                      onClick={() => setForm(s => ({ ...s, productCategories: toggle(s.productCategories, cat) }))}
                      className={cn("px-2.5 py-1 rounded-lg text-xs border transition-all",
                        form.productCategories.includes(cat)
                          ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                          : "border-white/10 text-white/40 hover:border-white/25"
                      )}>{cat}</button>
                  ))}
                </div>
              </div>
              <Field label="মাল কোথা থেকে কিনেন? (সরবরাহ উৎস)" span2>
                <Input value={form.supplySource} onChange={set("supplySource")} placeholder="যেমন: ঢাকার ইসলামপুর থেকে পাইকারি কিনি" />
              </Field>
              <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 text-xs text-amber-200/70 leading-relaxed">
                <strong className="text-amber-300">পরবর্তী ধাপে:</strong> নিবন্ধনের পর আপনি পাইকারি বিক্রেতাদের সাথে সরাসরি লিংক করতে পারবেন এবং অনলাইনে অর্ডার নিতে পারবেন।
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">তথ্য যাচাই করুন</h2>
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
                <div key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">{t}</div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {rows.map(([k, v]) => (
                      <div key={k}><dt className="text-[10px] text-white/35">{k}</dt><dd className="text-xs text-white/75 truncate">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-5 border-t border-white/[0.06]">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/55">
                <ChevronLeft className="h-4 w-4 mr-1" /> পেছনে
              </Button>
            ) : <div />}
            {step < 4 ? (
              <Button type="button" onClick={() => setStep(s => s + 1)} className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-[0_0_16px_rgba(245,158,11,0.3)] px-6">
                পরবর্তী <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-[0_0_16px_rgba(245,158,11,0.3)] px-8">
                {loading ? "নিবন্ধন হচ্ছে…" : "নিবন্ধন সম্পন্ন করুন"}
              </Button>
            )}
          </div>
        </form>
        <p className="mt-5 text-xs text-white/35 text-center">
          পাইকারি বিক্রেতা? <Link href="/auth/wholesale-register" className="text-amber-400 hover:underline">Wholesale Register</Link>
          &nbsp;·&nbsp; কারখানা? <Link href="/auth/factory-register" className="text-amber-400 hover:underline">Factory Register</Link>
        </p>
      </GlassCard>
    </div>
  );
}
