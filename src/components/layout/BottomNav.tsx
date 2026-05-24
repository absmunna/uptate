import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, ShoppingCart, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { useGetCart } from "@workspace/api-client-react";

const LEFT_ITEMS = [
  { href: "/",         label: "Home",    icon: Home },
  { href: "/portals",  label: "Apps",    icon: LayoutGrid },
];
const RIGHT_ITEMS = [
  { href: "/cart",    label: "Cart",    icon: ShoppingCart },
  { href: "/profile", label: "Account", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();
  const { role } = useAuth();
  const { data: cart } = useGetCart();

  const cartCount = cart?.itemCount ?? 0;
  const createHref = role === "seller" || role === "admin" ? "/seller/products/new" : "/auth/seller-register";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      {/* Floating pill container */}
      <div className="mx-3 mb-2.5">
        <div className="glass-panel rounded-2xl border border-white/[0.08] shadow-[0_-4px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(34,211,238,0.06)]">
          <div className="flex items-center h-16 px-2">

            {/* Left items */}
            {LEFT_ITEMS.map((item) => {
              const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 h-full gap-1 group">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    active ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" : "text-white/40 group-hover:text-white/70",
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-cyan-400" : "text-white/35 group-hover:text-white/60",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Centre create button */}
            <Link href={createHref} className="flex flex-col items-center justify-center flex-shrink-0 px-4 h-full">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center neon-glow-btn shadow-lg -mt-5 border border-cyan-400/40 active:scale-95 transition-transform">
                <Plus className="h-6 w-6 text-white" />
              </div>
            </Link>

            {/* Right items */}
            {RIGHT_ITEMS.map((item) => {
              const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              const isCart = item.href === "/cart";
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative">
                  <div className="relative">
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      active ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" : "text-white/40 group-hover:text-white/70",
                    )} />
                    {isCart && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-cyan-500 text-[8px] font-bold text-black shadow-[0_0_4px_rgba(34,211,238,0.7)]">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-cyan-400" : "text-white/35 group-hover:text-white/60",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

          </div>
        </div>
      </div>
    </nav>
  );
}
