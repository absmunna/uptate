import React, { memo } from "react";
import {
  useListPosts, getListPostsQueryKey,
  useGetPlatformStats, getGetPlatformStatsQueryKey,
} from "@workspace/api-client-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PostCard } from "@/components/feed/PostCard";
import { SuggestedVendors } from "@/components/feed/SuggestedVendors";
import { TrendingRail } from "@/components/feed/TrendingRail";
import { HeroSpotlight } from "@/components/home/HeroSpotlight";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductRail } from "@/components/home/ProductRail";
import { DemandRail } from "@/components/home/DemandRail";
import { MerchantHomeView } from "@/components/home/MerchantHomeView";
import { AdminHomeView } from "@/components/home/AdminHomeView";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Users, Store, ShoppingBag, TrendingUp,
  Flame, Sparkles, FileText, Newspaper,
} from "lucide-react";

/** Roles that get the merchant/seller dashboard on the homepage */
const MERCHANT_ROLES = new Set([
  "seller", "wholesale", "factory",
  "digital_seller", "service_provider", "rider", "nearby_shop",
]);

/** Roles that get the admin control panel on the homepage */
const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);

export default function Home() {
  const { role, user } = useAuth();

  // Check if current user is a retail seller
  const isRetailSeller = role === "seller" && user?.seller?.type === "retail";

  /* ── Seller / Factory / Merchant → Merchant Dashboard ── */
  if (MERCHANT_ROLES.has(role) && !isRetailSeller) {
    return <MerchantHomeView />;
  }

  /* ── Admin / Super Admin / Moderator → Admin Control Panel ── */
  if (ADMIN_ROLES.has(role)) {
    return <AdminHomeView />;
  }

  /* ── Guest / Buyer / User / Retail Seller → Standard B2B Feed ── */
  return <BuyerHomeView isRetailSeller={isRetailSeller} />;
}

/* ─────────────────────────────────────────────
   Buyer / Guest View — the original B2B feed
───────────────────────────────────────────── */
function BuyerHomeView({ isRetailSeller }: { isRetailSeller?: boolean }) {
  const { data: posts } = useListPosts({}, { query: { queryKey: getListPostsQueryKey() } });
  const { data: stats } = useGetPlatformStats({ query: { queryKey: getGetPlatformStatsQueryKey() } });

  return (
    <div className="flex flex-col gap-12 pb-12 pt-6">

      {/* ━━━ HERO ZONE: Stories + Banner ━━━ */}
      <section className="min-h-[160px] md:min-h-[220px]">
        <StoryBar />
      </section>

      {/* ━━━ STICKY PORTAL ICON BAR ━━━ */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]">
        <div className="max-w-4xl mx-auto">
          <PortalIconBar />
        </div>
      </div>

      {/* ━━━ PLATFORM STATS STRIP ━━━ */}
      {stats && (
        <section className="px-3 md:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard Icon={ShoppingBag} color="[var(--pm-accent)]" label="Products"  value={stats.totalProducts} />
            <StatCard Icon={Store}       color="[var(--pm-accent)]" label="Vendors"   value={stats.totalVendors} />
            <StatCard Icon={Users}       color="[var(--pm-accent)]" label="Users"     value={stats.totalUsers} />
            <StatCard Icon={TrendingUp}  color="[var(--pm-accent)]" label="Daily GMV" value={stats.dailyGmv} prefix="৳" />
          </div>
        </section>
      )}

      {/* ━━━ TRENDING & NEW ARRIVALS ━━━ */}
      <div className="flex flex-col gap-10 px-3 md:px-0">
        <section>
          <SectionHeader
            title="Trending Now"
            subtitle="What people are buying"
            Icon={Flame}
            href="/marketplace?sort=trending"
            className="mb-4"
          />
          <ProductRail sort="trending" />
        </section>

        <section>
          <SectionHeader
            title="New Arrivals"
            subtitle="Just listed by sellers"
            Icon={Sparkles}
            href="/marketplace?sort=newest"
            className="mb-4"
          />
          <ProductRail sort="newest" />
        </section>
      </div>

      {/* ━━━ COMMUNITY FEED ━━━ */}
      <section>
        <SectionHeader
          title="Community Feed"
          subtitle="Posts from sellers, buyers & creators"
          Icon={Newspaper}
          className="px-3 md:px-0 mb-4"
        />
        <div className="flex flex-col lg:flex-row gap-6 px-3 md:px-0">
          <div className="flex-1 min-w-0 max-w-2xl w-full flex flex-col gap-3">
            {posts === undefined
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="cyber-card rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full skeleton-shimmer" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="h-3 w-1/3 rounded-full skeleton-shimmer" />
                        <div className="h-2.5 w-1/4 rounded-full skeleton-shimmer" />
                      </div>
                    </div>
                    <div className="aspect-[4/3] rounded-xl skeleton-shimmer" />
                    <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
                  </div>
                ))
              : (posts ?? []).slice(0, 8).map((post, index) => (
                  <PostCard key={`${post.id}-${index}`} post={post} />
                ))}
          </div>

          <aside className="hidden lg:flex w-72 flex-col gap-5 shrink-0">
            <TrendingRail />
            <SuggestedVendors />
          </aside>
        </div>
      </section>
    </div>
  );
}

const StatCard = memo(({
  Icon, color, label, value, prefix = "",
}: {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  value: number;
  prefix?: string;
}) => {
  return (
    <GlassCard className="p-4 flex items-center gap-4 bg-[var(--pm-surface)]">
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--pm-bg)] text${color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <div className={`text-xl font-bold truncate text${color}`}>
          {prefix}{Number(value ?? 0).toLocaleString("en-IN")}
        </div>
        <div className="text-[11px] text-[var(--pm-text-secondary)] uppercase tracking-widest truncate">{label}</div>
      </div>
    </GlassCard>
  );
});
