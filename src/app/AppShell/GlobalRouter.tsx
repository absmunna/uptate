import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routeConfig';
import { useAuth } from '@/features/auth/AuthContext';
import { PageSkeleton } from './GlobalSkeletonSystem';

import { useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const GlobalRouter: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const currentRoute = ROUTES.find(r => r.path === location.pathname);
    const rawTitle = currentRoute?.path === '/' ? 'Home Feed' : location.pathname.split('/').filter(Boolean).pop();
    const title = typeof rawTitle === 'string' && rawTitle.length > 0 ? rawTitle : 'Portal';
    const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    document.title = `${formattedTitle} | Paikar Mart`;

    // Inject Meta Description for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Explore ${formattedTitle} on Paikar Mart - Bangladesh's leading social commerce super app for b2b, retail and wholesale sourcing.`);
    
  }, [location]);

  return (
    <Suspense fallback={<PageSkeleton />}>
        <Routes>
            {ROUTES.map((route) => {
                const Component = route.component;
                return (
                    <Route 
                        key={route.path}
                        path={route.path}
                        element={
                            route.isPublic ? (
                                <Component />
                            ) : (
                                <PrivateRoute allowedRoles={route.roles.map(r => r)}>
                                    <Component />
                                </PrivateRoute>
                            )
                        }
                    />
                );
            })}
            {/* Fallback 404 handled elsewhere or here */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Suspense>
  );
};
