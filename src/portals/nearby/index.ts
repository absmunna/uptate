/**
 * Nearby Portal — Rural shops, local discovery
 * Portal access: nearby_shop | rural | buyer | admin
 *
 * Pages live at: /local/*
 */
export const NEARBY_PORTAL = {
  id: "nearby",
  label: "Nearby Shops",
  labelBn: "কাছের দোকান",
  basePath: "/local",
  allowedRoles: ["nearby_shop", "rural", "buyer", "admin", "super_admin"],
} as const;
