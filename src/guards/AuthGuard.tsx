import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/AuthContext";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: string;
}

/**
 * Redirects unauthenticated users to /auth/login.
 * Preserves the intended path via ?from= query param.
 * Uses useEffect to avoid calling setLocation during render.
 */
export function AuthGuard({ children, fallback = "/auth/login" }: AuthGuardProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(`${fallback}?from=${encodeURIComponent(location)}`);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
