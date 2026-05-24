import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/AuthContext";
import type { ReactNode } from "react";
import type { AppRole } from "@/permissions/roles";
import { meetsRoleRequirement } from "@/permissions/accessControl";
import type { Permission } from "@/permissions/permissions";
import { hasPermission } from "@/permissions/permissions";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldOff } from "lucide-react";
import { Link } from "wouter";

interface RoleGuardProps {
  children: ReactNode;
  /** Minimum role level required */
  minRole?: AppRole;
  /** Specific roles allowed (OR logic) */
  roles?: AppRole[];
  /** Permission required */
  permission?: Permission;
  /** Show inline access-denied instead of redirect */
  inline?: boolean;
}

export function RoleGuard({ children, minRole, roles, permission, inline }: RoleGuardProps) {
  const [location, setLocation] = useLocation();
  const { role, isAuthenticated } = useAuth();

  const appRole = (role ?? "guest") as AppRole;

  const allowed =
    isAuthenticated &&
    (!minRole || meetsRoleRequirement(appRole, minRole)) &&
    (!roles || roles.includes(appRole)) &&
    (!permission || hasPermission(appRole, permission));

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(`/auth/login?from=${encodeURIComponent(location)}`);
    } else if (!allowed && !inline) {
      setLocation("/");
    }
  }, [isAuthenticated, allowed, inline]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated || (!allowed && !inline)) return null;

  if (!allowed && inline) {
    return (
      <GlassCard className="py-16 flex flex-col items-center justify-center text-center border border-rose-500/15">
        <ShieldOff className="h-10 w-10 text-rose-400/50 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Access Denied</h3>
        <p className="text-sm text-white/45 max-w-xs mb-4">
          তোমার বর্তমান role ({role}) এই পেজটি দেখার অনুমতি নেই।
        </p>
        <Link href="/">
          <button className="px-5 py-2 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/30 transition-all">
            হোমে ফিরে যাও
          </button>
        </Link>
      </GlassCard>
    );
  }

  return <>{children}</>;
}
