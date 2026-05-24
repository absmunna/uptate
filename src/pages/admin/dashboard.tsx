import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Settings as SettingsIcon, History, Coins, Store, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useGetPlatformStats } from "@workspace/api-client-react";

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const { data: stats } = useGetPlatformStats();

  if (role !== "admin" && role !== "super_admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <GlassCard className="p-6 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-2">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {user
              ? "এই পেজে প্রবেশের অনুমতি নেই। Admin অ্যাকাউন্ট দিয়ে লগইন করুন।"
              : "প্রথমে Admin অ্যাকাউন্ট দিয়ে লগইন করুন।"}
          </p>
          <Link href="/auth/login"><Button>লগইন করুন</Button></Link>
        </GlassCard>
      </div>
    );
  }

  const cards = [
    { href: "/admin/settings", Icon: SettingsIcon, title: "Platform Settings", desc: "Profit share, feature flags, payment & delivery providers." },
    { href: "/admin/changes",  Icon: History,      title: "AI Change Log",     desc: "Audit every change made by AI or admin." },
    { href: "/admin/users",    Icon: Users,        title: "Users",             desc: "Manage buyers, sellers and admins." },
    { href: "/admin/registry", Icon: LayoutDashboard, title: "UI Registry",    desc: "Hot-swap component variants without code." },
    { href: "/wallet",         Icon: Coins,        title: "PK Coin",           desc: "View your wallet & ledger." },
    { href: "/seller",         Icon: Store,        title: "Seller dashboard",  desc: "Jump into seller tools." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">PaikarMart control center</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Total products</div><div className="text-2xl font-bold">{stats?.totalProducts ?? "—"}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Total vendors</div><div className="text-2xl font-bold">{stats?.totalVendors ?? "—"}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Total orders</div><div className="text-2xl font-bold">{stats?.totalOrders ?? "—"}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-xs text-muted-foreground">Total users</div><div className="text-2xl font-bold">{stats?.totalUsers ?? "—"}</div></GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ href, Icon, title, desc }) => (
          <Link key={href} href={href}>
            <GlassCard className="p-5 cursor-pointer h-full" hoverEffect>
              <Icon className="h-6 w-6 text-primary mb-3" />
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
