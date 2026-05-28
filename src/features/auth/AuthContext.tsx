import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { safeStorage } from "@/utils/storage";

export type AppRole =
  | "guest" | "buyer" | "user"
  | "seller" | "wholesale" | "factory"
  | "rural" | "nearby_shop" | "rider"
  | "service_provider" | "digital_seller"
  | "moderator" | "admin" | "super_admin";

export interface AppUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: AppRole;
  roles?: AppRole[];
  permissions?: string[];
  seller?: {
    shopName: string;
    type: "retail" | "wholesale" | "service";
    subType?: string;
    category?: string;
    location?: string;
    address?: string;
    nidOrTradeLicense?: string;
    payoutMethod?: { kind: "bank" | "mobile"; details?: Record<string, string> };
  };
  factory?: {
    companyName: string;
    district: string;
    address: string;
    tradeLicenseNo?: string;
    productCategories: string[];
    exportCountries: string[];
    certifications: string[];
    employees: string;
    established: string;
    minOrderQty: string;
    productionCapacity: string;
    membershipBody: string;
    verified: boolean;
    website: string;
  };
  createdAt: string;
}

interface AuthCtx {
  user: AppUser | null;
  isAuthenticated: boolean;
  role: AppRole;
  loginWithPhone: (phone: string, password: string) => Promise<AppUser>;
  registerUser: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => Promise<AppUser>;
  registerSeller: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => Promise<AppUser>;
  registerFactory: (input: { fullName: string; phone: string; email: string; password: string; factory: Record<string, any> }) => Promise<AppUser>;
  logout: () => void;
}

const STORAGE_KEY = "pm.auth.v1";
const TOKEN_KEY = "pm.auth.token.v1";
const AuthContext = createContext<AuthCtx | null>(null);

function readStored(): AppUser | null {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function persist(u: AppUser | null) {
  if (u) safeStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else safeStorage.removeItem(STORAGE_KEY);
}

function persistToken(t: string | null) {
  if (t) safeStorage.setItem(TOKEN_KEY, t);
  else safeStorage.removeItem(TOKEN_KEY);
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getPermissionsForRole(role: AppRole): string[] {
  const base = ["CAN_BUY", "CAN_VIEW_FEED"];
  if (role === "seller" || role === "wholesale") {
    return [...base, "CAN_SELL", "CAN_MANAGE_SHOP"];
  }
  if (role === "factory") {
    return [...base, "CAN_SELL", "CAN_MANUFACTURE", "CAN_MANAGE_FACTORY"];
  }
  if (role === "rider") {
    return ["CAN_DELIVER", "CAN_VIEW_FEED"];
  }
  if (role === "service_provider") {
    return [...base, "CAN_CREATE_SERVICE", "CAN_MANAGE_SERVICES"];
  }
  if (role === "admin" || role === "super_admin") {
    return [...base, "CAN_SELL", "CAN_MANUFACTURE", "CAN_MANAGE_FACTORY", "CAN_DELIVER", "CAN_CREATE_SERVICE", "CAN_MODERATE", "CAN_ADMIN"];
  }
  return base;
}

async function callApi<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => readStored());

  useEffect(() => persist(user), [user]);

  const loginWithPhone = useCallback(async (phone: string, password: string) => {
    const serverData = await callApi("/api/v1/auth/login", { email: phone, password });
    if (serverData?.token) persistToken(serverData.token);
    const rawRole = (serverData?.user?.role ?? "buyer") as string;
    const role = (rawRole === "user" ? "buyer" : rawRole) as AppRole;
    
    // Core Constitution multi-role support: ensure user has fallback 'buyer' and context role
    const roles: AppRole[] = Array.from(new Set(["buyer" as AppRole, role]));
    const permissions = getPermissionsForRole(role);

    const next: AppUser = {
      id: serverData?.user?.id ?? uid("u"),
      fullName: serverData?.user?.name ?? serverData?.user?.handle ?? phone,
      phone,
      email: serverData?.user?.email,
      avatarUrl: serverData?.user?.avatarUrl,
      role,
      roles,
      permissions,
      createdAt: serverData?.user?.createdAt ?? new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => {
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: (input as any).password,
      role: 'buyer'
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("u"),
      role: "buyer",
      roles: ["buyer"],
      permissions: getPermissionsForRole("buyer"),
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => {
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: (input as any).password,
      role: 'seller',
      shopName: input.seller.shopName,
      type: input.seller.type,
      address: input.seller.address,
      nidOrTradeLicense: input.seller.nidOrTradeLicense,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("s"),
      role: "seller",
      roles: ["buyer", "seller"],
      permissions: getPermissionsForRole("seller"),
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerFactory = useCallback(async (input: { fullName: string; phone: string; email: string; password: string; factory: Record<string, any> }) => {
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: input.password,
      role: 'factory',
      shopName: input.factory.companyName,
      type: "factory",
      address: input.factory.address,
      tradeLicenseNo: input.factory.tradeLicenseNo,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      id: serverData?.user?.id ?? uid("f"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      role: "factory",
      roles: ["buyer", "factory"],
      permissions: getPermissionsForRole("factory"),
      factory: {
        companyName: input.factory.companyName,
        district: input.factory.district,
        address: input.factory.address ?? "",
        tradeLicenseNo: input.factory.tradeLicenseNo ?? "",
        productCategories: input.factory.productCategories ?? [],
        exportCountries: input.factory.exportCountries ?? [],
        certifications: input.factory.certifications ?? [],
        employees: input.factory.employees ?? "",
        established: input.factory.established ?? "",
        minOrderQty: input.factory.minOrderQty ?? "",
        productionCapacity: input.factory.productionCapacity ?? "",
        membershipBody: input.factory.membershipBody ?? "",
        verified: false,
        website: input.factory.website ?? "",
      },
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    callApi("/api/auth/logout", {}).catch(() => {});
    persistToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    isAuthenticated: !!user,
    role: (user?.role === "user" ? "buyer" : user?.role) ?? "guest",
    loginWithPhone,
    registerUser,
    registerSeller,
    registerFactory,
    logout,
  }), [user, loginWithPhone, registerUser, registerSeller, registerFactory, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
