import { Link } from "react-router-dom";
import { User, LayoutDashboard, Megaphone, FileCode2, LogOut, Store, ShoppingBag, Bell, Home, ShoppingCart, Zap } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSeller } from "@/seller/SellerContext";
import { useGetMe, useListNotifications } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINKS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/cart", icon: ShoppingCart, label: "My Cart" },
  { href: "/orders", icon: ShoppingBag, label: "My Orders" },
  { href: "/notifications", icon: Bell, label: "Notifications", badge: true },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { isSeller } = useSeller();
  const { data: user } = useGetMe();
  const { data: notifications } = useListNotifications();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] w-[290px] max-w-[88vw] p-0 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--pm-border)]">
          <Link to="/" onClick={close} className="font-extrabold text-xl text-[var(--pm-accent)] block mb-4">PaikarMart</Link>
          {user && (
            <Link to="/profile" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--pm-elevated)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface)] transition-colors">
              <Avatar className="h-11 w-11 border border-[var(--pm-border)] shrink-0">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-[var(--pm-accent)]/20 text-[var(--pm-accent)]">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--pm-text)] truncate text-sm">{user.name}</p>
                <p className="text-xs text-[var(--pm-text-secondary)] truncate">@{user.handle} · {user.location}</p>
              </div>
            </Link>
          )}
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-colors text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]"
                onClick={close}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--pm-text-secondary)]" />
                <span className="text-sm">{item.label}</span>
                {item.badge && unread > 0 && (
                  <Badge className="ml-auto bg-[var(--pm-accent)] text-[var(--pm-text)] text-[10px] h-5 min-w-[20px] px-1.5">{unread}</Badge>
                )}
              </Link>
            );
          })}

          <div className="h-px bg-[var(--pm-border)] my-3" />

          <p className="text-[10px] uppercase tracking-widest text-[var(--pm-text-secondary)] px-3 mb-1 font-semibold">Commerce</p>

          {isSeller ? (
            <Link to="/seller" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-colors text-[var(--pm-accent)]/90 hover:text-[var(--pm-accent)]" onClick={close}>
              <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />
              <span className="text-sm">Seller Dashboard</span>
            </Link>
          ) : (
            <Link to="/seller/verification" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 hover:bg-[var(--pm-accent)]/15 transition-colors text-[var(--pm-accent)]" onClick={close}>
              <Store className="h-[18px] w-[18px] shrink-0" />
              <span className="text-sm font-medium">Become a Seller</span>
            </Link>
          )}

          <Link to="/seller" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-colors text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]" onClick={close}>
            <Megaphone className="h-[18px] w-[18px] shrink-0 text-[var(--pm-text-secondary)]" />
            <span className="text-sm">Ads Manager</span>
          </Link>

          <div className="h-px bg-[var(--pm-border)] my-3" />

          <p className="text-[10px] uppercase tracking-widest text-[var(--pm-text-secondary)] px-3 mb-1 font-semibold">Tools</p>

          <Link to="/admin/dev-notes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-colors text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]" onClick={close}>
            <Zap className="h-[18px] w-[18px] shrink-0 text-[var(--pm-text-secondary)]" />
            <span className="text-sm">AI Tools & Dev Notes</span>
          </Link>
          <Link to="/admin/dev-notes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--pm-elevated)] transition-colors text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]" onClick={close}>
            <FileCode2 className="h-[18px] w-[18px] shrink-0 text-[var(--pm-text-secondary)]" />
            <span className="text-sm">API Console</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--pm-border)]">
          <button
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/15 transition-colors text-red-400/80 hover:text-red-400 w-full text-left text-sm"
            onClick={close}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
