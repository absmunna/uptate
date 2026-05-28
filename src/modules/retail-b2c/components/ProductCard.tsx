import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Eye, ShoppingBag, CheckCircle2, Coins, Flame, MapPin, X, ArrowUpRight } from 'lucide-react';
import { useCartStore, useNotificationStore, useWishlistStore } from '../../../store';
import { useCartDrawerStore } from '../../cart/cartDrawerStore';

// Define the comprehensive Product interface (new add)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  soldCount?: number;
  seller: {
    name: string;
    isVerified: boolean;
  };
  coinCashback?: number;
  portal: 'pk-shop' | 'b2c' | 'wholesale' | 'b2b';
  isFlashSale?: boolean;
  location?: string;
}

// Pre-defined set of hyper-realistic localized items for default state demonstration (update-v01)
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'প্রিমিয়াম জেনুইন লেদার ওয়ালেট (Genuine Leather Wallet)',
    price: 1200,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1627124718515-552fdc11bfdb?auto=format&fit=crop&w=400&q=80',
    category: 'ফ্যাশন',
    rating: 4.8,
    soldCount: 145,
    seller: { name: 'চামড়া হাট (Leather House)', isVerified: true },
    coinCashback: 50,
    portal: 'b2c',
    location: 'ঢাকা',
  },
  {
    id: 'prod-2',
    name: 'স্মার্ট ওয়াচ ৮ আল্ট্রা প্রিমিয়াম (Smart Watch 8 Ultra)',
    price: 2450,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80',
    category: 'ইলেকট্রনিক্স',
    rating: 4.7,
    soldCount: 382,
    seller: { name: 'গেজেট বাইট (GadgetByte)', isVerified: true },
    coinCashback: 120,
    portal: 'pk-shop',
    location: 'চট্টগ্রাম',
  },
  {
    id: 'prod-3',
    name: 'অর্গানিক কোকোনাট হেয়ার অয়েল (Organic Hair Oil)',
    price: 450,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=80',
    category: 'সৌন্দর্য',
    rating: 4.9,
    soldCount: 94,
    seller: { name: 'রূপচর্চা অর্গানিকস', isVerified: false },
    coinCashback: 30,
    portal: 'b2c',
    location: 'রাজশাহী',
  },
  {
    id: 'prod-4',
    name: 'নোইজ ক্যানসেলিং ব্লুটুথ হেডফোন (ANC Wireless Headset)',
    price: 3200,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    category: 'ইলেকট্রনিক্স',
    rating: 4.6,
    soldCount: 512,
    seller: { name: 'সাউন্ড বিডি (SoundBD)', isVerified: true },
    coinCashback: 200,
    portal: 'b2b',
    location: 'ঢাকা',
  },
  {
    id: 'prod-5',
    name: 'মডার্ন স্লিম ফিট পাঞ্জাবি ২০২৬ (Slim Fit Punjabi)',
    price: 1850,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=400&q=80',
    category: 'ফ্যাশন',
    rating: 4.9,
    soldCount: 220,
    seller: { name: 'মেট্রো লাইফস্টাইল', isVerified: true },
    coinCashback: 80,
    portal: 'pk-shop',
    location: 'সিলেট',
  },
  {
    id: 'prod-6',
    name: 'প্রিমিয়াম সুগন্ধি বাসমতি চাল (Premium Basmati Rice 5kg)',
    price: 650,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    category: 'গ্রোসারি',
    rating: 4.5,
    soldCount: 840,
    seller: { name: 'পাইকার কিচেন', isVerified: false },
    coinCashback: 20,
    portal: 'wholesale',
    location: 'যশোর',
  }
];

