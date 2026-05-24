import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import {
  Building2, Package, Wallet, CheckCircle2,
  ChevronRight, ChevronLeft, Eye, EyeOff, Store, Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WHOLESALE_MARKETS = [
  "ইসলামপুর (Islampur), ঢাকা",
  "খাতুনগঞ্জ (Khatunganj), চট্টগ্রাম",
  "বঙ্গবাজার, ঢাকা",
  "নিউমার্কেট এলাকা, ঢাকা",
  "মৌলভীবাজার, ঢাকা",
  "গুলিস্তান, ঢাকা",
  "চকবাজার, ঢাকা",
  "রহমতগঞ্জ, চট্টগ্রাম",
  "শ্যামবাজার, ঢাকা",
  "টঙ্গী শিল্প এলাকা",
  "নারায়ণগঞ্জ",
  "অন্যান্য",
];

const PRODUCT_CATEGORIES = [
  "পোশাক ও কাপড়", "ইলেকট্রনি��্স", "মুদিখানা ও খাদ্য", "প্লাস্টিক সামগ্রী",
  "হার্ডওয়্যার", "কসমেটিক্স", "ফার্মেসি", "কৃষি পণ্য",
  "জুতা ও চামড়া", "হোম ডেকোর", "শিশু পণ্য", "অন্যান্য",
];

const STEPS = [
  { id: 1, label: "ব্যবসার তথ্য", Icon: Building2 },
  { id: 2, label: "পণ্য ও সোর্স",  Icon: Package },
  { id: 3, label: "মূল্য কাঠামো", Icon: Wallet },
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
  shopName: "", market: "", shopAddress: "", district: "", tradeLicense: "", tin: "",
  productCategories: [], sourceFactory: "", sourceDescription: "",
  moq: "", priceTier1Qty: "", priceTier1Price: "",
  priceTier2Qty: "", priceTier2Price: "",
  priceTier3Qty: "", priceTier3Price: "",
  deliveryRadius: "", paymentMethod: "mobile", bankAccount: "",
};

function toggle<T>(arr: T[], val: T) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return <div className={cn("space-y-1.5", span2 && "md:col-span-2")}><Label className="text-white/65 text-xs">{label}</Label>{children}</div>;
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
              done ? "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :
              active ? "bg-emerald-500/15 border-emerald-400/50" : "bg-white/5 border-white/10"
            )}>
              <Icon className={cn("h-3.5 w-3.5", done ? "text-white" : active ? "text-emerald-300" : "text-white/25")} />
            </div>
            <span className={cn("text-[10px] hidden sm:block truncate", active ? "text-emerald-300" : done ? "text-white/50" : "text-white/20")}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={cn("h-px flex-1 min-w-[8px]", done ? "bg-emerald-500/40" : "bg-white/8")} />}
          </div>
        );
      })}
    </div>
  );
}

