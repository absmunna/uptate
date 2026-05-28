import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Ship, Coins, MapPin, Calculator, ShieldCheck, 
  Sparkles, Sliders, ArrowRightLeft, User, Factory, Heart, 
  HelpCircle, PlusCircle, CheckCircle2, ShoppingCart, TrendingUp, Info
} from 'lucide-react';
import { useAuthStore } from '../../modules/auth/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { calculateLogisticsCost } from '../../services/logisticsService';
import { convertCurrency } from '../../services/multiCurrencyService';
import { NegotiationPanel } from '../../components/social/NegotiationPanel';
import { PortalHero } from '../../components/ui/PortalHero';

// Model definition for wholesale bulk goods
interface WholesaleItem {
  id: string;
  name: string;
  category: string;
  minPriceUsd: number; // base price in USD
  moq: number;
  stock: number;
  image: string;
  sellerName: string;
  originalPrice: string;
}

const WHOLESALE_ITEMS: WholesaleItem[] = [
  {
    id: 'ws-1',
    name: 'প্যাকিং মাস্টার এক্সপোর্ট কোয়ালিটি বিটুবি কার্টন (১০ কেজি ক্যাপাসিটি)',
    category: 'Packaging & Box',
    minPriceUsd: 1.5,
    moq: 100,
    stock: 50000,
    image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=200&auto=format&fit=crop&q=80',
    sellerName: 'Acme Packaging Ltd.',
    originalPrice: '৳ ২০০'
  },
  {
    id: 'ws-2',
    name: 'ডেকোরেটিভ জুট ফাইবার শপিং ব্যাগ (হ্যান্ডমেড এক্সপোর্ট লট)',
    category: 'Eco Merchandise',
    minPriceUsd: 3.2,
    moq: 50,
    stock: 12000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    sellerName: 'Golden Fiber BD',
    originalPrice: '৳ ৪০০'
  },
  {
    id: 'ws-3',
    name: 'প্রিমিয়াম ১০০% কটন গ্যাবার্ডিন ফেব্রিক্স (স্পেশাল গার্মেন্টস রোল)',
    category: 'Apparel Fabric',
    minPriceUsd: 4.5,
    moq: 200,
    stock: 8500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80',
    sellerName: 'Ananta Textiles',
    originalPrice: '৳ ৫৫০'
  },
  {
    id: 'ws-4',
    name: 'হোলসেল ফুড-গ্রেড সিলিকন মোন্ডস (মাল্টি-ডিজাইন লট)',
    category: 'Kitchenware Manufactures',
    minPriceUsd: 2.1,
    moq: 40,
    stock: 15000,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&auto=format&fit=crop&q=80',
    sellerName: 'Matrix Molders',
    originalPrice: '৳ ২৫০'
  }
];