interface ProductCardProps {
  product?: Product;
  isFlashSale?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isFlashSale = false }) => {
  // Select a standard product if none provided (e.g. from static index looping in home page)
  const resolvedProduct = product || DEFAULT_PRODUCTS[Math.floor(Math.random() * DEFAULT_PRODUCTS.length)];
  
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const toggleWishlistStore = useWishlistStore((state) => state.toggleWishlist);
  const isLiked = isInWishlist(resolvedProduct.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const openCart = useCartDrawerStore((state) => state.open);

  const discountPercent = resolvedProduct.originalPrice
    ? Math.round(((resolvedProduct.originalPrice - resolvedProduct.price) / resolvedProduct.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: resolvedProduct.id,
      name: resolvedProduct.name,
      price: resolvedProduct.price,
      image: resolvedProduct.image,
      portal: resolvedProduct.portal === 'wholesale' ? 'b2b' : 'b2c',
      coinCashback: resolvedProduct.coinCashback,
    });
    addNotification(`"${resolvedProduct.name}" সফলভাবে কার্টে যোগ করা হয়েছে!`, 'success');
    openCart();
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlistStore(resolvedProduct);
    addNotification(
      !isLiked 
        ? `"${resolvedProduct.name}" উইশলিস্টে যুক্ত করা হয়েছে!` 
        : `"${resolvedProduct.name}" উইশলিস্ট থেকে সরানো হয়েছে!`, 
      'info'
    );
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      {/* Product Grid Card with glassmorphism styling and smooth tap scaling */}
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsQuickViewOpen(true)}
        className="group relative flex flex-col h-full bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {/* Badges / Overlay Elements */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {isFlashSale && (
            <div className="flex items-center gap-1 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">
              <Flame className="w-3 h-3 fill-white" />
              <span>ফ্ল্যাশ সেল</span>
            </div>
          )}
          {discountPercent > 0 && (
            <div className="text-[10px] font-extrabold bg-amber-500 text-black px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% ছাড়
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 text-white transition-all shadow-sm group-hover:scale-105 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${isLiked ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-white'}`}
          />
        </button>

        {/* 1:1 Aspect Ratio Image Container */}
        <div className="aspect-square relative overflow-hidden bg-[var(--pm-surface-hover)] shrink-0">
          <img
            src={resolvedProduct.image}
            alt={resolvedProduct.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Soft error handling fallback if Unsplash fails/throttles
              e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80';
            }}
          />
          {/* Subtle Quick View Overlay for Desktop Hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={openQuickView}
              className="p-3 bg-white hover:bg-[var(--pm-accent)] text-black hover:text-white rounded-full shadow-xl transition-all font-bold hover:scale-110"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-1 gap-2">
          {/* Category & Location */}
          <div className="flex justify-between items-center text-[10px] text-[var(--pm-text-secondary)] font-medium">
            <span className="bg-[var(--pm-surface-hover)] px-2 py-0.5 rounded-md border border-[var(--pm-border)]">
              {resolvedProduct.category}
            </span>
            {resolvedProduct.location && (
              <span className="flex items-center gap-0.5 opacity-80">
                <MapPin className="w-2.5 h-2.5" /> {resolvedProduct.location}
              </span>
            )}
          </div>

          {/* Product Title (2-line limits) */}
          <h4 className="text-sm font-semibold text-[var(--pm-text)] tracking-tight text-left line-clamp-2 h-10 mb-0.5 group-hover:text-[var(--pm-accent)] transition-colors">
            {resolvedProduct.name}
          </h4>

          {/* Ratings & Volume Sales */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{resolvedProduct.rating || 4.5}</span>
            </div>
            <span className="text-[10px] text-[var(--pm-text-secondary)]">
              ({resolvedProduct.soldCount || 50}+ বিক্রিত)
            </span>
          </div>

          {/* PK Coin Cashback Reward Badge */}
          {resolvedProduct.coinCashback && (
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-2.5 py-1 rounded-lg self-start border border-[var(--pm-accent)]/15">
              <Coins className="w-3 h-3 text-[var(--pm-accent)] animate-spin-slow" />
              <span>+{resolvedProduct.coinCashback} কয়েন ক্যাশব্যাক</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Wallet integration pricing + CTA block */}
          <div className="flex items-end justify-between mt-1 gap-1 pt-1.5 border-t border-[var(--pm-border)]/40">
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-[var(--pm-text)]">
                  ৳{resolvedProduct.price.toLocaleString()}
                </span>
                {resolvedProduct.originalPrice && (
                  <span className="text-xs text-[var(--pm-text-secondary)] line-through">
                    ৳{resolvedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[9px] text-[var(--pm-text-secondary)] font-medium mt-0.5 truncate max-w-[85px]">
                বনাম পাইকারি হার
              </p>
            </div>

            {/* Quick action button with touch target compliance for accessibility */}
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white shadow-md hover:shadow-lg transition-all scale-100 active:scale-95 group/btn flex items-center justify-center shrink-0 min-h-[38px] min-w-[38px]"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-4 h-4 group-hover/btn:translate-y-[-1px] transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Quick View Modal with Smooth Framer Motion AnimatePresence Backdrop */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Glassmorphism Content Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-[32px] shadow-2xl p-6 overflow-hidden z-20 text-left outline-none"
            >
              {/* Close Button clickable with 44px min touch footprint */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:bg-[var(--pm-border)] text-[var(--pm-text)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Core Layout Content */}
              <div className="space-y-4">
                {/* Product Zoom Head image */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--pm-surface-hover)] relative">
                  <img
                    src={resolvedProduct.image}
                    alt={resolvedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Category overlay */}
                  <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                    {resolvedProduct.category}
                  </span>
                </div>

                {/* Seller section with verified status details card */}
                <div className="flex items-center justify-between py-1 border-b border-[var(--pm-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--pm-accent-soft)] flex items-center justify-center text-[var(--pm-accent)] font-bold text-sm">
                      {resolvedProduct.seller.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-[var(--pm-text-secondary)] font-medium">বিক্রেতা (Seller)</p>
                      <span className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                        {resolvedProduct.seller.name}
                        {resolvedProduct.seller.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[var(--pm-text-secondary)] font-medium bg-[var(--pm-surface-hover)] px-2.5 py-1 rounded-lg">
                    <span>পোর্টাল: </span>
                    <span className="font-bold text-[var(--pm-accent)]">{resolvedProduct.portal.toUpperCase()}</span>
                  </div>
                </div>

                {/* Title & Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[var(--pm-text)] leading-snug">
                    {resolvedProduct.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{resolvedProduct.rating || 4.5} রেটিং</span>
                    </div>
                    <span className="text-[var(--pm-text-secondary)]">|</span>
                    <span className="text-[var(--pm-text-secondary)] font-medium">
                      {resolvedProduct.soldCount || 100}+ পিস সফলভাবে ডেলিভারি
                    </span>
                  </div>
                </div>

                {/* Coin Cashback Detailed Info panel */}
                {resolvedProduct.coinCashback && (
                  <div className="p-3 bg-[var(--pm-accent-soft)] border border-[var(--pm-accent)]/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[var(--pm-accent)] animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">সোশ্যাল পয়েন্ট রিওয়ার্ড</p>
                        <p className="text-[10px] text-[var(--pm-text-secondary)]">এই ক্রয়ে কয়েন ওয়ালেটে যুক্ত হবে</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[var(--pm-accent)]">+{resolvedProduct.coinCashback} PK Coins</span>
                    </div>
                  </div>
                )}

                {/* Prices & Actions footer block */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--pm-border)] gap-4">
                  <div>
                    <p className="text-xs text-[var(--pm-text-secondary)]">বর্তমান সেরা পিকার রিটেইল রেট</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[var(--pm-text)]">
                        ৳{resolvedProduct.price.toLocaleString()}
                      </span>
                      {resolvedProduct.originalPrice && (
                        <span className="text-sm text-[var(--pm-text-secondary)] line-through">
                          ৳{resolvedProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleWishlist}
                      className="p-3 rounded-2xl border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] transition-colors cursor-pointer"
                      title="উইশলিস্টে যোগ করুন"
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 stroke-red-500' : ''}`} />
                    </button>
                    
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>কার্টে নিন</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
