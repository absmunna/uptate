import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pill, Search, Plus, Minus, Star, Clock, MapPin, Shield,
  ShieldCheck, X, ChevronRight, AlertTriangle, Info, Phone,
  Thermometer, Heart, Stethoscope, Syringe, Eye, Baby,
  Package, CheckCircle2, BadgeCheck, Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Medicine = {
  id: string;
  name: string;
  generic: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stockCount?: number;
  image: string;
  description: string;
};

type Pharmacy = {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  isOpen: boolean;
  is24hr: boolean;
  verified: boolean;
  image: string;
  medicines: Medicine[];
};

const DRUG_CATEGORIES = [
  { id: 'all', label: 'All', icon: Pill },
  { id: 'fever', label: 'Fever', icon: Thermometer },
  { id: 'heart', label: 'Cardiac', icon: Heart },
  { id: 'diabetes', label: 'Diabetes', icon: Stethoscope },
  { id: 'injection', label: 'Injection', icon: Syringe },
  { id: 'eye', label: 'Eye Care', icon: Eye },
  { id: 'baby', label: 'Baby Care', icon: Baby },
];

const PHARMACIES: Pharmacy[] = [
  {
    id: 'ph1',
    name: 'MedLife Pharmacy',
    location: 'Dhanmondi 27, Dhaka',
    distance: '0.4 km',
    rating: 4.8,
    reviews: 312,
    deliveryTime: '15–25 min',
    isOpen: true,
    is24hr: false,
    verified: true,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=100&q=80',
    medicines: [
      {
        id: 'm1', name: 'Napa 500mg', generic: 'Paracetamol', brand: 'Beximco',
        category: 'fever', price: 4, unit: 'tablet', requiresPrescription: false,
        inStock: true, stockCount: 200,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&q=80',
        description: 'Pain relief and fever reducer'
      },
      {
        id: 'm2', name: 'Amoxi 250mg Capsule', generic: 'Amoxicillin', brand: 'Square',
        category: 'fever', price: 12, unit: 'capsule', requiresPrescription: true,
        inStock: true, stockCount: 80,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80',
        description: 'Antibiotic for bacterial infections'
      },
      {
        id: 'm3', name: 'Metformin 500mg', generic: 'Metformin HCl', brand: 'Incepta',
        category: 'diabetes', price: 6, unit: 'tablet', requiresPrescription: true,
        inStock: true, stockCount: 150,
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&q=80',
        description: 'Oral diabetes medication'
      },
      {
        id: 'm4', name: 'Opti-Fresh Eye Drops', generic: 'Carboxymethylcellulose', brand: 'Alcon',
        category: 'eye', price: 180, unit: 'bottle', requiresPrescription: false,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1576671414121-aa2d60f985a3?w=100&q=80',
        description: 'Lubricating eye drops for dry eyes'
      },
      {
        id: 'm5', name: 'Baby Paracetamol Syrup', generic: 'Paracetamol', brand: 'Beximco',
        category: 'baby', price: 45, unit: 'bottle', requiresPrescription: false,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&q=80',
        description: 'Fever & pain relief for children'
      },
    ]
  },
  {
    id: 'ph2',
    name: 'Sena Medical Store',
    location: 'Mirpur 10, Dhaka',
    distance: '1.2 km',
    rating: 4.6,
    reviews: 189,
    deliveryTime: '20–35 min',
    isOpen: true,
    is24hr: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=100&q=80',
    medicines: [
      {
        id: 'm6', name: 'Losartan 50mg', generic: 'Losartan Potassium', brand: 'ACI',
        category: 'heart', price: 14, unit: 'tablet', requiresPrescription: true,
        inStock: true, stockCount: 60,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&q=80',
        description: 'Used for high blood pressure'
      },
      {
        id: 'm7', name: 'Insulin Glargine', generic: 'Insulin Glargine', brand: 'Novo Nordisk',
        category: 'injection', price: 850, unit: 'vial', requiresPrescription: true,
        inStock: true, stockCount: 10,
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&q=80',
        description: 'Long-acting insulin for diabetes'
      },
    ]
  }
];

type CartItem = { medicine: Medicine; qty: number; pharmacy: Pharmacy };

