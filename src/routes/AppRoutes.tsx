import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { publicRoutes } from './public.routes';
import { RoleGuard } from '../guards/RoleGuard';
import { SellerDashboard } from '../pages/dashboards/SellerDashboard';
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { ModeratorDashboard } from '../pages/dashboards/ModeratorDashboard';
import { B2BLayout } from '../portals/b2b/layouts/B2BLayout';
import { B2BHome } from '../portals/b2b/pages/B2BHome';
import { Dashboard as B2BDashboard } from '../portals/b2b/pages/Dashboard';
import { Products as B2BProducts } from '../portals/b2b/pages/Products';
import { Orders as B2BOrders } from '../portals/b2b/pages/Orders';
import { WalletDashboard } from '../modules/wallet/pages/WalletDashboard';
import { B2CLayout } from '../portals/b2c/layouts/B2CLayout';
import { B2CHome } from '../portals/b2c/pages/B2CHome';
import { PKStoreHome } from '../portals/pk-store/pages/PKStoreHome';
import { NotFound } from '../pages/NotFound';
import Login from '../modules/auth/pages/Login';
import Register from '../modules/auth/pages/Register';
import { CheckoutPage } from '../pages/CheckoutPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/*" element={
        <RootLayout>
          <Routes>
            {publicRoutes}
            <Route 
              path="/b2b/*" 
              element={
                <B2BLayout>
                  <Routes>
                    <Route path="/" element={<B2BHome />} />
                    <Route path="/dashboard" element={<B2BDashboard />} />
                    <Route path="/products" element={<B2BProducts />} />
                    <Route path="/orders" element={<B2BOrders />} />
                  </Routes>
                </B2BLayout>
              } 
            />
            <Route 
              path="/wallet/*" 
              element={
                  <Routes>
                    <Route path="/" element={<WalletDashboard />} />
                  </Routes>
              } 
            />
            <Route 
              path="/b2c/*" 
              element={
                <B2CLayout>
                  <Routes>
                    <Route path="/" element={<B2CHome />} />
                  </Routes>
                </B2CLayout>
              } 
            />
            <Route 
              path="/pk-store/*" 
              element={
                  <Routes>
                    <Route path="/" element={<PKStoreHome />} />
                  </Routes>
              } 
            />
            <Route path="*" element={<NotFound />} />
            
            {/* Dashboard Routing with strict RoleGuard */}
            <Route 
              path="/dashboard" 
              element={
                <RoleGuard allowedRoles={['seller', 'moderator', 'admin', 'super_admin']}>
                  <SellerDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/dashboard/admin/*" 
              element={
                <RoleGuard allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/dashboard/moderator/*" 
              element={
                <RoleGuard allowedRoles={['moderator', 'admin', 'super_admin']}>
                  <ModeratorDashboard />
                </RoleGuard>
              } 
            />
          </Routes>
        </RootLayout>
      } />
    </Routes>
  );
};
