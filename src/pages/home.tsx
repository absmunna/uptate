import {
  useListPosts, getListPostsQueryKey,
  useGetPlatformStats, getGetPlatformStatsQueryKey,
} from "@workspace/api-client-react";
import { StoryBar } from "@/components/feed/StoryBar";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostComposer } from "@/components/feed/CreatePostComposer";
import { SuggestedVendors } from "@/components/feed/SuggestedVendors";
import { TrendingRail } from "@/components/feed/TrendingRail";
import { HeroSpotlight } from "@/components/home/HeroSpotlight";
import { PortalIconBar } from "@/components/home/PortalIconBar";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductRail } from "@/components/home/ProductRail";
import { DemandRail } from "@/components/home/DemandRail";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users, Store, ShoppingBag, TrendingUp,
  Flame, Sparkles, FileText, Newspaper,
} from "lucide-react";

export default function Home() {
  const { data: posts } = useListPosts({}, { query: { queryKey: getListPostsQueryKey() } });
  const { data: stats } = useGetPlatformStats({ query: { queryKey: getGetPlatformStatsQueryKey() } });

  return (
    <div className="flex flex-col gap-0 pb-10">

      {/* ━━━ HERO ZONE: Stories + Banner ━━━ */}
      <section className="pt-3">
        {/* Facebook-style tall story cards */}
        <StoryBar />

        {/* Hero spotlight banner */}
        <div className="mt-3 px-3 md:px-0">
          <HeroSpotlight />
        </div>
      </section>

      {/* ━━━ STICKY PORTAL ICON BAR ━━━
          Sticks just below the fixed 92px header */}
      <div className="sticky top-[92px] z-40 bg-background/90 backdrop-blur-lg border-b border-border/50 mt-3 -mx-3 px-0 md:mx-0">
        <PortalIconBar />
      </div>

      {/* ━━━ STATS STRIP ━━━ */}
      {stats && (
        <section className="px-3 md:px-0 pt-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <StatCard Icon={ShoppingBag} color="text-cyan-400"    glow="rgba(34,211,238,0.13)"   label="Products"  value={stats.totalProducts} />
            <StatCard Icon={Store}       color="text-purple-400"  glow="rgba(167,139,250,0.13)"  label="Vendors"   value={stats.totalVendors} />
            <StatCard Icon={Users}       color="text-blue-400"    glow="rgba(96,165,250,0.13)"   label="Users"     value={stats.totalUsers} />
            <StatCard Icon={TrendingUp}  color="text-emerald-400" glow="rgba(52,211,153,0.13)"   label="Daily GMV" value={stats.dailyGmv} prefix="৳" />
          </div>
        </section>
      )}

      {/* ━━━ TRENDING PRODUCTS ━━━ */}
      <section className="pt-6">
        <SectionHeader
          title="Trending Now"
          subtitle="What people are buying"
          Icon={Flame}
          href="/marketplace?sort=trending"
          className="px-3 md:px-0"
        />
        <div className="mt-2">
          <ProductRail sort="trending" />
        </div>
      </section>

      {/* ━━━ OPEN DEMANDS ━━━ */}
      <section className="pt-6">
        <SectionHeader
          title="Open Demands"
          subtitle="Sell what buyers need"
          Icon={FileText}
          href="/demand"
          className="px-3 md:px-0"
        />
        <div className="mt-2">
          <DemandRail />
        </div>
      </section>

      {/* ━━━ NEW ARRIVALS ━━━ */}
      <section className="pt-6">
        <SectionHeader
          title="New Arrivals"
          subtitle="Just listed by sellers"
          Icon={Sparkles}
          href="/marketplace?sort=newest"
          className="px-3 md:px-0"
        />
        <div className="mt-2">
          <ProductRail sort="newest" />
        </div>
      </section>

      {/* ━━━ COMMUNITY FEED ━━━ */}
      <section className="pt-7">
        <SectionHeader
          title="Community Feed"
          subtitle="Posts from sellers, buyers & creators"
          Icon={Newspaper}
          className="px-3 md:px-0"
        />
        <div className="flex flex-col lg:flex-row gap-5 mt-3">
          {/* Feed column */}
          <div className="flex-1 min-w-0 max-w-2xl w-full flex flex-col gap-3">
            <div className="px-3 md:px-0">
              <CreatePostComposer />
            </div>
            <div className="flex flex-col gap-3">
              {posts === undefined
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="mx-3 md:mx-0 cyber-card rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
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
                : posts.slice(0, 8).map((post) => (
                    <div key={post.id} className="mx-3 md:mx-0">
                      <PostCard post={post} />
                    </div>
                  ))}
            </div>
          </div>

          {/* Desktop right sidebar */}
          <aside className="hidden lg:flex w-72 flex-col gap-5 shrink-0">
            <TrendingRail />
            <SuggestedVendors />
          </aside>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  Icon, color, glow, label, value, prefix = "",
}: {
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <GlassCard className="p-3.5 flex items-center gap-3">
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
        style={{ background: glow, boxShadow: `0 0 12px ${glow}` }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className={`text-lg font-bold truncate ${color}`}>
          {prefix}{Number(value ?? 0).toLocaleString("en-IN")}
        </div>
        <div className="text-[10px] text-white/40 uppercase tracking-widest truncate">{label}</div>
      </div>
    </GlassCard>
  );
}
