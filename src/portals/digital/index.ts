/**
 * Digital Content Portal — Paid videos, courses
 * Portal access: digital_seller | seller | buyer | admin
 *
 * Pages live at: /video/*
 */
export const DIGITAL_PORTAL = {
  id: "digital",
  label: "Digital Content",
  labelBn: "ডিজিটাল কন্টেন্ট",
  basePath: "/video",
  allowedRoles: ["digital_seller", "seller", "buyer", "admin", "super_admin"],
} as const;
