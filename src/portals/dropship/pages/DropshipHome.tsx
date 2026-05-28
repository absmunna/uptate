import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, ArrowLeft, Layers, Globe, Cpu, Flame, Check, Tag, Search,
  Layout, Eye, Rocket, ShoppingCart, Info, TrendingUp, AlertCircle, Edit, Ship, DollarSign
} from 'lucide-react';

interface InternationalProduct {
  id: string;
  name: string;
  sourceCountry: string;
  sourceFlag: string;
  sourcingPrice: number;
  suggestedRetail: number;
  image: string;
  shippingDays: string;
  category: string;
  isImported?: boolean;
}

const INTERNATIONAL_PRODUCTS: InternationalProduct[] = [
  {
    id: 'int-p1',
    name: 'Wireless Smart Bluetooth Earbuds (Active Noise Cancel)',
    sourceCountry: 'চীন (Guangzhou Hub)',
    sourceFlag: '🇨🇳',
    sourcingPrice: 1200,
    suggestedRetail: 2800,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    shippingDays: '৭-১২ দিন',
    category: 'ইলেকট্রনিক্স'
  },
  {
    id: 'int-p2',
    name: 'Premium Ceramic Water Dripper Coffee Set',
    sourceCountry: 'তুরস্ক (Istanbul Trade)',
    sourceFlag: '🇹🇷',
    sourcingPrice: 850,
    suggestedRetail: 1950,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
    shippingDays: '১০-১৫ দিন',
    category: 'গৃহস্থালি ও রান্নাঘর'
  },
  {
    id: 'int-p3',
    name: 'Sartorial Silk Traditional Dupatta Set',
    sourceCountry: 'ভারত (Kolkata Silk Hub)',
    sourceFlag: '🇮🇳',
    sourcingPrice: 650,
    suggestedRetail: 1500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
    shippingDays: '৪-৮ দিন',
    category: 'ফ্যাশন ও ক্লোথিং'
  },
  {
    id: 'int-p4',
    name: 'Ergonomic Memory Foam Sleep Pillow',
    sourceCountry: 'ভিয়েতনাম (Hanoi Foam works)',
    sourceFlag: '🇻🇳',
    sourcingPrice: 1100,
    suggestedRetail: 2400,
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&h=400&fit=crop',
    shippingDays: '৮-১২ দিন',
    category: 'বেডরুম ও লাইফস্টাইল'
  }
];

const THEME_PRESETS = [
  { id: 'sunset', label: 'Sunset Orange 🌅', bg: 'bg-gradient-to-tr from-amber-500 to-orange-600', primary: '#ff6b00', text: '#ffffff' },
  { id: 'ocean', label: 'Ocean Blue 🌊', bg: 'bg-gradient-to-tr from-cyan-500 to-blue-600', primary: '#0ea5e9', text: '#ffffff' },
  { id: 'forest', label: 'Forest Green 🌲', bg: 'bg-gradient-to-tr from-emerald-500 to-teal-700', primary: '#10b981', text: '#ffffff' },
  { id: 'cyber', label: 'Cyber Neon ⚡', bg: 'bg-gradient-to-tr from-purple-600 to-pink-600', primary: '#d946ef', text: '#ffffff' }
];

