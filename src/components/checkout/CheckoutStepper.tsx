import React, { useState, useMemo } from 'react';
import { 
  MapPin, Truck, CreditCard, ShieldCheck, 
  ChevronRight, AlertCircle, Sparkles, Award, 
  Coins, Banknote, ShieldAlert, Loader2, Info
} from 'lucide-react';
import { ConfirmOrderButton } from './ConfirmOrderButton';
import { CartItem } from '../../modules/cart/cartStore';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/modules/wallet/store/walletStore';
import { toast } from 'sonner';

interface CheckoutStepperProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  onOrderCompleted: (details: {
    address: string;
    delivery: string;
    payment: string;
    total: number;
  }) => void;
}

// Bangladesh Cascading Geographic parameters
const BD_DIVISIONS: Record<string, Record<string, string[]>> = {
  "Dhaka Division": {
    "Dhaka District": ["Mirpur", "Uttara", "Dhanmondi", "Gulshan", "Mohammadpur", "Motijheel"],
    "Gazipur District": ["Sadar Tongi", "Sreepur", "Kaliakair", "Konabari"],
    "Narayanganj District": ["Siddhirganj", "Rupganj", "Sonargaon", "Fatullah"]
  },
  "Chattogram Division": {
    "Chattogram District": ["Panchlaish", "Halishahar", "Double Mooring", "Chawkbazar", "Patenga"],
    "Cox's Bazar District": ["Cox Sadar", "Ukhia", "Teknaf", "Chakaria"]
  },
  "Sylhet Division": {
    "Sylhet District": ["Zindabazar", "Ambarkhana", "Uposhahar", "Sadar Outlets"]
  }
};

