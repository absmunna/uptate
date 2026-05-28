import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronLeft, 
  Package, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders, Order } from "@/features/orders/order.api";
import { useNotificationStore } from "@/store/notificationStore";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
      return {
        icon: Clock,
        className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        labelBn: "অপেক্ষমান",
        labelEn: "Pending"
      };
    case "processing":
      return {
        icon: Loader2,
        className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        labelBn: "প্রক্রিয়াধীন",
        labelEn: "Processing"
      };
    case "shipped":
      return {
        icon: Truck,
        className: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        labelBn: "শিপড",
        labelEn: "Shipped"
      };
    case "delivered":
      return {
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        labelBn: "ডেলিভারড",
        labelEn: "Delivered"
      };
    case "cancelled":
    case "canceled":
      return {
        icon: XCircle,
        className: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        labelBn: "বাতিল",
        labelEn: "Cancelled"
      };
    default:
      return {
        icon: AlertCircle,
        className: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
        labelBn: status,
        labelEn: status
      };
  }
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await listOrders();
        setOrders(data);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
        addNotification("Failed to fetch order history", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-20">
      <header className="sticky top-0 z-10 bg-[var(--pm-surface)] border-b border-[var(--pm-border)] p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-[var(--pm-glass)]">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">আমার অর্ডারসমূহ (Order History)</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-4 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-[var(--pm-accent)] text-white' : 'bg-[var(--pm-elevated)] text-[var(--pm-text)] border border-[var(--pm-border)]'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[var(--pm-elevated)] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <Package className="w-16 h-16 text-[var(--pm-text-secondary)]" />
            <p className="text-[var(--pm-text-secondary)]">কোনো অর্ডার পাওয়া যায়নি</p>
            <Link to="/" className="px-6 py-2 rounded-full bg-[var(--pm-accent)] text-white">কেনাকাটা শুরু করুন</Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-[var(--pm-text-secondary)]">
            এই ফিল্টারে কোনো অর্ডার নেই
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={order.id} className="bg-[var(--pm-elevated)] p-4 rounded-2xl border border-[var(--pm-border)] space-y-3 hover:border-[var(--pm-accent)]/20 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[var(--pm-accent)]" />
                    <span className="font-medium text-sm text-[var(--pm-text-secondary)]">ID: {order.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{statusConfig.labelBn} ({statusConfig.labelEn})</span>
                  </span>
                </div>
              
                <div className="text-sm">
                  <p className="font-semibold">{order.items.length}টি পণ্য</p>
                  <p className="text-[var(--pm-text-secondary)]">৳{order.total.toFixed(2)}</p>
                </div>

                <div className="flex items-center text-xs text-[var(--pm-text-secondary)] gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
