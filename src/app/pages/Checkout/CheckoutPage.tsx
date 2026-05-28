import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowLeft, ShieldCheck, ShoppingBag, 
  PartyPopper, Home, ListTodo, Coins, Info, Lock 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../../modules/cart/cartStore';
import { useWalletStore } from '@/store/walletStore';
import { CheckoutStepper } from '../../../components/checkout/CheckoutStepper';
import { confirmOrderService, OrderConfirmationPayload } from '../../services/confirmOrderService';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    orderId: string;
    cashbackCoinsCount: number;
    total: number;
  } | null>(null);

  const subtotal = getTotalPrice();
  // Standard freight inside BD
  const deliveryFee = subtotal > 15000 ? 0 : 80;
  const vatAmount = Math.round(subtotal * 0.05);

  // Early exit if cart is dry and not on success screens
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-white text-center p-6">
        <div className="w-20 h-20 bg-cyan-950/20 border border-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 select-none">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">No items to checkout</h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            Please add wholesale products or premium orders to your Cart before requesting escrow settlement.
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="h-11 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider cursor-pointer">
            Return to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const handleOrderCompleted = async (stepDetails: {
    address: string;
    delivery: string;
    payment: string;
    total: number;
  }) => {
    // Collect entire pricing payloads
    const payload: OrderConfirmationPayload = {
      items,
      address: stepDetails.address,
      deliveryMethod: stepDetails.delivery,
      paymentMethod: stepDetails.payment,
      subtotal,
      deliveryFee,
      vatAmount,
      couponDiscount: (subtotal + vatAmount + deliveryFee) - stepDetails.total,
      total: stepDetails.total
    };

    try {
      const response = await confirmOrderService.confirmOrder(payload);
      if (response.success) {
        setPlacedOrderDetails({
          orderId: response.orderId,
          cashbackCoinsCount: response.cashbackCoinsCount,
          total: stepDetails.total
        });
        setIsSuccess(true);
        clearCart();
        toast.success("Consign order locked into escrow!");
      }
    } catch {
      toast.error("Handshake connection failed. Re-initiating ledger request...");
    }
  };

  // SUCCESS BRAND CELEBRATION COMPONENT
  if (isSuccess && placedOrderDetails) {
    return (
      <div className="min-h-[90vh] bg-[#03060d] flex items-center justify-center px-4 py-12 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg p-8 rounded-2xl bg-[var(--pm-surface)] border border-emerald-500/20 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          {/* Celebrating banner visual background */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500" />
          
          <motion.div
            initial={{ scale: 0, rotate: -35 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="w-20 h-20 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400"
          >
            <CheckCircle2 className="w-11 h-11" />
          </motion.div>

          {/* Sourcing details receipt */}
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-[0.2em] bg-emerald-500/5 border border-emerald-500/15 px-3 py-1 rounded-full mb-3 flex items-center gap-1.5">
            <PartyPopper className="w-3.5 h-3.5 shrink-0" /> Order escrow secured
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
            Mayer Doa Wholesale locked!
          </h2>
          <p className="text-zinc-400 text-xs max-w-sm leading-relaxed mb-6">
            Your transaction has been verified across the secure Paikar ledger. Logistics dispatch key is currently being synchronized.
          </p>

          {/* Financial summary receipt block */}
          <div className="w-full p-5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-3.5 mb-8 text-left select-none">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Sourcing ledger ID</span>
              <span className="font-mono text-white font-extrabold text-sm">{placedOrderDetails.orderId}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Escrow Settle block</span>
              <span className="font-mono text-cyan-400 font-extrabold text-sm">{formatBDT(placedOrderDetails.total)}</span>
            </div>

            {placedOrderDetails.cashbackCoinsCount > 0 && (
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-[var(--pm-text-secondary)] font-bold uppercase flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" /> Loyalty cashback reward
                </span>
                <span className="font-bold text-amber-400 text-sm">+{placedOrderDetails.cashbackCoinsCount} Coins</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full shrink-0">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 h-12 rounded-xl bg-[#0b101d] border border-white/5 hover:bg-white/5 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" /> Go to Feed
            </Button>
            <Button
              onClick={() => navigate('/orders')}
              className="flex-1 h-12 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ListTodo className="w-4 h-4" /> Track orders
            </Button>
          </div>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#03060d] font-sans pb-16">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        
        {/* Navigation Breadcrumb headers */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/cart')}
              className="p-2.5 bg-[#0b101d] hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">Trade operations workspace</h1>
              <span className="text-base sm:text-xl font-black tracking-tight uppercase">Checkout settlement</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> SECURED TERMINAL
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Complete Stepper Wizard Block (8 columns) */}
          <div className="lg:col-span-8">
            <CheckoutStepper
              items={items}
              subtotal={subtotal}
              discount={(subtotal > 10000) ? 500 : 0} // Automated corporate B2B credit loyalties
              onOrderCompleted={handleOrderCompleted}
            />
          </div>

          {/* RIGHT: Checked out Sourcing Catalog tally summary review */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] bg-[var(--pm-surface)]/30 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-5 select-none">
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold">
                Escrow tally summary
              </h3>
              <span className="text-xs font-mono font-black text-cyan-400">
                {items.length} lots
              </span>
            </div>

            {/* List items being purchased */}
            <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar border-b border-[var(--pm-border)] pb-4">
              {items.map((itm) => (
                <div key={itm.id} className="flex gap-3 items-center">
                  <div className="w-[50px] h-[50px] rounded-lg border border-[var(--pm-border)] bg-black/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={itm.image} alt={itm.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">{itm.name}</h4>
                    <p className="text-[10px] text-[var(--pm-text-secondary)] mt-0.5 font-mono leading-none">
                      {itm.quantity} pcs × {formatBDT(itm.price)}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#22d3ee] shrink-0 whitespace-nowrap">
                    {formatBDT(itm.price * itm.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Micro details panel total metrics */}
            <div className="flex flex-col gap-2 text-xs font-medium text-[var(--pm-text-secondary)] pb-1">
              <div className="flex justify-between">
                <span>Items base subtotal</span>
                <span className="font-mono text-white font-semibold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vat charges (5% BD levy)</span>
                <span className="font-mono text-white font-semibold">+ {formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated freight</span>
                <span className="font-mono text-white font-semibold">{deliveryFee === 0 ? "FREE B2B Sourcing" : formatBDT(deliveryFee)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-black/25 rounded-xl border border-[var(--pm-border)] flex gap-2 text-[10px] text-[var(--pm-text-secondary)]">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">All transaction credits inside Paikar Super App conform to Central Bank statutory escrow rules.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
