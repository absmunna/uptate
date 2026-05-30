import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useListNotifications, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Bell, ShoppingBag, Star, MessageSquare, AlertCircle,
  FileText, Check, CheckCheck, Settings, Trash2, Filter,
  Package, Truck, TrendingUp, Zap, Users, Tag,
  ChevronRight, X, BellOff
} from "lucide-react";

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  order:        { icon: ShoppingBag,   color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  review:       { icon: Star,          color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  message:      { icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  demand_match: { icon: FileText,      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  admin:        { icon: AlertCircle,   color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  promo:        { icon: Tag,           color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/20" },
  delivery:     { icon: Truck,         color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
  seller:       { icon: TrendingUp,    color: "text-lime-400",    bg: "bg-lime-500/10",    border: "border-lime-500/20" },
  system:       { icon: Zap,           color: "text-zinc-400",    bg: "bg-zinc-500/10",    border: "border-zinc-500/20" },
  default:      { icon: Bell,          color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
};

const FILTER_TABS = [
  { id: "all",    label: "All" },
  { id: "unread", label: "Unread" },
  { id: "order",  label: "Orders" },
  { id: "promo",  label: "Promos" },
  { id: "system", label: "System" },
];

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications({ query: { queryKey: getListNotificationsQueryKey() } });
  const [filter, setFilter] = useState("all");
  const [read, setRead] = useState<Set<string>>(new Set());

  const allNotifs = notifications || [];
  const unreadCount = allNotifs.filter((n: any) => !n.read && !read.has(n.id)).length;

  const shown = allNotifs.filter((n: any) => {
    if (filter === "unread") return !n.read && !read.has(n.id);
    if (filter !== "all") return n.type === filter;
    return true;
  });

  const markRead = (id: string) => setRead(prev => new Set([...prev, id]));
  const markAllRead = () => setRead(new Set(allNotifs.map((n: any) => n.id)));

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <div className="px-4 pt-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-4 bg-gradient-to-br from-violet-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Bell className="w-6 h-6 text-violet-400" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-red-500 border-2 border-[var(--pm-bg)] flex items-center justify-center">
                    <span className="text-[9px] font-black text-white px-1">{unreadCount > 99 ? "99+" : unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-base font-black text-white">Notifications</h1>
                <p className="text-[11px] text-zinc-400">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400">
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {FILTER_TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={cn("px-3.5 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", filter === tab.id ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
              {tab.label}
              {tab.id === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-[8px] text-white font-black">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-18 flex gap-3 p-3.5 rounded-2xl">
                <div className="w-10 h-10 rounded-2xl skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
                  <div className="h-2.5 w-full rounded-full skeleton-shimmer" />
                  <div className="h-2 w-1/4 rounded-full skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && shown.length === 0 && (
          <div className="py-20 text-center">
            <BellOff className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-[14px] font-black text-zinc-600">No notifications</p>
            <p className="text-[11px] text-zinc-700 mt-1">{filter !== "all" ? "Try a different filter" : "You're all caught up!"}</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && shown.length > 0 && (
          <div className="space-y-1.5">
            {shown.map((notif: any, i: number) => {
              const isUnread = !notif.read && !read.has(notif.id);
              const meta = TYPE_META[notif.type] || TYPE_META.default;
              const Icon = meta.icon;
              return (
                <motion.div key={notif.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => markRead(notif.id)}
                  className={cn("flex gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer", isUnread ? "bg-white/[0.04] border-white/[0.08]" : "bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]")}
                >
                  <div className={cn("w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 relative", meta.bg, meta.border)}>
                    <Icon className={cn("w-4 h-4", meta.color)} />
                    {isUnread && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[var(--pm-bg)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-[12px] leading-tight", isUnread ? "font-black text-white" : "font-semibold text-zinc-300")}>{notif.title || "Notification"}</p>
                      <span className="text-[9px] text-zinc-600 shrink-0 mt-0.5 whitespace-nowrap">{notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : "recently"}</span>
                    </div>
                    <p className={cn("text-[10px] mt-0.5 line-clamp-2", isUnread ? "text-zinc-400" : "text-zinc-600")}>{notif.body || notif.message || ""}</p>
                    {notif.link && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className={cn("text-[9px] font-black", meta.color)}>View details</span>
                        <ChevronRight className={cn("w-3 h-3", meta.color)} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
