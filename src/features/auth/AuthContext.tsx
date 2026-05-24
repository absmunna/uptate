import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function persist(u: AppUser | null) {
  if (typeof window === "undefined") return;
  if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function persistToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
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
    const serverData = await callApi("/api/auth/login", { phone, password });
    if (serverData?.token) persistToken(serverData.token);
    const rawRole = (serverData?.user?.role ?? "buyer") as string;
    const role = (rawRole === "user" ? "buyer" : rawRole) as AppRole;
    const next: AppUser = {
      id: serverData?.user?.id ?? uid("u"),
      fullName: serverData?.user?.name ?? serverData?.user?.handle ?? phone,
      phone,
      email: serverData?.user?.email,
      avatarUrl: serverData?.user?.avatarUrl,
      role,
      createdAt: serverData?.user?.createdAt ?? new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => {
    const serverData = await callApi("/api/auth/register", {
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      password: (input as any).password,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("u"),
      role: "buyer",
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => {
    const serverData = await callApi("/api/auth/seller-register", {
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      password: (input as any).password,
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
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerFactory = useCallback(async (input: { fullName: string; phone: string; email: string; password: string; factory: Record<string, any> }) => {
    const serverData = await callApi("/api/auth/seller-register", {
      name: input.fullName,
      email: input.email,
      phone: input.phone,
      password: input.password,
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
