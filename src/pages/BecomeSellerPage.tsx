import React, { useState } from 'react';
import { ShieldCheck, Store, FileSpreadsheet, Sparkles, Building2, Landmark, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../modules/auth/store/authStore';

export default function BecomeSellerPage() {
  const { lang } = useAppStore();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('wholesale');
  const [tradeLicense, setTradeLicense] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [shopAddress, setShopAddress] = useState('');
  const [nid, setNid] = useState('');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Visual Step Stepper */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              step >= s
                ? 'bg-[var(--pm-accent)] text-white shadow-lg scale-110'
                : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border border-[var(--pm-border)]'
            }`}
          >
            {step > s ? '✓' : s}
          </div>
        ))}
      </div>

      {/* Main card box */}
      <div className="p-6 md:p-8 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pm-accent)]/5 blur-3xl rounded-full" />
        
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-wider">Step 1 of 3</span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">সেলার বা ব্যবসা রেজিস্ট্রেশন</h1>
              <p className="text-xs text-[var(--pm-text-muted)] mt-1">আপনার ব্যবসার সঠিক তথ্য দিয়ে শুরু করুন।</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-white/50">পেশাদার স্টোরের নাম</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="উদা: আরমান গার্মেন্টস, চকবাজার"
                  className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-[var(--pm-accent)] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-white/50">ব্যবসার ধরণ</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="p-3 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-white focus:border-[var(--pm-accent)] outline-none cursor-pointer"
                >
                  <option value="wholesale">পাইকারি দোকান (Wholesaler)</option>
                  <option value="retail">রিটেইল শপ (B2C Retailer)</option>
                  <option value="nearby">কাছের শপ (Nearby Physical Shop)</option>
                  <option value="homemade">হোম মেইড ফুড (Home Made)</option>
                  <option value="factory">ম্যানুফ্যাকচারার / ফ্যাক্টরি মালিক</option>
                </select>
              </div>

              {(businessType === 'nearby' || businessType === 'homemade' || businessType === 'retail') && (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase text-white/50">দোকান বা বাসার ঠিকানা (Real Address)</label>
                  <textarea
                    required
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="পুরো ঠিকানা দিন (রোড নাম্বার, এলাকা, জেলা)"
                    className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-[var(--pm-accent)] outline-none min-h-[80px]"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer hover:brightness-110"
            >
              পরবর্তী ধাপে যান
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-wider">Step 2 of 3</span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">ট্রেড লাইসেন্স ও আইডেন্টিটি ভেরিফিকেশন</h1>
              <p className="text-xs text-[var(--pm-text-muted)] mt-1">বাংলাদেশ সরকারের নীতিমালা অনুযায়ী আপনার বৈধ ব্যবসার তথ্যাদি দিন।</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-white/50">ট্রেড লাইসেন্স নাম্বার / ই-টিন নাম্বার</label>
                <input
                  type="text"
                  required
                  value={tradeLicense}
                  onChange={(e) => setTradeLicense(e.target.value)}
                  placeholder="উদা: TR-9876543-BD"
                  className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-[var(--pm-accent)] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-white/50">জাতীয় পরিচয়পত্র নাম্বার (NID)</label>
                <input
                  type="text"
                  required
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="উদা: ১৯৯৬২৬১৫৯৮৭৪৫৬"
                  className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-[var(--pm-accent)] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-white/5 text-[var(--pm-text)] rounded-xl text-xs font-black border border-white/10 hover:bg-white/10"
              >
                পিছনে
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer"
              >
                পরবর্তী ধাপে যান
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-wider">Step 3 of 3</span>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">ব্যাংক একাউন্ট ও সেটআপ সম্পন্ন করুন</h1>
              <p className="text-xs text-[var(--pm-text-muted)] mt-1">লেনদেন ও পেমেন্ট উইথড্র এর জন্য সঠিক ব্যাংক বিবরণ নিশ্চিত করুন।</p>
            </div>

            <div className="space-y-3 p-4 bg-slate-950/80 rounded-xl border border-white/5 text-xs text-white/70">
              <div className="flex gap-2 text-white font-extrabold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                আপনার সম্পূর্ণ ডাটার গোপনীয়তা সুরক্ষিত থাকবে
              </div>
              <p className="text-[10px] leading-relaxed">পাইকার মার্টের মডারেশন ও অডিট টিম আপনার আবেদনটি পুঙ্খানুপুঙ্খ তথ্য অনুযায়ী ২৪ ঘণ্টার মধ্যে ভেরিফাই করে শপের পারমিশন রিলিজ করে দেবে।</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-white/5 text-[var(--pm-text)] rounded-xl text-xs font-black border border-white/10"
              >
                পিছনে
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
              >
                {loading ? 'অনুমোদনের আবেদন পাঠানো হচ্ছে...' : 'আবেদন সাবমিট করুন'}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-6 transition-all animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">আবেদনটি সফলভাবে জমা হয়েছে!</h2>
              <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed max-w-md mx-auto">
                ধন্যবাদ, আপনার দোকান <span className="text-[var(--pm-accent)] font-extrabold">{shopName}</span> এর সেলার রেজিস্ট্রেশন আবেদন মুলতবি আছে। আমাদের মডারেশন টিম ২৪ ঘণ্টার মধ্যে ট্রেড ডকুমেন্টস যাচাই করে আপনার প্রো-সেলার ড্যাশবোর্ড একটিভ করে দেবে।
              </p>
            </div>

            <button
              onClick={() => window.location.href = '#/'}
              className="px-6 py-3 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-white font-black text-xs rounded-xl hover:bg-white/5 cursor-pointer"
            >
              মূল হোমপেজে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