export const B2BHub = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // B2B Dynamic States
  const [activeTab, setActiveTab] = useState<'marketplace' | 'logistics' | 'factory' | 'currency'>('marketplace');
  const [currency, setCurrency] = useState<'BDT' | 'USD' | 'EUR'>('BDT');
  
  // Logistics calculations state
  const [distance, setDistance] = useState<number>(35);
  const [weight, setWeight] = useState<number>(20);
  
  // Bargaining / Bargainer state
  const [bargainedItem, setBargainedItem] = useState<WholesaleItem | null>(null);

  // Quick simulation role changer helper
  const handleRoleChange = (role: 'buyer' | 'wholesaler' | 'factory_owner' | 'admin') => {
    updateProfile({ role: role as any });
    addNotification(`সফলভাবে রোল পরিবর্তন হয়েছে: ${role.toUpperCase()}`, 'success');
  };

  const currentLogisticsCost = calculateLogisticsCost(distance, weight);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] p-4 sm:p-6 pb-24">
      {/* 1. B2B Wholesale Portal Hero */}
      <PortalHero 
        title="B2B Wholesale Hub"
        subtitle="Connect directly with manufacturers, factory owners, and large scale wholesalers. Negotiation bot enabled for bulk deals."
        badge="Direct Factory Sourcing"
        image="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop"
        ctaText="Become a Wholesaler"
        onCtaClick={() => navigate('/become-seller')}
        gradient="from-blue-950 via-[#101322] to-transparent"
      />

      {/* Role Switcher (Moved below hero for testing context) */}
      <div className="mt-4 p-4 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <User className="w-5 h-5 text-orange-400" />
           </div>
           <div>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">Current Identity</span>
              <span className="text-sm font-black text-white uppercase tracking-tighter">{user?.role || 'buyer'}</span>
           </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'buyer', label: 'Buyer' },
            { id: 'wholesaler', label: 'Wholesaler' },
            { id: 'factory_owner', label: 'Factory' },
            { id: 'admin', label: 'Admin' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id as any)}
              className={`text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest transition-all active:scale-95 ${
                user?.role === r.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-white/5 mb-6 overflow-x-auto hide-scrollbar gap-2 p-1 bg-white/5 rounded-2xl">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'marketplace'
              ? 'bg-[#1f2833] text-white border-b-2 border-orange-500 shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" /> হোলসেল প্রোডাক্ট বাজার
        </button>
        <button
          onClick={() => setActiveTab('factory')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'factory'
              ? 'bg-[#1f2833] text-white border-b-2 border-orange-500 shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Factory className="w-4 h-4" /> ফ্যাক্টরি হাব & রেজিস্ট্রেশন
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'logistics'
              ? 'bg-[#1f2833] text-white border-b-2 border-orange-500 shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" /> লজিস্টিকস হিসাব
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'currency'
              ? 'bg-[#1f2833] text-white border-b-2 border-orange-500 shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> মাল্টি-কারেন্সি ক্যালকুলেশন
        </button>
      </div>

      {/* Dynamic Content Switching Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1f2833]/40 border border-white/5 rounded-3xl p-6 shadow-2xl"
        >
          {/* Marketplace B2B Panel */}
          {activeTab === 'marketplace' && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" /> বাল্ক বায়ার শোরুম
                  </h3>
                  <p className="text-xs text-white/50">এখানে সরাসরি নিগোশিয়েট (দরদাম) বট ব্যবহার করে আপনার কাস্টম লট ফিক্সড করতে পারেন!</p>
                </div>

                {/* Local Currency Selector */}
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shrink-0 self-end">
                  {(['BDT', 'USD', 'EUR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${
                        currency === curr
                          ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/10'
                          : 'text-white/50 border-transparent hover:text-white'
                      }`}
                    >
                      {curr === 'BDT' ? '৳ BDT' : curr === 'USD' ? '$ USD' : '€ EUR'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wholesale Items Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WHOLESALE_ITEMS.map((item) => {
                  // Standard Conversion display price
                  // MinPriceUsd defaults in USD context (1.5, 3.2, etc.)
                  const finalAmount = currency === 'USD' 
                    ? item.minPriceUsd 
                    : convertCurrency(item.minPriceUsd, 'USD', currency);

                  const formattedPrice = currency === 'BDT' 
                    ? `৳ ${finalAmount.toFixed(1)} / পিস` 
                    : currency === 'EUR'
                      ? `€ ${finalAmount.toFixed(2)} / pc`
                      : `$ ${finalAmount.toFixed(2)} / pc`;

                  return (
                    <div 
                      key={item.id}
                      className="bg-black/40 border border-white/5 rounded-2xl p-4.5 flex gap-4 hover:border-orange-500/20 hover:bg-black/60 transition-all group"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-xl border border-white/5 shadow-md" 
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/15 font-bold">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-white/40 font-bold truncate">Supplier: {item.sellerName}</span>
                          </div>
                          
                          <h4 className="text-xs sm:text-sm font-black text-white hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                            {item.name}
                          </h4>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/5 pt-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-white/40 font-bold leading-none uppercase mb-1">MOQ: {item.moq} পিস</span>
                            <span className="text-sm font-black text-orange-400">{formattedPrice}</span>
                          </div>

                          <div className="flex gap-1.5 shrink-0">
                            {/* Negotiation Trigger button */}
                            <button
                              onClick={() => setBargainedItem(item)}
                              className="px-3.5 py-2 rounded-xl bg-orange-600/95 hover:bg-orange-500 text-white text-[11px] font-black tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/15 active:scale-95 group-hover:animate-pulse"
                            >
                              <Coins className="w-3.5 h-3.5" /> দরদাম ও ক্রয় করুন
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guard Portal Redirect Cards if WHOLESALER/ADMIN */}
              <div className="mt-8 p-5 bg-[#171a25]/60 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">বিটুবি সেলার ড্যাশবোর্ড প্রোডাক্ট ম্যানেজমেন্ট</h4>
                    <p className="text-xs text-white/50">আপনার নিজস্ব বাল্ক সরবরাহকারী অ্যাকাউন্ট থাকলে সরাসরি পণ্য যোগ এবং ট্র্যাক করুন।</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (user?.role === 'wholesale' || user?.role === 'admin') {
                        navigate('/wholesale/manage-products');
                      } else {
                        addNotification('এই পৃষ্ঠা অ্যাক্সেস করার জন্য আপনার Wholesale রোল প্রয়োজন। অনুগ্রহ করে সিমুলেটর থেকে রোল পরিবর্তন করুন!', 'warning');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-black rounded-xl border border-blue-500 shadow-md transition-all active:scale-95 text-center whitespace-nowrap"
                  >
                    পণ্যসমূহ পরিচালনা (Manage Products)
                  </button>
                  <button
                    onClick={() => {
                        if (user?.role === 'wholesale' || user?.role === 'admin') {
                          navigate('/wholesale');
                        } else {
                          addNotification('আপনার Wholesale বা Admin রোল প্রয়োজন। অনুগ্রহ করে সিমুলেটর থেকে রোল পরিবর্তন করুন!', 'warning');
                        }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl border border-white/5 transition-all active:scale-95 text-center whitespace-nowrap"
                  >
                    হোলসেল হোম
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Factory Module Portal */}
          {activeTab === 'factory' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Factory className="w-5 h-5 text-indigo-400" /> ইন্টারন্যাশনাল শিপমেন্ট ও ফ্যাক্টরি প্রো-ডোর
                </h3>
                <p className="text-xs text-white/50">ডিরেক্ট মিল এবং বিগ ম্যানুফ্যাকচারারদের ট্রেড ডেক হাব। এক্সপোর্ট-ইম্পোর্ট এবং আন্তর্জাতিক বাণিজ্যের সমন্বয়শালা।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Registration Card */}
                <div className="bg-gradient-to-br from-[#121422] to-[#151a35] border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 w-fit mb-4">
                      <Ship className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black text-white mb-2">গ্লোবাল ফ্যাক্টরি ট্রেডার রেজিস্ট্রেশন</h4>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">
                      আপনি কি একজন ফ্যাক্টরি মালিক বা ইন্ডাস্ট্রিয়াল সাপ্লায়ার? আপনার বিজনেস ভেরিফাই করতে এক্সপোর্ট লাইসেন্স কপি এবং আন্তর্জাতিক সাপ্লাই সার্টিফিকেট আপলোড করে আজই আবেদন করুন।
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (user?.role === 'factory' || user?.role === 'admin') {
                          navigate('/factory/register');
                        } else {
                          addNotification('ফ্যাক্টরি রেজিস্ট্রেশন অ্যাক্সেস করতে অনুগ্রহ করে টেস্টিং প্যানেলে আপনার রোল "Factory" এ সেট করুন!', 'warning');
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <PlusCircle className="w-4 h-4" /> রেজিস্ট্রেশন পেজ এ যান
                    </button>
                    
                    <button
                      onClick={() => {
                        if (user?.role === 'factory' || user?.role === 'admin') {
                          navigate('/factory');
                        } else {
                          addNotification('ফ্যাক্টরি ড্যাশবোর্ড অ্যাক্সেস করতে অনুগ্রহ করে আপনার রোল "Factory" এ সেট করুন!', 'warning');
                        }
                      }}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-xs rounded-xl transition-all"
                    >
                      ফ্যাক্টরি হোম ও ট্র্যাকার
                    </button>
                  </div>
                </div>

                {/* Simulated Supply List Section */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
                  <h4 className="text-sm font-black text-white flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ভেরিফাইড ফ্যাক্টরি লট (Direct From Mill)
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'ঢাকা ক্যান্ডল ফেজ ও ফ্লাস্ক ফ্যাক্টরি', city: 'সাভার বিসিক (Savar BSCIC)', cap: '৫০কে পিস/ডেইলি', status: 'ভেরিফাইড সাপ্লায়ার' },
                      { name: 'চট্টগ্রাম গার্মেন্টস এক্সেসরিজ করপোরেশন', city: 'ইপিজেড এলাকা (EPZ Zone)', cap: '২০মেট্রিক টন লট', status: 'এক্সপোর্ট উইং' }
                    ].map((fac, i) => (
                      <div key={i} className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-white">{fac.name}</p>
                          <span className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-400" /> {fac.city}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">{fac.status}</span>
                          <p className="text-[9px] font-semibold text-white/40 mt-1">ক্যাপাসিটি: {fac.cap}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logistics Cost Calculator Panel */}
          {activeTab === 'logistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-400" /> হোলসেল ডিস্ট্রিবিউশন লজিস্টিকস হিসাব
                  </h3>
                  <p className="text-xs text-white/50">পণ্য পাঠানোর দূরত্ব এবং অর্ডারের ট্রেইল ওজন ব্যবহার করে এক্সক্লুসিভ ডেলিভারি খরচ প্রাক-নির্ধারণ করুন।</p>
                </div>

                {/* Distance range controller slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white">ডেলিভারি দূরত্ব (Distance):</label>
                    <span className="text-orange-400 font-mono font-black">{distance} কিমি (km)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value))}
                    className="w-full bg-black/40 accent-orange-500 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-bold">
                    <span>১ কিমি</span>
                    <span>৫০০ কিমি (আন্তঃজেলা)</span>
                  </div>
                </div>

                {/* Weight slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-white">মোট চালান ওজন (Total Weight):</label>
                    <span className="text-orange-400 font-mono font-black">{weight} কেজি (kg)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full bg-black/40 accent-orange-500 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-bold">
                    <span>১ কেজি</span>
                    <span>১০০০ কেজি (১ টন)</span>
                  </div>
                </div>
              </div>

              {/* Graphical calculation block output */}
              <div className="p-6 bg-gradient-to-br from-[#121422] to-[#1a233c] border border-white/5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-wider mb-4 border border-orange-500/20">
                    <Calculator className="w-3.5 h-3.5" /> আনুমানিক ডেলিভারি বিলিং রশিদ
                  </div>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-white/60">প্রাথমিক বেস রেট (Distance Rate):</span>
                      <span className="font-mono text-white">৳ {distance * 2}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-white/60">ওজন রেট (৳১/কেজি):</span>
                      <span className="font-mono text-white">৳ {weight * 1}</span>
                    </div>
                    <div className="flex justify-between items-center font-extrabold text-sm text-white pt-2">
                      <span className="text-orange-400 font-black">সর্বমোট আনুমানিক লজিস্টিকস চার্জ:</span>
                      <span className="font-mono text-xl text-orange-500 font-extrabold">৳ {currentLogisticsCost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/60 leading-snug">
                    দ্রষ্টব্য: এই লজিস্টিকস হিসাবটি রিটেইল বা পাইকারি পণ্যের দূরত্ব-ওজন ফর্মুলায় চালিত এবং লোকাল বিটুবি লজিস্টিকস পার্টনারদের সাথে সমন্বিত।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Multi-Currency System */}
          {activeTab === 'currency' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-400" /> মাল্টি-কারেন্সি স্পেশাল এক্সচেঞ্জ পোর্টাল
                </h3>
                <p className="text-xs text-white/50">আন্তর্জাতিক এলসি (L/C) এবং বাল্ক ট্রেডিং-এর জন্য বৈদেশিক মুদ্রা রূপান্তর সহজতর করতে রিয়েল-টাইম হিসাব করুন।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                  <p className="text-xs font-black text-white uppercase tracking-wider text-white/50">কারেন্সি এক্সচেঞ্জ রেট চার্ট</p>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-white">১ ইউএস ডলার (1 USD)</span>
                      <span className="font-mono text-orange-400 font-extrabold">১১৮.০০ বিডিটি (BDT)</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-white">১ ইউরো (1 EUR)</span>
                      <span className="font-mono text-orange-400 font-extrabold">১২৮.২৬ বিডিটি (BDT)</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-bold text-white">১ ইউএস ডলার (1 USD)</span>
                      <span className="font-mono text-orange-400 font-extrabold">০.৯২ ইউরো (EUR)</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-[#121422] to-[#1f173c] border border-white/5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase mb-3">আমদানি ও রপ্তানি পেমেন্ট সুবিধা</h4>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">
                      পায়কার মার্ট গ্লোবাল উইং-এর মাধ্যমে হোলসেল চালানের মূল্য আন্তর্জাতিক ডলারে কিংবা কাস্টম লোকাল ব্যাংক ওয়ালেটের মাধ্যমে এক্সচেঞ্জ করা যায়।
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => addNotification('সুবিধাজনক ইন্টারন্যাশনাল ব্যাংক একসেস সংযুক্ত করা হয়েছে!', 'success')} 
                    className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md"
                  >
                    ইন্টারন্যাশনাল ট্রানজেকশন প্রপোজাল
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Embedded direct price bargainer popup portal if items are active */}
      <AnimatePresence>
        {bargainedItem && (
          <NegotiationPanel 
            post={{
              id: bargainedItem.id,
              sellerName: bargainedItem.sellerName,
              content: bargainedItem.name,
              price: bargainedItem.originalPrice,
              originalPrice: bargainedItem.originalPrice,
              image: bargainedItem.image,
              type: 'Wholesale'
            }}
            onClose={() => setBargainedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
