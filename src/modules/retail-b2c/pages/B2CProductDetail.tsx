import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, ShieldCheck, Heart, Store, MessageSquare, ChevronRight, 
  MapPin, Clock, ArrowLeft, ShoppingCart, Send, ThumbsUp, HelpCircle 
} from 'lucide-react';
import { Product } from '../components/ProductCard';
import { useCartStore, useNotificationStore, useWishlistStore } from '../../../store';
import { toast } from 'sonner';

interface B2CProductDetailProps {
  product: Product;
  onBack: () => void;
  onVisitStore: (storeId: string) => void;
  onVisitBrand?: (brandId: string) => void;
}

export const B2CProductDetail: React.FC<B2CProductDetailProps> = ({ 
  product, 
  onBack, 
  onVisitStore,
  onVisitBrand 
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'qa'>('desc');
  const [zoomedImage, setZoomedImage] = useState(false);
  const { items, addItem } = useCartStore();
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const isLiked = isInWishlist(product.id);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Review Form state
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [localReviews, setLocalReviews] = useState<any[]>([
    {
      id: 1,
      author: "তামিম রহমান",
      rating: 5,
      date: "২০২৬-০৫-১৫",
      comment: "অসাধারণ প্রোডাক্ট! একদম যেমন ছবিতে দেখেছি ঠিক তেমনই পেয়েছি। অত্যন্ত দ্রুত ডেলিভারি পেয়েছি। ধন্যবাদ পাইকার মার্ট!",
      isVerified: true
    },
    {
      id: 2,
      author: "নাজিয়া সুলতানা",
      rating: 4,
      date: "২০২৬-০৫-১০",
      comment: "প্যাকেজিং খুবই চমৎকার ছিল। কোয়ালিটি বেশ ভালো, দাম অনুযায়ী চমৎকার ডিল।",
      isVerified: true
    }
  ]);

  // Q&A state
  const [userQuestion, setUserQuestion] = useState('');
  const [localQA, setLocalQA] = useState<any[]>([
    {
      id: 1,
      question: "ভাইয়া, এটা কি অরিজিনাল লেদার?",
      reply: "হ্যাঁ আপু, এটি শতভাগ জেনুইন কাউ-লেদার দিয়ে তৈরি এবং আমাদের তরফ থেকে ৬ মাসের ওয়ারেন্টি আছে।",
      askedBy: "রিফাত আহমেদ",
      repliedBy: product.seller.name
    },
    {
      id: 2,
      question: "চট্টগ্রাম এ ডেলিভারি দিতে কতদিন লাগবে?",
      reply: "চট্টগ্রাম মেট্রোর ভেতরে ৪৫ ঘণ্টার মধ্যে সুপার ফাস্ট এক্সপ্রেস ডেলিভারি নিশ্চিত করা হবে।",
      askedBy: "তানভীর হাসান",
      repliedBy: product.seller.name
    }
  ]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      portal: 'b2c',
      coinCashback: product.coinCashback,
    });
    addNotification(`"${product.name}" সফলভাবে কার্টে রাখা হয়েছে!`, 'success');
    toast.success("পণ্যটি কার্টে যোগ করা হয়েছে!");
  };

  const handleLike = () => {
    toggleWishlist(product);
    addNotification(!isLiked ? 'উইশলিস্টে যুক্ত করা হয়েছে' : 'উইশলিস্ট থেকে সরানো হয়েছে', 'info');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    
    const newRev = {
      id: Date.now(),
      author: "সম্মানিত ক্রেতা (আপনি)",
      rating: userRating,
      date: "আজকে",
      comment: userComment,
      isVerified: true
    };
    
    setLocalReviews([newRev, ...localReviews]);
    setUserComment('');
    toast.success("আপনার রিভিউটি যুক্ত করা হয়েছে!");
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const newQA = {
      id: Date.now(),
      question: userQuestion,
      reply: "শীঘ্রই বিক্রেতা আপনার প্রশ্নের উত্তর প্রদান করবেন। অনুগ্রহ করে অপেক্ষা করুন।",
      askedBy: "আপনি",
      repliedBy: "পেন্ডিং উত্তর"
    };

    setLocalQA([newQA, ...localQA]);
    setUserQuestion('');
    toast.success("আপনার প্রশ্ন বিক্রেতার নিকট পাঠানো হয়েছে!");
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="w-full bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] pb-28">
      {/* Top sticky header bar */}
      <div className="sticky top-16 z-50 bg-[var(--pm-bg)]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/[0.08]">
        <button 
          onClick={onBack}
          className="p-2 -ml-1 rounded-full hover:bg-white/5 text-[var(--pm-text)] transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text-secondary)]">পণ্য বিবরণী</span>
        <button 
          onClick={handleLike}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-[var(--pm-text)] active:scale-95"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 stroke-red-500':''}`} />
        </button>
      </div>

      <div className="px-4">
        {/* Aspect 1:1 image gallery with simulated magnification toggle */}
        <div className="mt-4 rounded-3xl overflow-hidden border border-white/[0.08] bg-[var(--pm-surface)] relative">
          <motion.img 
            animate={{ scale: zoomedImage ? 1.35 : 1 }}
            transition={{ ease: 'easeOut', duration: 0.35 }}
            src={product.image} 
            alt={product.name} 
            onClick={() => setZoomedImage(!zoomedImage)}
            className="w-full aspect-square object-cover cursor-zoom-in"
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              {discountPercent}% ছাড়
            </span>
          )}
          <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full font-bold">
            ছবিতে ট্যাপ করুন বড় করতে
          </span>
        </div>

        {/* Pricing, product headers */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] text-[9px] font-black tracking-wide px-2 py-0.5 rounded uppercase border border-[var(--pm-accent)]/15">
              {product.category}
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/15">
              <ShieldCheck className="w-3 h-3 fill-emerald-500/10" />
              ১০০% অথেনটিক ব্র্যান্ড
            </span>
          </div>

          <h1 className="text-base sm:text-lg font-black leading-snug text-white">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-[var(--pm-accent)]">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-[var(--pm-text-secondary)] line-through decoration-white/20">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs py-2 border-y border-white/[0.06] select-none">
            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
              <Star className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>{product.rating || 4.8}</span>
            </div>
            <span className="text-[var(--pm-text-secondary)] text-[10px] font-bold">
              {product.soldCount || 120}+ টি বিক্রি হয়েছে
            </span>
            {product.location && (
              <span className="text-[var(--pm-text-secondary)] text-[10px] font-bold flex items-center gap-1 ml-auto">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {product.location}
              </span>
            )}
          </div>
        </div>

        {/* Micro Store info */}
        <div className="mt-5 p-4 rounded-2xl bg-[var(--pm-surface)] border border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--pm-bg)] border border-white/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-[var(--pm-accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-black text-white flex items-center gap-1 truncate">
              {product.seller.name}
              {product.seller.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10 shrink-0" />
              )}
            </h3>
            <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium">ভেরিফাইড পিকার মার্চেন্ট</p>
          </div>
          <button 
            onClick={() => onVisitStore(product.seller.name)}
            className="text-[9px] font-extrabold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-all"
          >
            শপে যান
          </button>
        </div>

        {/* Tab system spec/reviews/qa */}
        <div className="mt-6">
          <div className="flex border-b border-white/[0.06] select-none text-xs font-extrabold pb-px">
            {[
              { id: 'desc', label: 'বিবরণ ও ডিল' },
              { id: 'reviews', label: `রিভিউ (${localReviews.length})` },
              { id: 'qa', label: `প্রশ্ন-উত্তর (${localQA.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-center pb-2.5 border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-[var(--pm-accent)] text-white text-[11px] font-black' 
                    : 'border-transparent text-[var(--pm-text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-4">
            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div className="space-y-4 text-xs text-[var(--pm-text-secondary)] leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="font-black text-white text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-orange-400">
                    <Clock className="w-3.5 h-3.5 text-orange-500" /> ১ দিনের ফাস্ট এক্সপ্রেস ডেলিভারি
                  </h4>
                  <p className="text-[10px] leading-relaxed font-semibold">আপনার লোকেশনে দ্রুততম নিরাপদ কুরিয়ার ও পেমেন্ট অন ডেলিভারি (COD) সুবিধা রয়েছে।</p>
                </div>
                
                <h4 className="font-extrabold text-[11px] text-white">পণ্যের সংক্ষিপ্ত বিবরণ:</h4>
                <p className="font-medium text-[10px] leading-relaxed">
                  পেশাদার কারিগর দ্বারা প্রস্তুতকৃত ও আধুনিক ফিনিশিং সম্বলিত ১০০% নির্ভরযোগ্য কোয়ালিটি পণ্য। এটি দীর্ঘস্থায়ী ব্যবহারের জন্য ডিজাইন করা হয়েছে এবং ব্র্যান্ড গ্যারান্টি দ্বারা সুরক্ষিত।
                </p>

                <table className="w-full text-[10px] border border-white/5 rounded-xl overflow-hidden">
                  <tbody>
                    <tr className="border-b border-white/5 bg-white/5">
                      <td className="px-3 py-2 font-black text-white w-28">ব্র্যান্ড নাম</td>
                      <td className="px-3 py-2 text-[var(--pm-text-secondary)]">{product.seller.name} ওএম</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="px-3 py-2 font-black text-white">ওয়ারেন্টি</td>
                      <td className="px-3 py-2 text-[var(--pm-text-secondary)]">৬ মাস প্রস্তুতকারক গ্যারান্টি</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="px-3 py-2 font-black text-white">উৎপাদন স্থল</td>
                      <td className="px-3 py-2 text-[var(--pm-text-secondary)]">বাংলাদেশ (বাংলাদেশি কারুশিল্প)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Write review form */}
                <form onSubmit={handleAddReview} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <span className="text-[10px] font-black text-white block uppercase tracking-wider">রিভিউ লিখুন</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[var(--pm-text-secondary)]">রেটিং দিন:</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-0.5 active:scale-90 transition-transform"
                        >
                          <Star className={`w-3.5 h-3.5 ${star <= userRating ? 'fill-yellow-500 text-yellow-500':'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="পণ্য সম্পর্কে আপনার মন্তব্য লিখুন..."
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      className="flex-1 bg-[var(--pm-bg)]/80 border border-white/10 rounded-xl px-3 text-[10px] text-white focus:outline-none focus:border-[var(--pm-accent)] h-9 font-medium"
                    />
                    <button 
                      type="submit"
                      className="bg-[var(--pm-accent)] text-white px-4.5 rounded-xl h-9 text-[10px] font-black active:scale-95 transition-all outline-none"
                    >
                      সাবমিট
                    </button>
                  </div>
                </form>

                {/* Review listings */}
                <div className="space-y-3">
                  {localReviews.map(rev => (
                    <div key={rev.id} className="p-3.5 rounded-2xl border border-white/[0.06] bg-white/5 text-[10px] text-left">
                      <div className="flex items-center justify-between mb-1.5 select-none">
                        <span className="font-black text-white">{rev.author}</span>
                        <span className="text-[8px] text-[var(--pm-text-secondary)]">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2 select-none">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-yellow-500 text-yellow-500':'text-zinc-700'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-[var(--pm-text-secondary)] leading-relaxed font-medium">{rev.comment}</p>
                      {rev.isVerified && (
                        <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded inline-block mt-2">
                          ভেরিফাইড পারচেস
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A Tab */}
            {activeTab === 'qa' && (
              <div className="space-y-4">
                {/* Ask Question form */}
                <form onSubmit={handleAddQuestion} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
                  <span className="text-[10px] font-black text-white block uppercase tracking-wider">বিক্রেতাকে প্রশ্ন করুন</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="পণ্য বা শিপিং সংক্রান্ত কোনো প্রশ্ন আছে?"
                      value={userQuestion}
                      onChange={e => setUserQuestion(e.target.value)}
                      className="flex-1 bg-[var(--pm-bg)]/80 border border-white/10 rounded-xl px-3 text-[10px] text-white focus:outline-none focus:border-[var(--pm-accent)] h-9 font-medium"
                    />
                    <button 
                      type="submit"
                      className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white rounded-xl px-4 h-9 flex items-center justify-center active:scale-95 transition-all outline-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Question and answer lists */}
                <div className="space-y-4 text-[10px] text-left">
                  {localQA.map(qa => (
                    <div key={qa.id} className="p-3.5 border border-white/[0.04] rounded-2xl space-y-2.5 bg-black/15">
                      <div className="flex gap-2 items-start text-white">
                        <HelpCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold leading-tight">{qa.question}</p>
                          <span className="text-[8px] text-[var(--pm-text-secondary)] mt-0.5 block">{qa.askedBy} কর্তৃক জিজ্ঞাসিত</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-start pl-4.5 border-l border-white/5 text-[var(--pm-text-secondary)]">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium leading-relaxed">{qa.reply}</p>
                          <span className="text-[8px] text-cyan-400 font-bold mt-0.5 block">{qa.repliedBy} উত্তর দিয়েছেন</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styled sticky bottom buy actions bar conforming to safe-area-inset bottom spacing guidelines */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--pm-surface)]/90 backdrop-blur-lg border-t border-white/[0.08] px-4 py-3 flex items-center gap-3 select-none pb-safe">
        <button 
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95 transition-all text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 outline-none"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" /> কার্ট করুন
        </button>
        <button 
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-[var(--pm-accent)]/20 border border-[var(--pm-accent)]/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all outline-none"
        >
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
};
