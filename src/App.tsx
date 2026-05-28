import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/AppProviders";
import { AppShell } from "@/app/AppShell/AppShell";
import { orderTrackingService } from "@/modules/orders/orderTrackingService";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    orderTrackingService.initEventListener();
  }, []);

  return (
    <AppProviders>
      <AppShell />
      <Toaster />
    </AppProviders>
  );
}

export default App;
