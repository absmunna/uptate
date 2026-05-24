import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Package, ArrowRight, RefreshCw, AlertCircle,
  Clock, Truck, CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped:    "bg-purple-500/20 text-purple-400",
  delivered:  "bg-green-500/20 text-green-400",
  cancelled:  "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    "অপেক্ষারত",
  processing: "প্রক্রিয়ারত",
  shipped:    "পাঠানো হয়েছে",
  delivered:  "পৌঁছেছে",
  cancelled:  "বাতিল",
};

const STATUS_ICONS: Record<OrderStatus, typeof Package> = {
  pending:    Clock,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle2,
  cancelled:  XCircle,
};

// Flow: pending → processing → shipped → delivered (or → cancelled from any)
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:    "processing",
  processing: "shipped",
  shipped:    "delivered",
};

const VENDOR_ID = "v1"; // In real app, comes from auth context

interface OrderItem {
  id: string; productTitle: string; productImage: string;
  vendorName: string; quantity: number; lineTotal: number;
}
interface PriceBreakdown {
  subtotal: number; vatRate: string; vatAmount: number;
  shippingFee: number; total: number;
}
interface ApiOrder {
  id: string; orderNo: string; buyerName: string;
  items: OrderItem[];
  breakdown: PriceBreakdown;
  total: number; status: OrderStatus;
  deliveryAddress: string; deliveryDistrict: string;
  deliveryPolicy: string;
  paymentMethod: string; createdAt: string;
}

async function fetchSellerOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`/api/orders/seller?vendorId=${VENDOR_ID}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Status update failed");
  }
  return res.json();
}

export default function SellerOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const { data: orders = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["seller-orders", VENDOR_ID],
    queryFn: fetchSellerOrders,
    refetchInterval: 8000,   // real-time polling
    staleTime: 0,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
      updateOrderStatus(id, status, note),
    onSuccess: (updated) => {
      toast.success(`অর্ডার ${updated.orderNo} → ${STATUS_LABELS[updated.status as OrderStatus]}`);
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => updateOrderStatus(id, "cancelled", "Cancelled by seller"),
    onSuccess: () => {
      toast.success("অর্ডার বাতিল করা হয়েছে");
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const visible = orders.filter((o) => filter === "all" || o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-white/60 mt-1 flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                {pendingCount}টি নতুন অর্ডার
              </span>
            )}
            <span>স্বয়ংক্রিয় আপডেট চলছে</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className={`p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all ${isFetching ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Select value={filter} onValueChange={(v: typeof filter) => setFilter(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব অর্ডার</SelectItem>
              <SelectItem value="pending">অপেক্ষারত</SelectItem>
              <SelectItem value="processing">প্রক্রিয়ারত</SelectItem>
              <SelectItem value="shipped">পাঠানো</SelectItem>
              <SelectItem value="delivered">পৌঁছেছে</SelectItem>
              <SelectItem value="cancelled">বাতিল</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats row */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(["pending","processing","shipped","delivered","cancelled"] as OrderStatus[]).map((s) => {
            const cnt = orders.filter((o) => o.status === s).length;
            const Icon = STATUS_ICONS[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? "all" : s)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  filter === s ? "border-primary bg-primary/15" : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className={`flex items-center gap-2 mb-1 ${STATUS_STYLES[s].split(" ")[1]}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">{STATUS_LABELS[s]}</span>
                </div>
                <p className="text-2xl font-bold text-white">{cnt}</p>
              </button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl skeleton-shimmer" />)}
        </div>
      ) : visible.length === 0 ? (
        <GlassCard className="p-12 text-center text-white/60">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>কোনো অর্ডার নেই।</p>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/50 text-xs">অর্ডার</TableHead>
                  <TableHead className="text-white/50 text-xs">ক্রেতা</TableHead>
                  <TableHead className="text-white/50 text-xs">তারিখ</TableHead>
                  <TableHead className="text-white/50 text-xs">মূল্য বিভাজন</TableHead>
                  <TableHead className="text-white/50 text-xs">স্ট্যাটাস</TableHead>
                  <TableHead className="text-white/50 text-xs text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((o) => {
                  const nextStatus = NEXT_STATUS[o.status];
                  const bd = o.breakdown;
                  const Icon = STATUS_ICONS[o.status];

                  return (
                    <TableRow key={o.id} className="border-white/10 hover:bg-white/5 align-top">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {o.items[0]?.productImage && (
                            <img
                              src={o.items[0].productImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm text-white font-medium truncate max-w-[140px]">
                              {o.items[0]?.productTitle}
                              {o.items.length > 1 && (
                                <span className="text-white/40 text-xs"> +{o.items.length - 1}</span>
                              )}
                            </div>
                            <div className="text-xs text-white/40">#{o.orderNo}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm text-white/80">{o.buyerName}</div>
                        <div className="text-xs text-white/40">{o.deliveryDistrict}</div>
                      </TableCell>

                      <TableCell className="text-white/50 text-xs">
                        {format(new Date(o.createdAt), "d MMM, h:mm a")}
                      </TableCell>

                      {/* BD compliance: show full price breakdown */}
                      <TableCell>
                        {bd ? (
                          <div className="text-xs flex flex-col gap-0.5">
                            <span className="text-white/50">বেস: {formatBDT(bd.subtotal)}</span>
                            <span className="text-amber-400/70">VAT ({bd.vatRate}): +{formatBDT(bd.vatAmount)}</span>
                            <span className="text-white/50">ডেলিভারি: {bd.shippingFee === 0 ? "ফ্রি" : `+${formatBDT(bd.shippingFee)}`}</span>
                            <span className="text-primary font-bold">মোট: {formatBDT(o.total)}</span>
                          </div>
                        ) : (
                          <span className="text-primary font-semibold text-sm">{formatBDT(o.total)}</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status]}`}>
                          <Icon className="w-3 h-3" />
                          {STATUS_LABELS[o.status]}
                        </span>
                        <div className="text-[10px] text-white/30 mt-1 max-w-[120px] truncate">{o.deliveryPolicy}</div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-2">
                          {nextStatus && (
                            <Button
                              size="sm"
                              onClick={() => statusMutation.mutate({ id: o.id, status: nextStatus })}
                              disabled={statusMutation.isPending}
                              className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 text-xs h-8"
                            >
                              → {STATUS_LABELS[nextStatus]}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                          {(o.status === "pending" || o.status === "processing") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelMutation.mutate(o.id)}
                              disabled={cancelMutation.isPending}
                              className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs h-7"
                            >
                              বাতিল
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
