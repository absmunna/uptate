import * as React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useGetVendor, getGetVendorQueryKey } from "@workspace/api-client-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PostCard } from "@/components/feed/PostCard";
import {
  MapPin, Star, Users, BadgeCheck, Mail, Share2,
  Heart, Bell, MessageSquare, Store, ShoppingBag,
  ChevronRight, Package, BarChart3, Calendar, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: vendor, isLoading } = useGetVendor(id, { query: { queryKey: getGetVendorQueryKey(id), enabled: !!id } });
  const [tab, setTab] = useState<"products" | "posts" | "about">("products");
  const [followed, setFollowed] = useState(false);

  if (isLoading || !vendor) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] pt-16">
        <div className="h-52 skeleton-shimmer" />
        <div className="px-4 -mt-16 space-y-3">
          <div className="w-24 h-24 rounded-3xl skeleton-shimmer" />
          <div className="h-5 w-1/2 rounded-full skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded-full skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28">
      {/* Cover Photo */}
      <div className="relative h-56 overflow-hidden">
        {vendor.coverUrl ? (
          <img src={vendor.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/60 via-indigo-900/40 to-[var(--pm-bg)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] via-[var(--pm-bg)]/30 to-transparent" />

        {/* Back button */}
        <Link to="/vendors" className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <div className="absolute top-5 right-5 flex gap-2">
          <button onClick={() => toast.success("Link copied!")} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-16 relative z-10">
        {/* Avatar + Info */}
        <div className="flex items-end gap-4 mb-3">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[var(--pm-bg)] bg-[var(--pm-surface)] shrink-0 shadow-xl">
            {vendor.avatarUrl ? (
              <img src={vendor.avatarUrl} alt={vendor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-violet-500 to-indigo-600">
                {vendor.name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-white truncate">{vendor.name}</h1>
              {vendor.verified && <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{vendor.tagline || "PaikarMart Vendor"}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Products", value: (vendor.products || []).length, icon: Package },
            { label: "Followers", value: vendor.followers?.toLocaleString() || "0", icon: Users },
            { label: "Rating", value: vendor.rating ? `${vendor.rating.toFixed(1)}★` : "—", icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
              <Icon className="w-4 h-4 text-violet-400" />
              <p className="text-[13px] font-black text-white">{value}</p>
              <p className="text-[8px] text-zinc-600">{label}</p>
            </div>
          ))}
        </div>

        {/* Location */}
        {vendor.location && (
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[11px] text-zinc-500">{vendor.location}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setFollowed(f => !f); toast.success(followed ? "Unfollowed" : `Now following ${vendor.name}`); }}
            className={cn("flex-1 py-2.5 rounded-2xl text-[12px] font-black transition-all", followed ? "bg-white/[0.06] border border-white/[0.10] text-zinc-300" : "bg-violet-500 hover:bg-violet-400 text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)]")}
          >
            {followed ? "Following" : "Follow"}
          </button>
          <button onClick={() => toast.info("Messaging coming soon")} className="flex-1 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-zinc-300 text-[12px] font-black hover:border-white/[0.14] transition-all flex items-center justify-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </button>
          <button onClick={() => toast.success("Alerts on for this vendor")} className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <Bell className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.05] mb-4">
          {(["products", "posts", "about"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2 rounded-xl text-[11px] font-black capitalize transition-all", tab === t ? "bg-violet-500/15 border border-violet-500/25 text-violet-400" : "text-zinc-500 hover:text-zinc-300")}>
              {t === "products" ? `Products (${(vendor.products || []).length})` : t === "posts" ? `Posts (${(vendor.recentPosts || []).length})` : "About"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "products" && (
          <ProductGrid products={vendor.products} emptyMessage="No products listed yet." />
        )}

        {tab === "posts" && (
          <div className="space-y-4">
            {(vendor.recentPosts || []).length > 0 ? (
              (vendor.recentPosts || []).map((post: any) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="py-16 text-center">
                <BarChart3 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-[13px] font-black text-zinc-600">No posts yet</p>
              </div>
            )}
          </div>
        )}

        {tab === "about" && (
          <div className="space-y-3">
            {vendor.description && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">About</p>
                <p className="text-[12px] text-zinc-300 leading-relaxed">{vendor.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Member Since", value: vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : "—" },
                { label: "Response Time", value: vendor.responseTime || "< 1 hour" },
                { label: "Orders Fulfilled", value: vendor.totalOrders?.toLocaleString() || "—" },
                { label: "Verified", value: vendor.verified ? "Yes ✓" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[9px] text-zinc-600">{label}</p>
                  <p className="text-[12px] font-black text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
