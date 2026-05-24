import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/features/auth/AuthContext";
import {
  ShieldCheck, Users, Store, ShoppingBag, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, Settings,
  BarChart3, FileText, ArrowRight,
} from "lucide-react";
import { formatBDT } from "@/lib/format";

interface PlatformStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  dailyGmv: number;
}

interface PendingSeller {
  id: string;
  name: string;
  type: string;
  district: string;
  avatarUrl?: string;
  submitted: string;
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await fetch("/api/stats/overview");
  if (!res.ok) throw new Error(`stats/overview: ${res.status}`);
  return res.json();
}

async function fetchPendingSellers(): Promise<PendingSeller[]> {
  const res = await fetch("/api/admin/sellers/pending");
  if (!res.ok) throw new Error(`admin/sellers/pending: ${res.status}`);
  return res.json();
}

export function AdminHomeView() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  const { data: pendingSellers = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["admin-pending-sellers"],
    queryFn: fetchPendingSellers,
    refetchInterval: 60_000,
    staleTime: 15_000,
  });

  const isSuperAdmin = user?.role === "super_admin";
  const firstName    = user?.fullName?.split(" ")[0] ?? "Admin";

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Admin welcome banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/25 via-indigo-500/8 to-transparent border border-indigo-500/20 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {isSuperAdmin ? "Super Admin" : user?.role === "moderator" ? "Moderator" : "Admin"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">
              Control Panel 🛡️
            </h1>
            <p className="text-white/50 text-sm mt-1">স্বাগতম, {firstName} — PaikarMart Dashboard</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Live pending verification alert */}
        {!pendingLoading && pendingSellers.length > 0 && (
          <div className="relative mt-4 flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-orange-300 text-xs font-semibold flex-1">
              {pendingSellers.length} seller{pendingSellers.length > 1 ? "s" : ""} pending verification
            </span>
            <Link href="/admin/dashboard">
              <span className="text-orange-400 text-xs font-bold cursor-pointer hover:underline">Review →</span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Live platform stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={Users}       iconColor="text-blue-400"    bg="rgba(96,165,250,0.12)"   label="Total Users"    value={(stats?.totalUsers    ?? 0).toLocaleString("en-IN")} />
        <StatTile icon={Store}       iconColor="text-purple-400"  bg="rgba(167,139,250,0.12)"  label="Active Sellers" value={(stats?.totalVendors  ?? 0).toLocaleString("en-IN")} />
        <StatTile icon={ShoppingBag} iconColor="text-cyan-400"    bg="rgba(34,211,238,0.12)"   label="Products"       value={(stats?.totalProducts ?? 0).toLocaleString("en-IN")} />
        <StatTile icon={TrendingUp}  iconColor="text-emerald-400" bg="rgba(52,211,153,0.12)"   label="Daily GMV"      value={formatBDT(stats?.dailyGmv ?? 0)} />
      </div>

      {/* ── Quick action tiles ── */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { href: "/admin/dashboard",  icon: BarChart3, label: "Platform Dashboard", color: "text-indigo-400" },
          { href: "/admin/users",      icon: Users,     label: "User Management",    color: "text-blue-400" },
          { href: "/admin/settings",   icon: Settings,  label: "System Settings",    color: "text-white/50" },
          { href: "/admin/registry",   icon: FileText,  label: "Component Registry", color: "text-purple-400" },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href}>
            <GlassCard className="p-4 flex items-center gap-3 cursor-pointer hover:border-indigo-500/30 transition-colors">
              <Icon className={`w-5 h-5 shrink-0 ${color}`} />
              <span className="text-white/70 text-xs font-semibold leading-tight">{label}</span>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* ── Live pending seller verification queue ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white">
            Pending Seller Verification
            {pendingSellers.length > 0 && (
              <span className="ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                {pendingSellers.length}
              </span>
            )}
          </h2>
          <Link href="/admin/dashboard">
            <span className="text-xs text-indigo-400 hover:underline cursor-pointer">View all →</span>
          </Link>
        </div>

        {pendingLoading ? (
          <div className="flex flex-col gap-2.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-14 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : pendingSellers.length === 0 ? (
          <GlassCard className="p-5 flex items-center gap-3 text-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-white/50 text-sm">All sellers verified — queue is clear</span>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-2.5">
            {pendingSellers.map(seller => (
              <GlassCard key={seller.id} className="p-3.5 flex items-center gap-3 border-orange-500/10">
                {seller.avatarUrl ? (
                  <img
                    src={seller.avatarUrl}
                    alt={seller.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-orange-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold truncate">{seller.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 shrink-0">{seller.type}</span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-0.5">{seller.district} · {seller.submitted}</p>
                </div>
                <button
                  className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center hover:bg-emerald-500/25 transition-colors shrink-0"
                  aria-label="Approve"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ── Super admin full panel CTA ── */}
      {isSuperAdmin && (
        <Link href="/admin/dashboard">
          <div className="flex items-center justify-between rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors px-5 py-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Full Admin Panel</p>
                <p className="text-white/50 text-xs">Users, sellers, AI analytics, security</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-400" />
          </div>
        </Link>
      )}
    </div>
  );
}

function StatTile({
  icon: Icon, iconColor, bg, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bg: string;
  label: string;
  value: string;
}) {
  return (
    <GlassCard className="p-4 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
        style={{ background: bg }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-black text-white truncate leading-none">{value}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5 truncate">{label}</p>
      </div>
    </GlassCard>
  );
}
