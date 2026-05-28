import * as React from "react";
import { 
  Laptop, Code, Palette as PaletteIcon, Search as SearchIcon, 
  FileText, PlayCircle, Sparkles, ShieldCheck, 
  Zap, ArrowLeft
} from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";

export default function DigitalServicesPortal() {
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("cat") || "all";
  const navigate = useNavigate();

  const { data: products } = useListProducts(
    { category: "digital" }, 
    { query: { queryKey: getListProductsQueryKey({ category: "digital" }) } }
  );

  // Filter logic
  const filteredDigital = products?.filter(p => {
    if (selectedCat === "all") return true;
    const cat = p.category?.toLowerCase() || "";
    if (selectedCat === "ebook") return cat.includes("book") || cat.includes("ebook");
    if (selectedCat === "design") return cat.includes("design") || cat.includes("ui") || cat.includes("ux");
    if (selectedCat === "seo") return cat.includes("seo") || cat.includes("marketing");
    if (selectedCat === "dev") return cat.includes("dev") || cat.includes("web") || cat.includes("software");
    if (selectedCat === "creator") return cat.includes("creator") || cat.includes("content") || cat.includes("video");
    return true;
  }) || [];

  return (
    <div className="w-full px-4 pb-24 flex flex-col pt-16">
      <div className="flex-1 flex flex-col gap-6 pt-2">
        <section className="pt-2 md:pt-4">
          <StoryBar context="digital-services" />
        </section>

        <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 -mx-4 px-4">
          <PortalIconBar context="digital-services" />
        </div>

        <div className="flex flex-col gap-6 pt-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                <Laptop className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground">Digital Services</h1>
                <p className="text-xs text-muted-foreground">Premium digital products & pro freelancers</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <p className="text-[10px] font-bold text-white">Verified Sellers</p>
                <p className="text-[8px] text-white/50">Trusted digital experts</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <p className="text-[10px] font-bold text-white">Instant Access</p>
                <p className="text-[8px] text-white/50">Get files immediately</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Featured Offers
            </h3>
          </div>

          <ProductGrid 
            products={filteredDigital} 
            emptyMessage={`No digital services found for "${selectedCat}".`} 
          />
        </div>
      </div>
    </div>
  );
}
