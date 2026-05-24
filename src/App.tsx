import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import ProductDetail from "@/pages/product-detail";
import Vendors from "@/pages/vendors";
import VendorDetail from "@/pages/vendor-detail";
import Local from "@/pages/local";
import Categories from "@/pages/categories";
import Reels from "@/pages/reels";
import Demand from "@/pages/demand";
import DemandDetail from "@/pages/demand-detail";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import Notifications from "@/pages/notifications";
import DevNotes from "@/pages/dev-notes";
import Profile from "@/pages/profile";

import { SellerProvider } from "@/seller/SellerContext";
import { SellerLayout } from "@/seller/SellerLayout";
import SellerDashboard from "@/pages/seller/dashboard";
import SellerProducts from "@/pages/seller/products";
import SellerProductForm from "@/pages/seller/product-form";
import SellerOrdersPage from "@/pages/seller/orders";
import SellerProfilePage from "@/pages/seller/profile";
import SellerVerification from "@/pages/seller/verification";
import SellerAnalytics from "@/pages/seller/analytics";

// New: feature providers
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { LanguageProvider } from "@/features/language/LanguageContext";
import { AuthProvider } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";
import { LocationProvider } from "@/features/location/LocationContext";
import { PKCoinProvider } from "@/features/wallet/PKCoinContext";
import { VideoUnlockProvider } from "@/features/digital-content/VideoUnlockContext";

// New: pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import SellerRegisterPage from "@/pages/auth/seller-register";
import WalletPage from "@/pages/wallet";
import VideoLibrary from "@/pages/video";
import VideoDetail from "@/pages/video/detail";
import VideoPackage from "@/pages/video/package";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSettings from "@/pages/admin/settings";
import AdminChanges from "@/pages/admin/changes";
import AdminRegistry from "@/pages/admin/registry";
import AdminUsers from "@/pages/admin/users";
import FactoryRegisterPage from "@/pages/auth/factory-register";
import WholesaleRegisterPage from "@/pages/auth/wholesale-register";
import RuralRegisterPage from "@/pages/auth/rural-register";
import ExportMarketplace from "@/pages/export/index";
import FactoryDetailPage from "@/pages/export/factory-detail";
import B2BHub from "@/pages/b2b/index";
import LogisticsPage from "@/pages/logistics/index";
import Portals from "@/pages/portals";
import SearchPage from "@/pages/search";

// Guards
import { AuthGuard }   from "@/guards/AuthGuard";
import { SellerGuard } from "@/guards/SellerGuard";
import { AdminGuard }  from "@/guards/AdminGuard";
import { PortalGuard } from "@/guards/PortalGuard";

const queryClient = new QueryClient();

function SellerRoutes() {
  return (
    <AuthGuard>
      <SellerGuard>
        <SellerLayout>
          <Switch>
            <Route path="/seller" component={SellerDashboard} />
            <Route path="/seller/products" component={SellerProducts} />
            <Route path="/seller/products/new" component={SellerProductForm} />
            <Route path="/seller/products/:id/edit" component={SellerProductForm} />
            <Route path="/seller/new-product" component={SellerProductForm} />
            <Route path="/seller/orders" component={SellerOrdersPage} />
            <Route path="/seller/analytics" component={SellerAnalytics} />
            <Route path="/seller/profile" component={SellerProfilePage} />
            <Route path="/seller/verification" component={SellerVerification} />
            <Route component={NotFound} />
          </Switch>
        </SellerLayout>
      </SellerGuard>
    </AuthGuard>
  );
}

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/marketplace/product/:id" component={ProductDetail} />
        <Route path="/vendors" component={Vendors} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/local" component={Local} />
        <Route path="/categories" component={Categories} />
        <Route path="/reels" component={Reels} />
        <Route path="/demand" component={Demand} />
        <Route path="/demand/:id" component={DemandDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
        <Route path="/notifications" component={Notifications} />

        {/* Auth */}
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        <Route path="/auth/seller-register" component={SellerRegisterPage} />
        <Route path="/auth/factory-register" component={FactoryRegisterPage} />
        <Route path="/auth/wholesale-register" component={WholesaleRegisterPage} />
        <Route path="/auth/rural-register" component={RuralRegisterPage} />

        {/* Cross-border export */}
        <Route path="/export" component={ExportMarketplace} />
        <Route path="/export/factory/:id" component={FactoryDetailPage} />

        {/* B2B Supply Chain Hub */}
        <Route path="/b2b" component={B2BHub} />

        {/* Logistics */}
        <Route path="/logistics" component={LogisticsPage} />

        {/* Search */}
        <Route path="/search" component={SearchPage} />

        {/* Portal launcher */}
        <Route path="/portals" component={Portals} />

        {/* Wallet */}
        <Route path="/wallet" component={WalletPage} />

        {/* Digital video content */}
        <Route path="/video" component={VideoLibrary} />
        <Route path="/video/package/:id" component={VideoPackage} />
        <Route path="/video/:id" component={VideoDetail} />

        {/* Admin — guarded */}
        <Route path="/admin">
          {() => <AdminGuard><AdminDashboard /></AdminGuard>}
        </Route>
        <Route path="/admin/settings">
          {() => <AdminGuard><AdminSettings /></AdminGuard>}
        </Route>
        <Route path="/admin/changes">
          {() => <AdminGuard><AdminChanges /></AdminGuard>}
        </Route>
        <Route path="/admin/registry">
          {() => <AdminGuard><AdminRegistry /></AdminGuard>}
        </Route>
        <Route path="/admin/users">
          {() => <AdminGuard><AdminUsers /></AdminGuard>}
        </Route>
        <Route path="/admin/dev-notes">
          {() => <AdminGuard><DevNotes /></AdminGuard>}
        </Route>

        <Route path="/seller/:rest*" component={SellerRoutes} />
        <Route path="/seller" component={SellerRoutes} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <PKCoinProvider>
              <VideoUnlockProvider>
                <WishlistProvider>
                  <CartProvider>
                    <TooltipProvider>
                      <SellerProvider>
                        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                          <Router />
                        </WouterRouter>
                        <Toaster />
                      </SellerProvider>
                    </TooltipProvider>
                  </CartProvider>
                </WishlistProvider>
              </VideoUnlockProvider>
            </PKCoinProvider>
          </LocationProvider>
        </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
