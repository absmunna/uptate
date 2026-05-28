import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, ShieldCheck, Star, Clock, User, 
  Layers, CheckCircle, HelpCircle, Briefcase, ChevronRight 
} from 'lucide-react';
import { useNotificationStore } from '../../../store/notificationStore';

interface DigitalService {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviewsCount: number;
  price: number;
  priceType: 'hourly' | 'fixed';
  category: string;
  image: string;
  features: string[];
}

const CATEGORIES = [
  { id: 'all', label: 'সব ক্যাটাগরি' },
  { id: 'it', label: 'আইটি সাপোর্ট' },
  { id: 'design', label: 'ডিজাইন ও গ্রাফিক্স' },
  { id: 'dev', label: 'ওয়েব ও সফটওয়্যার' },
  { id: 'education', label: 'অনলাইন টিউটরিং' },
  { id: 'marketing', label: 'ডিজিটাল মার্কেটিং' }
];

const MOCK_SERVICES: DigitalService[] = [
  {
    id: 'ds-1',
    title: 'ওয়ার্ডপ্রেস ওয়েবসাইট স্পিড অপ্টিমাইজেশন',
    provider: 'রনি হাসান (ওয়েব ডেভ স্পেশালিস্ট)',
    rating: 4.9,
    reviewsCount: 124,
    price: 1500,
    priceType: 'fixed',
    category: 'dev',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    features: ['স্পিড অপ্টিমাইজেশন (৯০+ স্কোর)', 'মোবাইল ফ্রেন্ডলি সেটআপ', 'ডাটাবেস ক্লিন-আপ', '৩ মাসের ফ্রি ব্যাকআপ সাপোর্ট']
  },
  {
    id: 'ds-2',
    title: 'লোগো এবং ব্রান্ড ম্যানুয়াল ডিজাইন',
    provider: 'ফারহানা ইয়াসমিন (ক্রিয়েটিভ ডিজাইনার)',
    rating: 4.8,
    reviewsCount: 86,
    price: 2500,
    priceType: 'fixed',
    category: 'design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    features: ['৩টি ইউনিক কনসেপ্ট', 'আনলিমিটেড রিভিশন', 'ভেক্টর সোর্স ফাইলস', 'ব্র্যান্ড কালার গাইডলাইন']
  },
  {
    id: 'ds-3',
    title: 'অনলাইন এইচএসসি আইসিটি (ICT) একাডেমিক টিউটরিং',
    provider: 'প্রকৌশলী সাজ্জাদ রহমান',
    rating: 5.0,
    reviewsCount: 42,
    price: 1200,
    priceType: 'hourly',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop',
    features: ['সি প্রোগ্রামিং ও এইচটিএমএল স্পেশাল ক্লাস', 'অধ্যায়ভিত্তিক ওয়ান-টু-ওয়ান গাইড', 'পিডিএফ নোট ও সাজেশনস']
  },
  {
    id: 'ds-4',
    title: 'সোশ্যাল মিডিয়া বিজনেস ফানেল এবং অ্যাড ক্যাম্পেইন',
    provider: 'আরিফ আহমেদ (ডিজিটাল মার্কেটার)',
    rating: 4.7,
    reviewsCount: 95,
    price: 3000,
    priceType: 'fixed',
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    features: ['টার্গেটেড অডিয়েন্স রিসার্চ', 'বিজ্ঞাপন কপি রাইটিং', 'পিক্সেল এবং ট্র্যাকিং সেটআপ', '৭ দিনের রিপোর্ট মনিটরিং']
  },
  {
    id: 'ds-5',
    title: 'উইন্ডোজ/ল্যাপটপ রিমোট ব্লু-স্ক্রিন ও সিস্টেম ফিক্স',
    provider: 'আইটি হাব টিম বাংলাদেশ',
    rating: 4.6,
    reviewsCount: 156,
    price: 500,
    priceType: 'fixed',
    category: 'it',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
    features: ['ড্রাইভার ও সফটওয়্যার কনফ্লিক্ট সলিউশন', 'অ্যান্টিভাইরাস ও ম্যালওয়্যার দূরীকরণ', 'অনলাইন অ্যানিডেস্ক/টিমভিউয়ার সাপোর্ট']
  }
];

