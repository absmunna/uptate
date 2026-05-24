import { useQuery } from "@tanstack/react-query";
import { useGetSellerStats, getGetSellerStatsQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, ShoppingBag, Box, Eye, Users, Star, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useSeller } from "@/seller/SellerContext";
import React from "react";

const VENDOR_ID = "v1";

const FALLBACK_WEEKLY = [
  { day: "Mon", value: 320 },
  { day: "Tue", value: 480 },
  { day: "Wed", value: 410 },
  { day: "Thu", value: 620 },
  { day: "Fri", value: 540 },
  { day: "Sat", value: 780 },
  { day: "Sun", value: 690 },
];

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
interface ApiOrder {
  id: string; orderNo: string; buyerName: string;
  items: { productTitle: string; productImage: string; quantity: number; lineTotal: number }[];
  total: number; status: OrderStatus; createdAt: string;
}

async function fetchSellerOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`/api/orders/seller?vendorId=${VENDOR_ID}`);
  if (!res.ok) return [];
  return res.json();
}

export default function SellerDashboard() {
  const { data: stats } = useGetSellerStats({ query: { queryKey: getGetSellerStatsQueryKey() } });
  const { products, profile } = useSeller();

  const { data: orders = [] } = useQuery({
    queryKey: ["seller-orders", VENDOR_ID],
    queryFn: fetchSellerOrders,
    refetchInterval: 10000,
    staleTime: 0,
  });

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing" || o.status === "shipped",
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const revenue = stats?.revenue ?? totalSales;
  const ordersToday = stats?.ordersToday ?? activeOrders.length;
  const productsLive = stats?.productsLive ?? products.filter((p) => p.stock > 0).length;
  const matches = stats?.activeDemandMatches ?? 4;
  const views = stats?.viewsThisWeek ?? products.reduce((s, p) => s + p.views, 0);
  const weekly = stats?.weeklySales?.length ? stats.weeklySales : FALLBACK_WEEKLY;

  return (
    <div className="flex flex-col gap-8">
      {/* Pending alert */}
      {pendingOrders.length > 0 && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-400 font-semibold text-sm">
              {pendingOrders.length}টি নতুন অর্ডার আপনার মনোযোগ দরকার!
            </p>
            <p className="text-yellow-400/60 text-xs mt-0.5">দ্রুত গ্রহণ করুন এবং প্রক্রিয়াকরণ শুরু করুন।</p>
          </div>
          <Link href="/seller/orders">
            <Button size="sm" className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30 text-xs">
              অর্ডার দেখুন
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">স্বাগতম, {profile.shopName}</h1>
          <p className="text-white/60 mt-1">আপনার শপের পারফরম্যান্স একনজরে।</p>
        </div>
        <Link href="/seller/products/new">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            পণ্য যোগ করুন
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat icon={DollarSign} label="মোট বিক্রয়" value={formatBDT(revenue)} />
        <Stat icon={ShoppingBag} label="সক্রিয় অর্ডার" value={String(activeOrders.length)} />
        <Stat icon={Box} label="পণ্য" value={String(productsLive)} />
        <Stat icon={Users} label="ম্যাচ" value={String(matches)} />
        <Stat
          icon={Eye}
          label="ভিউ"
          value={views.toLocaleString()}
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <GlassCard className="p-6 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">সাপ্তাহিক রাজস্ব</h2>
            <span className="text-xs text-white/50">গত ৭ দিন</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="dashRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#dashRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent orders from real API */}
        <GlassCard className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">সাম্প্রতিক অর্ডার</h2>
          {orders.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-white/50 py-8">
              <Star className="w-8 h-8 text-white/20 mb-3" />
              <p className="text-sm">এখনো কোনো অর্ডার নেই।</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {orders.slice(0, 4).map((o) => {
                const STATUS_COLORS: Record<OrderStatus, string> = {
                  pending:    "text-yellow-400",
                  processing: "text-blue-400",
                  shipped:    "text-purple-400",
                  delivered:  "text-emerald-400",
                  cancelled:  "text-red-400",
                };
                const STATUS_LABELS: Record<OrderStatus, string> = {
                  pending:    "অপেক্ষারত",
                  processing: "প্রক্রিয়ারত",
                  shipped:    "পাঠানো",
                  delivered:  "পৌঁছেছে",
                  cancelled:  "বাতিল",
                };
                return (
                  <div key={o.id} className="flex items-center gap-3 py-3">
                    {o.items[0]?.productImage && (
                      <img
                        src={o.items[0].productImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">
                        {o.items[0]?.productTitle ?? o.orderNo}
                      </div>
                      <div className={`text-xs ${STATUS_COLORS[o.status]}`}>
                        {STATUS_LABELS[o.status]} · {o.buyerName}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary shrink-0">{formatBDT(o.total)}</div>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/seller/orders" className="mt-auto">
            <Button variant="ghost" className="w-full text-primary hover:bg-white/5">
              সব অর্ডার দেখুন
            </Button>
          </Link>
        </GlassCard>
      </div>

      {/* Top products */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">শীর্ষ পণ্য</h2>
          <Link href="/seller/products">
            <Button variant="link" className="text-primary pr-0">সব পরিচালনা করুন</Button>
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="py-12 text-center text-white/50 border border-white/10 border-dashed rounded-xl bg-white/5">
            আপনি এখনো কোনো পণ্য যোগ করেননি।
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => (
              <GlassCard key={p.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-black/20">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-sm text-white truncate">{p.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-semibold">{formatBDT(p.price)}</span>
                    <span className="text-xs text-white/50">{p.views} views</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <GlassCard className={`p-5 flex flex-col gap-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wide">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </GlassCard>
  );
}
