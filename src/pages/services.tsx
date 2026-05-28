import * as React from "react";
import { Wrench, Sparkles, Zap, Warehouse, ShieldCheck } from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";

export default function ServicesPortal() {
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("cat") || "all";

  const { data: products } = useListProducts(
    { category: "service" }, 
    { query: { queryKey: getListProductsQueryKey({ category: "service" }) } }
  );

  // Filter based on sub-category if needed
  const filteredServices = products?.filter(p => {
    if (selectedCat === "all") return true;
    const cat = p.category?.toLowerCase() || "";
    if (selectedCat === "home") return cat === "cleaning" || cat === "home service";
    if (selectedCat === "fix") return cat === "electric" || cat === "repair";
    if (selectedCat === "plumbing") return cat === "plumbing";
    return true;
  }) || [];

  return (
    <div className="w-full px-4 pb-24 text-[var(--pm-text)] flex flex-col pt-16">
      
      {/* ━━━ HERO ZONE: Stories + Banner ━━━ */}
      <section className="pt-2 md:pt-4">
        <StoryBar context="services" />
      </section>

      {/* ━━━ STICKY PORTAL ICON BAR ━━━ */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 -mx-4 px-4 mt-2">
        <PortalIconBar context="services" />
      </div>

      <div className="flex flex-col gap-6 pt-2">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-br from-rose-900/20 via-pink-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground">Services Portal</h1>
              <p className="text-xs text-muted-foreground">Expert solutions for your home and business</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-[10px] font-bold text-white">Verified Pros</p>
              <p className="text-[8px] text-white/50">Background checked experts</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
              <Zap className="w-5 h-5 text-amber-500" />
              <p className="text-[10px] font-bold text-white">Fast Response</p>
              <p className="text-[8px] text-white/50">Average 30 min response</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            Available Services
          </h3>
        </div>

        <ProductGrid 
          products={filteredServices} 
          emptyMessage={`No services found for "${selectedCat}" category.`} 
        />
      </div>
    </div>
  );
}