export default function DigitalServicesHome() {
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<DigitalService | null>(null);
  const [bookingDetails, setBookingDetails] = useState({ requirements: '', contactNo: '', scheduledDate: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredServices = MOCK_SERVICES.filter(service => {
    const matchSearch = service.title.toLowerCase().includes(search.toLowerCase()) || 
                        service.provider.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.contactNo || !bookingDetails.scheduledDate) {
      addNotification('দয়া করে মোবাইল নম্বর এবং পছন্দের তারিখ ইনপুট দিন', 'error');
      return;
    }
    setIsSuccess(true);
  };

  const closeBookingFlow = () => {
    setSelectedService(null);
    setBookingDetails({ requirements: '', contactNo: '', scheduledDate: '' });
    setIsSuccess(false);
  };

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] relative">
      {/* Dynamic Navigation Header */}
      <div className="flex items-center gap-3 px-3 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight">🛠️ Digital Services</h1>
          <p className="text-[11px] text-[var(--pm-text-secondary)]">ভেরিফাইড ফ্রিল্যান্সার ও আইটি ওয়ান-স্টপ সলিউশন</p>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="px-3 mb-4">
        <div 
          className="flex items-center gap-2 rounded-2xl px-3.5 py-3 border shadow-sm transition-all focus-within:ring-2 focus-within:ring-[var(--pm-accent)]"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input 
            type="text" 
            placeholder="সার্ভিস বা সার্ভিস প্রোভাইডার খুজুন..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" 
          />
        </div>
      </div>

      {/* Scrollable Category Filter */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-3 hide-scrollbar">
        {CATEGORIES.map(category => (
          <button 
            key={category.id} 
            onClick={() => setSelectedCategory(category.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all"
            style={selectedCategory === category.id
              ? { background: 'var(--pm-accent)', color: '#fff', borderColor: 'var(--pm-accent)' }
              : { background: 'var(--pm-surface)', color: 'var(--pm-text-secondary)', borderColor: 'var(--pm-border)' }
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="px-3 space-y-4">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl">
            <Layers className="w-10 h-10 mx-auto text-[var(--pm-text-secondary)] opacity-40 mb-3" />
            <p className="text-sm font-semibold text-[var(--pm-text-secondary)]">কোনো ডিজিটাল সার্ভিস খুঁজে পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredServices.map(service => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border overflow-hidden flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
            >
              <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                <img 
                  referrerPolicy="no-referrer"
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-white font-bold">{service.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--pm-text)] leading-tight mb-1 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[var(--pm-text-secondary)] flex items-center gap-1.5 mb-3">
                    <User className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    {service.provider}
                  </p>
                  
                  {/* Highlighted Service Features */}
                  <div className="space-y-1 mb-4">
                    {service.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[var(--pm-text-secondary)]">
                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--pm-border)] mt-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--pm-text-secondary)]">সার্ভিস ফি</span>
                    <p className="text-base font-black text-[var(--pm-accent)]">
                      ৳{service.price.toLocaleString('bn-BD')}
                      <span className="text-[10px] font-medium text-[var(--pm-text-secondary)]">
                        /{service.priceType === 'hourly' ? 'ঘণ্টা' : 'ফিক্সড'}
                      </span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="bg-[var(--pm-accent)] text-white text-xs font-bold px-4 py-2 hover:bg-orange-600 transition-all rounded-xl active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    বিস্তারিত দেখুন <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Booking Drawer / Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={closeBookingFlow} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[480px] rounded-t-[32px] p-5 shadow-2xl border-t flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)', maxHeight: '90dvh' }}
            >
              {/* Handlebar */}
              <div className="w-12 h-1 bg-[var(--pm-border)] rounded-full mx-auto mb-4" />

              {!isSuccess ? (
                <form onSubmit={handleBookService} className="flex-1 flex flex-col overflow-y-auto pb-6 hide-scrollbar">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-orange-500/10 text-[var(--pm-accent)] border border-orange-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        আইটি গিগ বুকিং
                      </span>
                      <h2 className="text-base font-extrabold text-[var(--pm-text)] tracking-tight mt-1">
                        {selectedService.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Provider Detail */}
                    <div className="p-3.5 rounded-2xl flex items-center justify-between border" style={{ background: 'var(--pm-bg)', borderColor: 'var(--pm-border)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--pm-accent)]/10 flex items-center justify-center text-xs font-bold text-[var(--pm-accent)]">
                          {selectedService.provider.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--pm-text)]">{selectedService.provider}</p>
                          <p className="text-[10px] text-[var(--pm-text-secondary)]">ভেরিফাইড পাতিদার ফ্রিল্যান্সার</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-[var(--pm-accent)]">৳{selectedService.price.toLocaleString('bn-BD')}</p>
                        <p className="text-[9px] text-[var(--pm-text-secondary)] uppercase">{selectedService.priceType === 'hourly' ? 'ঘণ্টা প্রতি' : 'ফিক্সড বাজেট'}</p>
                      </div>
                    </div>

                    {/* Features list */}
                    <div>
                      <p className="text-[11px] font-bold text-[var(--pm-text)] mb-2">সার্ভিসটিতে যা যা থাকছে:</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {selectedService.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[var(--pm-text-secondary)] bg-[var(--pm-bg)]/40 px-3 py-2 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--pm-text-secondary)] mb-1">আপনার প্রয়োজনীয় বিষয়সমূহ (যদি থাকে)</label>
                        <textarea 
                          rows={2}
                          value={bookingDetails.requirements}
                          onChange={e => setBookingDetails({ ...bookingDetails, requirements: e.target.value })}
                          placeholder="আপনার রিকোয়ারমেন্ট, লোগো নাম বা থিম এর লিংক দিন..."
                          className="w-full text-xs p-3 rounded-xl border bg-[var(--pm-bg)] outline-none text-[var(--pm-text)] focus:border-[var(--pm-accent)]"
                          style={{ borderColor: 'var(--pm-border)' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--pm-text-secondary)] mb-1">যোগাযোগ মোবাইল নম্বর *</label>
                          <input 
                            type="tel" 
                            required
                            value={bookingDetails.contactNo}
                            onChange={e => setBookingDetails({ ...bookingDetails, contactNo: e.target.value })}
                            placeholder="+88017XXXXXXXX"
                            className="w-full text-xs p-3 rounded-xl border bg-[var(--pm-bg)] outline-none text-[var(--pm-text)] focus:border-[var(--pm-accent)]"
                            style={{ borderColor: 'var(--pm-border)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[var(--pm-text-secondary)] mb-1">পছন্দের ডেলিভারি তারিখ *</label>
                          <input 
                            type="date" 
                            required
                            value={bookingDetails.scheduledDate}
                            onChange={e => setBookingDetails({ ...bookingDetails, scheduledDate: e.target.value })}
                            className="w-full text-xs p-3 rounded-xl border bg-[var(--pm-bg)] outline-none text-[var(--pm-text)] focus:border-[var(--pm-accent)] input-calendar-white"
                            style={{ borderColor: 'var(--pm-border)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button 
                      type="button"
                      onClick={closeBookingFlow}
                      className="flex-1 border bg-transparent text-[var(--pm-text)] py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer"
                      style={{ borderColor: 'var(--pm-border)' }}
                    >
                      বাতিল করুন
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-[var(--pm-accent)] hover:bg-orange-600 text-white py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      বুক নিশ্চিত করুন
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-500">বুকিং রিকোয়েস্ট সফল হয়েছে!</h3>
                  <p className="text-xs text-[var(--pm-text-secondary)] mt-2 max-w-xs mx-auto">
                    আমাদের এক্সপার্ট ফ্রিল্যান্সার <strong className="text-[var(--pm-text)]">{selectedService.provider}</strong> খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                  </p>

                  <div className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-4 w-full text-left my-5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--pm-text-secondary)]">বুকড গিগ:</span>
                      <span className="font-bold text-[var(--pm-text)] text-right max-w-[200px] truncate">{selectedService.title}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--pm-text-secondary)]">মোবাইল নম্বর:</span>
                      <span className="font-mono font-semibold text-[var(--pm-text)]">{bookingDetails.contactNo}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--pm-text-secondary)]">ডেলিভারি ডেমো টার্গেট:</span>
                      <span className="font-bold text-[var(--pm-accent)]">{bookingDetails.scheduledDate}</span>
                    </div>
                  </div>

                  <button 
                    onClick={closeBookingFlow}
                    className="w-full bg-[var(--pm-accent)] hover:bg-orange-600 text-white py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
