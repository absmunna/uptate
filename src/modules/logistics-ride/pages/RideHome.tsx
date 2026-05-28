import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Bike, 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  Phone, 
  ShieldCheck, 
  Map, 
  Navigation, 
  HelpCircle, 
  ArrowLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../../store';

interface RideOption {
  id: string;
  name: string;
  banglaName: string;
  icon: React.ComponentType<any>;
  baseFare: number;
  perKmRate: number;
  estimatedTime: string;
  description: string;
  capacity: string;
}

const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'bike',
    name: 'Paikar Bike',
    banglaName: 'বাইক রাইড',
    icon: Bike,
    baseFare: 30,
    perKmRate: 12,
    estimatedTime: '৩ মিনিট',
    description: 'শহরের ট্রাফিকের মাঝে দ্রুততম ও সাশ্রয়ী যাতায়াত',
    capacity: '১ জন যাত্রী'
  },
  {
    id: 'car',
    name: 'Paikar Premium Car',
    banglaName: 'প্রাইভেট কার',
    icon: Car,
    baseFare: 80,
    perKmRate: 22,
    estimatedTime: '৬ মিনিট',
    description: 'পরিবার নিয়ে নিরাপদ ও আরামদায়ক এসি প্রিমিয়াম জার্নি',
    capacity: '৪ জন যাত্রী'
  },
  {
    id: 'logistics',
    name: 'Paikar Logistics PickUp',
    banglaName: 'পণ্যবাহী পিকআপ',
    icon: Truck,
    baseFare: 150,
    perKmRate: 35,
    estimatedTime: '১০ মিনিট',
    description: 'পাইকারি ব্যবসার মালপত্র বা ভারী পণ্য পরিবহনের জন্য',
    capacity: '১ টন লোড ক্যাপাসিটি'
  }
];

const POPULAR_ROUTES = [
  { from: 'মতিঝিল (Motijheel)', to: 'উত্তরা সেক্টর ৭ (Uttara Sec 7)', distance: 18 },
  { from: 'মিরপুর ১০ (Mirpur 10)', to: 'কারওয়ান বাজার (Karwan Bazar)', distance: 8.5 },
  { from: 'গুলশান ২ (Gulshan 2)', to: 'ধানমন্ডি ৩২ (Dhanmondi 32)', distance: 11 },
  { from: 'সদরঘাট টার্মিনাল (Sadarghat)', to: 'চকবাজার হোলসেল মার্কেট (Chawkbazar)', distance: 2.5 }
];

