import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, ShieldCheck, ArrowRight, Store, 
  Trash2, Plus, CornerDownRight, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, CartItem } from '../../../modules/cart/cartStore';
import { CartItemCard } from '../../../components/cart/CartItemCard';
import { OrderSummaryPanel } from '../../../components/cart/OrderSummaryPanel';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Strict MOQ/B2B Minimum order parameters per vendor lot
const VENDOR_B2B_THRESHOLD = 5000; // ৳5,000 minimum value per wholesaler lot

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Trigger analytical CART_UPDATED event upon layout load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('CART_UPDATED', { detail: { items } }));
    }
  }, [items]);

  // Group items dynamically by Vendor / Seller
  const groupedItems = useMemo(() => {
    const groups: Record<string, { vendorName: string; vendorId: string; items: CartItem[] }> = {};
    items.forEach((item) => {
      const vId = item.vendorId || 'pk-direct-general';
      const vName = item.vendorName || 'Paikar Direct Vendor';
      if (!groups[vId]) {
        groups[vId] = {
          vendorName: vName,
          vendorId: vId,
          items: [],
        };
      }
      groups[vId].items.push(item);
    });
    return Object.values(groups);
  }, [items]);

  // Group validations calculations (B2B MOQ checking & minimum purchases)
  const groupStatus = useMemo(() => {
    const validations: Record<string, { totalValue: number; met: boolean; remaining: number }> = {};
    groupedItems.forEach((group) => {
      const totalVal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const isMet = totalVal >= VENDOR_B2B_THRESHOLD;
      validations[group.vendorId] = {
        totalValue: totalVal,
        met: isMet,
        remaining: Math.max(0, VENDOR_B2B_THRESHOLD - totalVal),
      };
    });
    return validations;
  }, [groupedItems]);

  const handleApplyPromo = (discountVal: number) => {
    setCouponDiscount(discountVal);
  };

  const handleClearCatalog = () => {
    clearCart();
    toast.success("Sourcing list cleared completely.");
  };

  const handleProceedToCheckout = () => {
    // Check if any B2B group is violating MOQ threshold
    const hasViolations = Object.values(groupStatus).some(status => !status.met);
    if (hasViolations && items.some(i => i.portal === 'b2b')) {
      toast.error("Wholesale Minimum Procurement Limit (৳5,000) not satisfied for all sellers!");
      return;
    }

    // Launch CHECKOUT_STARTED event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('CHECKOUT_STARTED', { detail: { subtotal: getTotalPrice() } }));
    }

    navigate('/checkout');
  };

  const subtotal = getTotalPrice();
  // Standard freight fee inside Bangladesh cargo networks
  const deliveryFee = subtotal > 15000 ? 0 : 80;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 p-6 max-w-[1280px] mx-auto text-white text-center">
        <div className="w-24 h-24 rounded-full bg-cyan-950/20 border border-cyan-500/15 flex items-center justify-center text-cyan-400 select-none animate-pulse">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-2">Your sourcing cart is empty</h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Please add premium products, service contracts or logistics bookings to proceed with trading.
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="h-12 px-8 rounded-full bg-[#0b101d] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-bold tracking-wider uppercase text-xs cursor-pointer">
            Explore Trading Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#03060d] font-sans pb-24 md:pb-12">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        
        {/* Navigation Breadcrumb Headers */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 select-none">
          <div className="flex items-center gap-3">
            <Link 
              to="/marketplace" 
              className="p-2.5 bg-[#0b101d] hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 cursor-pointer"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </Link>
            <div>
              <h1 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-black">Trade Operations Workspace</h1>
              <span className="text-base sm:text-xl font-black tracking-tight uppercase">Sourcing Manifest</span>
            </div>
          </div>
          <button 
            onClick={handleClearCatalog}
            className="text-xs text-rose-400 hover:text-rose-500 font-extrabold flex items-center gap-1 cursor-pointer hover:bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10 transition-all uppercase"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Tally
          </button>
        </div>

        {/* Desktop Split Columns Layout - Left 8 columns, Right 4 columns (12cols grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Dynamic Grouped Wholesale Portals List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <AnimatePresence mode="popLayout">
              {groupedItems.map((group) => {
                const status = groupStatus[group.vendorId] || { totalValue: 0, met: true, remaining: 0 };
                const isB2BPortal = group.items.some(i => i.portal === 'b2b');

                return (
                  <motion.div
                    key={group.vendorId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-5 rounded-2xl bg-[var(--pm-surface)]/30 border border-[var(--pm-border)] flex flex-col gap-4 shadow-md"
                  >
                    {/* Seller Group Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--pm-border)] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-950/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/10">
                          <Store className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h2 className="text-sm font-black text-white uppercase tracking-tight">{group.vendorName}</h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-[var(--pm-text-secondary)] uppercase">Verified Wholesaler</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-400/5 px-1.5 py-0.5 rounded border border-cyan-400/10">BDT Settle</span>
                          </div>
                        </div>
                      </div>

                      {/* MOQ/Value Limit Verification Indicators */}
                      {isB2BPortal ? (
                        <div className="flex items-center gap-2 shrink-0">
                          {status.met ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/10">
                              <CheckCircle className="w-3.5 h-3.5" /> Direct Shipment Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-400/10 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" /> ৳{status.remaining.toLocaleString()} to MOQ
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-black/25 px-2.5 py-1 rounded-md border border-[var(--pm-border)]">
                          Standard Lot
                        </span>
                      )}
                    </div>

                    {/* MOQ Alerts notice panel */}
                    {isB2BPortal && !status.met && (
                      <div className="bg-amber-500/5 border border-amber-500/10 px-4 py-3 rounded-xl flex gap-3 text-xs text-amber-200 shrink-0">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 self-start mt-0.5" />
                        <div className="leading-relaxed">
                          <span className="font-bold block">Wholesale Sourcing Limit Unresolved:</span>
                          To unlock direct B2B factory channels, this supplier lot needs a minimum spend of <strong>{formatBDT(VENDOR_B2B_THRESHOLD)}</strong>. Add more items from {group.vendorName} to proceed safely.
                        </div>
                      </div>
                    )}

                    {/* Group Items mapping cards */}
                    <div className="flex flex-col gap-3">
                      {group.items.map((item) => (
                        <div key={item.id} className="relative">
                          <CartItemCard item={item} />
                        </div>
                      ))}
                    </div>

                    {/* Group Subtotals Tally Footer */}
                    <div className="flex items-center justify-between text-xs bg-black/15 p-3 rounded-xl border border-[var(--pm-border)]">
                      <span className="text-[var(--pm-text-secondary)] font-bold uppercase flex items-center gap-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" /> Lot subtotal
                      </span>
                      <span className="font-mono text-white font-extrabold text-sm">
                        {group.items.reduce((acc, current) => acc + current.quantity, 0)} Pcs • {formatBDT(status.totalValue)}
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>

          </div>

          {/* RIGHT SIDE: Sticky Financial Summary Area */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] w-full max-w-[360px] mx-auto hidden lg:block">
            <OrderSummaryPanel
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              couponDiscount={couponDiscount}
              onApplyCoupon={handleApplyPromo}
              onProceed={handleProceedToCheckout}
              totalItemsCount={getTotalItems()}
            />
          </div>

        </div>

      </div>

      {/* MOBILE ONLY: Fixed Sticky summary ribbon bar - Height: 72px */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-[var(--pm-surface)]/95 backdrop-blur-md border-t border-[var(--pm-border)] flex items-center px-4 justify-between lg:hidden z-40 select-none pb-safe">
        <div className="flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold">Consolidated Settle</span>
          <span className="text-xl font-black text-cyan-400 font-mono tracking-tight leading-none mt-1">
            {formatBDT(subtotal + Math.round(subtotal * 0.05) + deliveryFee - couponDiscount)}
          </span>
        </div>
        <Button
          onClick={handleProceedToCheckout}
          className="h-11 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <span>Checkout</span> <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
};
