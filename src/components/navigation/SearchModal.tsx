import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, History, Filter, SlidersHorizontal, ArrowRight, ShieldCheck, MapPin, Sparkles, Star } from 'lucide-react';
import { CloseButton } from '@/components/ui/PremiumButtons';
import { useNavigate } from 'react-router-dom';
import { useUIStore, useSearchStore } from '../../store';
import { mockProducts } from '../../modules/retail-b2c/data/products';
import { Product } from '../../modules/retail-b2c/components/ProductCard';

const TRENDING_SEARCHES = [
  'iPhone 15 Pro Max',
  'Wholesale Saree Bangladesh',
  'Srimangal Tea Premium',
  'Xiaomi Smart Watch',
  'Organic Mango Rajshahi',
];

const CATEGORIES = ['সব', 'ফ্যাশন', 'ইলেকট্রনিক্স', 'সৌন্দর্য', 'গ্রোসারি'];

export const SearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchModalOpen, setSearchModalOpen } = useUIStore();
  const { recentSearches, addRecentSearch, removeRecentSearch } = useSearchStore();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('সব');
  const [selectedPortal, setSelectedPortal] = useState('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchModalOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  // Real-time filtered products inside modal (highly optimized)
  const filteredProducts = useMemo(() => {
    if (!query.trim() && activeCategory === 'সব' && selectedPortal === 'all' && minPrice === '' && maxPrice === '') {
      return [];
    }
    return mockProducts.filter((product) => {
      const matchesText = !query.trim() || 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = activeCategory === 'সব' || product.category === activeCategory;
      const matchesPortal = selectedPortal === 'all' || product.portal === selectedPortal;
      const matchesMinPrice = minPrice === '' || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === '' || product.price <= maxPrice;

      return matchesText && matchesCategory && matchesPortal && matchesMinPrice && matchesMaxPrice;
    });
  }, [query, activeCategory, selectedPortal, minPrice, maxPrice]);

  const handleSearchTrigger = (searchQuery: string) => {
    const finalQuery = searchQuery.trim();
    if (finalQuery) {
      addRecentSearch(finalQuery);
      setSearchModalOpen(false);
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
    }
  };

  const handleProductClick = (product: Product) => {
    addRecentSearch(product.name);
    setSearchModalOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      addRecentSearch(query);
    }
    setSearchModalOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (!isSearchModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-md p-0 sm:p-4">
        {/* Backdrop overlay listener */}
        <div 
          className="fixed inset-0 cursor-zoom-out" 
          onClick={() => setSearchModalOpen(false)}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          ref={modalRef}
          className="relative w-full sm:max-w-xl bg-[var(--pm-surface)]/95 sm:rounded-3xl border-b sm:border border-[var(--pm-border)] shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:mt-16 text-[var(--pm-text)]"
        >
          {/* Top Search bar wrapper */}
          <div className="p-4 border-b border-[var(--pm-border)] flex items-center gap-3 bg-[var(--pm-surface)] sticky top-0 z-10">
            <div className="relative flex-1 flex items-center bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-full px-4.5 py-2.5 focus-within:ring-2 focus-within:ring-[var(--pm-accent)]/25 transition-all">
              <Search className="w-4 h-4 text-[var(--pm-accent)] shrink-0 mr-3" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="পণ্য, ক্যাটাগরি বা বাজার খুঁজুন..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger(query)}
                className="w-full bg-transparent outline-none border-none text-xs font-semibold text-[var(--pm-text)] placeholder-[var(--pm-text-muted)]"
              />
              {query && (
                <CloseButton 
                  size="sm"
                  variant="ghost" 
                  onClose={() => setQuery('')}
                  className="h-6 w-6 rounded-full hover:bg-[var(--pm-border)]"
                />
              )}
              <div className="h-4 w-px bg-[var(--pm-border)] mx-1.5" />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-full transition-colors ${showFilters ? 'bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]' : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Standard Circular Close Button */}
            <CloseButton 
              size="md"
              variant="glass"
              onClose={() => setSearchModalOpen(false)}
              className="border-[var(--pm-border)] p-2.5 rounded-full transition-colors font-semibold shrink-0"
              title="Close Search"
            />
          </div>

          {/* Scrolling Content panel */}
          <div className="p-5 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
            {/* Dynamic Advanced Filters inside Modal */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-5 space-y-4 overflow-hidden border-b border-[var(--pm-border)] pb-4 text-xs"
                >
                  {/* Categorized filter selection */}
                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider mb-2 block">ক্যাটাগরি</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl border transition-all ${
                            activeCategory === cat 
                              ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] font-bold' 
                              : 'border-[var(--pm-border)] bg-[var(--pm-surface-hover)] text-[var(--pm-text-secondary)]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portal Selection */}
                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider mb-2 block">স্টোর/পোর্টাল</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: 'all', label: 'সব পোর্টাল' },
                        { id: 'b2c', label: 'খুচরা বাজার (B2C)' },
                        { id: 'pk-shop', label: 'পিকে শপ (PK)' },
                        { id: 'wholesale', label: 'পাইকারি (Wholesale)' }
                      ].map((store) => (
                        <button
                          key={store.id}
                          onClick={() => setSelectedPortal(store.id)}
                          className={`p-2 rounded-xl border text-center font-bold transition-all ${
                            selectedPortal === store.id
                              ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]'
                              : 'border-[var(--pm-border)] bg-[var(--pm-surface-hover)] text-[var(--pm-text-secondary)]'
                          }`}
                        >
                          {store.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider mb-2 block">সর্বনিম্ন মূল্য (৳)</span>
                      <input 
                        type="number" 
                        placeholder="Min Price" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl py-2 px-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" 
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider mb-2 block">সর্বোচ্চ মূল্য (৳)</span>
                      <input 
                        type="number" 
                        placeholder="Max Price" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl py-2 px-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Display Results or History */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-[var(--pm-text-secondary)] uppercase tracking-wider">
                  <span>অনুসন্ধান ফলাফল ({filteredProducts.length})</span>
                  <button 
                    onClick={handleViewAllResults}
                    className="text-[var(--pm-accent)] hover:underline flex items-center gap-0.5"
                  >
                    সব দেখুন <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center gap-3 p-2 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/30 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--pm-bg)] shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-black text-[var(--pm-accent)]">৳{product.price}</span>
                          <span className="text-[9px] bg-white/5 border border-[var(--pm-border)] px-1.5 py-0.5 rounded text-[var(--pm-text-secondary)] capitalize">{product.portal}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredProducts.length > 6 && (
                  <button 
                    onClick={handleViewAllResults}
                    className="w-full text-center py-2.5 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 text-xs font-bold text-[var(--pm-text)] transition-colors mt-2"
                  >
                    বাকি {filteredProducts.length - 6}টি পণ্য গ্যালারিতে দেখুন
                  </button>
                )}
              </div>
            ) : query.trim() ? (
              /* No matching results in quick layout */
              <div className="text-center py-8 bg-[var(--pm-surface-hover)] border border-dashed border-[var(--pm-border)] rounded-2xl p-4 flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-[var(--pm-text-secondary)]">"{query}" এর সাথে মেলার মতো কোনো পণ্য পাওয়া যায়নি!</p>
                <button
                  onClick={handleViewAllResults}
                  className="mt-1 text-xs text-[var(--pm-accent)] font-bold hover:underline"
                >
                  সার্চ পেজে গিয়ে ট্রাই করুন
                </button>
              </div>
            ) : (
              /* Default State: Show search tags, history, trending lists */
              <div className="space-y-5">
                {/* Search History list */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <History className="w-3.5 h-3.5 text-[var(--pm-text-secondary)]" />
                      <span className="text-[10px] font-extrabold text-[var(--pm-text-secondary)] uppercase tracking-wider">সাম্প্রতিক হিস্ট্রি</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item, id) => (
                        <span 
                          key={id}
                          onClick={() => handleSearchTrigger(item)}
                          className="text-xs font-semibold text-[var(--pm-text)] bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Lists */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span className="text-[10px] font-extrabold text-[var(--pm-accent)] uppercase tracking-wider"> ট্রেন্ডিং রাইট নাও</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    {TRENDING_SEARCHES.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleSearchTrigger(item)}
                        className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer group"
                      >
                        <span className="text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] font-semibold transition-colors">{item}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--pm-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-2.5 text-[10px] text-[var(--pm-text-secondary)]">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>পাইকার মার্টের সকল পণ্যSSL Commerz এবং ক্যাশব্যাকের মাধ্যমে ভেরিফাইড ও সুরক্ষিত</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
