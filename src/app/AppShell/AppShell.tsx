import React from 'react';
import { useLocation } from "react-router-dom";
import { GlobalTopBar as Header } from "./GlobalTopBar";
import { MobileBottomNav as BottomNav } from "./MobileBottomNav";
import { DesktopNav } from "./DesktopNav";
import { GlobalRouter } from "./GlobalRouter";
import { EventSyncProvider } from "./EventSyncProvider";
import { RoleBasedShell } from "./RoleBasedShell";

export const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isReels = pathname === "/reels";

  const content = (
    <div className={isReels ? "h-[100dvh] w-full bg-black overflow-hidden" : "min-h-[100dvh] w-full flex flex-col"}>
      {!isReels && <Header onToggleSidebar={() => {}} />}
      <div className={isReels ? "h-full" : "flex flex-1 w-full max-w-[1440px] mx-auto px-0"}>
        {!isReels && <DesktopNav />}
        <main className={isReels ? "h-full" : "flex-1 min-w-0 pt-[64px] pb-[max(5rem,env(safe-area-inset-bottom))]"}>
          <GlobalRouter />
        </main>
      </div>
      <BottomNav />
    </div>
  );

  return (
      <EventSyncProvider>
        <RoleBasedShell>
          {content}
        </RoleBasedShell>
      </EventSyncProvider>
  );
};
