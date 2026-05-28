import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../../store';
import { ProductCard } from '../components/ProductCard';
import { BackButton } from '@/components/ui/PremiumButtons';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist, removeFromWishlist } = useWishlistStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring' as const, stiffness: 260, damping: 25 } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 pb-24 text-[var(--pm-text)]"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between my-6">
        <div className="flex items-center gap-3">
          <BackButton onBack={() => navigate(-1)} size="md" variant="glass" className="border-[var(--pm-border)]" title="ফিরে যান" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-[var(--pm-text)] flex items-center gap-2">
              আমার পছন্দের তালিকা <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </h1>
            <p className="text-xs text-[var(--pm-text-secondary)]">আপনার পছন্দের মোট {items.length}টি পণ্য সংরক্ষিত আছে</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all active:scale-95"
          >
            সব মুছুন
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty wishlist vector style visual state */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-16 text-center bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-8 max-w-md mx-auto flex flex-col items-center gap-4 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--pm-surface-hover)] flex items-center justify-center text-red-500 text-opacity-80">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[var(--pm-text)]">উইশলিস্ট সম্পূর্ণ খালি!</h3>
            <p className="text-xs text-[var(--pm-text-secondary)] mt-1 max-w-[260px] mx-auto leading-relaxed">
              আপনার পছন্দের তালিকায় এখন কোনো পণ্য নেই। আমাদের সমৃদ্ধ মার্কেটপ্লেস ঘুরে পছন্দের পণ্য যুক্ত করুন।
            </p>
          </div>
          <button
            onClick={() => navigate('/b2c')}
            className="px-6 py-3 rounded-2xl bg-[var(--pm-accent)] text-white hover:opacity-95 font-black text-xs shadow-md shadow-[var(--pm-accent)]/15 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            শপিং করুন
          </button>
        </motion.div>
      ) : (
        /* Wishlist product list grid */
        <div className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {items.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="relative"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Safe-shopping badge notification inside wishlist page */}
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3 justify-center max-w-md mx-auto text-[11px] text-[var(--pm-text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>লাইক বা লাভ রিঅ্যাক্ট দিয়ে সহজেই যেকোনো প্রোডাক্ট রি-অর্ডার করার সুবিধা</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
