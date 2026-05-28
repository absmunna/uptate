import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Factory, FileText, Ship, Building2, CheckCircle2,
  ChevronRight, ChevronLeft, Globe, Lock, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";
import { ThemeLangSwitcher } from "../../../components/navigation/ThemeLangSwitcher";

const PRODUCT_CATEGORIES = [
  "Readymade Garments (RMG)", "Knitwear / Sweaters", "Leather & Leather Goods",
  "Jute & Jute Products", "Pharmaceuticals", "Ceramics", "Electronics",
  "Footwear", "Plastics", "Agro Products", "Handicrafts", "Furniture",
  "Textile Fabrics", "Home Textiles", "Frozen Food / Seafood", "Other"
];

const INCOTERMS = ["FOB", "CIF", "EXW", "CFR", "DAP", "DDP", "FCA"];
const SHIPPING_METHODS = ["Sea Freight (FCL)", "Sea Freight (LCL)", "Air Freight", "Courier / Express", "Multi-modal"];
const EXPORT_COUNTRIES = [
  "USA", "UK", "Germany", "France", "Italy", "Spain", "Canada", "Australia",
  "Japan", "South Korea", "India", "China", "UAE", "Saudi Arabia", "Turkey", "Other"
];
const CERTIFICATIONS = [
  "ISO 9001", "ISO 14001", "OEKO-TEX", "GOTS", "BSCI", "WRAP", "SEDEX",
  "LEED", "Halal", "FDA", "CE Mark", "BSTI"
];

const STEPS = [
  { id: 1, label: "Company Info",   Icon: Building2 },
  { id: 2, label: "Factory Details",Icon: Factory },
  { id: 3, label: "Export Docs",    Icon: FileText },
  { id: 4, label: "Shipping & Bank",Icon: Ship },
  { id: 5, label: "Review",         Icon: CheckCircle2 }
];

type FormState = {
  fullName: string; phone: string; email: string; password: string;
  companyName: string; companyAddress: string; district: string; postcode: string;
  tradeLicenseNo: string; tin: string; website: string;
  productCategories: string[]; employees: string; established: string;
  productionCapacity: string; annualRevenue: string; minOrderQty: string;
  exportCountries: string[];
  exportLicenseNo: string; exportLicenseExpiry: string;
  ircNo: string; ircExpiry: string; binNo: string;
  membershipBody: string; membershipNo: string;
  certifications: string[];
  bankName: string; bankBranch: string; accountName: string;
  accountNo: string; swiftCode: string; routingNo: string;
  shippingMethods: string[]; preferredIncoterms: string; shippingAgent: string;
};

