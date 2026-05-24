import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

const CART_KEY = ["cart"];

async function fetchCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Cart load failed");
  return res.json() as Promise<{ items: CartItem[]; subtotal: number; itemCount: number; currency: string }>;
}

async function removeCartItem(itemId: string) {
  const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Remove failed");
  return res.json();
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string; title: string; price: number;
    images: string[];
    vendor: { name: string };
  };
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { data: cart, isLoading } = useQuery({ queryKey: CART_KEY, queryFn: fetchCart });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      toast.success("পণ্য সরানো হয়েছে");
      qc.invalidateQueries({ queryKey: CART_KEY });
    },
    onError: () => toast.error("সরাতে ব্যর্থ হয়েছে"),
  });

  const handleOrderSuccess = () => {
    setCheckoutOpen(false);
    qc.invalidateQueries({ queryKey: CART_KEY });
    qc.invalidateQueries({ queryKey: ["buyer-orders"] });
    setLocation("/orders");
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-4">
        {[1, 2].map((i) => <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />)}
      </div>
    );
  }

  // BD compliance: live price preview
  const subtotal = cart?.subtotal ?? 0;
  const vatAmount = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 1000 ? 0 : 60;   // default Dhaka estimate
  const estimatedTotal = subtotal + vatAmount + shippingFee;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">কার্ট খালি</h2>
          <p className="text-white/50 max-w-sm">
            আপনার কার্টে কোনো পণ্য নেই। মার্কেটপ্লেস থেকে পণ্য যোগ করুন।
          </p>
        </div>
        <Link href="/marketplace">
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            কেনাকাটা শুরু করুন
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white">শপিং কার্ট</h1>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cart items */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            {cart.items.map((item) => (
              <GlassCard key={item.id} className="p-4 flex gap-4">
                <Link href={`/marketplace/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.images?.[0] ?? ''}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded-xl border border-white/10"
                  />
                </Link>

                <div className="flex flex-col flex-1 py-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/marketplace/product/${item.product.id}`}>
                      <h3 className="font-medium text-white hover:text-primary transition-colors line-clamp-2 text-sm">
                        {item.product.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={removeMutation.isPending}
                      className="text-white/30 hover:text-red-400 transition-colors p-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-white/40 mt-1">{item.product.vendor.name}</div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="text-xs text-white/60">
                      পরিমাণ: <span className="font-semibold text-white">{item.quantity}</span>
                    </div>
                    <div className="font-bold text-primary text-sm">
                      {formatBDT(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Order summary — BD compliance price breakdown */}
          <GlassCard className="w-full md:w-80 p-6 flex flex-col gap-5 sticky top-24 shrink-0">
            <h2 className="text-base font-semibold text-white">অর্ডার সারসংক্ষেপ</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-white/60">
                <span>বেস মূল্য ({cart.itemCount} পণ্য)</span>
                <span className="text-white">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-amber-400/80">
                <span>VAT (৫%)</span>
                <span>+ {formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>আনুমানিক ডেলিভারি</span>
                <span className={shippingFee === 0 ? "text-emerald-400" : "text-white"}>
                  {shippingFee === 0 ? "বিনামূল্যে ✓" : `~ ${formatBDT(shippingFee)}`}
                </span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex justify-between items-end">
                <span className="text-white font-medium text-sm">আনুমানিক মোট</span>
                <span className="text-2xl font-bold text-primary">{formatBDT(estimatedTotal)}</span>
              </div>

              <p className="text-[11px] text-white/30 leading-relaxed">
                ✱ চূড়ান্ত মূল্য চেকআউটে ডেলিভারি জেলার উপর ভিত্তি করে নির্ধারিত হবে।
              </p>
            </div>

            {/* BD compliance badge */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-primary/80">
                VAT ও ডেলিভারি চার্জ বাংলাদেশ ই-কমার্স নীতি অনুযায়ী
              </p>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-base font-semibold"
              onClick={() => setCheckoutOpen(true)}
            >
              চেকআউট করুন <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </GlassCard>
        </div>
      </div>

      {/* Checkout modal */}
      {cart && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}
