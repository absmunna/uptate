import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import { Link } from "wouter";
import {
  ShoppingBag, Clock, Truck, CheckCircle2, XCircle,
  Package, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface StatusHistoryEntry { status: OrderStatus; at: string; note?: string; }
interface OrderItem {
  id: string; productTitle: string; productImage: string;
  vendorName: string; unitPrice: number; quantity: number; lineTotal: number;
}
interface PriceBreakdown {
  subtotal: number; vatRate: string; vatAmount: number;
  shippingFee: number; shippingLabel: string; total: number;
}
interface Order {
  id: string; orderNo: string; items: OrderItem[];
  breakdown: PriceBreakdown;
  total: number; status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  deliveryAddress: string; deliveryDistrict: string;
  maxDeliveryDays: number; deliveryPolicy: string;
  paymentMethod: string; createdAt: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Package; color: string; bg: string }> = {
  pending:    { label: "অপেক্ষারত",     icon: Clock,        color: "text-yellow-400",  bg: "bg-yellow-500/20" },
  processing: { label: "প্রক্রিয়ারত",    icon: Package,      color: "text-blue-400",    bg: "bg-blue-500/20" },
  shipped:    { label: "পাঠানো হয়েছে",  icon: Truck,        color: "text-purple-400",  bg: "bg-purple-500/20" },
  delivered:  { label: "পৌঁছে গেছে",    icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  cancelled:  { label: "বাতিল",         icon: XCircle,      color: "text-red-400",     bg: "bg-red-500/20" },
};

const STEP_ORDER: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export default function BuyerOrdersPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: orders = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: fetchOrders,
    refetchInterval: 8000,
    staleTime: 0,
  });

  const toggle = (id: string) =>
    setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-white/20" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">কোনো অর্ডার নেই</h2>
          <p className="text-white/50">মার্কেটপ্লেসে যান এবং আপনার প্রথম অর্ডার দিন।</p>
        </div>
        <Link href="/marketplace">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            কেনাকাটা শুরু করুন
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">আমার অর্ডার</h1>
          <p className="text-white/50 text-sm mt-1">
            {orders.length}টি অর্ডার · প্রতি ৮ সেকেন্ডে আপডেট
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className={`p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all ${isFetching ? "animate-spin" : ""}`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {orders.map((order) => {
        const cfg = STATUS_CONFIG[order.status];
        const StatusIcon = cfg.icon;
        const isOpen = expanded.has(order.id);
        const stepIdx = STEP_ORDER.indexOf(order.status);
        const bd = order.breakdown;

        return (
          <GlassCard key={order.id} className="overflow-hidden">
            {/* Header row */}
            <div className="p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{order.orderNo}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-0.5">
                  {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
                </p>
                <p className="text-primary font-bold text-sm mt-1">{formatBDT(order.total)}</p>
              </div>
              <button onClick={() => toggle(order.id)} className="text-white/30 hover:text-white p-1">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Progress stepper (not cancelled) */}
            {order.status !== "cancelled" && (
              <div className="px-4 pb-4">
                <div className="flex items-center">
                  {STEP_ORDER.map((s, i) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${
                        i <= stepIdx ? "bg-primary border-primary" : "bg-white/10 border-white/20"
                      }`} />
                      {i < STEP_ORDER.length - 1 && (
                        <div className={`flex-1 h-0.5 ${i < stepIdx ? "bg-primary" : "bg-white/10"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {STEP_ORDER.map((s) => (
                    <span key={s} className={`text-[9px] ${s === order.status ? STATUS_CONFIG[s].color : "text-white/30"}`}>
                      {STATUS_CONFIG[s].label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded details */}
            {isOpen && (
              <div className="border-t border-white/10 p-4 flex flex-col gap-5">

                {/* Items */}
                <div>
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">পণ্য</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.productTitle}</p>
                        <p className="text-xs text-white/40">{item.vendorName} · পরিমাণ {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-white">{formatBDT(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                {/* BD Compliance price breakdown */}
                {bd && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 text-sm">
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                      মূল্য বিভাজন (ই-কমার্স আইন অনুযায়ী)
                    </p>
                    <div className="flex justify-between text-white/60">
                      <span>বেস মূল্য</span><span>{formatBDT(bd.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-amber-400/80">
                      <span>VAT ({bd.vatRate})</span><span>+ {formatBDT(bd.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>ডেলিভারি</span>
                      <span className={bd.shippingFee === 0 ? "text-emerald-400" : ""}>
                        {bd.shippingFee === 0 ? "বিনামূল্যে ✓" : `+ ${formatBDT(bd.shippingFee)}`}
                      </span>
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-white">সর্বমোট</span>
                      <span className="text-primary">{formatBDT(order.total)}</span>
                    </div>
                  </div>
                )}

                {/* Delivery info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <p className="col-span-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">ডেলিভারি তথ্য</p>
                  <div><span className="text-white/40">জেলা</span><p className="text-white mt-0.5">{order.deliveryDistrict}</p></div>
                  <div><span className="text-white/40">পেমেন্ট</span><p className="text-white mt-0.5 uppercase">{order.paymentMethod}</p></div>
                  <div className="col-span-2"><span className="text-white/40">ঠিকানা</span><p className="text-white mt-0.5">{order.deliveryAddress}</p></div>
                  <div className="col-span-2 mt-1 bg-primary/10 rounded-lg px-3 py-2 text-primary text-xs font-medium">{order.deliveryPolicy}</div>
                </div>

                {/* Status timeline */}
                <div>
                  <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">স্ট্যাটাস ইতিহাস</p>
                  <div className="flex flex-col gap-3">
                    {[...order.statusHistory].reverse().map((h, i) => {
                      const hc = STATUS_CONFIG[h.status];
                      const HIcon = hc.icon;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${hc.bg}`}>
                            <HIcon className={`w-3.5 h-3.5 ${hc.color}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${hc.color}`}>{hc.label}</p>
                            <p className="text-xs text-white/40">
                              {format(new Date(h.at), "d MMM yyyy, h:mm a")}
                            </p>
                            {h.note && <p className="text-xs text-white/60 mt-0.5">{h.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
