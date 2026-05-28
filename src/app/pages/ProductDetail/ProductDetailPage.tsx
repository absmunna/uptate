import React, { useEffect } from 'react';
import { useProductStore } from '../../store/productStore';
import { productService } from '../../services/productService';
import { ProductMediaGallery } from '../../../components/product/ProductMediaGallery';
import { SellerTrustCard } from '../../../components/product/SellerTrustCard';
import { ReviewSystem } from '../../../components/product/ReviewSystem';
import { ProductQASection } from '../../../components/product/ProductQASection';
import { RelatedProductsGrid } from '../../../components/product/RelatedProductsGrid';
import { ArrowLeft, ShoppingCart, ShieldCheck, Heart, Share2, Award, Sparkles, MessageSquare, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export const ProductDetailPage: React.FC = () => {
  const {
    product,
    setProduct,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    selectedVariant,
    setSelectedVariant,
    isSaved,
    setIsSaved,
  } = useProductStore();

  useEffect(() => {
    // Load fresh target product
    productService.getProductDetails("prod-jamdani-saree-001").then((p) => {
      setProduct(p);
    });
  }, [setProduct]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--pm-accent)] border-t-transparent rounded-full" />
        <p className="text-sm text-[var(--pm-text-secondary)] font-mono">Resolving Handloom Jamdani Ledger...</p>
      </div>
    );
  }

  const handleShare = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Design link copied for team review!");
      } else {
        throw new Error("Clipboard unavailable");
      }
    } catch (e) {
      console.warn("[ProductDetailPage] Copy failed:", e);
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        toast.success("Link copied (fallback)");
      } catch {
        toast.error("Copy operation not supported");
      }
      document.body.removeChild(input);
    }
  };

  const currentPrice = selectedVariant ? product.price + 500 : product.price;

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-32">
      {/* Breadcrumb / Nav Actions bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <button className="inline-flex items-center gap-2 text-[var(--pm-text-secondary)] hover:text-cyan-400 transition-colors w-fit group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Return to Wholesale Sourcing</span>
        </button>
      </div>

      {/* Primary Layout Frame */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-11">
        
        {/* LEFT COMPONENT COLUMN (720px - 820px equivalent layout) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Frame with fixed 1:1 image rules */}
            <ProductMediaGallery
              images={product.images}
              title={product.title}
              trendingScore={product.viralityScore}
            />

            {/* Product Header & Quick Details */}
            <div className="flex flex-col gap-5 justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold leading-none border border-emerald-500/10">
                    <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" /> 100% Authentic Handcrafted
                  </span>
                  {product.isPromoted && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold leading-none border border-amber-500/10">
                      Promoted Partner
                    </span>
                  )}
                </div>

                <h1 className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight leading-tight leading-none truncate-2-lines">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-white">৳{currentPrice.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-[var(--pm-text-secondary)] line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant selection matrix (Pill button designs height 36px, radius 999px) */}
              {product.variants && product.variants.map((v: any) => (
                <div key={v.id} className="space-y-2">
                  <span className="text-xs text-[var(--pm-text-secondary)] uppercase tracking-wider font-semibold">{v.name}</span>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`h-9 px-5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                          selectedVariant === opt
                            ? 'bg-[var(--pm-accent)] text-white border-none font-bold'
                            : 'bg-[var(--pm-surface)] text-[var(--pm-text-secondary)] border border-[var(--pm-border)] hover:border-zinc-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Sourcing warning context */}
              <div className="inline-flex items-start gap-2.5 p-3.5 rounded-xl bg-orange-500/5 text-orange-400 text-xs border border-orange-500/10">
                <Info className="w-4 h-4 shrink-0" />
                <span>Weaving artisan takes roughly 2-3 extra days due to premium heritage complexity in red zari models.</span>
              </div>
            </div>
          </div>

          {/* Dynamic Content Tab View */}
          <div className="flex flex-col gap-6">
            <div className="flex border-b border-[var(--pm-border)] space-x-6 select-none overflow-x-auto no-scrollbar py-1">
              {(['description', 'reviews', 'qa'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold pb-3 border-b-2 transition-all cursor-pointer capitalize ${
                    activeTab === tab
                      ? 'border-[var(--pm-accent)] text-white'
                      : 'border-transparent text-[var(--pm-text-secondary)] hover:text-white'
                  }`}
                >
                  {tab === 'description' ? 'Product Description' : tab === 'reviews' ? 'Reviews (2)' : 'Artisan Q&A (2)'}
                </button>
              ))}
            </div>

            {/* Render selected tabs views */}
            {activeTab === 'description' && (
              <div className="text-sm leading-relaxed text-[var(--pm-text-secondary)] space-y-4 max-w-4xl">
                <p>{product.description}</p>
                <div className="p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]/50 space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Heritage Specifications</span>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-[var(--pm-text-secondary)]">
                    <li><strong className="text-white">Origin:</strong> Sonargaon Handloom Core</li>
                    <li><strong className="text-white">Blend Ratio:</strong> 80/20 Cotton-Silk Blend</li>
                    <li><strong className="text-white">Count Thread:</strong> 84 Count Premium</li>
                    <li><strong className="text-white">Artisan Signature:</strong> Weaver Certified</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSystem productId={product.id} reviews={[
                { id: "r1", userName: "Anika Rahman", rating: 5, comment: "The thread work is incredibly fine! Authentic Jamdani at a reasonable price.", createdAt: "2026-05-15", isVerifiedBuyer: true },
                { id: "r2", userName: "Sajid Hasan", rating: 4, comment: "Gave this as a wedding gift. Elegantly designed and verified. Recommended seller.", createdAt: "2026-05-10", isVerifiedBuyer: true }
              ]} />
            )}

            {activeTab === 'qa' && (
              <ProductQASection productId={product.id} questionsAnswers={[
                { id: "q1", userName: "Fariha Chowdhury", question: "Is dry cleaning mandatory for this specific saree?", answer: "Yes, to retain the pure silk zari thread luster, we highly recommend professional dry cleaning only.", createdAt: "2026-05-20", answeredAt: "2026-05-21" },
                { id: "q2", userName: "Niaz Morshed", question: "Can I get customized box wrapping for overseas gifting?", answer: "Yes! While checking out, please select premium packaging option or message us directly.", createdAt: "2026-05-18", answeredAt: "2026-05-19" }
              ]} />
            )}
          </div>

          {/* Related recommendation listing banner grid */}
          <div className="space-y-4 pt-4 border-t border-[var(--pm-border)]">
            <h4 className="font-sans font-bold text-lg text-white">Recommended Heritage Alternates</h4>
            <RelatedProductsGrid />
          </div>
        </div>

        {/* RIGHT COLUMN STICKY MATRIX (360px wide control panel) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="lg:sticky lg:top-28 flex flex-col gap-6">
            
            {/* Sourcing Order Sizing Card */}
            <Card className="p-5 border border-[var(--pm-border)] bg-[var(--pm-surface)] rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Purchase Flow Setup</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 fill-current" /> Escrow Protected
                </span>
              </div>

              {/* Price & quantity block */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase">Total Unit Cost</span>
                  <p className="text-xl font-extrabold text-white">৳{(currentPrice * quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center border border-[var(--pm-border)] rounded-xl bg-[var(--pm-bg)]/60 p-1 select-none">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--pm-text-secondary)] hover:bg-[var(--pm-glass)] hover:text-white transition-colors cursor-pointer touch-target h-10 w-10 flex items-center justify-center p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--pm-text-secondary)] hover:bg-[var(--pm-glass)] hover:text-white transition-colors cursor-pointer touch-target h-10 w-10 flex items-center justify-center p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Primary action buttons (Height 56px per layout spec) */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => toast.success(`Successfully dispatched order setup with ${quantity} units!`)}
                  className="w-full h-14 rounded-xl text-sm font-bold bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90 transition-all flex items-center justify-center gap-2 "
                >
                  <ShoppingCart className="w-5 h-5" /> Buy Now
                </Button>
                <Button
                  onClick={() => toast.success(`Added ${quantity} units to standard cart!`)}
                  variant="outline"
                  className="w-full h-14 rounded-xl text-sm font-bold border-[var(--pm-border)] hover:bg-[var(--pm-glass)] text-white transition-all flex items-center justify-center gap-2"
                >
                  Add to Cart
                </Button>
              </div>

              {/* Security confirmation detail notes */}
              <p className="text-[10px] text-[var(--pm-text-secondary)] text-center leading-relaxed">
                Funds remain locked securely via Paikar Mart trust escrow protocol. Handover occurs locally under Dhaka inspection rules.
              </p>
            </Card>

            {/* Merchant Trust Profile Module */}
            <SellerTrustCard
              id="vendor-royal-dhaka"
              name="Royal Dhaka Weavers Ltd."
              responseRate="99%"
              followersCount={14850}
            />
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation (Sticky actions for Mobile ≤767px views) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--pm-surface)]/90 backdrop-blur-md border-t border-[var(--pm-border)] shadow-2xl p-4 z-40 flex items-center justify-between gap-4">
        <div className="text-left select-none">
          <span className="text-[10px] text-[var(--pm-text-secondary)] block uppercase">Price Total</span>
          <span className="text-lg font-bold text-white">৳{(currentPrice * quantity).toLocaleString()}</span>
        </div>
        <div className="flex gap-2 flex-grow max-w-[280px]">
          <Button
            onClick={() => toast.success(`Instantly bought ${quantity} designs!`)}
            className="flex-1 h-12 rounded-xl text-xs font-bold leading-none bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90 flex items-center justify-center gap-1"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
