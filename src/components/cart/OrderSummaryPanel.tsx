import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Ticket, Info } from 'lucide-react';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OrderSummaryPanelProps {
  subtotal: number;
  deliveryFee: number;
  onProceed: () => void;
  couponDiscount: number;
  onApplyCoupon: (discount: number) => void;
  totalItemsCount: number;
}

export const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  subtotal,
  deliveryFee,
  onProceed,
  couponDiscount,
  onApplyCoupon,
  totalItemsCount,
}) => {
  const [couponInput, setCouponInput] = useState('');

  // 5% VAT BD policy compliance calculations
  const vatAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + vatAmount + deliveryFee - couponDiscount;

  const handleApplyPromo = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'PAIKAR500') {
      onApplyCoupon(500);
      toast.success("Promo Applied: ৳500 loyalty discount credited!");
    } else if (code === 'PAIKAR1000' && subtotal > 10000) {
      onApplyCoupon(1000);
      toast.success("Promo Applied: ৳1000 B2B discount credited!");
    } else {
      toast.error("Invalid coupon code. Try 'PAIKAR500'!");
    }
  };

  return (
    <div className="w-full lg:w-[360px] flex flex-col gap-4 shrink-0">
      
      {/* 1. Corporate Coupon Code Module */}
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-2xl flex flex-col gap-2.5">
        <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Ticket className="w-4 h-4 text-cyan-400" /> Apply Corporate Promo
        </label>
        <div className="flex gap-2 h-11">
          <input
            type="text"
            placeholder="e.g. PAIKAR500"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 bg-[var(--pm-bg)]/40 border border-[var(--pm-border)] rounded-xl px-4 text-xs font-mono text-[var(--pm-text)] placeholder:text-[var(--pm-text-secondary)] outline-none focus:border-cyan-500 hover:border-zinc-700 transition-colors"
          />
          <Button
            onClick={handleApplyPromo}
            className="h-full px-5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 2. Main Pricing Breakdown Canvas */}
      <div className="p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col gap-4 shadow-xl select-none">
        
        <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
          <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold">
            Trading aggregates
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> ESCROW SECURED
          </span>
        </div>

        {/* Breakdown Row Fields */}
        <div className="flex flex-col gap-3 text-xs text-[var(--pm-text-secondary)] font-medium">
          <div className="flex justify-between items-center text-sm">
            <span>Base Subtotal ({totalItemsCount} pieces)</span>
            <span className="font-mono text-white text-right font-semibold">{formatBDT(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>statutory VAT (5% statutory govt levy)</span>
            <span className="font-mono text-amber-400 text-right font-semibold">+ {formatBDT(vatAmount)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Estimated Freight Carrier Fee</span>
            <span className="font-mono text-white text-right font-semibold">{formatBDT(deliveryFee)}</span>
          </div>

          {couponDiscount > 0 ? (
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span>Promo Campaign Coupon</span>
              <span className="font-mono text-right">- {formatBDT(couponDiscount)}</span>
            </div>
          ) : null}

          <div className="h-px bg-[var(--pm-border)] my-1 shrink-0" />

          {/* Consolidated Total - 28px bold styled element */}
          <div className="flex justify-between items-end pt-1">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Consolidated Total</span>
            <span className="text-[28px] font-black text-cyan-400 font-mono tracking-tight leading-none text-right">
              {formatBDT(totalAmount)}
            </span>
          </div>
        </div>

        {/* Delivery micro note */}
        <div className="bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-xl flex gap-2 text-[10px] text-cyan-200 mt-1">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="leading-snug">Freight routes conform to statutory standard cargo networks inside BD.</span>
        </div>

        {/* Proceed CTA - Height: 56px, Radius: 16px */}
        <Button
          onClick={onProceed}
          className="w-full h-14 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-cyan-400/20 text-sm uppercase tracking-wider cursor-pointer"
        >
          Proceed to Settlement <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};
