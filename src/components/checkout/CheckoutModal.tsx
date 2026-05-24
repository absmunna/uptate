import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, MapPin, Truck, ShieldCheck, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { formatBDT } from "@/lib/format";
import { toast } from "sonner";

const BD_DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal",
  "Sylhet", "Rangpur", "Mymensingh", "Gazipur", "Narayanganj",
  "Cox's Bazar", "Comilla", "Bogura", "Jessore", "Dinajpur",
];

const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", icon: "💜" },
  { id: "nagad", label: "Nagad", icon: "🟠" },
  { id: "rocket", label: "Rocket", icon: "🟣" },
  { id: "cod",   label: "Cash on Delivery", icon: "💵" },
  { id: "bank",  label: "Bank Transfer", icon: "🏦" },
];

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; title: string; price: number; images: string[]; vendor: { name: string } };
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { items: CartItem[]; subtotal: number; itemCount: number };
  onSuccess: (order: any) => void;
}

export function CheckoutModal({ isOpen, onClose, cart, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<"address" | "payment" | "confirm" | "placing">("address");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDistrict, setDeliveryDistrict] = useState("Dhaka");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  // BD Compliance: live price breakdown
  const isInsideDhaka = deliveryDistrict.toLowerCase() === "dhaka" || deliveryDistrict.toLowerCase() === "gazipur" || deliveryDistrict.toLowerCase() === "narayanganj";
  const subtotal = cart.subtotal;
  const vatAmount = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 1000 ? 0 : isInsideDhaka ? 60 : 120;
  const total = subtotal + vatAmount + shippingFee;
  const maxDeliveryDays = isInsideDhaka ? 3 : 7;

  useEffect(() => {
    if (isOpen) { setStep("address"); setError(""); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!termsAccepted) { setError("আপনাকে শর্তাবলী সম্মতি দিতে হবে।"); return; }
    setError("");
    setStep("placing");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryAddress, deliveryDistrict, paymentMethod, notes, termsAccepted }),
      });
      const data = await res.json();
      if (!res.ok) { setStep("confirm"); setError(data.message ?? "অর্ডার প্রদানে সমস্যা হয়েছে।"); return; }
      toast.success(`অর্ডার ${data.orderNo} সফলভাবে তৈরি হয়েছে!`);
      onSuccess(data);
    } catch {
      setStep("confirm");
      setError("নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative z-10 w-full max-w-lg mx-auto max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-0">
        {/* Header */}
        <div className="sticky top-0 bg-black/40 backdrop-blur border-b border-white/10 flex items-center justify-between px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">
            {step === "address" && "ডেলিভারি ঠিকানা"}
            {step === "payment" && "পেমেন্ট পদ্ধতি"}
            {step === "confirm" && "অর্ডার নিশ্চিত করুন"}
            {step === "placing" && "অর্ডার প্রক্রিয়াকরণ..."}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* STEP 1: Address */}
          {step === "address" && (
            <>
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">জেলা নির্বাচন করুন *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {BD_DISTRICTS.slice(0, 9).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDeliveryDistrict(d)}
                        className={`text-xs px-2 py-2 rounded-lg border transition-all ${
                          deliveryDistrict === d
                            ? "border-primary bg-primary/20 text-primary font-semibold"
                            : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                    <select
                      className="col-span-3 bg-white/5 border border-white/10 text-white/70 rounded-lg px-3 py-2 text-xs"
                      value={BD_DISTRICTS.slice(0, 9).includes(deliveryDistrict) ? "" : deliveryDistrict}
                      onChange={(e) => e.target.value && setDeliveryDistrict(e.target.value)}
                    >
                      <option value="">অন্য জেলা...</option>
                      {BD_DISTRICTS.slice(9).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-white/70 text-sm mb-2 block">সম্পূর্ণ ঠিকানা *</Label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 p-3 text-sm resize-none focus:outline-none focus:border-primary/50"
                    rows={3}
                    placeholder="বাড়ি নং, রাস্তা, এলাকা, উপজেলা..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  <p className="text-white/30 text-xs mt-1">কমপক্ষে ১০ অক্ষর লিখুন</p>
                </div>

                <div>
                  <Label className="text-white/70 text-sm mb-2 block">বিশেষ নির্দেশনা (ঐচ্ছিক)</Label>
                  <Input
                    className="bg-white/5 border-white/10 text-white placeholder-white/30"
                    placeholder="যেমন: সন্ধ্যার পরে কল করুন"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery preview */}
              <div className={`rounded-xl p-4 border flex items-start gap-3 ${isInsideDhaka ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${isInsideDhaka ? "text-emerald-400" : "text-amber-400"}`} />
                <div>
                  <p className={`text-sm font-semibold ${isInsideDhaka ? "text-emerald-400" : "text-amber-400"}`}>
                    {isInsideDhaka ? "ঢাকার মধ্যে — ৩ কর্মদিবস" : "ঢাকার বাইরে — ৭ কর্মদিবস"}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">Bangladesh E-Commerce Delivery Policy অনুযায়ী</p>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl"
                disabled={deliveryAddress.trim().length < 10}
                onClick={() => setStep("payment")}
              >
                পেমেন্ট পদ্ধতি বেছে নিন <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* STEP 2: Payment */}
          {step === "payment" && (
            <>
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                      paymentMethod === pm.id
                        ? "border-primary bg-primary/15 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                    }`}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-medium text-sm">{pm.label}</span>
                    {paymentMethod === pm.id && <ShieldCheck className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-white/10 text-white/70 h-12 rounded-xl" onClick={() => setStep("address")}>
                  পিছনে
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl" onClick={() => setStep("confirm")}>
                  পর্যালোচনা করুন <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* STEP 3: Confirm — full BD price breakdown */}
          {(step === "confirm" || step === "placing") && (
            <>
              {/* Items summary */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">পণ্য</h3>
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.product.title}</p>
                      <p className="text-xs text-white/40">{item.product.vendor.name} · qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-white shrink-0">{formatBDT(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* BD compliance price breakdown box */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 text-sm">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  মূল্য বিভাজন (বাংলাদেশ ই-কমার্স আইন অনুযায়ী)
                </h3>
                <div className="flex flex-col gap-2 text-white/70">
                  <div className="flex justify-between">
                    <span>বেস মূল্য ({cart.itemCount} পণ্য)</span>
                    <span className="text-white font-medium">{formatBDT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (৫% — মূল্য সংযোজন কর)</span>
                    <span className="text-amber-400 font-medium">+ {formatBDT(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ</span>
                    <span className={shippingFee === 0 ? "text-emerald-400 font-medium" : "text-white font-medium"}>
                      {shippingFee === 0 ? "বিনামূল্যে ✓" : `+ ${formatBDT(shippingFee)}`}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-white">সর্বমোট</span>
                    <span className="text-primary text-lg">{formatBDT(total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery commitment */}
              <div className={`rounded-xl p-3 border flex items-start gap-3 ${isInsideDhaka ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                <Truck className={`w-4 h-4 mt-0.5 shrink-0 ${isInsideDhaka ? "text-emerald-400" : "text-amber-400"}`} />
                <div className="text-xs">
                  <p className={`font-semibold ${isInsideDhaka ? "text-emerald-400" : "text-amber-400"}`}>
                    সর্বোচ্চ {maxDeliveryDays} কর্মদিবসে ডেলিভারি
                  </p>
                  <p className="text-white/50 mt-0.5">{deliveryDistrict} · {deliveryAddress.slice(0, 50)}{deliveryAddress.length > 50 ? "..." : ""}</p>
                  <p className="text-white/40 mt-0.5">পেমেন্ট: {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</p>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setTermsAccepted(!termsAccepted)}
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    termsAccepted ? "bg-primary border-primary" : "border-white/30 group-hover:border-white/60"
                  }`}
                >
                  {termsAccepted && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-xs text-white/60 leading-relaxed">
                  আমি PaikarMart-এর{" "}
                  <span className="text-primary underline">শর্তাবলী ও গোপনীয়তা নীতি</span>-তে সম্মত। বাংলাদেশ ডিজিটাল কমার্স নীতি (২০২০) অনুযায়ী VAT ও ডেলিভারি চার্জ প্রযোজ্য।
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-white/70 h-12 rounded-xl"
                  onClick={() => setStep("payment")}
                  disabled={step === "placing"}
                >
                  পিছনে
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-bold"
                  onClick={handlePlaceOrder}
                  disabled={step === "placing" || !termsAccepted}
                >
                  {step === "placing" ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full border-2 border-white/30 border-t-white w-4 h-4" />
                      অর্ডার প্রক্রিয়াকরণ...
                    </span>
                  ) : (
                    <>অর্ডার নিশ্চিত করুন — {formatBDT(total)}</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