const TEMPLATE_BANNERS = [
  { id: 'b1', label: 'ফ্যাশন ও ট্রেন্ডস', title: 'Ultimate Lifestyle Collection', desc: 'স্মার্ট ফিউশন ও আন্তর্জাতিক প্রিমিয়াম ক্যাটাগরি!', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop' },
  { id: 'b2', label: 'গ্যাজেট কর্নার', title: 'Next-Gen Smart Gadgets', desc: 'স্মার্ট লাইফ সহজ করার সর্বাধুনিক বিদেশি প্রযুক্তি।', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&h=300&fit=crop' },
  { id: 'b3', label: 'মুদি ও বিউটি', title: 'Guaranteed Organic & Glow', desc: 'বিশ্বসেরা উপাদানে আকর্ষণীয় সোর্সিং কসমেটিকস।', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&h=300&fit=crop' }
];

export default function DropShipHome() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'builder' | 'sourcing' | 'orders'>('builder');

  // Shopify Page State Config
  const [storeTitle, setStoreTitle] = useState('স্মার্ট ডিলস বিডি (Smart Deals BD)');
  const [storeSubtitle, setStoreSubtitle] = useState('পেইকার মার্টের সরাসরি আমদানিকৃত সেরা বিদেশি কালেকশন');
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [selectedBanner, setSelectedBanner] = useState(TEMPLATE_BANNERS[0]);
  const [customInventory, setCustomInventory] = useState<InternationalProduct[]>([
    INTERNATIONAL_PRODUCTS[0],
    INTERNATIONAL_PRODUCTS[2]
  ]);

  // Deployment feedback
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  
  // Sourcing variables
  const [globalCatalog, setGlobalCatalog] = useState<InternationalProduct[]>(INTERNATIONAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Sourcing Import Handler
  const handleImport = (product: InternationalProduct) => {
    if (customInventory.some(p => p.id === product.id)) return;
    setCustomInventory(prev => [...prev, product]);
    
    // Animate import flag
    setGlobalCatalog(prev => prev.map(p => p.id === product.id ? { ...p, isImported: true } : p));
    setTimeout(() => {
      setGlobalCatalog(prev => prev.map(p => p.id === product.id ? { ...p, isImported: false } : p));
    }, 1500);
  };

  const handleRemoveInventory = (prodId: string) => {
    setCustomInventory(prev => prev.filter(p => p.id !== prodId));
  };

  const handleDeployStore = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      const randStr = Math.random().toString(36).substring(7);
      setDeployedUrl(`https://paikarmart.com/stores/pm-${randStr}`);
    }, 1800);
  };

  const filteredCatalog = globalCatalog.filter(p => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] relative">
      
      {/* Top Header Navigation */}
      <div className="flex items-center gap-3 px-3 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all cursor-pointer"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1.5 text-[var(--pm-text)]">
            <Ship className="w-5 h-5 text-emerald-500" /> ড্রপশিপিং পোর্টাল
          </h1>
          <p className="text-[11px] text-[var(--pm-text-secondary)]">নিজের শপ বানিয়ে গ্লোবাল পণ্য ১-ক্লিক এ রিটেইল করুন</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 px-3 mb-4">
        {[
          { id: 'builder', label: 'স্টোর বিল্ডার', icon: Layout },
          { id: 'sourcing', label: 'গ্লোবাল সোর্সিং', icon: Globe },
          { id: 'orders', label: 'ড্রপশিপ অর্ডার', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMenu(tab.id as any)}
            className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl border text-[10px] font-black transition-all cursor-pointer"
            style={activeMenu === tab.id
              ? { background: 'var(--pm-accent)', color: '#fff', borderColor: 'var(--pm-accent)' }
              : { background: 'var(--pm-surface)', color: 'var(--pm-text-secondary)', borderColor: 'var(--pm-border)' }
            }
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT SWITCHING */}
      <AnimatePresence mode="wait">
        {activeMenu === 'builder' && (
          <motion.div 
            key="builder-section"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-3 space-y-4"
          >
            {/* Shopify builder customizers */}
            <div className="p-4 border border-[var(--pm-border)] rounded-2xl space-y-3.5" style={{ background: 'var(--pm-surface)' }}>
              <div className="flex items-center gap-1.5 border-b border-[var(--pm-border)]/50 pb-2">
                <Edit className="w-4 h-4 text-[var(--pm-accent)]" />
                <h3 className="text-xs font-extrabold">স্টোর ল্যান্ডিং পেজ কাস্টমাইজেশন</h3>
              </div>

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-text-secondary)] text-left block">ল্যান্ডিং পেজ টাইটেল</label>
                <input 
                  type="text" 
                  value={storeTitle}
                  onChange={e => setStoreTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border bg-[var(--pm-bg)] text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  style={{ borderColor: 'var(--pm-border)' }}
                />
              </div>

              {/* Subtitle input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-text-secondary)] text-left block">সাবটাইটেল / স্লোগান</label>
                <input 
                  type="text" 
                  value={storeSubtitle}
                  onChange={e => setStoreSubtitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border bg-[var(--pm-bg)] text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  style={{ borderColor: 'var(--pm-border)' }}
                />
              </div>

              {/* Themes preset selection */}
              <div>
                <label className="text-[10px] font-bold text-[var(--pm-text-secondary)] text-left block mb-1.5">ব্র্যান্ড থিম কালার</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedTheme(preset)}
                      className={`py-1.5 px-2 rounded-xl text-[9px] font-bold text-white transition-all flex items-center justify-center gap-1 ${preset.bg}`}
                    >
                      {preset.label}
                      {selectedTheme.id === preset.id && <Check className="w-3 h-3 text-white fill-white/10" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banners presets visual selections */}
              <div>
                <label className="text-[10px] font-bold text-[var(--pm-text-secondary)] text-left block mb-1.5">হিরো ব্যানার ক্যাটাগরি</label>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                  {TEMPLATE_BANNERS.map(banner => (
                    <button
                      key={banner.id}
                      onClick={() => setSelectedBanner(banner)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-extrabold border transition-all ${
                        selectedBanner.id === banner.id 
                        ? 'border-[var(--pm-accent)] text-[var(--pm-accent)] bg-[var(--pm-accent)]/5' 
                        : 'border-[var(--pm-border)] text-[var(--pm-text-secondary)] bg-[var(--pm-bg)]'
                      }`}
                    >
                      {banner.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW OF DEPLOYED FRAME */}
            <div className="border border-[var(--pm-border)] rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[var(--pm-surface)] px-3.5 py-2.5 border-b border-[var(--pm-border)] flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-[var(--pm-text-secondary)] tracking-widest flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> লাইভ স্টোরফ্রন্ট প্রিভিউ (Live Preview)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Outer preview frame styled using custom colors */}
              <div className="bg-[var(--pm-bg)] p-4 space-y-4">
                
                {/* Header preview navigation banner */}
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--pm-border)]">
                  <span className="font-extrabold text-[10px] text-white tracking-tight flex items-center gap-1">
                    🛒 {storeTitle}
                  </span>
                  <span className="text-[8px] bg-red-500/10 text-red-500 px-1 py-0.1 rounded border border-red-500/20 font-bold uppercase">পেইকার ড্রপশিপ</span>
                </div>

                {/* Banner Hero Preview */}
                <div className="relative h-28 rounded-xl overflow-hidden flex items-center justify-center p-3 text-center border border-white/5">
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedBanner.img} 
                    alt={selectedBanner.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30" 
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10">
                    <h4 className="text-[11px] font-extrabold text-white">{selectedBanner.title}</h4>
                    <p className="text-[8px] text-white/80 mt-1">{selectedBanner.desc}</p>
                    <span 
                      className="inline-block mt-2.5 text-[8px] font-bold text-[#fff] px-3 py-1 rounded-full uppercase tracking-wider transition-all"
                      style={{ background: selectedTheme.primary }}
                    >
                      কালেকশন দেখুন
                    </span>
                  </div>
                </div>

                {/* Inventory products imported inside the store */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold text-[var(--pm-text-secondary)] text-left">আমদানিকৃত আইটেমস ({customInventory.length})</p>
                  
                  {customInventory.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-xl" style={{ borderColor: 'var(--pm-border)' }}>
                      <p className="text-[10px] text-[var(--pm-text-secondary)]">কোনো ড্রপশিপিং আইটেম নেই। গ্লোবাল সোর্সিং থেকে পণ্য ইম্পোর্ট করুন।</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {customInventory.map(item => (
                        <div 
                          key={item.id} 
                          className="p-2 border rounded-xl flex flex-col relative"
                          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
                        >
                          <button 
                            onClick={() => handleRemoveInventory(item.id)}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 hover:bg-red-500 active:scale-95 cursor-pointer z-10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          
                          <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-900 mb-1.5">
                            <img 
                              referrerPolicy="no-referrer"
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          
                          <h5 className="text-[9px] font-bold text-white line-clamp-1 leading-snug">{item.name}</h5>
                          
                          <div className="mt-2.5 flex items-end justify-between">
                            <div>
                              <p className="text-[7px] text-[var(--pm-text-secondary)]">খুচরা মূল্য</p>
                              <p className="text-[10px] font-bold text-[var(--pm-accent)]">৳{item.suggestedRetail.toLocaleString()}</p>
                            </div>
                            <span className="text-[7px] bg-indigo-500/10 text-indigo-400 font-bold px-1.5 py-0.5 rounded border border-indigo-500/10">১-ক্লিক বাই</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtitle bottom branding tag */}
                <p className="text-[8px] text-center text-[var(--pm-text-secondary)]">{storeSubtitle}</p>
              </div>
            </div>

            {/* Launch deployment buttons */}
            <div className="p-1">
              <button
                onClick={handleDeployStore}
                disabled={isDeploying}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/30 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Rocket className="w-4 h-4 animate-bounce" /> {isDeploying ? 'স্টোর ডিপ্লয় করা হচ্ছে...' : 'নতুন স্টোর লঞ্চ করুন (Deploy Live Store)'}
              </button>

              {/* Deployed successfully panel URL link */}
              {deployedUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-3 border border-emerald-500/30 bg-emerald-500/10 rounded-2xl text-center space-y-1.5"
                >
                  <p className="text-[10px] text-emerald-400 font-bold">✓ আপনার সফিস্টাইলের ড্রপশিপ শপটি সফলভাবে ডিপ্লয় করা হয়েছে!</p>
                  <p className="text-[11px] font-mono text-white select-all underline bg-black/30 p-2 rounded-lg truncate flex items-center justify-center gap-1">
                    {deployedUrl} <Edit className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  </p>
                  <span className="text-[8px] text-[var(--pm-text-secondary)]">যেকোনো সামাজিক গণমাধ্যমে বা কাস্টমারদের সাথে এই লিংক শেয়ার করুন।</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* INTERNATIONAL PRODUCTS SOURCING MARKETPLACE */}
        {activeMenu === 'sourcing' && (
          <motion.div 
            key="sourcing-section"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-3 space-y-3.5"
          >
            {/* Catalog Info Ribbon */}
            <div className="bg-gradient-to-r from-teal-500/10 to-indigo-500/10 p-3 border border-indigo-500/20 rounded-2xl">
              <p className="text-[11px] text-[var(--pm-text)] leading-relaxed">
                পেইকার মার্ট সরাসরি কাস্টমস ও কার্গো শিপমেন্ট দেখভাল করে। আপনি শুধুমাত্র পণ্য আপনার স্টোরে যোগ করুন এবং কাস্টমারদের কাছ থেকে অর্ডারের মার্জিন লাভ করুন!
              </p>
            </div>

            {/* Catalog Search & Filter */}
            <div 
              className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border shadow-xs"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
            >
              <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
              <input 
                type="text" 
                placeholder="চীন, ভারতের সেরা খুচরা আমদানিকৃত গ্যাজেট খুঁজুন..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]" 
              />
            </div>

            {/* List of international dropshipping sourcing products */}
            <div className="space-y-3">
              {filteredCatalog.map(p => (
                <div 
                  key={p.id}
                  className="rounded-2xl border p-3 flex gap-3"
                  style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-[var(--pm-border)]">
                    <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/10 font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold">
                          {p.sourceFlag} {p.sourceCountry}
                        </span>
                      </div>
                      
                      <h4 className="text-[11px] font-bold text-[var(--pm-text)] leading-snug line-clamp-2">
                        {p.name}
                      </h4>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[var(--pm-border)]/20 flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div>
                          <p className="text-[7px] text-[var(--pm-text-secondary)]">সোর্সিং রেট</p>
                          <p className="text-[10px] font-bold text-[var(--pm-text)] font-mono">৳{p.sourcingPrice}</p>
                        </div>
                        <div>
                          <p className="text-[7px] text-emerald-500">খুচরা রেট</p>
                          <p className="text-[10px] font-black text-emerald-500 font-mono">৳{p.suggestedRetail}</p>
                        </div>
                      </div>

                      {/* Profit calculator breakdown margin */}
                      <div className="text-right">
                        <div className="text-[8px] bg-red-400/10 text-red-500 px-1 py-0.5 rounded border border-red-500/10 flex items-center gap-0.5 mb-1 justify-end font-bold">
                          <DollarSign className="w-2.5 h-2.5" /> নিট প্রফিট মার্জিন
                        </div>
                        <p className="text-xs font-black text-red-500 font-mono">৳{(p.suggestedRetail - p.sourcingPrice).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--pm-border)]/10 pt-2.5">
                      <span className="text-[8px] text-[var(--pm-text-secondary)]">ডেলিভারি সময়: <b>{p.shippingDays}</b></span>
                      <button 
                        onClick={() => handleImport(p)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                          customInventory.some(inv => inv.id === p.id)
                          ? 'bg-transparent text-[var(--pm-text-secondary)] border border-[var(--pm-border)]'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {p.isImported ? 'ইম্পোর্ট হচ্ছে...' : customInventory.some(inv => inv.id === p.id) ? '✓ স্টোরে যুক্ত আছে' : '+ ১-ক্লিক ইম্পোর্ট'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* DROPSHIP REAL-TIME ORDERS TRACKER AND MARGINS */}
        {activeMenu === 'orders' && (
          <motion.div 
            key="orders-section"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-3 space-y-4"
          >
            {/* Summary KPI Cards of Dropshipping margins */}
            <div className="grid grid-cols-2 gap-2.5 bg-[var(--pm-surface)] p-3 border border-[var(--pm-border)] rounded-2xl">
              <div className="p-3 bg-[var(--pm-bg)] border border-[var(--pm-border)]/50 rounded-xl text-center">
                <p className="text-[9px] text-[var(--pm-text-secondary)]">মোট ড্রপশিপিং সেল</p>
                <p className="text-sm font-black text-indigo-400 mt-1 font-mono">৳৭৪,৮০০</p>
                <span className="text-[7px] text-emerald-500 font-bold">↑ ১৫.৪% এই সপ্তাহে</span>
              </div>
              <div className="p-3 bg-[var(--pm-bg)] border border-[var(--pm-border)]/50 rounded-xl text-center">
                <p className="text-[9px] text-[var(--pm-text-secondary)]">মোট উপার্জিত লাভ (Profit)</p>
                <p className="text-sm font-black text-emerald-500 mt-1 font-mono">৳৩৪,২০০</p>
                <span className="text-[7px] text-indigo-400 font-semibold">আপনার ওয়ালেটে পাঠানো হয়েছে</span>
              </div>
            </div>

            {/* active live shipments */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-[var(--pm-text)] mb-2 flex items-center gap-1.5">
                ✈️ সক্রিয় আন্তর্জাতিক কার্গো ও শিপমেন্ট লিস্টিং
              </h3>

              {[
                { id: 'ds-o1', user: 'জাকির রহমান, মিরপুর ঢাকা', product: 'Mem foam foam sleeping pillow (ds)', sourcing: 1100, price: 2400, country: 'ভিয়েতনাম', status: 'কাস্টমস ক্লিয়ারেন্স', statusColor: 'bg-amber-400 text-amber-950 border-amber-300', date: '২০ মে, ২০২৬' },
                { id: 'ds-o2', user: 'নুসরাত সুলতানা, নাসিরাবাদ চট্টগ্রাম', product: 'Wireless ANC Earbuds (Pro)', sourcing: 1200, price: 2800, country: 'চীন', status: 'ইন ট্রানজিট কার্গো', statusColor: 'bg-indigo-500 text-white border-indigo-400', date: '১৮ মে, ২০২৬' },
                { id: 'ds-o3', user: 'তৌহিদুল ইসলাম, উপশহর সিলেট', product: 'Premium Ceramic Water Dripper', sourcing: 850, price: 1950, country: 'তুরস্ক', status: 'ডেলিভারড সম্পূর্ণ', statusColor: 'bg-emerald-500 text-white border-emerald-400', date: '১৫ মে, ২০২৬' }
              ].map(order => (
                <div 
                  key={order.id} 
                  className="rounded-xl border p-3 flex flex-col justify-between"
                  style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--pm-border)]/50 pb-2 mb-2">
                    <div>
                      <p className="text-[8px] text-[var(--pm-text-secondary)]">অর্ডার নম্বর: <b>#{order.id}</b></p>
                      <p className="text-[10px] font-bold text-white mt-0.5">{order.user}</p>
                    </div>
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold text-[var(--pm-text-secondary)]">{order.product}</p>

                  <div className="mt-2 text-[10px] flex justify-between items-center bg-[var(--pm-bg)]/40 p-2 rounded-lg border border-[var(--pm-border)]/20">
                    <div>
                      <span className="text-[8px] text-[var(--pm-text-secondary)]">শিপিং উৎস দেশ</span>
                      <p className="font-bold text-white mt-0.2">{order.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-emerald-500">আপনার উপার্জিত মার্জিন</span>
                      <p className="font-black text-emerald-500 font-mono">৳{(order.price - order.sourcing).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2.5 text-[8px] text-[var(--pm-text-secondary)]">
                    <span>ক্রয় তারিখ: {order.date}</span>
                    <span>শিপিং পদ্ধতি: <b>পেইকার মার্ট এক্সপ্রেস এয়ার</b></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer and warnings */}
            <div className="p-3 bg-[var(--pm-surface)] border border-red-500/20 rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-[9px] text-[var(--pm-text-secondary)] leading-relaxed">
                <b>নিরাপত্তা নোটিফিকেশন:</b> পেইকার মার্ট ড্রপশিপ সিস্টেমে কোনো পণ্যের জন্য অগ্রিম ক্যাশ ব্লক করতে হয় না। রিটার্ন অথবা ক্যান্সলেশন রিফান্ড পোর্টালে সম্পূর্ণ স্বয়ংক্রিয়ভাবে ৩ কার্যদিবসে নিষ্পন্ন হবে।
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
