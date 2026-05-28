import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import {
  Factory, FileText, Ship, Building2, CheckCircle2,
  ChevronRight, ChevronLeft, Globe, Lock, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCT_CATEGORIES = [
  "Readymade Garments (RMG)", "Knitwear / Sweaters", "Leather & Leather Goods",
  "Jute & Jute Products", "Pharmaceuticals", "Ceramics", "Electronics",
  "Footwear", "Plastics", "Agro Products", "Handicrafts", "Furniture",
  "Textile Fabrics", "Home Textiles", "Frozen Food / Seafood", "Other",
];

const INCOTERMS = ["FOB", "CIF", "EXW", "CFR", "DAP", "DDP", "FCA"];
const SHIPPING_METHODS = ["Sea Freight (FCL)", "Sea Freight (LCL)", "Air Freight", "Courier / Express", "Multi-modal"];
const EXPORT_COUNTRIES = [
  "USA", "UK", "Germany", "France", "Italy", "Spain", "Canada", "Australia",
  "Japan", "South Korea", "India", "China", "UAE", "Saudi Arabia", "Turkey", "Other",
];
const CERTIFICATIONS = [
  "ISO 9001", "ISO 14001", "OEKO-TEX", "GOTS", "BSCI", "WRAP", "SEDEX",
  "LEED", "Halal", "FDA", "CE Mark", "BSTI",
];

const STEPS = [
  { id: 1, label: "Company Info",   Icon: Building2 },
  { id: 2, label: "Factory Details",Icon: Factory },
  { id: 3, label: "Export Docs",    Icon: FileText },
  { id: 4, label: "Shipping & Bank",Icon: Ship },
  { id: 5, label: "Review",         Icon: CheckCircle2 },
];

type FormState = {
  // Step 1 — Company / auth
  fullName: string; phone: string; email: string; password: string;
  companyName: string; companyAddress: string; district: string; postcode: string;
  tradeLicenseNo: string; tin: string; website: string;
  // Step 2 — Factory
  productCategories: string[]; employees: string; established: string;
  productionCapacity: string; annualRevenue: string; minOrderQty: string;
  exportCountries: string[];
  // Step 3 — Export docs (PRIVATE — admin only)
  exportLicenseNo: string; exportLicenseExpiry: string;
  ircNo: string; ircExpiry: string; binNo: string;
  membershipBody: string; membershipNo: string;
  certifications: string[];
  // Step 4 — Shipping & Bank (PRIVATE — admin only)
  bankName: string; bankBranch: string; accountName: string;
  accountNo: string; swiftCode: string; routingNo: string;
  shippingMethods: string[]; preferredIncoterms: string; shippingAgent: string;
};

const INIT: FormState = {
  fullName: "", phone: "", email: "", password: "",
  companyName: "", companyAddress: "", district: "", postcode: "",
  tradeLicenseNo: "", tin: "", website: "",
  productCategories: [], employees: "", established: "",
  productionCapacity: "", annualRevenue: "", minOrderQty: "",
  exportCountries: [],
  exportLicenseNo: "", exportLicenseExpiry: "", ircNo: "", ircExpiry: "",
  binNo: "", membershipBody: "", membershipNo: "", certifications: [],
  bankName: "", bankBranch: "", accountName: "", accountNo: "",
  swiftCode: "", routingNo: "",
  shippingMethods: [], preferredIncoterms: "FOB", shippingAgent: "",
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar gap-1">
      {STEPS.map((s, i) => {
        const done = s.id < step;
        const active = s.id === step;
        const Icon = s.Icon;
        return (
          <div key={s.id} className="flex items-center gap-1 shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center border transition-all",
                done   ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" :
                active ? "bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.2)]" :
                         "bg-white/5 border-white/10"
              )}>
                <Icon className={cn("h-4 w-4", done ? "text-black" : active ? "text-cyan-300" : "text-white/30")} />
              </div>
              <span className={cn("text-[10px] hidden sm:block text-center leading-tight max-w-[56px] truncate",
                active ? "text-cyan-300" : done ? "text-white/60" : "text-white/25"
              )}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px w-6 sm:w-10 mt-0 sm:-mt-4 transition-colors", done ? "bg-cyan-500/50" : "bg-white/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PrivateBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium mb-4">
      <Lock className="h-3 w-3" />
      <span>Sensitive info — visible to Admin only · Never shown on public profile</span>
    </div>
  );
}

function PublicBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium mb-4">
      <Eye className="h-3 w-3" />
      <span>Public info — visible on your factory profile</span>
    </div>
  );
}