const INIT: FormState = {
  fullName: "", phone: "", email: "", password: "",
  companyName: "", companyAddress: "", district: "Dhaka", postcode: "",
  tradeLicenseNo: "", tin: "", website: "",
  productCategories: [], employees: "", established: "",
  productionCapacity: "", annualRevenue: "", minOrderQty: "",
  exportCountries: [],
  exportLicenseNo: "", exportLicenseExpiry: "", ircNo: "", ircExpiry: "",
  binNo: "", membershipBody: "", membershipNo: "", certifications: [],
  bankName: "", bankBranch: "", accountName: "", accountNo: "",
  swiftCode: "", routingNo: "",
  shippingMethods: [], preferredIncoterms: "FOB", shippingAgent: ""
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function FactoryRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setVal = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "factory_owner"
      });
      toast.success("Factory account created! Verification pending.", {
        description: "Admin will review your registration within 24 hours."
      });
      navigate("/login");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-[var(--pm-bg)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeLangSwitcher />
      </div>

      <div className="max-w-2xl w-full mx-auto py-8">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.2)]">
            <Globe className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Factory & Exporter Registration</h1>
            <p className="text-sm text-white/50">B2B Cross-Border Export Partner · PaikarMart Global</p>
          </div>
        </div>

        <GlassCard className="p-6 border border-slate-800">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto gap-2 pb-2">
            {STEPS.map((s, i) => {
              const done = s.id < step;
              const active = s.id === step;
              const Icon = s.Icon;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1 min-w-[100px]">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center border transition-all shrink-0",
                      done ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" :
                      active ? "bg-cyan-500/15 border-cyan-400/60" : "bg-white/5 border-white/10"
                    )}>
                      <Icon className={cn("h-4 w-4", done ? "text-slate-900" : active ? "text-cyan-300" : "text-white/25")} />
                    </div>
                    <span className={cn("text-[10px] font-bold tracking-tight truncate max-w-[70px]", 
                      active ? "text-cyan-300" : done ? "text-white/60" : "text-white/25"
                    )}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={cn("h-px flex-1 min-w-[6px]", done ? "bg-cyan-500/40" : "bg-white/10")} />}
                </div>
              );
            })}
          </div>

          <form onSubmit={submit}>
            {/* Step 1: Company Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">1. Company & Contact Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60">Contact Person Name *</label>
                    <input value={form.fullName} onChange={setVal("fullName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="MD. Rahman" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Contact Phone *</label>
                    <input value={form.phone} onChange={setVal("phone")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="+880 1XXXXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Contact Email *</label>
                    <input type="email" value={form.email} onChange={setVal("email")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="rahman@factory.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Password *</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={form.password} onChange={setVal("password")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 pl-4 pr-10 text-white text-sm outline-none focus:border-cyan-500" placeholder="At least 6 characters" />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60">Company / Factory Name *</label>
                    <input value={form.companyName} onChange={setVal("companyName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="Dhaka Textile Industries Ltd." />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60">Factory Registered Address *</label>
                    <input value={form.companyAddress} onChange={setVal("companyAddress")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="Plot 12, BSCIC, Gazipur, Bangladesh" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">District *</label>
                    <input value={form.district} onChange={setVal("district")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="Gazipur" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Postcode</label>
                    <input value={form.postcode} onChange={setVal("postcode")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="1700" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Government Trade License No. *</label>
                    <input value={form.tradeLicenseNo} onChange={setVal("tradeLicenseNo")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="TL-XXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">TIN Number (Tax ID)</label>
                    <input value={form.tin} onChange={setVal("tin")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="Tax ID Number" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60">Company URL Website</label>
                    <input value={form.website} onChange={setVal("website")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="https://dhakatextile.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Factory Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">2. Production Capacity & Details (Public Profile)</h2>
                <div className="space-y-2">
                  <label className="text-xs text-white/60 font-bold">Manufactured Product Categories * (Select all)</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map(cat => {
                      const on = form.productCategories.includes(cat);
                      return (
                        <button type="button" key={cat} onClick={() => setForm((s) => ({ ...s, productCategories: toggle(s.productCategories, cat) }))}
                          className={cn("px-2.5 py-1.5 rounded-xl text-xs border transition-all",
                            on ? "border-cyan-500 text-cyan-300 bg-cyan-500/10" : "border-slate-800 text-white/45 bg-slate-950/40"
                          )}>{cat}</button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Total Factory Strength (No. of Employees)</label>
                    <input value={form.employees} onChange={setVal("employees")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="e.g. 1,200 workers" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Established Year</label>
                    <input value={form.established} onChange={setVal("established")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="e.g. 2002" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Monthly Production Capacity</label>
                    <input value={form.productionCapacity} onChange={setVal("productionCapacity")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="e.g. 100,000 Yards / garments" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Annual Export Volume (USD)</label>
                    <input value={form.annualRevenue} onChange={setVal("annualRevenue")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="e.g. $5M USD" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-white/60">Minimum Order Quantity (MOQ) *</label>
                    <input value={form.minOrderQty} onChange={setVal("minOrderQty")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="e.g. 5,000 pcs per order" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Export License & Docs */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">3. Export Licenses & Certificates (Protected Info)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Government Export License No. *</label>
                    <input value={form.exportLicenseNo} onChange={setVal("exportLicenseNo")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="EXP-BD-99120" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">License Expiry Date</label>
                    <input type="date" value={form.exportLicenseExpiry} onChange={setVal("exportLicenseExpiry")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Import Registration Certificate (IRC) No.</label>
                    <input value={form.ircNo} onChange={setVal("ircNo")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="IRC-XXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Business Identification Number (BIN)</label>
                    <input value={form.binNo} onChange={setVal("binNo")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="BIN-XXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Association / Membership Body</label>
                    <select value={form.membershipBody} onChange={setVal("membershipBody")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                      <option value="">None / Other</option>
                      {["BGMEA", "BKMEA", "BTMA", "FBCCI", "DCCI", "BEPZA"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Membership Number</label>
                    <input value={form.membershipNo} onChange={setVal("membershipNo")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Shipping and Bank */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white tracking-wide">4. Shipping preferences & Payout Bank Details</h2>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/60">Preferred Shipping Methods</label>
                  <div className="flex flex-wrap gap-2">
                    {SHIPPING_METHODS.map(m => {
                      const on = form.shippingMethods.includes(m);
                      return (
                        <button type="button" key={m} onClick={() => setForm(s => ({ ...s, shippingMethods: toggle(s.shippingMethods, m) }))}
                          className={cn("px-2.5 py-1.5 rounded-xl text-xs border transition-all",
                            on ? "border-purple-500 text-purple-300 bg-purple-500/10" : "border-slate-800 text-white/45 bg-slate-950/40"
                          )}>{m}</button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Preferred Incoterms</label>
                    <select value={form.preferredIncoterms} onChange={setVal("preferredIncoterms")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none">
                      {INCOTERMS.map(inc => <option key={inc} value={inc}>{inc}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Prefered Shipping Forwarding Agent</label>
                    <input value={form.shippingAgent} onChange={setVal("shippingAgent")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="e.g. DHL, Expeditors" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2 border-t border-slate-800 pt-3">
                    <span className="text-xs font-bold text-cyan-400">Export Payment Payout Bank Details</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Routing Bank Name *</label>
                    <input value={form.bankName} onChange={setVal("bankName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" placeholder="Dutch Bangla Bank Ltd." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Branch Name</label>
                    <input value={form.bankBranch} onChange={setVal("bankBranch")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="Motijheel Commercial Area" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Account Holder Name *</label>
                    <input value={form.accountName} onChange={setVal("accountName")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Account Number *</label>
                    <input value={form.accountNo} onChange={setVal("accountNo")} required className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">SWIFT BIC (for international payments)</label>
                    <input value={form.swiftCode} onChange={setVal("swiftCode")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" placeholder="DBBLDHAKAMC" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60">Local Bank Routing No</label>
                    <input value={form.routingNo} onChange={setVal("routingNo")} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-white text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-sm font-semibold text-white tracking-wide">5. Review & Submit Factory onboarding Application</h2>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 text-xs">
                  <p className="font-bold text-cyan-400">Onboarding Enterprise:</p>
                  <p>Primary Representative: {form.fullName}</p>
                  <p>Enterprise Entity: {form.companyName}</p>
                  <p>Enterprise Location: {form.companyAddress}, {form.district}</p>
                  <p>Entity government license: {form.tradeLicenseNo}</p>
                  <p>Preferred Incoterm: {form.preferredIncoterms}</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800">
              {step > 1 ? (
                <button type="button" onClick={back} className="text-sm text-white/60 hover:text-white transition-colors flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </button>
              ) : <div />}

              {step < 5 ? (
                <button type="button" onClick={next} className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-1 shadow-lg shadow-cyan-500/20">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  {submitting ? "Submitting Application…" : "Submit Factory Application"}
                </button>
              )}
            </div>

          </form>

          <p className="mt-5 text-xs text-white/30 text-center">
            Are you a Buyer instead? <Link to="/register" className="text-cyan-400 font-semibold hover:underline">Register as buyer</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
