import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, Download, ShieldCheck, Star, Sparkles, BookOpen, 
  Terminal, Palette, Laptop, Play, ShoppingCart, CheckCircle, RefreshCw 
} from 'lucide-react';

interface DigitalItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  type: 'eBook' | 'Course' | 'Template' | 'Software' | 'Music';
  description: string;
  author: string;
  fileSize: string;
  downloadsCount: number;
}

const CATEGORIES = [
  { id: 'all', label: 'সব ক্যাটাগরি', icon: null },
  { id: 'Course', label: 'ভিডিও কোর্স', icon: <Play className="w-4 h-4" /> },
  { id: 'Template', label: 'ওয়েব টেমপ্লেট', icon: <Terminal className="w-4 h-4" /> },
  { id: 'eBook', label: 'ই-বুক পিডিএফ', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'Software', label: 'ইউটিলিটি সফটওয়্যার', icon: <Laptop className="w-4 h-4" /> }
];

const MOCK_PRODUCTS: DigitalItem[] = [
  {
    id: 'dp-1',
    name: 'মডার্ন রিয়্যাক্ট এবং টাইপস্ক্রিপ্ট মাস্টারক্লাস',
    category: 'Course',
    price: 999,
    rating: 4.9,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    type: 'Course',
    description: 'বাংলাদেশি ডেভলপারদের জন্য স্ক্র্যাচ থেকে এডভান্সড টাইপস্ক্রিপ্ট, হুকস এবং রিডাক্স স্টেট ম্যানেজমেন্ট শেখার সেরা গাইডলাইন।',
    author: 'প্রোগ্রামার তানজিম হুসাইন',
    fileSize: '4.8 GB (২৪টি মডিউল)',
    downloadsCount: 1420
  },
  {
    id: 'dp-2',
    name: 'পেইকারমার্ট ল্যান্ডিং পেজ ভিউজেএস টেমপ্লেট',
    category: 'Template',
    price: 499,
    rating: 4.8,
    reviewsCount: 189,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    type: 'Template',
    description: 'টেইলউইন্ড সিএসএস ভি৪ দিয়ে তৈরি সম্পূর্ণ রেসপন্সিভ এবং এসইও অপ্টিমাইজড সোশ্যাল কমার্স থিম টেমপ্লেট।',
    author: 'সফটওয়্যার টিম পেইকারমার্ট',
    fileSize: '18.4 MB (সোর্স কোড)',
    downloadsCount: 680
  },
  {
    id: 'dp-3',
    name: 'পাইথন এবং কৃত্রিম বুদ্ধিমত্তা শেখার হাতেখড়ি',
    category: 'eBook',
    price: 150,
    rating: 4.7,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop',
    type: 'eBook',
    description: 'সহজ ভাষায় বাংলা উদাহরণ এবং রিয়াল-ওয়ার্ল্ড প্রোজেক্ট নিয়ে সাজানো পূর্ণাঙ্গ পাইথন ই-বুক সংস্করণ।',
    author: 'ড. মাহবুবুল আলম',
    fileSize: '12.5 MB (২১০ পৃষ্ঠা পিডিএফ)',
    downloadsCount: 2350
  },
  {
    id: 'dp-4',
    name: 'স্মার্ট ব্যাকগ্রাফিক সলিউশন - ফটোশপ ব্রাশেস প্যাক',
    category: 'Template',
    price: 250,
    rating: 4.6,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    type: 'Template',
    description: 'আলটিমেট ব্যাকগ্রাউন্ড পেইন্টিং, স্মোক ইফেক্ট এবং ক্যালিগ্রাফির জন্য প্রিমিয়াম ফটোশপ ব্রাশেস বান্ডেল।',
    author: 'ক্রিয়েটিভ মাইন্ডস গ্যালারি',
    fileSize: '84 MB (.ABR ফাইল)',
    downloadsCount: 410
  },
  {
    id: 'dp-5',
    name: 'অটোমেটেড ইনভয়েস জেনারেটর (ম্যাক ও উইন্ডোজ)',
    category: 'Software',
    price: 599,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    type: 'Software',
    description: 'ক্ষুদ্র ব্যবসায়ী ও বিক্রেতাদের জন্য কোনো কোডিং ছাড়াই মাত্র ৫ সেকেন্ডে পিডিএফ চমৎকার রিসিপ্ট তৈরির টুলস।',
    author: 'পেইকারমার্ট ল্যাবস',
    fileSize: '42.8 MB (ভার্সন ১.২)',
    downloadsCount: 920
  }
];

