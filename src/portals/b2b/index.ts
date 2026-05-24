/**
 * B2B Portal — Wholesale, Factory, Bulk Orders
 * Portal access: wholesale | factory | admin | super_admin
 *
 * Pages live at: /b2b/*
 * Portal guard:  PortalGuard portal="b2b"
 */
export const B2B_PORTAL = {
  id: "b2b",
  label: "B2B Marketplace",
  labelBn: "বি-টু-বি মার্কেটপ্লেস",
  basePath: "/b2b",
  allowedRoles: ["wholesale", "factory", "admin", "super_admin"],
} as const;
