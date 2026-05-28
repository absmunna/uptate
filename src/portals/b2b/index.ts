export * from './B2BHub';

export const B2B_PORTAL = {
  id: "b2b",
  label: "B2B Portal",
  labelBn: "বি-টু-বি পোর্টাল",
  basePath: "/b2b",
  allowedRoles: ["wholesale", "factory", "admin", "super_admin"],
} as const;

