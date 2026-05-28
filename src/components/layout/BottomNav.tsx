import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";
import { useGetCart } from "@workspace/api-client-react";

const LEFT_ITEMS = [
  { href: "/portals",  label: "Apps",    icon: LayoutGrid },
  { href: "/categories", label: "Explore", icon: Compass },
];

const RIGHT_ITEMS = [
  { href: "/cart",    label: "Cart",    icon: ShoppingCart },
  { href: "/profile", label: "Account", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const { role } = useAuth();
  const { data: cart } = useGetCart();

  const cartCount = cart?.itemCount ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      {/* Floating pill container */}
      <div className="mx-3 mb-2.5">
        <div className="glass-panel rounded-2xl border border-border/80 shadow-[0_-4px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(var(--primary),0.06)]">
          <div className="flex items-center h-16 px-2">

            {/* Left items */}
            {LEFT_ITEMS.map((item) => {
              const active = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href} className="flex flex-col items-center justify-center flex-1 h-full gap-1 group">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    active ? "text-primary" : "text-foreground/40 group-hover:text-foreground/75",
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-primary" : "text-foreground/35 group-hover:text-foreground/60",
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Centre Home button */}
            <Link to="/" className="flex flex-col items-center justify-center flex-shrink-0 px-4 h-full">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg -mt-5 border transition-transform active:scale-95 cursor-pointer",
                location.pathname === "/" 
                  ? "bg-gradient-to-br from-primary to-accent border-primary/40 text-primary-foreground" 
                  : "bg-card/90 border-border/80 backdrop-blur-md"
              )}>
                <Home className={cn(
                  "h-6 w-6 transition-colors",
                  location.pathname === "/" ? "text-primary-foreground" : "text-primary"
                )} />
              </div>
            </Link>

            {/* Right items */}
            {RIGHT_ITEMS.map((item) => {
              const active = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              const isCart = item.href === "/cart";
              return (
                <Link key={item.href} to={item.href} className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative">
                  <div className="relative">
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      active ? "text-primary" : "text-foreground/40 group-hover:text-foreground/75",
                    )} />
                    {isCart && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-sm">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    active ? "text-primary" : "text-foreground/35 group-hover:text-foreground/60",
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