function TagSelect({ options, selected, onToggle, colorClass = "border-cyan-500/30 text-cyan-300 bg-cyan-500/10" }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; colorClass?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            type="button" key={opt}
            onClick={() => onToggle(opt)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs border transition-all",
              on ? colorClass : "border-white/10 text-white/45 bg-white/5 hover:border-white/25"
            )}
          >{opt}</button>
        );
      })}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return <div className={cn("space-y-1.5", span2 && "md:col-span-2")}><Label className="text-white/70 text-xs">{label}</Label>{children}</div>;
}

export default function FactoryRegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INIT);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));
  const setSel = (k: keyof FormState) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Register as factory role via auth (extends registerSeller with factory-specific data)
      await auth.registerFactory({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        factory: {
          companyName: form.companyName,
          companyAddress: form.companyAddress,
          district: form.district,
          postcode: form.postcode,
          tradeLicenseNo: form.tradeLicenseNo,
          tin: form.tin,
          website: form.website,
          productCategories: form.productCategories,
          employees: form.employees,
          established: form.established,
          productionCapacity: form.productionCapacity,
          annualRevenue: form.annualRevenue,
          minOrderQty: form.minOrderQty,
          exportCountries: form.exportCountries,
          certifications: form.certifications,
          // Private fields
          exportLicenseNo: form.exportLicenseNo,
          exportLicenseExpiry: form.exportLicenseExpiry,
          ircNo: form.ircNo,
          ircExpiry: form.ircExpiry,
          binNo: form.binNo,
          membershipBody: form.membershipBody,
          membershipNo: form.membershipNo,
          bankName: form.bankName,
          bankBranch: form.bankBranch,
          accountName: form.accountName,
          accountNo: form.accountNo,
          swiftCode: form.swiftCode,
          routingNo: form.routingNo,
          shippingMethods: form.shippingMethods,
          preferredIncoterms: form.preferredIncoterms,
          shippingAgent: form.shippingAgent,
        },
      });
      toast.success("Factory account created! Verification pending.", {
        description: "Admin will review your documents within 24–48 hours.",
      });
      navigate("/export");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center neon-glow-sm">
          <Globe className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Factory / Exporter Registration</h1>
          <p className="text-sm text-white/50">B2B Cross-Border Export Module · PaikarMart Global</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <StepIndicator step={step} />

        <form onSubmit={submit}>
          {/* ── Step 1: Company Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Company & Contact Info</h2>
                <PublicBadge />
              </div>
              <FieldRow>
                <Field label="Contact Person Name *"><Input value={form.fullName} onChange={set("fullName")} required placeholder="MD. Rahman" /></Field>
                <Field label="Phone *"><Input value={form.phone} onChange={set("phone")} required placeholder="+880 1XXXXXXXXX" /></Field>
                <Field label="Email *"><Input type="email" value={form.email} onChange={set("email")} required /></Field>
                <Field label="Password *">
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required />
                    <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Company / Factory Name *" span2><Input value={form.companyName} onChange={set("companyName")} required placeholder="Dhaka Textile Industries Ltd." /></Field>
                <Field label="Factory Address *" span2><Input value={form.companyAddress} onChange={set("companyAddress")} required placeholder="Plot 12, BSCIC, Gazipur" /></Field>
                <Field label="District"><Input value={form.district} onChange={set("district")} placeholder="Dhaka" /></Field>
                <Field label="Postcode"><Input value={form.postcode} onChange={set("postcode")} placeholder="1700" /></Field>
                <Field label="Trade License No. *"><Input value={form.tradeLicenseNo} onChange={set("tradeLicenseNo")} required /></Field>
                <Field label="TIN (Tax ID)"><Input value={form.tin} onChange={set("tin")} /></Field>
                <Field label="Website" span2><Input value={form.website} onChange={set("website")} placeholder="https://yourfactory.com" /></Field>
              </FieldRow>
            </div>
          )}

          {/* ── Step 2: Factory Details ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Factory Details</h2>
                <PublicBadge />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs">Product Categories * (select all that apply)</Label>
                <TagSelect
                  options={PRODUCT_CATEGORIES}
                  selected={form.productCategories}
                  onToggle={(v) => setForm((s) => ({ ...s, productCategories: toggle(s.productCategories, v) }))}
                />
              </div>
              <FieldRow>
                <Field label="No. of Employees"><Input value={form.employees} onChange={set("employees")} placeholder="e.g. 500" /></Field>
                <Field label="Established Year"><Input value={form.established} onChange={set("established")} placeholder="e.g. 1998" /></Field>
                <Field label="Production Capacity / month"><Input value={form.productionCapacity} onChange={set("productionCapacity")} placeholder="e.g. 50,000 pcs" /></Field>
                <Field label="Annual Export Revenue (USD)"><Input value={form.annualRevenue} onChange={set("annualRevenue")} placeholder="e.g. 2,000,000" /></Field>
                <Field label="Min. Order Quantity (MOQ)" span2><Input value={form.minOrderQty} onChange={set("minOrderQty")} placeholder="e.g. 1000 pcs per style" /></Field>
              </FieldRow>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs">Countries Currently Exporting To</Label>
                <TagSelect
                  options={EXPORT_COUNTRIES}
                  selected={form.exportCountries}
                  onToggle={(v) => setForm((s) => ({ ...s, exportCountries: toggle(s.exportCountries, v) }))}
                  colorClass="border-blue-500/30 text-blue-300 bg-blue-500/10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs">Quality Certifications (visible on profile)</Label>
                <TagSelect
                  options={CERTIFICATIONS}
                  selected={form.certifications}
                  onToggle={(v) => setForm((s) => ({ ...s, certifications: toggle(s.certifications, v) }))}
                  colorClass="border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Export Docs ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Export Documents</h2>
                <PrivateBadge />
              </div>
              <FieldRow>
                <Field label="Export License Number *"><Input value={form.exportLicenseNo} onChange={set("exportLicenseNo")} required placeholder="EXP-BD-XXXXXXXX" /></Field>
                <Field label="Export License Expiry"><Input type="date" value={form.exportLicenseExpiry} onChange={set("exportLicenseExpiry")} /></Field>
                <Field label="IRC (Import Registration Certificate) No."><Input value={form.ircNo} onChange={set("ircNo")} placeholder="IRC-XXXXXX" /></Field>
                <Field label="IRC Expiry"><Input type="date" value={form.ircExpiry} onChange={set("ircExpiry")} /></Field>
                <Field label="BIN (Business Identification No.)"><Input value={form.binNo} onChange={set("binNo")} /></Field>
                <Field label="Industry Association (BGMEA, BKMEA etc.)">
                  <Select value={form.membershipBody} onValueChange={setSel("membershipBody")}>
                    <SelectTrigger><SelectValue placeholder="Select (optional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {["BGMEA", "BKMEA", "BTMA", "FBCCI", "DCCI", "BEPZA", "Other"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Membership No."><Input value={form.membershipNo} onChange={set("membershipNo")} /></Field>
              </FieldRow>
              <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200/80 text-xs leading-relaxed">
                <strong className="text-amber-300">Document Upload:</strong> Physical document copies will be requested during the admin verification process. You'll receive an email with upload instructions after this registration.
              </div>
            </div>
          )}

          {/* ── Step 4: Shipping & Bank ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Shipping & Banking</h2>
                <PrivateBadge />
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/70 text-xs">Preferred Shipping Methods</Label>
                <TagSelect
                  options={SHIPPING_METHODS}
                  selected={form.shippingMethods}
                  onToggle={(v) => setForm((s) => ({ ...s, shippingMethods: toggle(s.shippingMethods, v) }))}
                  colorClass="border-purple-500/30 text-purple-300 bg-purple-500/10"
                />
              </div>

              <FieldRow>
                <Field label="Preferred Incoterms">
                  <Select value={form.preferredIncoterms} onValueChange={setSel("preferredIncoterms")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INCOTERMS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Shipping Agent / Forwarder"><Input value={form.shippingAgent} onChange={set("shippingAgent")} placeholder="e.g. Agility BD, Expeditors" /></Field>
              </FieldRow>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-amber-400" /> Bank Account Details</h3>
                <FieldRow>
                  <Field label="Bank Name *"><Input value={form.bankName} onChange={set("bankName")} required placeholder="Dutch Bangla Bank Ltd." /></Field>
                  <Field label="Branch"><Input value={form.bankBranch} onChange={set("bankBranch")} placeholder="Motijheel Branch" /></Field>
                  <Field label="Account Name *"><Input value={form.accountName} onChange={set("accountName")} required /></Field>
                  <Field label="Account Number *"><Input value={form.accountNo} onChange={set("accountNo")} required /></Field>
                  <Field label="SWIFT Code"><Input value={form.swiftCode} onChange={set("swiftCode")} placeholder="DBBLDHAKAMC" /></Field>
                  <Field label="Routing Number"><Input value={form.routingNo} onChange={set("routingNo")} /></Field>
                </FieldRow>
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-1">Review & Submit</h2>

              {[
                { label: "Company", items: [
                  { k: "Company Name", v: form.companyName },
                  { k: "Contact", v: `${form.fullName} · ${form.phone}` },
                  { k: "Email", v: form.email },
                  { k: "Address", v: `${form.companyAddress}, ${form.district}` },
                  { k: "Trade License", v: form.tradeLicenseNo },
                ]},
                { label: "Factory", items: [
                  { k: "Categories", v: form.productCategories.join(", ") || "—" },
                  { k: "Employees", v: form.employees || "—" },
                  { k: "MOQ", v: form.minOrderQty || "—" },
                  { k: "Certifications", v: form.certifications.join(", ") || "—" },
                  { k: "Export Countries", v: form.exportCountries.join(", ") || "—" },
                ]},
                { label: "Export Docs (Admin only)", items: [
                  { k: "Export License", v: form.exportLicenseNo || "—" },
                  { k: "IRC No.", v: form.ircNo || "—" },
                  { k: "BIN", v: form.binNo || "—" },
                ], private: true },
                { label: "Shipping & Bank (Admin only)", items: [
                  { k: "Bank", v: `${form.bankName} · ${form.accountNo}` || "—" },
                  { k: "SWIFT", v: form.swiftCode || "—" },
                  { k: "Incoterms", v: form.preferredIncoterms },
                  { k: "Shipping", v: form.shippingMethods.join(", ") || "—" },
                ], private: true },
              ].map((section) => (
                <div key={section.label} className={cn(
                  "rounded-xl border p-4",
                  section.private ? "border-amber-500/20 bg-amber-500/5" : "border-white/8 bg-white/3"
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    {section.private ? <Lock className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className={cn("text-xs font-semibold uppercase tracking-widest", section.private ? "text-amber-300" : "text-emerald-300")}>{section.label}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {section.items.map(({ k, v }) => (
                      <div key={k}>
                        <dt className="text-[10px] text-white/35 uppercase tracking-wider">{k}</dt>
                        <dd className="text-xs text-white/80 truncate mt-0.5">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-200/80 text-xs leading-relaxed">
                By submitting you confirm that all information provided is accurate and you agree to PaikarMart's
                <span className="text-cyan-300 font-medium"> Export Partner Terms</span>.
                Your account will be active within <strong>24–48 hours</strong> after admin verification.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/[0.06]">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={back} className="text-white/60 hover:text-white">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <Button type="button" onClick={next} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 neon-glow-sm px-6">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0 neon-glow-sm px-8">
                {submitting ? "Submitting…" : "Submit Application"}
              </Button>
            )}
          </div>
        </form>

        <p className="mt-6 text-xs text-white/40 text-center">
          Already registered? <Link to="/auth/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
          &nbsp;·&nbsp;
          Regular seller? <Link to="/auth/seller-register" className="text-cyan-400 hover:text-cyan-300">Seller register</Link>
        </p>
      </GlassCard>
    </div>
  );
}
