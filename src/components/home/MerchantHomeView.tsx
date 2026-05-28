import { useQuery } from "@tanstack/react-query";
import { useGetSellerStats, getGetSellerStatsQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSeller } from "@/seller/SellerContext";
import { useAuth, type AppUser } from "@/features/auth/AuthContext";
import {
  DollarSign, ShoppingBag, Package, TrendingUp,
  Plus, ArrowRight, AlertCircle, Clock, Truck,
  CheckCircle2, Store, BarChart3, Star,
} from "lucide-react";
import { format } from "date-fns";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
interface ApiOrder {
  id: string; orderNo: string; buyerName: string;
  total: number; status: OrderStatus; createdAt: string;
  items: { productTitle: string; quantity: number; lineTotal: number }[];
}

const STATUS_META: Record<OrderStatus, { label: string; color: string; Icon: typeof Clock }> = {
  pending:    { label: "অপেক্ষারত",     color: "text-yellow-400",  Icon: Clock },
  processing: { label: "প্রক্রিয়ারত",    color: "text-blue-400",    Icon: Package },
  shipped:    { label: "পাঠানো হয়েছে",  color: "text-purple-400",  Icon: Truck },
  delivered:  { label: "পৌঁছে গেছে",    color: "text-emerald-400", Icon: CheckCircle2 },
  cancelled:  { label: "বাতিল",         color: "text-red-400",     Icon: AlertCircle },
};

async function fetchSellerOrders(vendorId: string): Promise<ApiOrder[]> {
  const res = await fetch(`/api/orders/seller?vendorId=${vendorId}`);
  if (!res.ok) return [];
  return res.json();
}

function roleLabel(user: AppUser): string {
  switch (user.role) {
    case "factory":   return user.factory?.companyName ?? "Factory";
    case "wholesale": return "Wholesale Seller";
    case "seller":    return user.seller?.shopName ?? "My Shop";
    default:          return "Merchant";
  }
}

function roleTag(role: AppUser["role"]): string {
  switch (role) {
    case "factory":         return "Factory";
    case "wholesale":       return "Wholesale";
    case "digital_seller":  return "Digital";
    case "service_provider":return "Service";
    case "rider":           return "Rider";
    default:                return "Seller";
  }
}

export function MerchantHomeView() {
  const { user } = useAuth();
  const { products } = useSeller();
  const vendorId = user?.id ?? "v1";

  const { data: stats } = useGetSellerStats({ query: { queryKey: getGetSellerStatsQueryKey() } });
  const { data: orders = [] } = useQuery({
    queryKey: ["seller-orders", vendorId],
    queryFn: () => fetchSellerOrders(vendorId),
    refetchInterval: 10000,
    staleTime: 0,
  });

  const pending   = orders.filter(o => o.status === "pending");
  const active    = orders.filter(o => ["pending","processing","shipped"].includes(o.status));
  const totalSales = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const revenue   = stats?.revenue ?? totalSales;
  const liveProducts = stats?.productsLive ?? products.filter(p => p.stock > 0).length;
  const rating    = 4.8;

  const shopName  = user ? roleLabel(user) : "My Shop";
  const tag       = user ? roleTag(user.role) : "Seller";
  const firstName = user?.fullName?.split(" ")[0] ?? "Merchant";

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent border border-primary/20 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                {tag}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">
              স্বাগতম, {firstName} 👋
            </h1>
            <p className="text-white/50 text-sm mt-1">{shopName}</p>
          </div>
          <Link to="/seller">
            <Button size="sm" variant="outline" className="shrink-0 bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Full Dashboard
            </Button>
          </Link>
        </div>

        {/* Pending alert inside banner */}
        {pending.length > 0 && (
          <div className="relative mt-4 flex items-center gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2.5">
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="text-yellow-300 text-xs font-semibold flex-1">
              {pending.length}টি নতুন অর্ডার আপনার অনুমোদনের অপেক্ষায়
            </span>
            <Link to="/seller/orders">
              <span className="text-yellow-400 text-xs font-bold underline-offset-2 hover:underline cursor-pointer">
                দেখুন →
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Primary CTA — Upload Product ── */}
      <Link to="/seller/products/new">
        <div className="flex items-center justify-between rounded-2xl bg-primary hover:bg-primary/90 transition-colors px-5 py-4 cursor-pointer shadow-lg shadow-primary/25">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">পণ্য আপলোড করুন</p>
              <p className="text-white/60 text-xs">Wholesale product listing</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/70" />
        </div>
      </Link>

      {/* ── Key stats grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={DollarSign} iconColor="text-emerald-400" bg="rgba(52,211,153,0.12)"
          label="মোট আয়" value={formatBDT(revenue)}
        />
        <StatTile
          icon={ShoppingBag} iconColor="text-blue-400" bg="rgba(96,165,250,0.12)"
          label="সক্রিয় অর্ডার" value={String(active.length)}
        />
        <StatTile
          icon={Package} iconColor="text-purple-400" bg="rgba(167,139,250,0.12)"
          label="লাইভ পণ্য" value={String(liveProducts)}
        />
        <StatTile
          icon={Star} iconColor="text-yellow-400" bg="rgba(251,191,36,0.12)"
          label="রেটিং" value={`${rating} ★`}
        />
      </div>

      {/* ── Quick links row ── */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { href: "/seller/orders",   icon: ShoppingBag, label: "অর্ডার" },
          { href: "/seller/products", icon: Package,     label: "পণ্য" },
          { href: "/seller/analytics",icon: TrendingUp,  label: "Analytics" },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} to={href}>
            <GlassCard className="p-3.5 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 transition-colors text-center">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-[11px] font-semibold text-white/70">{label}</span>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* ── Recent orders ── */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">সাম্প্রতিক অর্ডার</h2>
            <Link to="/seller/orders">
              <span className="text-xs text-primary hover:underline cursor-pointer">সব দেখুন →</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {orders.slice(0, 4).map(order => {
              const meta = STATUS_META[order.status];
              const StatusIcon = meta.Icon;
              return (
                <GlassCard key={order.id} className="p-3.5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5`}>
                    <StatusIcon className={`w-4 h-4 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold truncate">{order.orderNo}</span>
                      <span className={`text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="text-white/40 text-[11px] mt-0.5">
                      {order.buyerName} · {format(new Date(order.createdAt), "d MMM")}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-sm shrink-0">{formatBDT(order.total)}</span>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Seller portal shortcut ── */}
      <GlassCard className="p-4 flex items-center gap-3 border-dashed border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-white/30" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-xs font-medium">আপনার Seller Hub-এ যেতে</p>
          <p className="text-white text-sm font-semibold mt-0.5">Seller Portal</p>
        </div>
        <Link to="/seller">
          <Button size="sm" className="bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 text-xs">
            খুলুন
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
}

function StatTile({
  icon: Icon, iconColor, bg, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string; bg: string; label: string; value: string;
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
        <p className="text-lg font-black text-white truncate leading-none">{value}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5 truncate">{label}</p>
      </div>
    </GlassCard>
  );
}
