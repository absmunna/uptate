/**
 * Ride / Logistics Portal — Delivery rider matching
 * Portal access: rider | admin
 *
 * Pages live at: /logistics/*
 */
export const RIDE_PORTAL = {
  id: "ride",
  label: "Logistics & Ride",
  labelBn: "লজিস্টিক ও রাইড",
  basePath: "/logistics",
  allowedRoles: ["rider", "admin", "super_admin"],
} as const;