export function PharmacyUI({ searchQuery }: { searchQuery: string }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [expandedPharmacy, setExpandedPharmacy] = useState<string | null>('ph1');
  const [prescriptionWarning, setPrescriptionWarning] = useState<string | null>(null);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.medicine.price * i.qty, 0);

  const addToCart = (medicine: Medicine, pharmacy: Pharmacy) => {
    if (medicine.requiresPrescription) {
      setPrescriptionWarning(medicine.id);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.medicine.id === medicine.id);
      if (existing) return prev.map(i => i.medicine.id === medicine.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { medicine, qty: 1, pharmacy }];
    });
    toast.success(`${medicine.name} added`, { duration: 1500 });
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.medicine.id === medicineId);
      if (existing && existing.qty > 1) return prev.map(i => i.medicine.id === medicineId ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.medicine.id !== medicineId);
    });
  };

  const getQty = (medicineId: string) => cart.find(i => i.medicine.id === medicineId)?.qty || 0;

  const filteredPharmacies = PHARMACIES.map(ph => ({
    ...ph,
    medicines: ph.medicines.filter(m => {
      const matchesCat = activeCategory === 'all' || m.category === activeCategory;
      const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.generic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
  })).filter(ph => ph.medicines.length > 0 || !searchQuery);

  return (
    <div className="px-4 md:px-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <Pill className="w-4.5 h-4.5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white">Nearby Pharmacies</h2>
          <p className="text-[10px] text-zinc-500">Medicines & health products near you</p>
        </div>
      </div>

      {/* Prescription Notice */}
      <div className="mb-4 p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-black text-amber-300">Prescription Required</p>
          <p className="text-[10px] text-amber-400/70 leading-relaxed mt-0.5">
            Medicines marked with Rx require a valid prescription. Upload your prescription during checkout.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {DRUG_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                isActive
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.03] border-white/[0.05] text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Pharmacies */}
      <div className="space-y-4">
        {filteredPharmacies.map(pharmacy => (
          <div key={pharmacy.id} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Pharmacy Header */}
            <button
              onClick={() => setExpandedPharmacy(expandedPharmacy === pharmacy.id ? null : pharmacy.id)}
              className="w-full flex items-center gap-3 p-4"
            >
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-emerald-500/10 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-emerald-400" />
                </div>
                {pharmacy.is24hr && (
                  <div className="absolute -top-1 -right-1 px-1 py-0.5 rounded-full bg-blue-500 text-[7px] font-black text-white border border-[var(--pm-bg)]">
                    24H
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-black text-white">{pharmacy.name}</span>
                  {pharmacy.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-white">{pharmacy.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-400">{pharmacy.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-400">{pharmacy.deliveryTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-full",
                  pharmacy.isOpen ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700/30 text-zinc-500"
                )}>
                  {pharmacy.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
                <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", expandedPharmacy === pharmacy.id && "rotate-90")} />
              </div>
            </button>

            {/* Medicines */}
            <AnimatePresence>
              {expandedPharmacy === pharmacy.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/[0.05]"
                >
                  <div className="p-3 space-y-2.5">
                    {pharmacy.medicines.map(medicine => {
                      const qty = getQty(medicine.id);
                      const showWarning = prescriptionWarning === medicine.id;
                      return (
                        <div key={medicine.id} className="p-3 rounded-2xl bg-black/20 border border-white/[0.04]">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className="text-[12px] font-black text-white">{medicine.name}</span>
                                {medicine.requiresPrescription && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-[8px] font-black text-red-400">Rx</span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-500">{medicine.generic} • {medicine.brand}</p>
                              <p className="text-[10px] text-zinc-600 mt-0.5">{medicine.description}</p>
                              {medicine.stockCount && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div className={cn("w-1.5 h-1.5 rounded-full", medicine.stockCount > 50 ? "bg-emerald-400" : "bg-amber-400")} />
                                  <span className="text-[9px] text-zinc-500">
                                    {medicine.stockCount > 50 ? 'In Stock' : `Only ${medicine.stockCount} left`}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-emerald-400">৳{medicine.price}</p>
                              <p className="text-[9px] text-zinc-600">/{medicine.unit}</p>
                            </div>
                          </div>

                          {showWarning && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 p-2.5 rounded-xl bg-red-500/8 border border-red-500/20 flex items-start gap-2"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-[10px] font-black text-red-300">Prescription Required</p>
                                <p className="text-[9px] text-red-400/70 mt-0.5">Upload prescription to order this medicine.</p>
                              </div>
                              <button onClick={() => setPrescriptionWarning(null)}>
                                <X className="w-3 h-3 text-zinc-600" />
                              </button>
                            </motion.div>
                          )}

                          <div className="flex items-center justify-between mt-2.5">
                            <button className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 hover:text-zinc-300 transition-colors">
                              <Info className="w-3 h-3" />
                              Details
                            </button>
                            {pharmacy.isOpen ? (
                              qty > 0 ? (
                                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-2.5 py-1.5">
                                  <button onClick={() => removeFromCart(medicine.id)}>
                                    <Minus className="w-3 h-3 text-emerald-400" />
                                  </button>
                                  <span className="text-[11px] font-black text-white w-4 text-center">{qty}</span>
                                  <button onClick={() => addToCart(medicine, pharmacy)}>
                                    <Plus className="w-3 h-3 text-emerald-400" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(medicine, pharmacy)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all",
                                    medicine.requiresPrescription
                                      ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                                      : "bg-emerald-500 hover:bg-emerald-400 text-white"
                                  )}
                                >
                                  {medicine.requiresPrescription ? 'Upload Rx' : <><Plus className="w-3 h-3" />Add</>}
                                </button>
                              )
                            ) : (
                              <span className="text-[9px] text-zinc-600 font-bold">Pharmacy Closed</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[84px] left-4 right-4 z-[200]"
          >
            <button
              onClick={() => setShowCart(true)}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-between px-5 shadow-[0_8px_32px_rgba(52,211,153,0.35)] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">{totalItems}</span>
                </div>
                <span className="text-[12px] font-black text-white uppercase tracking-wide">View Cart</span>
              </div>
              <span className="text-[14px] font-black text-white">৳{totalPrice}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
