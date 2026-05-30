import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { MapPin } from "lucide-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { useSearchParams } from "react-router-dom";

const LOCAL_CATEGORIES = [
  { id: "all",       label: "সবগুলা",            emoji: "📍" },
  { id: "homemade",  label: "হোমমেড খাবার",      emoji: "🏡" },
  { id: "pharmacy",  label: "ফার্মেসি",            emoji: "💊" },
  { id: "food",      label: "হোটেল/রেস্টুরেন্ট",     emoji: "🍲" },
  { id: "hotel",     label: "হোটেল/রিসোর্ট",       emoji: "🏨" },
  { id: "services",  label: "সেবাসমূহ",          emoji: "🔧" },
];

export default function Local() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get("cat") || "all";

  const { data: products } = useListProducts(
    { nearMe: true }, 
    { query: { queryKey: getListProductsQueryKey({ nearMe: true }) } }
  );

  // Filter based on category
  const filteredProducts = products?.filter(p => {
    if (selectedCat === "all") return true;
    
    const cat = p.category?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";
    const portal = (p as any).portal;

    if (selectedCat === "homemade") {
      return cat === "homemade" || cat === "home made" || cat === "home made food";
    }
    if (selectedCat === "pharmacy") {
      return cat === "pharmacy" || name.includes("pharmacy") || name.includes("ঔষধ");
    }
    if (selectedCat === "food") {
      // Restaurant/Food category
      return cat === "restaurant" || cat === "food" || cat === "hotel" || name.includes("restaurant");
    }
    if (selectedCat === "hotel") {
      return cat === "hotel" || cat === "resort";
    }
    if (selectedCat === "services") {
      // Physical services from service portal OR nearby service providers
      return cat === "services" || cat === "service" || portal === "service";
    }
    return true;
  }) || [];

  return (
    <div className="w-full px-4 pb-24 text-[var(--pm-text)] flex flex-col pt-16">
      {/* ━━━ HERO ZONE: Stories + Banner ━━━ */}
      <section className="pt-2 md:pt-4">
        <StoryBar context="local" />
      </section>

      {/* ━━━ STICKY PORTAL ICON BAR ━━━ */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 -mx-4 px-4 mt-2">
        <PortalIconBar context="local" />
      </div>

      <div className="flex flex-col gap-5 pt-2">
        <div className="flex items-center gap-3 bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center">
            <MapPin className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Nearby Shop Portal</h1>
            <p className="text-xs text-[var(--pm-text-muted)]">Verified local shops and home-made delicacies near you</p>
          </div>
        </div>

        {/* Local Specialized Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          {LOCAL_CATEGORIES.map(({ id, label, emoji }) => {
            const active = selectedCat === id;
            return (
              <button
                key={id}
                onClick={() => setSearchParams({ cat: id })}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-[11px] font-black transition-all ${
                  active
                    ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)] animate-pulse"
                    : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <ProductGrid products={filteredProducts} emptyMessage={`No shops found for "${selectedCat}" category.`} />
      </div>
    </div>
  );
}
