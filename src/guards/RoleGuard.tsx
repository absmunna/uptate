import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../modules/auth/authStore';

export const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user && allowedRoles.includes(user.role)) return <>{children}</>;
  
  return <Navigate to="/dashboard" replace />; // Redirect unauthorized users to basic dashboard or home
};