const DELIVERY_METHODS = [
  { id: "std", label: "Standard Carrier Logistics", desc: "Arrives in 48-72h. Flat regional rate.", price: 60, icon: Truck },
  { id: "exp", label: "Express Direct Courier", desc: "Next-day urgent handover.", price: 120, icon: Sparkles },
  { id: "pickup", label: "Paikar Warehouse Pickup", desc: "Collect personally from logistics hub.", price: 0, icon: MapPin },
  { id: "logistics", label: "Logistics Freight Partner", desc: "Dedicated cargo flatbed (B2B bulk only).", price: 250, icon: Award }
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Direct cash settlement upon verification", icon: Banknote, accent: "text-cyan-400" },
  { id: "bkash", label: "bKash / Nagad Wallet", desc: "Instant digital mobile financial service", icon: CreditCard, accent: "text-rose-400" },
  { id: "card", label: "SSL Commerz Gateways", desc: "Supports Visa, Mastercard, AMEX", icon: CreditCard, accent: "text-indigo-400" },
  { id: "wallet", label: "Paikar Super Wallet", desc: "Settle using loaded account credits", icon: CreditCard, accent: "text-amber-400" }
];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  items,
  subtotal,
  discount,
  onOrderCompleted,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const { bdtBalance, sendMoney } = useWalletStore();

  // Step 1 Address Data
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka Division');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka District');
  const [selectedArea, setSelectedArea] = useState('Mirpur');
  const [postalCode, setPostalCode] = useState('');
  
  // Validation inline warnings map
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 & 3 Selections
  const [deliveryMethod, setDeliveryMethod] = useState('std');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Interactive Loader for Confirming checkout page
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Memoized selection details
  const deliveryObj = useMemo(() => {
    return DELIVERY_METHODS.find(m => m.id === deliveryMethod) || DELIVERY_METHODS[0];
  }, [deliveryMethod]);

  const deliveryFee = deliveryObj.price;
  const vatAmount = Math.round(subtotal * 0.05); // Statutory 5% VAT
  const consolidatedTotal = subtotal + vatAmount + deliveryFee - discount;

  // Handle cascading Division update
  const handleDivChange = (div: string) => {
    setSelectedDivision(div);
    const districts = Object.keys(BD_DIVISIONS[div] || {});
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
      const areas = BD_DIVISIONS[div][districts[0]] || [];
      if (areas.length > 0) {
        setSelectedArea(areas[0]);
      }
    }
  };

  // Handle cascading District update
  const handleDistChange = (dist: string) => {
    setSelectedDistrict(dist);
    const areas = BD_DIVISIONS[selectedDivision][dist] || [];
    if (areas.length > 0) {
      setSelectedArea(areas[0]);
    }
  };

  // Step 1 Validation logic
  const validateAddressStep = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Consignee Full Name is required";
    if (!phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^(?:\+88)?01[3-9]\d{8}$/.test(phone.trim().replace(/[-\s]/g, ""))) {
      nextErrors.phone = "Provide a valid BD phone number (e.g. 01712345678)";
    }
    if (!streetAddress.trim() || streetAddress.trim().length < 8) {
      nextErrors.streetAddress = "Please log a complete street location (Min 8 characters)";
    }
    if (!postalCode.trim() || !/^\d{4}$/.test(postalCode.trim())) {
      nextErrors.postalCode = "ZIP Code must represent a valid 4-digit BD index";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddressStep()) {
      setActiveStep(2);
      toast.success("Consignee logistics coordinates locked!");
    } else {
      toast.error("Please align or resolve the address parameters correctly");
    }
  };

  const handleConfirmSourcing = async () => {
    // Escrow verification setup
    if (paymentMethod === 'wallet' && bdtBalance < consolidatedTotal) {
      toast.error("Insufficient Paikar Wallet balances. Settle with mobile networks or COD!");
      return;
    }

    setIsAuthorizing(true);
    // Fire analytical event coordination
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('PAYMENT_METHOD_SELECTED', { detail: { method: paymentMethod } }));
    }

    try {
      // Simulate escrow handshakes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === 'wallet') {
        sendMoney(consolidatedTotal, `PaikarMart Escrow Block: Qty-${items.length}`);
      }

      const fullAddressString = `${streetAddress}, ${selectedArea}, ${selectedDistrict}, ${selectedDivision} [ZIP: ${postalCode}]`;
      onOrderCompleted({
        address: fullAddressString,
        delivery: deliveryObj.label,
        payment: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'COD',
        total: consolidatedTotal
      });

    } catch {
      toast.error("Handloom transaction failed. Re-initiating ledger lookup...");
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Horizontal Steps Header indicators */}
      <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl select-none">
        {[
          { step: 1, name: "Address" },
          { step: 2, name: "Logistics" },
          { step: 3, name: "Settle" },
          { step: 4, name: "Review" },
          { step: 5, name: "Secure" }
        ].map((s) => {
          const isActive = activeStep === s.step;
          const isDone = activeStep > s.step;
          return (
            <div
              key={s.step}
              className={`py-2 text-center rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? "bg-cyan-400/10 border border-cyan-400/40 text-cyan-400 font-bold" 
                  : isDone 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                  : "border border-transparent text-[var(--pm-text-secondary)] opacity-50"
              }`}
            >
              <span className="text-xs font-mono font-black">0{s.step}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:block mt-0.5">{s.name}</span>
            </div>
          );
        })}
      </div>

      {/* Stepper Wizard Frames */}
      <div className="min-h-[300px]">
        
        {/* STEP 1: CONSIGN COORDINATES FORM */}
        {activeStep === 1 && (
          <form onSubmit={handleStep1Submit} className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-5 rounded-2xl flex flex-col gap-5">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> Receiver Logistics Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full name input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase select-none">Consignee Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Fariha Chowdhury"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors(p => ({ ...p, fullName: '' }));
                    }}
                    className={`w-full bg-[var(--pm-bg)]/60 border ${errors.fullName ? "border-rose-500":"border-[var(--pm-border)]"} rounded-xl h-11 px-4 text-xs font-medium text-white focus:border-cyan-400 outline-none transition-colors`}
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase select-none">Mobile Connection (+880) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
                    }}
                    className={`w-full bg-[var(--pm-bg)]/60 border ${errors.phone ? "border-rose-500":"border-[var(--pm-border)]"} rounded-xl h-11 px-4 text-xs font-medium text-white focus:border-cyan-400 outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Division Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase">Division *</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => handleDivChange(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl h-11 px-4 text-xs font-semibold text-white outline-none focus:border-cyan-400"
                >
                  {Object.keys(BD_DIVISIONS).map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase">District *</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistChange(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl h-11 px-4 text-xs font-semibold text-white outline-none focus:border-cyan-400"
                >
                  {Object.keys(BD_DIVISIONS[selectedDivision] || {}).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Upazila Area Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase">Thana / Area *</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl h-11 px-4 text-xs font-semibold text-white outline-none focus:border-cyan-400"
                >
                  {(BD_DIVISIONS[selectedDivision]?.[selectedDistrict] || []).map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* ZIP Postal selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase select-none">ZIP Index *</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 1216"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value.replace(/\D/g, ''));
                      if (errors.postalCode) setErrors(p => ({ ...p, postalCode: '' }));
                    }}
                    className={`w-full bg-[var(--pm-bg)]/60 border ${errors.postalCode ? "border-rose-500":"border-[var(--pm-border)]"} rounded-xl h-11 px-4 text-xs font-mono font-bold text-white focus:border-cyan-400 outline-none transition-colors`}
                  />
                  {errors.postalCode && (
                    <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 flex-wrap">
                      <AlertCircle className="w-3 h-3" /> {errors.postalCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Street Address Details */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase select-none">Street Address Details *</label>
                <div className="relative">
                  <textarea
                    placeholder="House Number, Holding No, Main road identifier or landmarks..."
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                      if (errors.streetAddress) setErrors(p => ({ ...p, streetAddress: '' }));
                    }}
                    className={`w-full bg-[var(--pm-bg)]/60 border ${errors.streetAddress ? "border-rose-500":"border-[var(--pm-border)]"} rounded-xl p-4 text-xs font-medium text-white focus:border-cyan-400 outline-none shrink-0 h-20 resize-none transition-colors`}
                  />
                  {errors.streetAddress && (
                    <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.streetAddress}
                    </span>
                  )}
                </div>
              </div>

            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shrink-0 mt-2 select-none cursor-pointer">
              Continue to Logistics Route <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: PROCUREMENT DELIVERY PATH (72px Option card items) */}
        {activeStep === 2 && (
          <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-5 rounded-2xl flex flex-col gap-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" /> Logistics Procurement Routes
              </h3>
              <p className="text-xs text-[var(--pm-text-secondary)]">All options are fully dispatch protected with cargo insurance.</p>
            </div>

            <div className="flex flex-col gap-3">
              {DELIVERY_METHODS.map((method) => {
                const isSelected = deliveryMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      setDeliveryMethod(method.id);
                    }}
                    className={`h-[72px] px-4 rounded-xl border text-left flex items-center justify-between transition-all select-none cursor-pointer ${
                      isSelected 
                        ? "border-cyan-400 bg-cyan-400/5 text-white" 
                        : "border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-text-secondary)] hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/30 shrink-0 ${isSelected ? "text-cyan-400":"text-zinc-500"}`}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-tight truncate">{method.label}</h4>
                        <p className="text-[10px] text-[var(--pm-text-secondary)] truncate leading-none mt-0.5">{method.desc}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-cyan-400 whitespace-nowrap ml-3">
                      {method.price === 0 ? "FREE B2B" : `৳${method.price.toLocaleString()}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 h-11 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button type="button" className="flex-1 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => setActiveStep(3)}>
                Select Route
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT METHOD SETUP (80px cards, no backend, UI validation) */}
        {activeStep === 3 && (
          <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-5 rounded-2xl flex flex-col gap-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" /> Sourcing Settlement Engine
              </h3>
              <p className="text-xs text-[var(--pm-text-secondary)]">Choose how you wish to lock escrow. Funds remain parked securely under Paikar rules.</p>
            </div>

            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`h-[80px] p-4 rounded-xl border text-left flex items-center justify-between transition-all select-none cursor-pointer ${
                      isSelected 
                        ? "border-cyan-400 bg-cyan-400/5 text-white" 
                        : "border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-text-secondary)] hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center shrink-0">
                        <method.icon className={`w-5 h-5 ${method.accent}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{method.label}</h4>
                        <p className="text-[10px] text-[var(--pm-text-secondary)] leading-normal mt-0.5">{method.desc}</p>
                      </div>
                    </div>
                    {method.id === 'wallet' && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-1 rounded-md border border-amber-500/10">
                        Bal: ৳{bdtBalance.toLocaleString()}
                      </span>
                    )}
                    <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${isSelected ? "border-cyan-400" : "border-[var(--pm-border)]"}`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 h-11 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => setActiveStep(2)}>
                Back
              </Button>
              <Button type="button" className="flex-1 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => setActiveStep(4)}>
                Lock payment Method
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER BLOCK DETAILS REVIEW */}
        {activeStep === 4 && (
          <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-5 rounded-2xl flex flex-col gap-5">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verify Sourcing Block Details
            </h3>

            {/* Block meta details review summary */}
            <div className="flex flex-col gap-3 text-xs bg-black/20 border border-[var(--pm-border)] p-4 rounded-xl">
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2 gap-4">
                <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Consignee</span>
                <span className="text-white text-right font-medium">{fullName} ({phone})</span>
              </div>
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2 gap-4">
                <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Destination Coordinates</span>
                <span className="text-white text-right font-medium max-w-[240px] truncate">{streetAddress}, {selectedArea}, {selectedDistrict}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2 gap-4">
                <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Procurement Transit</span>
                <span className="text-white text-right font-semibold">{deliveryObj.label}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--pm-text-secondary)] font-bold uppercase">Escrow Settlement</span>
                <span className="text-cyan-400 text-right font-semibold">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
              </div>
            </div>

            {/* Micro items summary */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase select-none">Catalog Tally</span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                {items.map((itm) => (
                  <div key={itm.id} className="flex justify-between items-center text-xs bg-[var(--pm-surface)] p-2.5 rounded-xl border border-[var(--pm-border)] gap-4">
                    <span className="text-white truncate max-w-[200px] font-medium">{itm.name}</span>
                    <span className="font-mono text-cyan-400 font-bold whitespace-nowrap">
                      Qty {itm.quantity} × {formatBDT(itm.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 h-11 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer" onClick={() => setActiveStep(3)}>
                Back
              </Button>
              <Button 
                type="button" 
                className="flex-1 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer" 
                onClick={() => setActiveStep(5)}
              >
                Proceed to Secure Verification
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRM SECURE ORDER COMPONENT PANEL */}
        {activeStep === 5 && (
          <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-5 items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldAlert className="w-8 h-8 fill-current shrink-0" />
            </div>

            <div className="space-y-1.5 max-w-sm mb-1 select-none">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Escrow Safeguard Verification</h3>
              <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed">
                By ticking authorize, your payment is placed securely into Mayer Doa Verified Escrow blocks. Zero supplier dispatch claims are possible without verification keys.
              </p>
            </div>

            {/* Dynamic Price indicator */}
            <div className="p-4 bg-[var(--pm-bg)]/60 rounded-xl border border-[var(--pm-border)] w-full">
              <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase block font-bold">Consolidated settlement total</span>
              <span className="text-2xl font-black text-cyan-400 font-mono tracking-tight">{formatBDT(consolidatedTotal)}</span>
            </div>

            <div className="flex gap-3 w-full">
              <Button 
                disabled={isAuthorizing}
                type="button" 
                variant="outline" 
                className="flex-1 h-12 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer" 
                onClick={() => setActiveStep(4)}
              >
                Cancel Review
              </Button>
              
              {/* ConfirmOrderButton implementation */}
              <ConfirmOrderButton
                isAuthorizing={isAuthorizing}
                onClick={handleConfirmSourcing}
                className="flex-1 h-12 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-400/20 active:scale-95 transition-all"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