export default function WholesaleRegisterPage() {
  const [, navigate] = useLocation();
  const { registerSeller } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));
  const setSel = (k: keyof Form) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerSeller({
        fullName: form.fullName, phone: form.phone, email: form.email,
        password: form.password,
        seller: {
          shopName: form.shopName, type: "wholesale",
          subType: form.market,
          category: form.productCategories.join(", "),
          location: `${form.shopAddress}, ${form.district}`,
          payoutMethod: { kind: form.paymentMethod as "mobile" | "bank", details: { account: form.bankAccount } },
        },
      });
      toast.success("পাইকারি অ্যাকাউন্ট তৈরি হয়েছে!", { description: "এডমিন যাচাই করার পর অ্যাকাউন্ট সক্রিয় হবে।" });
      navigate("/seller");
    } catch { toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে।"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.2)]">
          <Store className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">পাইকারি সেলার রেজিস্ট্রেশন</h1>
          <p className="text-sm text-white/45">Wholesale Seller · ইসলামপুর / খাতুনগঞ্জ / অন্যান্য</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <StepBar step={step} />
        <form onSubmit={submit}>

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">ব্যবসা ও যোগাযোগের তথ্য</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="পূর্ণ নাম *"><Input value={form.fullName} onChange={set("fullName")} required placeholder="মো. রহমান" /></Field>
                <Field label="মোবাইল নম্বর *"><Input value={form.phone} onChange={set("phone")} required placeholder="01XXXXXXXXX" /></Field>
                <Field label="ইমেইল"><Input type="email" value={form.email} onChange={set("email")} /></Field>
                <Field label="পাসওয়ার্ড *">
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="দোকানের নাম *" span2><Input value={form.shopName} onChange={set("shopName")} required placeholder="রহমান ট্রেডার্স" /></Field>
                <Field label="পাইকারি মার্কেট *" span2>
                  <Select value={form.market} onValueChange={setSel("market")}>
                    <SelectTrigger><SelectValue placeholder="মার্কেট নির্বাচন করুন" /></SelectTrigger>
                    <SelectContent>{WHOLESALE_MARKETS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="দোকানের ঠিকানা" span2><Input value={form.shopAddress} onChange={set("shopAddress")} placeholder="দোকান নং, রোড, এলাকা" /></Field>
                <Field label="জেলা"><Input value={form.district} onChange={set("district")} placeholder="ঢাকা" /></Field>
                <Field label="ট্রেড লাইসেন্স নম্বর"><Input value={form.tradeLicense} onChange={set("tradeLicense")} /></Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">পণ্যের ধরন ও সোর্স</h2>
              <div className="space-y-1.5">
                <Label className="text-white/65 text-xs">পণ্যের ক্যাটাগরি (একাধিক নির্বাচন করুন)</Label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map(cat => (
                    <button type="button" key={cat}
                      onClick={() => setForm(s => ({ ...s, productCategories: toggle(s.productCategories, cat) }))}
                      className={cn("px-2.5 py-1 rounded-lg text-xs border transition-all",
                        form.productCategories.includes(cat)
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-white/10 text-white/40 hover:border-white/25"
                      )}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-white/65 text-xs">সোর্স কারখানা লিংক (যদি থাকে)</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <Input value={form.sourceFactory} onChange={set("sourceFactory")} className="pl-9" placeholder="কারখানার নাম বা PaikarMart Factory ID" />
                  </div>
                </div>
                <Field label="সোর্সের বিবরণ" span2>
                  <Input value={form.sourceDescription} onChange={set("sourceDescription")} placeholder="যেমন: গাজীপুর BSCIC থেকে সরাসরি কিনি" />
                </Field>
                <Field label="ডেলিভারি রেডিয়াস (কিমি)">
                  <Input value={form.deliveryRadius} onChange={set("deliveryRadius")} placeholder="যেমন: 50" type="number" />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">পাইকারি মূল্য কাঠামো (Price Tiers)</h2>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-200/70 text-xs mb-2">
                তিনটি পরিমাণ স্তরে আলাদা দাম সেট করুন — যত বেশি কিনবে, তত কম দামে পাবে।
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { tier: "১ম টায়ার", qKey: "priceTier1Qty" as keyof Form, pKey: "priceTier1Price" as keyof Form, color: "text-cyan-400" },
                  { tier: "২য় টায়ার", qKey: "priceTier2Qty" as keyof Form, pKey: "priceTier2Price" as keyof Form, color: "text-blue-400" },
                  { tier: "৩য় টায়ার", qKey: "priceTier3Qty" as keyof Form, pKey: "priceTier3Price" as keyof Form, color: "text-purple-400" },
                ].map(({ tier, qKey, pKey, color }) => (
                  <div key={tier} className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                    <div className={cn("col-span-2 text-xs font-semibold mb-1", color)}>{tier}</div>
                    <Field label="ন্যূনতম পরিমাণ (MOQ)"><Input value={form[qKey] as string} onChange={set(qKey)} placeholder="যেমন: ১০০ পিস" /></Field>
                    <Field label="প্রতি পিস দাম (৳)"><Input value={form[pKey] as string} onChange={set(pKey)} placeholder="যেমন: ৳৮৫" type="number" /></Field>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                <Field label="পেমেন্ট পদ্ধতি">
                  <Select value={form.paymentMethod} onValueChange={setSel("paymentMethod")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">bKash / Nagad / Rocket</SelectItem>
                      <SelectItem value="bank">ব্যাংক অ্যাকাউন্ট</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="অ্যাকাউন্ট নম্বর"><Input value={form.bankAccount} onChange={set("bankAccount")} required placeholder="01XXXXXXXXX" /></Field>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white mb-3">সারসংক্ষেপ</h2>
              {[
                { title: "ব্যক্তিগত তথ্য", rows: [
                  ["নাম", form.fullName], ["ফোন", form.phone], ["দোকান", form.shopName], ["মার্কেট", form.market],
                ]},
                { title: "পণ্য ও সোর্স", rows: [
                  ["ক্যাটাগরি", form.productCategories.join(", ") || "—"],
                  ["সোর্স", form.sourceDescription || form.sourceFactory || "—"],
                  ["ডেলিভারি রেডিয়াস", form.deliveryRadius ? `${form.deliveryRadius} কিমি` : "—"],
                ]},
                { title: "মূল্য কাঠামো", rows: [
                  ["টায়ার ১", form.priceTier1Qty ? `${form.priceTier1Qty} পিস → ৳${form.priceTier1Price}` : "—"],
                  ["টায়ার ২", form.priceTier2Qty ? `${form.priceTier2Qty} পিস → ৳${form.priceTier2Price}` : "—"],
                  ["টায়ার ৩", form.priceTier3Qty ? `${form.priceTier3Qty} পিস → ৳${form.priceTier3Price}` : "—"],
                ]},
              ].map(({ title, rows }) => (
                <div key={title} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">{title}</div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {rows.map(([k, v]) => (
                      <div key={k}><dt className="text-[10px] text-white/35">{k}</dt><dd className="text-xs text-white/75 truncate">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              ))}
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-200/70 text-xs">
                সাবমিট করলে তোমার আবেদন এডমিনের কাছে যাবে। যাচাই সম্পন্ন হলে ২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট সক্রিয় হবে।
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-5 border-t border-white/[0.06]">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/55">
                <ChevronLeft className="h-4 w-4 mr-1" /> পেছনে
              </Button>
            ) : <div />}
            {step < 4 ? (
              <Button type="button" onClick={() => setStep(s => s + 1)} className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 shadow-[0_0_16px_rgba(16,185,129,0.3)] px-6">
                পরবর্তী <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 shadow-[0_0_16px_rgba(16,185,129,0.3)] px-8">
                {loading ? "সাবমিট হচ্ছে…" : "রেজিস্ট্রেশন সম্পন্ন করুন"}
              </Button>
            )}
          </div>
        </form>
        <p className="mt-5 text-xs text-white/35 text-center">
          কারখানা মালিক? <Link href="/auth/factory-register" className="text-emerald-400 hover:underline">Factory Register</Link>
          &nbsp;·&nbsp; গ্রামীণ দোকান? <Link href="/auth/rural-register" className="text-emerald-400 hover:underline">Rural Register</Link>
        </p>
      </GlassCard>
    </div>
  );
}
