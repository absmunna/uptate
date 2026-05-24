import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { Link } from "wouter";
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  Bookmark, ShoppingCart, Zap, Store, BadgeCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTogglePostLike, getListPostsQueryKey, type Post } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/CartContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { isEnabled } from "@/config/feature.flags";
import { PostComments } from "./PostComments";

const VENDOR_TYPE_COLORS: Record<string, string> = {
  retail:      "text-blue-300 bg-blue-500/10 border-blue-400/20",
  wholesale:   "text-purple-300 bg-purple-500/10 border-purple-400/20",
  service:     "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
  grocery:     "text-amber-300 bg-amber-500/10 border-amber-400/20",
  hotel:       "text-rose-300 bg-rose-500/10 border-rose-400/20",
  real_estate: "text-cyan-300 bg-cyan-500/10 border-cyan-400/20",
  dropship:    "text-indigo-300 bg-indigo-500/10 border-indigo-400/20",
};

export function PostCard({ post }: { post: Post }) {
  const qc = useQueryClient();
  const toggleLike = useTogglePostLike();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const cart = useCart();
  const wishlist = useWishlist();

  const author = post?.author ?? { id: "", name: "Unknown", avatarUrl: undefined, verified: false };
  const images = post?.images ?? [];
  const product = post?.product;
  const vendorType = (author as { type?: string })?.type;
  const typeColors = vendorType ? (VENDOR_TYPE_COLORS[vendorType] ?? "text-white/50 bg-white/5 border-white/10") : null;

  const handleLike = () => {
    setIsLiking(true);
    toggleLike.mutate(
      { id: post?.id },
      {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getListPostsQueryKey() }); setTimeout(() => setIsLiking(false), 300); },
        onError: () => setIsLiking(false),
      },
    );
  };

  const handleAddToCart = () => {
    if (!product?.id) return;
    cart.add({ productId: product.id, title: product.title ?? "Product", price: product.price ?? 0, currency: "BDT", imageUrl: product.images?.[0], vendorId: author?.id, vendorName: author?.name });
    toast.success("Added to cart", { description: product.title });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => { window.location.assign(`${import.meta.env.BASE_URL}cart`); }, 200);
  };

  const handleWishlist = () => {
    if (!product?.id) return;
    wishlist.toggle({ productId: product.id, title: product.title, price: product.price, imageUrl: product.images?.[0] });
  };

  let timeAgo = "";
  try { timeAgo = post?.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ""; } catch { timeAgo = ""; }

  const wishlisted = product?.id ? wishlist.has(product.id) : false;
  const inCart = product?.id ? cart.has(product.id) : false;

  return (
    <article className="cyber-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href={author?.id ? `/vendors/${author.id}` : "#"} className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar className="border-2 border-cyan-400/30 h-10 w-10 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
              <AvatarImage src={author?.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 text-cyan-300 text-sm font-bold">
                {author?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            {author?.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_6px_rgba(34,211,238,0.8)]">
                <BadgeCheck className="h-3 w-3 text-black" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-white truncate">{author?.name}</span>
              {vendorType && typeColors && (
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border", typeColors)}>
                  <Store className="h-2.5 w-2.5" />{vendorType}
                </span>
              )}
            </div>
            {timeAgo && <p className="text-[11px] text-white/35 mt-0.5">{timeAgo}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-7 px-2.5 rounded-full border border-cyan-500/20">
            Follow
          </Button>
          <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/8 h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Caption ── */}
      {post?.content && (
        <div className="px-4 pb-3">
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}

      {/* ── Media ── */}
      {images.length > 0 && (
        <div className={cn("overflow-hidden", images.length > 1 ? "grid grid-cols-2 gap-px" : "")}>
          {images.slice(0, 4).map((url, i) => (
            <div key={i} className={cn("overflow-hidden", images.length === 1 ? "aspect-[4/3]" : "aspect-square")}>
              <img
                src={url}
                alt="Post content"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Product card ── */}
      {product && (
        <div className="mx-3 mt-3 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
          <Link href={`/marketplace/product/${product.id}`}>
            <div className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.title} className="h-16 w-16 object-cover rounded-lg shrink-0 border border-white/10" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">{product.title}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-cyan-400 font-bold text-base">{formatBDT(product.price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > (product.price ?? 0) && (
                    <span className="text-xs text-white/35 line-through">{formatBDT(product.compareAtPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Action buttons */}
          <div className="grid grid-cols-3 border-t border-white/[0.06]">
            {isEnabled("wishlist.enabled") && (
              <button
                onClick={handleWishlist}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-r border-white/[0.06]",
                  wishlisted ? "text-rose-400 bg-rose-500/8" : "text-white/50 hover:text-white/80 hover:bg-white/5",
                )}
              >
                <Bookmark className={cn("h-3.5 w-3.5", wishlisted && "fill-rose-400")} />
                {wishlisted ? "Saved" : "Save"}
              </button>
            )}
            {isEnabled("cart.enabled") && (
              <button
                onClick={handleAddToCart}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-r border-white/[0.06]",
                  inCart ? "text-cyan-400 bg-cyan-500/8" : "text-white/50 hover:text-white/80 hover:bg-white/5",
                )}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {inCart ? "In Cart" : "Add Cart"}
              </button>
            )}
            {isEnabled("buyNow.enabled") && (
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <Zap className="h-3.5 w-3.5" />
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Social reaction bar ── */}
      <div className="flex items-center gap-5 px-4 py-3 mt-1 border-t border-white/[0.05]">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-all duration-200",
            post?.liked ? "text-rose-400 [text-shadow:0_0_8px_rgba(251,113,133,0.5)]" : "text-white/40 hover:text-white/70",
            isLiking && "scale-125",
          )}
        >
          <Heart className={cn("h-5 w-5", post?.liked && "fill-rose-400")} />
          <span className="text-xs">{post?.likeCount ?? 0}</span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            showComments ? "text-cyan-400" : "text-white/40 hover:text-white/70",
          )}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">{post?.commentCount ?? 0}</span>
        </button>

        <button
          onClick={() => {
            try {
              if (navigator?.share) navigator.share({ title: author?.name, text: post?.content }).catch(() => {});
              else if (navigator?.clipboard) navigator.clipboard.writeText(post?.content ?? "").then(() => toast.success("Copied"));
            } catch { /* noop */ }
          }}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-xs">{post?.shareCount ?? 0}</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={handleWishlist}
            className={cn("transition-colors", wishlisted ? "text-rose-400" : "text-white/30 hover:text-white/60")}
          >
            <Bookmark className={cn("h-4.5 w-4.5", wishlisted && "fill-rose-400")} />
          </button>
        </div>
      </div>

      {showComments && post?.id && (
        <div className="border-t border-white/[0.05]">
          <PostComments postId={post.id} />
        </div>
      )}
    </article>
  );
}
