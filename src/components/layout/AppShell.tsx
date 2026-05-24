import { useLocation } from "wouter";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./Sidebar";
import { DesktopRightPanel } from "./DesktopRightPanel";

interface AppShellProps { children: React.ReactNode; }

const FULL_WIDTH_PREFIXES = ["/reels", "/seller"];
const NO_RIGHT_PANEL_PREFIXES = [
  "/marketplace/product/",
  "/vendors/",
  "/profile",
  "/cart",
  "/orders",
  "/wallet",
  "/admin",
  "/b2b",
  "/export",
  "/logistics",
  "/portals",
  "/video/",
];

/* Header = 52px row + 40px tab bar = 92px total */
const HEADER_H = "pt-[92px]";

export function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();

  const isReels  = location === "/reels";
  const isAuth   = location.startsWith("/auth");
  const isFull   = FULL_WIDTH_PREFIXES.some((p) => location.startsWith(p));
  const noRight  = NO_RIGHT_PANEL_PREFIXES.some((p) => location.startsWith(p));

  /* ── Reels: full-screen immersive ── */
  if (isReels) {
    return (
      <div className="min-h-[100dvh] w-full bg-background">
        {children}
        <BottomNav />
      </div>
    );
  }

  /* ── Auth: centred card ── */
  if (isAuth) {
    return (
      <div className={`min-h-[100dvh] w-full bg-background flex flex-col ${HEADER_H}`}>
        <Header />
        <main className="flex-1 w-full flex items-start justify-center px-4 py-8">
          {children}
        </main>
      </div>
    );
  }

  /* ── Seller: full-width, own sidebar in SellerLayout ── */
  if (isFull) {
    return (
      <div className={`min-h-[100dvh] w-full bg-background flex flex-col ${HEADER_H}`}>
        <Header />
        <div className="flex-1 w-full pb-28 md:pb-8">
          {children}
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── Standard: 3-column desktop ── */
  return (
    <div className={`min-h-[100dvh] w-full bg-background flex flex-col ${HEADER_H}`}>
      <Header />
      <div className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto w-full md:px-4 xl:px-6 flex gap-4 xl:gap-5 pb-28 md:pb-10 pt-3">
          <DesktopSidebar />
          <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
          {!noRight && <DesktopRightPanel />}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
