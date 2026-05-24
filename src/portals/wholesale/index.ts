/**
 * Wholesale Portal — Islampur, Khatunganj, bulk pricing
 * Portal access: wholesale | admin
 *
 * Pages live at: /wholesale/*  (future)
 */
export const WHOLESALE_PORTAL = {
  id: "wholesale",
  label: "Wholesale Portal",
  labelBn: "পাইকারি পোর্টাল",
  basePath: "/wholesale",
  allowedRoles: ["wholesale", "admin", "super_admin"],
} as const;
