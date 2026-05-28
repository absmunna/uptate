import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ShieldCheck, Landmark, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[var(--pm-surface)] border-t border-[var(--pm-border)] mt-auto py-12 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Social trust */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">
            Paikar<span className="text-[var(--pm-accent)]">Mart</span>
          </h2>
          <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed font-semibold">
            বাংলাদেশের প্রথম ও বৃহত্তম সোশ্যাল কমার্স সুপার অ্যাপ। হকার্স মার্কেট, চকবাজার ও কেরানীগঞ্জের পাইকারি রেট এখন সারা বাংলাদেশে সরাসরি হোম ডেলিভারি।
          </p>
          <div className="flex gap-3 pt-1">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[var(--pm-text-secondary)] hover:text-[var(--pm-accent)] hover:border-[var(--pm-accent)]/20 cursor-pointer transition-all">
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
          
          {/* Trust Escrow Badge */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 max-w-[240px]">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">100% Escrow Secured trade</span>
          </div>
        </div>

        {/* Dynamic Navigation Column & Rules */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-[var(--pm-text)] uppercase text-xs tracking-widest text-[var(--pm-accent)]">গ্রাহক গাইডলাইন</h3>
          <ul className="space-y-2.5 text-xs text-[var(--pm-text-secondary)] font-semibold">
            <li><NavLink to="/faq" className="hover:text-[var(--pm-accent)] transition-colors">❓ সাধারণ জিজ্ঞাসা (FAQ)</NavLink></li>
            <li><NavLink to="/qna" className="hover:text-[var(--pm-accent)] transition-colors">💬 পণ্য ও সোর্সিং ফোরাম (Q&A)</NavLink></li>
            <li><NavLink to="/terms" className="hover:text-[var(--pm-accent)] transition-colors">📜 শর্তাবলী ও গোপনীয়তা নীতি</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-[var(--pm-accent)] transition-colors">✉️ কাস্টমার সাপোর্ট টিকেট</NavLink></li>
          </ul>
        </div>

        {/* Merchant & Seller Corner */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-[var(--pm-text)] uppercase text-xs tracking-widest text-[var(--pm-accent)]">হোলসেলার ও মার্চেন্ট</h3>
          <ul className="space-y-2.5 text-xs text-[var(--pm-text-secondary)] font-semibold">
            <li><NavLink to="/become-seller" className="hover:text-[var(--pm-accent)] transition-colors">🏢 নতুন বিক্রেতা অ্যাকাউন্ট খুলুন</NavLink></li>
            <li><NavLink to="/seller-rules" className="hover:text-[var(--pm-accent)] transition-colors">⚖️ বিক্রেতার নিয়মনীতি ও জরিমানা</NavLink></li>
            <li><span className="text-white/30 cursor-not-allowed">🚚 যৌথ শিপিং হাব সংযোগ (Coming Soon)</span></li>
            <li><span className="text-white/30 cursor-not-allowed">📊 বাল্ক বায়ার রিক্রুটমেন্ট (B2B)</span></li>
          </ul>
        </div>

        {/* Comprehensive Physical Hubs coordinates in Bangladesh */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-[var(--pm-text)] uppercase text-xs tracking-widest text-[var(--pm-accent)]">পাইকারি বাজার ও অফিস সমূহ</h3>
          <div className="space-y-3 text-xs text-[var(--pm-text-secondary)] font-semibold">
            <div className="flex gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black">ঢাকা মেইন হাব (চকবাজার)</strong>
                <span className="text-[10px] text-[var(--pm-text-muted)] block mt-0.5">রয়েল প্লাজা, চকবাজার হকার্স মার্কেট, ঢাকা-১২১১</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black">গার্মেন্টস সোর্সিং হাব (কেরানীগঞ্জ)</strong>
                <span className="text-[10px] text-[var(--pm-text-muted)] block mt-0.5">আল-মদিনা টাওয়ার, পূর্ব নয়াবাজার, ঢাকা</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Payment Partners Integration Seals */}
      <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-[var(--pm-border)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-[10px] text-[var(--pm-text-muted)] uppercase tracking-widest font-black">Authorized Payment Partners</p>
          <div className="flex flex-wrap items-center gap-4 mt-2.5">
            <span className="text-[10px] px-2 py-1 bg-pink-500/10 text-pink-500 rounded border border-pink-500/15 font-black">bKash</span>
            <span className="text-[10px] px-2 py-1 bg-orange-500/10 text-orange-500 rounded border border-orange-500/15 font-black">Nagad</span>
            <span className="text-[10px] px-2 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/15 font-black">uCash</span>
            <span className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/15 font-black">SSL Commerz Card</span>
          </div>
        </div>

        <div className="text-center md:text-right text-[10px] text-[var(--pm-text-muted)] font-semibold max-w-md leading-relaxed">
          &copy; {new Date().getFullYear()} Paikar Mart Super App. গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ মেনে নিবন্ধিত। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
};

