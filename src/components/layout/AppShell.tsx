import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./Sidebar";
import { DesktopRightPanel } from "./DesktopRightPanel";
import { ComplianceFooter } from "./ComplianceFooter";

interface AppShellProps { children: React.ReactNode; }

const FULL_WIDTH_PREFIXES = ["/reels", "/seller", "/admin", "/b2b", "/video", "/search"];
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
const NO_SIDEBAR_PREFIXES = ["/search", "/reels", "/auth", "/checkout"];

/* Header = 52px row total */
const HEADER_H = "pt-[52px]";

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  const isReels   = location.pathname === "/reels";
  const isSearch  = location.pathname === "/search";
  const isAuth    = location.pathname.startsWith("/auth");
  const isFull    = FULL_WIDTH_PREFIXES.some((p) => location.pathname.startsWith(p));
  const noRight   = NO_RIGHT_PANEL_PREFIXES.some((p) => location.pathname.startsWith(p));
  const noSidebar = NO_SIDEBAR_PREFIXES.some((p) => location.pathname.startsWith(p));

  /* ── Immersive Pages (Search, Reels): Hide global header or handle overlap ── */
  if (isReels || isSearch) {
    return (
      <div className="min-h-[100dvh] w-full bg-background">
        <main className="w-full max-w-[480px] mx-auto min-h-screen border-x border-foreground/5 shadow-2xl relative bg-background">
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  /* ── Auth: centered card ── */
  if (isAuth) {
    return (
      <div className={`min-h-[100dvh] w-full bg-background flex flex-col ${HEADER_H}`}>
        <Header />
        <main className="flex-1 w-full flex items-start justify-center px-4 py-8">
          <div className="w-full max-w-[480px]">
            {children}
          </div>
        </main>
      </div>
    );
  }

  /* ── Seller/Admin/B2B Dashboards: Full width 3-column or sidebar layout ── */
  if (isFull && !isSearch) {
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

  /* ── Standard Consumer View: Centered 480px "Super App" look on Desktop ── */
  return (
    <div className={`min-h-[100dvh] w-full bg-background flex flex-col ${HEADER_H}`}>
      <Header />
      <div className="flex-1 w-full flex justify-center relative">
        {/* Desktop Sidebar (Left of center) */}
        {!noSidebar && (
          <div className="hidden xl:block fixed left-[calc(50%-240px-260px-24px)] top-[68px] w-[260px]">
             <DesktopSidebar />
          </div>
        )}

        {/* Main centered content area */}
        <main className="w-full max-w-[480px] bg-background min-h-[calc(100dvh-52px)] border-x border-foreground/5 shadow-2xl relative pb-28 md:pb-10 group/main">
          <div className={
            ["/services", "/transport", "/digital-services", "/travel", "/local", "/portals", "/marketplace"].some(p => location.pathname.startsWith(p))
              ? "p-0"
              : "p-3 md:p-4"
          }>
             {children}
          </div>
        </main>

        {/* Desktop Right Panel (Right of center) */}
        {!noRight && (
          <div className="hidden xl:block fixed left-[calc(50%+240px+24px)] top-[68px] w-[300px]">
             <DesktopRightPanel />
          </div>
        )}
      </div>
      <ComplianceFooter />
      <BottomNav />
    </div>
  );
}
