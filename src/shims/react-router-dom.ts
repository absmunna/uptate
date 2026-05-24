/**
 * Shim: maps legacy react-router-dom imports → wouter equivalents.
 * This allows legacy files to compile without installing react-router-dom.
 */
export { Link, useLocation, useParams, useRoute, Router } from "wouter";

// useNavigate → returns a function like wouter's navigate
import { useLocation } from "wouter";
export function useNavigate() {
  const [, navigate] = useLocation();
  return navigate;
}

// NavLink — simple Link alias (wouter has no built-in NavLink)
export { Link as NavLink } from "wouter";

// Outlet — placeholder for nested routes
import type { ReactNode } from "react";
export function Outlet(): ReactNode {
  return null;
}

// Routes / Route / Navigate — minimal compatibility stubs
export { Switch as Routes } from "wouter";
export { Route } from "wouter";

export function Navigate({ to }: { to: string }) {
  const [, nav] = useLocation();
  nav(to);
  return null;
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  return children as any;
}
