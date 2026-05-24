import * as React from "react";
import {
  useGetMe, getGetMeQueryKey,
  useListOrders, getListOrdersQueryKey,
  useListDemands, getListDemandsQueryKey,
  useListProducts, getListProductsQueryKey,
  useListPosts, getListPostsQueryKey,
} from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MapPin, Settings, ShieldCheck, Package, FileText, Heart,
  Store, LayoutDashboard, Trash2, ShoppingBag, Camera, Share2,
  Star, TrendingUp, Wallet, Bell, ChevronRight, Eye, EyeOff,
  LogOut, UserCheck, Lock, HelpCircle, Moon, Globe, CreditCard,
  Check, Clock, Truck, XCircle, Edit3, Phone, Mail, BadgeCheck,
} from "lucide-react";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/features/auth/AuthContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { usePKCoin } from "@/features/wallet/PKCoinContext";
import { toast } from "sonner";
import { PostCard } from "@/components/feed/PostCard";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, ROLE_COLORS } from "@/permissions/roles";
import type { AppRole } from "@/permissions/roles";

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ComponentType<{className?:string}> }> = {
  pending:    { label: "Pending",    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",   Icon: Clock },
  confirmed:  { label: "Confirmed",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20",      Icon: Check },
  shipped:    { label: "Shipped",    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",      Icon: Truck },
  delivered:  { label: "Delivered",  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", Icon: ShieldCheck },
  cancelled:  { label: "Cancelled",  color: "text-rose-400 bg-rose-500/10 border-rose-500/20",     Icon: XCircle },
};

const SETTINGS_GROUPS = [
  {
    title: "Account",
    items: [
      { label: "Edit Profile",       Icon: Edit3,    href: "#edit",        accent: "text-cyan-400" },
      { label: "Phone & Email",      Icon: Phone,    href: "#",            accent: "text-blue-400" },
      { label: "Addresses",          Icon: MapPin,   href: "#",            accent: "text-emerald-400" },
      { label: "Verification",       Icon: BadgeCheck, href: "#",          accent: "text-purple-400" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Notifications",      Icon: Bell,     href: "/notifications", accent: "text-amber-400" },
      { label: "Language",           Icon: Globe,    href: "#",            accent: "text-teal-400" },
      { label: "Appearance",         Icon: Moon,     href: "#",            accent: "text-indigo-400" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "PK Coin Wallet",     Icon: Wallet,   href: "/wallet",      accent: "text-cyan-400" },
      { label: "Payment Methods",    Icon: CreditCard, href: "#",          accent: "text-green-400" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Change Password",    Icon: Lock,     href: "#",            accent: "text-rose-400" },
      { label: "Privacy Settings",   Icon: UserCheck, href: "#",           accent: "text-violet-400" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help & FAQ",         Icon: HelpCircle, href: "#",          accent: "text-sky-400" },
    ],
  },
];

const TABS = [
  { v: "overview",  label: "Overview",  Icon: TrendingUp },
  { v: "orders",    label: "Orders",    Icon: Package },
  { v: "wishlist",  label: "Wishlist",  Icon: Heart },
  { v: "demands",   label: "Demands",   Icon: FileText },
  { v: "posts",     label: "Posts",     Icon: Store },
  { v: "settings",  label: "Settings",  Icon: Settings },
];

export default function Profile() {
  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: orders } = useListOrders({ query: { queryKey: getListOrdersQueryKey() } });
  const { data: demands } = useListDemands({ mine: true }, { query: { queryKey: getListDemandsQueryKey({ mine: true }) } });
  const { data: products } = useListProducts({}, { query: { queryKey: getListProductsQueryKey() } });
  const { data: posts } = useListPosts({}, { query: { queryKey: getListPostsQueryKey() } });
  const { role, logout } = useAuth();
  const wishlist = useWishlist();
  const { balance } = usePKCoin();

  const [activeTab, setActiveTab] = React.useState("overview");
  const [editOpen, setEditOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [balanceVisible, setBalanceVisible] = React.useState(true);

  React.useEffect(() => {
    if (user) { setName(user.name ?? ""); setBio(user.bio ?? ""); }
  }, [user]);

  const saveProfile = () => {
    try {
      window.localStorage.setItem("pm.profile.draft.v1", JSON.stringify({ name, bio }));
      toast.success("Profile updated");
      setEditOpen(false);
    } catch { toast.error("Could not save"); }
  };

  const isSeller = ["seller", "admin", "factory", "wholesale", "rural"].includes(role);
  const appRole = (role ?? "guest") as AppRole;

  const myPosts = (posts ?? []).filter((p) => p?.author?.id === user?.id || p?.author?.name === user?.name);
  const myProducts = (products ?? []).slice(0, 8);

  const displayName = name || user?.name || "User";
  const totalOrders = orders?.length ?? 0;
  const totalWishlist = wishlist.items.length;

  return (
    <div className="flex flex-col pb-24 min-h-screen">

      {/* ━━━ COVER PHOTO ━━━ */}
      <div className="relative h-44 md:h-60 w-full overflow-hidden rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=75"
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-[#04070f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-transparent to-purple-900/30" />
        {/* Cover edit button */}
        <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-white/70 text-[11px] font-medium hover:text-white transition-colors">
          <Camera className="h-3 w-3" /> Edit Cover
        </button>
      </div>

      {/* ━━━ AVATAR + NAME ROW ━━━ */}
      <div className="px-4 md:px-6 -mt-14 relative z-10">
        <div className="flex items-end justify-between">
          {/* Avatar */}
          <div className="relative">
            <div className="p-[3px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_24px_rgba(34,211,238,0.3)]">
              <Avatar className="h-24 w-24 md:h-28 md:w-28 border-3 border-[#04070f] rounded-full">
                <AvatarImage src={user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-900 to-blue-900 text-cyan-300">
                  {displayName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <button className="absolute bottom-0.5 right-0.5 h-7 w-7 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] border-2 border-[#04070f] hover:bg-cyan-400 transition-colors">
              <Camera className="h-3 w-3 text-black" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => { setEditOpen(true); }}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 text-[13px] font-semibold hover:bg-cyan-500/25 transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 transition-all">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 transition-all"
              onClick={() => setActiveTab("settings")}>
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Name + role + bio */}
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[22px] font-black text-white leading-tight">{displayName}</h1>
            {user?.verified && (
              <BadgeCheck className="h-5 w-5 text-cyan-400 fill-cyan-400/20" />
            )}
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
              ROLE_COLORS[appRole] ?? "bg-white/8 text-white/50 border-white/10"
            )}>
              {ROLE_LABELS[appRole] ?? role}
            </span>
          </div>

          {user?.handle && (
            <p className="text-[13px] text-cyan-400/70 font-medium">@{user.handle}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {user?.location && (
              <div className="flex items-center gap-1 text-[12px] text-white/45">
                <MapPin className="h-3 w-3 text-cyan-400/60" />
                {user.location}
              </div>
            )}
            {user?.trustScore != null && (
              <div className="flex items-center gap-1 text-[12px] text-amber-400/80">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Trust Score: <span className="font-bold text-amber-400">{user.trustScore}</span>
              </div>
            )}
          </div>

          {(bio || user?.bio) && (
            <p className="text-[13px] text-white/55 leading-relaxed mt-1 max-w-sm">
              {bio || user?.bio}
            </p>
          )}
        </div>

        {/* ━━━ STATS ROW ━━━ */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            { label: "Orders",   value: totalOrders,           color: "text-cyan-400" },
            { label: "Wishlist", value: totalWishlist,          color: "text-rose-400" },
            { label: "Posts",    value: myPosts.length,         color: "text-purple-400" },
            { label: "Rating",   value: `${user?.trustScore ?? 5.0}★`, color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="cyber-card rounded-2xl p-3 flex flex-col items-center gap-0.5">
              <span className={`text-[18px] font-black ${s.color}`}>{s.value}</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ━━━ WALLET CARD ━━━ */}
        <div className="mt-4">
          <GlassCard className="p-4 border border-cyan-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.3)]">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">PK Coin Balance</p>
                  <p className="text-[20px] font-black text-cyan-400 leading-tight">
                    {balanceVisible ? `৳ ${balance.toLocaleString()}` : "৳ ••••••"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setBalanceVisible((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors p-1">
                  {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <Link href="/wallet">
                  <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold hover:from-cyan-400 transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    Top Up
                  </button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ━━━ SELLER DASHBOARD SHORTCUT ━━━ */}
        {isSeller && (
          <Link href="/seller">
            <div className="mt-3 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/15 hover:border-emerald-500/30 transition-all cursor-pointer group">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <LayoutDashboard className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-white">Seller Dashboard</p>
                <p className="text-[11px] text-white/40">Manage products, orders & analytics</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        )}
      </div>

      {/* ━━━ TABS ━━━ */}
      <div className="sticky top-[92px] z-30 bg-[#04070f]/95 backdrop-blur-xl border-b border-white/[0.05] mt-5 px-4 md:px-6">
        <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => {
            const Icon = t.Icon;
            const active = activeTab === t.v;
            return (
              <button
                key={t.v}
                onClick={() => setActiveTab(t.v)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold transition-all duration-200",
                  active
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    : "text-white/45 hover:text-white/70 hover:bg-white/5",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━ TAB CONTENT ━━━ */}
      <div className="px-4 md:px-6 pt-5">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4">
            {/* Quick actions grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: isSeller ? "New Product" : "Open a Shop", sub: isSeller ? "List items for sale" : "Start selling today", Icon: Store, color: "from-emerald-500 to-teal-600", href: isSeller ? "/seller/products/new" : "/auth/seller-register" },
                { label: "Post a Demand", sub: "Sellers will bid for you", Icon: FileText, color: "from-amber-500 to-orange-600", href: "/demand" },
                { label: "Explore Portals", sub: "All platform features", Icon: TrendingUp, color: "from-violet-500 to-purple-600", href: "/portals" },
                { label: "B2B Wholesale", sub: "Bulk buying & selling", Icon: ShoppingBag, color: "from-cyan-500 to-blue-600", href: "/b2b" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <div className="group cursor-pointer cyber-card rounded-2xl p-4 flex flex-col gap-3 hover:border-white/15 transition-all">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <a.Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white leading-tight">{a.label}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{a.sub}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent orders preview */}
            {(orders?.length ?? 0) > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-white/70 uppercase tracking-widest">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-[12px] text-cyan-400 flex items-center gap-0.5 hover:text-cyan-300">
                    See all <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {orders?.slice(0, 2).map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {/* Wishlist preview */}
            {wishlist.items.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-white/70 uppercase tracking-widest">Wishlist</h3>
                  <button onClick={() => setActiveTab("wishlist")} className="text-[12px] text-cyan-400 flex items-center gap-0.5">
                    See all <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
                  {wishlist.items.slice(0, 6).map((w) => (
                    <div key={w.productId} className="shrink-0 w-24 flex flex-col gap-1">
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        {w.imageUrl && <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover" />}
                      </div>
                      <p className="text-[10px] text-white/60 truncate">{w.title}</p>
                      <p className="text-[11px] font-bold text-cyan-400">৳{w.price?.toFixed?.(0) ?? 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-3">
            {(orders?.length ?? 0) === 0
              ? <EmptyState Icon={Package} title="No orders yet" sub="Your purchases will appear here." />
              : orders?.map((order) => <OrderCard key={order.id} order={order} full />)
            }
          </div>
        )}

        {/* WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="flex flex-col gap-3">
            {wishlist.items.length === 0
              ? <EmptyState Icon={Heart} title="Wishlist is empty" sub="Save products you love." />
              : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {wishlist.items.map((w) => (
                    <div key={w.productId} className="group relative cyber-card rounded-2xl overflow-hidden">
                      {w.imageUrl && (
                        <div className="aspect-square overflow-hidden">
                          <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-[12px] text-white/85 font-medium truncate">{w.title}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[13px] font-bold text-cyan-400">৳{w.price?.toFixed?.(0) ?? 0}</span>
                          <button onClick={() => wishlist.remove(w.productId)} className="text-white/30 hover:text-rose-400 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* DEMANDS */}
        {activeTab === "demands" && (
          <div className="flex flex-col gap-3">
            {(demands?.length ?? 0) === 0
              ? <EmptyState Icon={FileText} title="No demands yet" sub="Post what you need — sellers will bid." />
              : demands?.map((d) => (
                  <Link key={d.id} href={`/demand/${d.id}`}>
                    <div className="cyber-card rounded-2xl p-4 hover:border-white/15 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-[14px] font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">{d.title}</h3>
                        <span className={cn(
                          "shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          d.status === "open"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-white/40 bg-white/5 border-white/10"
                        )}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/50 line-clamp-2 mb-3">{d.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-black text-cyan-400">৳{d.budget}</span>
                        <span className="text-[11px] text-white/40">{d.matchCount ?? 0} offers</span>
                        <ChevronRight className="h-3.5 w-3.5 text-white/20 ml-auto group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))
            }
          </div>
        )}

        {/* POSTS */}
        {activeTab === "posts" && (
          <div className="flex flex-col gap-3">
            {isSeller && (
              <div className="mb-2">
                <p className="text-[11px] text-white/40 mb-3 uppercase tracking-widest">My Products ({myProducts.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {myProducts.map((p) => (
                    <Link key={p.id} href={`/marketplace/product/${p.id}`}>
                      <div className="group cursor-pointer cyber-card rounded-2xl overflow-hidden hover:border-white/15 transition-all">
                        <div className="aspect-square overflow-hidden">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            : <div className="w-full h-full skeleton-shimmer" />
                          }
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] text-white/75 truncate font-medium">{p.title}</p>
                          <p className="text-[12px] font-bold text-cyan-400 mt-0.5">৳{p.price?.toFixed?.(0) ?? 0}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {myPosts.length === 0
              ? <EmptyState Icon={Store} title="No posts yet" sub="Your community posts will appear here." />
              : myPosts.map((p) => <PostCard key={p.id} post={p} />)
            }
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-5 pb-8">
            {SETTINGS_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 pl-1">{group.title}</p>
                <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.03]">
                  {group.items.map((item, idx) => (
                    <Link key={item.label} href={item.href === "#edit" ? "#" : item.href}>
                      <button
                        onClick={item.href === "#edit" ? () => setEditOpen(true) : undefined}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors text-left",
                          idx < group.items.length - 1 && "border-b border-white/[0.05]",
                        )}
                      >
                        <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0", `bg-current/10`)}>
                          <item.Icon className={cn("h-4 w-4", item.accent)} />
                        </div>
                        <span className="flex-1 text-[13px] font-medium text-white/80">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Log out */}
            <button
              onClick={() => { logout?.(); toast.success("Logged out"); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-rose-500/15 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
            >
              <div className="h-8 w-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <LogOut className="h-4 w-4 text-rose-400" />
              </div>
              <span className="flex-1 text-[13px] font-medium text-rose-400">Log Out</span>
            </button>

            {/* App version */}
            <p className="text-center text-[10px] text-white/20 mt-2">PaikarMart v2.0 · Build 2026</p>
          </div>
        )}
      </div>

      {/* ━━━ EDIT DIALOG ━━━ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#0d1829] border border-white/10 text-white rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-[11px] text-white/50 uppercase tracking-wider mb-1.5 block">Display Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/[0.07] border border-white/10 focus:border-cyan-500/50 rounded-xl h-11 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/50 uppercase tracking-wider mb-1.5 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell people about yourself…"
                className="w-full bg-white/[0.07] border border-white/10 focus:border-cyan-500/50 rounded-xl p-4 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none transition-all"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)} className="text-white/60 hover:text-white hover:bg-white/8">
              Cancel
            </Button>
            <Button onClick={saveProfile} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:from-cyan-400 rounded-xl px-6">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderCard({ order, full }: { order: any; full?: boolean }) {
  const cfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.pending;
  const StatusIcon = cfg.Icon;
  return (
    <div className={cn("cyber-card rounded-2xl p-4", full && "hover:border-white/15 transition-all")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[11px] text-white/35 font-mono">#{order.id.slice(0, 10).toUpperCase()}</span>
          <span className="text-[14px] font-bold text-white">
            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          <span className="text-[11px] text-white/40 mt-0.5">
            {format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[18px] font-black text-cyan-400">৳{order.total?.toFixed(0)}</span>
          <div className={cn("flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border", cfg.color)}>
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </div>
        </div>
      </div>
      {full && (
        <div className="mt-3 flex gap-2">
          <button className="flex-1 h-8 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
            Track Order
          </button>
          <button className="flex-1 h-8 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ Icon, title, sub }: { Icon: React.ComponentType<{className?:string}>; title: string; sub: string }) {
  return (
    <div className="py-14 flex flex-col items-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
      <Icon className="h-10 w-10 text-white/15 mb-3" />
      <p className="text-[14px] font-semibold text-white/50">{title}</p>
      <p className="text-[12px] text-white/30 mt-1 max-w-xs">{sub}</p>
    </div>
  );
}
