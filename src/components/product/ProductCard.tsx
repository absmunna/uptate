import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Star, MapPin, ShoppingCart, Zap } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const TYPE_BADGE: Record<string, string> = {
  retail:    "badge-retail",
  wholesale: "badge-wholesale",
  dropship:  "badge-dropship",
  grocery:   "badge-grocery",
  service:   "badge-service",
  hotel:     "badge-hotel",
};

export function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  const vendorName = product.vendor?.name ?? "—";
  const rating = typeof product.rating === "number" ? product.rating : null;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;
  const typeBadge = TYPE_BADGE[product.type] ?? "badge-retail";

  const qc = useQueryClient();
  const addToCart = useAddToCart();

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          toast.success("Added to cart");
          qc.invalidateQueries({ queryKey: ["/api/cart"] });
        },
      }
    );
  };

  return (
    <Link to={`/marketplace/product/${product.id}`}>
      <GlassCard className="h-full flex flex-col group overflow-hidden cursor-pointer glass-card-hover relative">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--pm-surface)]">
          {img ? (
            <img
              src={img}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
            />
          ) : (
            <div className="w-full h-full skeleton-shimmer" />
          )}

          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="text-[10px] font-bold bg-[var(--pm-accent)] text-[var(--pm-text)] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" />{discountPct}% OFF
              </span>
            )}
          </div>

          {product.distanceKm !== undefined && (
            <div className="absolute top-2 right-2 bg-[var(--pm-surface)]/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] text-[var(--pm-text)] border border-[var(--pm-border)]">
              <MapPin className="w-2.5 h-2.5 text-[var(--pm-accent)]" />
              {product.distanceKm.toFixed(1)} km
            </div>
          )}

          {/* Quick add to cart */}
          <button
            onClick={handleCart}
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[var(--pm-accent)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[var(--pm-text)]" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize", typeBadge)}>
              {product.type.replace("_", " ")}
            </span>
            {rating !== null && (
              <div className="flex items-center gap-1 text-[11px] text-[var(--pm-text-secondary)]">
                <Star className="w-3 h-3 fill-[var(--pm-accent)] text-[var(--pm-accent)]" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-[var(--pm-text)] line-clamp-2 leading-snug group-hover:text-[var(--pm-accent)] transition-colors">
            {product.title}
          </h3>

          <p className="text-[11px] text-[var(--pm-text-secondary)] truncate mt-auto">{vendorName}</p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[var(--pm-accent)] font-bold text-sm">${product.price?.toFixed(2) ?? "—"}</span>
            <button
               onClick={handleCart}
               className="h-8 w-8 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center hover:bg-[var(--pm-accent)] hover:text-[var(--pm-text)] transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