export const RideHome: React.FC = () => {
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Form states
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState<string>('bike');
  const [distanceKm, setDistanceKm] = useState<number>(5);

  // Game UI/Simulation states
  const [isSearching, setIsSearching] = useState(false);
  const [matchStep, setMatchStep] = useState(0); // 0: Idle, 1: Connecting, 2: Found Driver, 3: Ride Active
  const [otp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  // Auto fare calculation
  const currentOption = RIDE_OPTIONS.find(r => r.id === selectedRide) || RIDE_OPTIONS[0];
  const calculatedFare = Math.round(currentOption.baseFare + (distanceKm * currentOption.perKmRate));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearching) {
      setMatchStep(1);
      // Step 1: Connecting (2 seconds)
      timer = setTimeout(() => {
        setMatchStep(2);
        addNotification('আপনার জন্য চালক পাওয়া গেছে!', 'success');
        
        // Step 2: Found Driver (4 seconds) -> Ride Active
        timer = setTimeout(() => {
          setMatchStep(3);
          addNotification('রাইড সফলভাবে শুরু হয়েছে। আপনার নিরাপত্তা আমাদের অগ্রাধিকার।', 'info');
        }, 4000);
      }, 3000);
    } else {
      setMatchStep(0);
    }

    return () => clearTimeout(timer);
  }, [isSearching]);

  const handleRouteSelect = (route: typeof POPULAR_ROUTES[0]) => {
    setPickup(route.from);
    setDestination(route.to);
    setDistanceKm(route.distance);
    addNotification(`রুটের দূরত্ব: ${route.distance} কিমি সেট করা হয়েছে।`, 'info');
  };

  const handleCancelRide = () => {
    setIsSearching(false);
    setMatchStep(0);
    addNotification('আপনার রিকোয়েস্ট স্তগিত করা হয়েছে।', 'info');
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !destination.trim()) {
      addNotification('দয়া করে পিকআপ এবং গন্তব্যস্থলের নাম লিখুন', 'error');
      return;
    }
    setIsSearching(true);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24 px-4 pt-4">
      {/* Top Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black tracking-tight text-[var(--pm-text)] flex items-center gap-2">
            লজিস্টিকস ও রাইড <Navigation className="w-4 h-4 text-[var(--pm-accent)] animate-pulse" />
          </h1>
          <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium">নিরাপদ যাত্রী পরিবহন ও পাইকারি পণ্য লোড ডেলিভারি</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSearching ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-5"
          >
            {/* Promo banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-[var(--pm-accent)]/15 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[var(--pm-accent)] shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-white">১০০% ভেরিফাইড ও জিপিএস ট্র্যাকড চালক</h3>
                <p className="text-[9px] text-[var(--pm-text-secondary)] leading-tight mt-0.5">সবচেয়ে কম ভাড়ায় সারা দেশে কুরিয়ার এবং ঢাকা-চট্টগ্রামে দ্রুত রিলায়্যাবল রাইড সুবিধা।</p>
              </div>
            </div>

            {/* Address Selection Form */}
            <form onSubmit={handleBookRide} className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xl space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--pm-text-secondary)] mb-1 flex items-center gap-1">
                📍 রাইড ডিটেইলস
              </h2>
              
              <div className="space-y-3 relative">
                {/* Input 1: Pickup */}
                <div className="relative">
                  <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-emerald-500" />
                  <input
                    type="text"
                    required
                    placeholder="পিকআপ লোকেশন লিখুন (যেমন: মতিঝিল)"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] placeholder-[var(--pm-text-muted)] focus:border-[var(--pm-accent)] rounded-2xl py-3 pl-9 pr-4 text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                {/* Vertical dash line */}
                <div className="absolute left-4 top-8 w-0.5 h-10 bg-dashed border-l border-[var(--pm-border)]" />

                {/* Input 2: Destination */}
                <div className="relative">
                  <div className="absolute left-3 top-3.5 w-2.5 h-2.5 bg-red-500 rotate-45" />
                  <input
                    type="text"
                    required
                    placeholder="কোথায় যাবেন? গন্তব্য লিখুন"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] placeholder-[var(--pm-text-muted)] focus:border-[var(--pm-accent)] rounded-2xl py-3 pl-9 pr-4 text-xs font-semibold outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Simulated Distance slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-[10px] text-[var(--pm-text-secondary)] font-bold mb-1">
                  <span>আনুমানিক দূরত্ব:</span>
                  <span className="text-[var(--pm-accent)]">{distanceKm} কিলোমিটার</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--pm-border)] rounded-lg appearance-none cursor-pointer accent-[var(--pm-accent)]"
                />
              </div>

              {/* Submit button inside form but visually bottom */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-[var(--pm-accent)] hover:opacity-95 text-white font-extrabold text-xs rounded-full transition-all active:scale-95 shadow-lg shadow-[var(--pm-accent)]/20 uppercase tracking-wider block"
              >
                অনলাইনে চালক খুঁজুন — ভাড়া ৳{calculatedFare.toLocaleString()}
              </button>
            </form>

            {/* Popular Route suggestions */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-[var(--pm-text-secondary)] uppercase tracking-wide flex items-center gap-1.5 px-0.5">
                ⭐ জনপ্রিয় সাজেস্টেড রুটসমূহ
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {POPULAR_ROUTES.map((route, i) => (
                  <div
                    key={i}
                    onClick={() => handleRouteSelect(route)}
                    className="p-3.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/30 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-[var(--pm-text)] truncate">{route.from}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-xs font-bold text-[var(--pm-text-secondary)] truncate">{route.to}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1.5 pl-2 border-l border-[var(--pm-border)]/40">
                      <div>
                        <span className="text-xs font-black text-[var(--pm-accent)] block">{route.distance} কিমি</span>
                        <span className="text-[8px] text-[var(--pm-text-muted)] block">পছন্দ করুন</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Selection list */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-[var(--pm-text-secondary)] uppercase tracking-wide flex items-center gap-1 px-0.5">
                🚖 যানবাহন সিলেক্ট করুন
              </h3>
              <div className="space-y-2.5">
                {RIDE_OPTIONS.map((ride) => {
                  const Icon = ride.icon;
                  const isActive = selectedRide === ride.id;
                  const estimatedCost = Math.round(ride.baseFare + (distanceKm * ride.perKmRate));
                  return (
                    <div
                      key={ride.id}
                      onClick={() => setSelectedRide(ride.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                        isActive 
                          ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/8 shadow-md' 
                          : 'border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)]'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl shrink-0 ${isActive ? 'bg-[var(--pm-accent)] text-white' : 'bg-[var(--pm-surface-hover)] text-[var(--pm-text-secondary)]'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-extrabold text-white">{ride.banglaName} <span className="text-[10px] font-medium text-[var(--pm-text-secondary)]">({ride.name})</span></h4>
                          <span className="text-sm font-black text-[var(--pm-accent)]">৳{estimatedCost.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-[var(--pm-text-secondary)] leading-relaxed mt-1">{ride.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[9px] text-[var(--pm-text-muted)]">
                          <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">👥 {ride.capacity}</span>
                          <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">⏱️ চালক নিকটেই: {ride.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Searching Driver Match simulated states */
          <motion.div
            key="matching-simulation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-2xl text-center space-y-6 max-w-sm mx-auto"
          >
            {matchStep === 1 && (
              <div className="space-y-6 py-6">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--pm-accent)]/20 border-t-[var(--pm-accent)] animate-spin" />
                  <div className="w-16 h-16 rounded-full bg-[var(--pm-accent-soft)] flex items-center justify-center text-[var(--pm-accent)]">
                    {selectedRide === 'bike' ? <Bike className="w-8 h-8" /> : selectedRide === 'car' ? <Car className="w-8 h-8" /> : <Truck className="w-8 h-8" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-sm text-[var(--pm-text)] tracking-tight">আপনার রাইড খোঁজা হচ্ছে...</h3>
                  <p className="text-[10px] text-[var(--pm-text-secondary)] mt-1 max-w-[240px] mx-auto leading-relaxed">
                    নিকটতম চালকদের সাথে কানেক্ট করা হচ্ছে। অনুগ্রহ করে ক্ষনিক অপেক্ষা করুন।
                  </p>
                </div>
              </div>
            )}

            {matchStep === 2 && (
              <div className="space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[9px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ম্যাচিং সম্পন্ন</span>
                  <h3 className="font-extrabold text-xs text-[var(--pm-text)] mt-1.5">কানেক্টেড ড্রাইভার</h3>
                </div>

                {/* Driver Identity Card inside simulation */}
                <div className="p-4 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-left flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-xl bg-[var(--pm-accent-soft)] flex items-center justify-center font-black text-sm text-[var(--pm-accent)]">
                    MK
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white">মোস্তফা কামাল (Mustafa)</h4>
                    <span className="text-[10px] text-[var(--pm-text-secondary)] block">বাইক: ঢাকা মেট্রো-হ ৫০-৯২৭৩</span>
                    <span className="text-[9px] text-[var(--pm-accent)] font-bold mt-0.5 block flex items-center gap-1">⭐ ৪.৯ (১২০+ ট্রিপ সম্পন্ন)</span>
                  </div>
                  <button onClick={() => addNotification('চালককে কল করা হচ্ছে...', 'info')} className="p-2.5 rounded-full bg-[var(--pm-accent)] text-white hover:opacity-90 shrink-0">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>

                {/* One Time Password Card Security verification */}
                <div className="p-3.5 rounded-xl border border-dashed border-[var(--pm-border)] bg-[var(--pm-bg)]">
                  <span className="text-[9px] text-[var(--pm-text-secondary)] font-bold block uppercase tracking-wide">নিরাপত্তা ও ওটিপি পিন</span>
                  <span className="text-lg font-black text-[var(--pm-accent)] tracking-widest mt-1 block">{otp}</span>
                  <p className="text-[8px] text-[var(--pm-text-muted)] leading-tight mt-1.5">চালক আপনার পিকআপ পয়েন্টে আসলে রাইড স্টার্ট করতে তাকে এই পিনটি দিন।</p>
                </div>
              </div>
            )}

            {matchStep === 3 && (
              <div className="space-y-6">
                {/* Live simulation journey */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-emerald-400">যাত্রা চলমান (Ride in Progress)</h3>
                  <p className="text-[10px] text-[var(--pm-text-secondary)] leading-relaxed mt-1">
                    আপনি একটি সুরক্ষিত ও লাইভ ট্র্যাকড রাইডের ভেতর আছেন। শুভ যাত্রা!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] space-y-2 text-left text-[10px]">
                  <div className="flex justify-between items-center text-[var(--pm-text-secondary)] border-b border-[var(--pm-border)]/50 pb-2">
                    <span>শুরু:</span>
                    <span className="font-extrabold text-white truncate max-w-[170px]">{pickup}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--pm-text-secondary)] border-b border-[var(--pm-border)]/50 pb-2">
                    <span>গন্তব্য:</span>
                    <span className="font-extrabold text-white truncate max-w-[170px]">{destination}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--pm-accent)] font-bold">মোট ভাড়া:</span>
                    <span className="text-xs font-black text-[var(--pm-accent)]">৳{calculatedFare.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSearching(false);
                    setMatchStep(0);
                    addNotification('আরামদায়ক রাইডের জন্য ধন্যবাদ! পাইকার মার্টের সাথে থাকুন।', 'success');
                  }}
                  className="w-full py-3 bg-[var(--pm-accent)] hover:opacity-95 text-white font-extrabold text-xs rounded-full transition-transform active:scale-95"
                >
                  রাইড সম্পন্ন করুন
                </button>
              </div>
            )}

            {/* Cancel Match booking button */}
            {matchStep < 3 && (
              <button
                onClick={handleCancelRide}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 font-extrabold text-xs rounded-full transition-colors mt-2"
              >
                রাইড বাতিল করুন
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RideHome;
