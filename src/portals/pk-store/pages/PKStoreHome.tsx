import React from 'react';
import { StoryBar } from '../../../components/feed/StoryBar';
import { PortalIconBar } from '../../../components/home/PortalIconBar';
import { useProductStore } from '../../../modules/products/productStore';
import { ProductCard } from '../../../components/ui/ProductCard';
import { Sparkles, Warehouse } from 'lucide-react';

export const PKStoreHome = () => {
  const { products: storeProducts } = useProductStore();
  
  // Filter products for pk-store specifically
  const products = storeProducts.filter(p => p.portal === 'pk-store');

  return (
    <>
      {/* ━━━ PREMIUM HEADER ━━━ */}
      <section className="p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-white flex items-center gap-2">
             PK Store <span className="bg-amber-500/10 text-amber-500 text-[10px] uppercase px-2 py-0.5 rounded-full border border-amber-500/20 font-black">Verified</span>
           </h1>
           <p className="text-zinc-400 text-xs">Curated Premium Goods & Exclusive Access</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-amber-500">
           <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
      </section>

      <section className="pt-3 md:pt-4 px-3">
        <StoryBar context="retail" />
      </section>

      <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-lg border-b border-border/50 mt-2 -mx-3 px-0 md:mx-0">
        <PortalIconBar context="pk-store" />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-black mb-4 px-1">Discover Curated Selections</h2>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Warehouse className="w-10 h-10 mb-4 opacity-50" />
            <p className="text-sm">No premium products available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
             {products.map(prod => (
                <ProductCard key={prod.id} product={prod} action={<div>Premium</div>} />
             ))}
          </div>
        )}
      </div>
    </>
  );
};