export default function DigitalProductsHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeItem, setActiveItem] = useState<DigitalItem | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'downloading' | 'finished'>('details');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const filteredProducts = MOCK_PRODUCTS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                        item.author.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || item.type === selectedType;
    return matchSearch && matchType;
  });

  const handlePurchase = () => {
    setCheckoutStep('downloading');
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCheckoutStep('finished');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const closeModal = () => {
    setActiveItem(null);
    setCheckoutStep('details');
    setDownloadProgress(0);
  };

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight">💾 Digital Store</h1>
          <p className="text-[11px] text-[var(--pm-text-secondary)]">প্রিমিয়াম ই-বুকস, ওয়েব থিমস ও শিক্ষামূলক কোর্স</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 mb-4">
        <div 
          className="flex items-center gap-2 rounded-2xl px-3.5 py-3 border shadow-sm transition-all focus-within:ring-2 focus-within:ring-[var(--pm-accent)]"
          style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
        >
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input 
            type="text" 
            placeholder="ডিজিটাল প্রোডাক্ট এর নাম দিয়ে খুঁজুন..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" 
          />
        </div>
      </div>

      {/* Categories filters */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-3 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setSelectedType(cat.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5"
            style={selectedType === cat.id
              ? { background: 'var(--pm-accent)', color: '#fff', borderColor: 'var(--pm-accent)' }
              : { background: 'var(--pm-surface)', color: 'var(--pm-text-secondary)', borderColor: 'var(--pm-border)' }
            }
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="px-3 grid grid-cols-2 gap-3.5">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl">
            <Laptop className="w-10 h-10 mx-auto text-[var(--pm-text-secondary)] opacity-40 mb-3" />
            <p className="text-sm font-semibold text-[var(--pm-text-secondary)]">কোনো প্রডাক্ট পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveItem(p)}
              className="rounded-2xl border overflow-hidden flex flex-col cursor-pointer hover:border-[var(--pm-accent)]/40 transition-colors"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
            >
              {/* Product Card Image */}
              <div className="relative aspect-square w-full bg-slate-900 border-b overflow-hidden" style={{ borderColor: 'var(--pm-border)' }}>
                <img 
                  referrerPolicy="no-referrer"
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-md font-extrabold border border-white/5 uppercase">
                  {p.type}
                </span>
              </div>

              {/* Product Card Details */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[var(--pm-text)] leading-tight mb-1 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-[var(--pm-text-secondary)] truncate mb-2">
                    বাই: {p.author}
                  </p>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-[var(--pm-text)]">{p.rating}</span>
                    <span className="text-[9px] text-[var(--pm-text-secondary)]">({p.reviewsCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[var(--pm-border)] mt-auto">
                  <span className="text-sm font-black text-[var(--pm-accent)]">
                    ৳{p.price.toLocaleString('bn-BD')}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-[var(--pm-accent)]/10 flex items-center justify-center text-[var(--pm-accent)]">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Slider / Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={closeModal} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[480px] rounded-t-[32px] p-5 shadow-2xl border-t flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)', maxHeight: '90dvh' }}
            >
              <div className="w-12 h-1 bg-[var(--pm-border)] rounded-full mx-auto mb-4" />

              {checkoutStep === 'details' && (
                <div className="flex-1 flex flex-col overflow-y-auto pb-4 hide-scrollbar">
                  <div className="flex gap-4 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-[var(--pm-border)]">
                      <img 
                        referrerPolicy="no-referrer"
                        src={activeItem.image} 
                        alt={activeItem.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-widest">
                        {activeItem.type}
                      </span>
                      <h2 className="text-base font-extrabold text-[var(--pm-text)] tracking-tight leading-tight mt-1 mb-2">
                        {activeItem.name}
                      </h2>
                      <p className="text-[11px] text-[var(--pm-text-secondary)]">লেখক/প্রকাশক: <strong className="text-[var(--pm-text)]">{activeItem.author}</strong></p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <h3 className="font-bold text-[11px] text-[var(--pm-text-secondary)] mb-1">প্রডাক্ট ডিসক্রিপশন:</h3>
                      <p className="text-[11px] text-[var(--pm-text-secondary)] bg-[var(--pm-bg)]/50 p-3 rounded-xl border border-[var(--pm-border)] leading-relaxed">
                        {activeItem.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--pm-bg)]/80 border p-3 rounded-2xl text-center" style={{ borderColor: 'var(--pm-border)' }}>
                        <span className="block text-[9px] uppercase tracking-wider text-[var(--pm-text-secondary)]">ফাইল সাইজ</span>
                        <span className="font-bold text-xs text-[var(--pm-text)]">{activeItem.fileSize}</span>
                      </div>
                      <div className="bg-[var(--pm-bg)]/80 border p-3 rounded-2xl text-center" style={{ borderColor: 'var(--pm-border)' }}>
                        <span className="block text-[9px] uppercase tracking-wider text-[var(--pm-text-secondary)]">মোট ডাউনলোড</span>
                        <span className="font-bold text-xs text-[var(--pm-accent)]">{activeItem.downloadsCount.toLocaleString('bn-BD')}+ বার</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-secondary)]">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>ক্রয় করার পর ফাইলটি সরাসরি ইনস্ট্যান্ট ডাউনলোড লিংক পাবেন</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-secondary)]">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>লাইফটাইম এক্সেস ও ভবিষ্যতের আপডেট সম্পূর্ণরূপে ফ্রি</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={closeModal}
                      className="flex-1 border bg-transparent text-[var(--pm-text)] py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer"
                      style={{ borderColor: 'var(--pm-border)' }}
                    >
                      বাতিল
                    </button>
                    <button 
                      onClick={handlePurchase}
                      className="flex-1 bg-[var(--pm-accent)] hover:bg-orange-600 text-white py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                    >
                      <ShoppingCart className="w-4 h-4" /> ৳{activeItem.price.toLocaleString('bn-BD')} কিনুন
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'downloading' && (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/25 mb-4 animate-bounce">
                    <Download className="w-8 h-8 text-[var(--pm-accent)] animate-pulse" />
                  </div>
                  <h3 className="text-base font-extrabold text-[var(--pm-text)]">পেমেন্ট ভেরিফাই এবং ফাইল প্রস্তুত হচ্ছে...</h3>
                  <p className="text-xs text-[var(--pm-text-secondary)] mt-1.5 mb-6">দয়া করে অপেক্ষা করুন, সার্ভার কানেকশন নেওয়া হচ্ছে</p>

                  <div className="w-full bg-[var(--pm-bg)] border rounded-full h-3.5 mb-2 overflow-hidden flex items-center justify-start p-0.5" style={{ borderColor: 'var(--pm-border)' }}>
                    <div 
                      className="bg-gradient-to-r from-[var(--pm-accent)] to-amber-500 h-full rounded-full transition-all duration-200" 
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--pm-accent)]">{downloadProgress}%</span>
                </div>
              )}

              {checkoutStep === 'finished' && (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-500">ক্রয় এবং ডাউনলোড সম্পন্ন!</h3>
                  <p className="text-xs text-[var(--pm-text-secondary)] mt-1.5">
                    আপনার ডিজিটাল ফাইলটি আপনার ডিভাইসে সেভ করা হয়েছে এবং সোর্স ড্রাইভে আপ করতে পাঠানো হয়েছে।
                  </p>

                  <div className="p-4 rounded-2xl w-full text-left my-5 border space-y-2 text-xs" style={{ background: 'var(--pm-bg)', borderColor: 'var(--pm-border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--pm-text-secondary)]">ডাউনলোড ফাইল:</span>
                      <span className="font-bold text-[var(--pm-text)] truncate max-w-[200px]">{activeItem.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[var(--pm-text-secondary)]">ফাইল সাইজ:</span>
                      <span className="font-mono font-bold text-[var(--pm-text)]">{activeItem.fileSize}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[var(--pm-text-secondary)]">ডেলিভারি টোকেন:</span>
                      <span className="font-mono font-bold text-[var(--pm-accent)]">PK-DL-{Math.floor(Math.random() * 900000) + 100000}</span>
                    </div>
                  </div>

                  <button 
                    onClick={closeModal}
                    className="w-full bg-[var(--pm-accent)] hover:bg-orange-600 text-white py-3 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    লাইব্রেরিতে ফিরে যান
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
