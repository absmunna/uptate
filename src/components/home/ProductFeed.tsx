import React from 'react';
import { useListProducts } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-[160px] shrink-0 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-hidden cursor-pointer hover:border-[var(--pm-accent)]/40 transition-all group">
        <div className="relative aspect-square bg-[var(--pm-surface-hover)] overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-2 left-2 text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-[11px] font-semibold text-[var(--pm-text)] line-clamp-2 leading-snug mb-1">{product.title}</p>
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-[var(--pm-text-muted)]">{product.rating?.toFixed(1)} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[var(--pm-accent)]">৳{product.price?.toLocaleString('bn-BD')}</p>
              {product.originalPrice > product.price && (
                <p className="text-[9px] text-[var(--pm-text-muted)] line-through">৳{product.originalPrice?.toLocaleString('bn-BD')}</p>
              )}
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-6 h-6 rounded-lg bg-[var(--pm-accent)]/15 flex items-center justify-center hover:bg-[var(--pm-accent)]/30 transition-colors"
            >
              <ShoppingCart className="w-3 h-3 text-[var(--pm-accent)]" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const ProductFeed = () => {
  const { data: featuredRaw, isLoading: l1 } = useListProducts({ sort: "rating", limit: "6" } as any);
  const { data: forYouRaw, isLoading: l2 } = useListProducts({ sort: "newest", limit: "6" } as any);

  const featured = Array.isArray(featuredRaw) ? featuredRaw : [];
  const forYou = Array.isArray(forYouRaw) ? forYouRaw : [];

  if (l1 && l2) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--pm-accent)]" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 pb-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)]">ফিচার্ড পণ্য</h2>
          <Link href="/products" className="text-[var(--pm-accent)] text-sm font-medium">সব দেখুন →</Link>
        </div>
        {featured.length > 0 ? (
          <div className="flex flex-row gap-3 overflow-x-auto hide-scrollbar pb-2">
            {featured.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-sm text-[var(--pm-text-muted)] text-center py-4">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)]">আপনার জন্য</h2>
          <Link href="/products" className="text-[var(--pm-accent)] text-sm font-medium">সব দেখুন →</Link>
        </div>
        {forYou.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {forYou.map((p: any) => <ProductCard key={p.id} product={{ ...p }} />)}
          </div>
        ) : (
          <p className="text-sm text-[var(--pm-text-muted)] text-center py-4">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>
    </section>
  );
};
