import { UserRole } from './roles';

export const Permissions = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.MODERATOR]: ['moderate_content', 'view_analytics'],
  [UserRole.SELLER]: ['manage_products', 'view_orders', 'view_analytics'],
  [UserRole.BUYER]: ['place_orders', 'view_products'],
  // Define other roles similarly
};

export const canAccess = (role: UserRole, permission: string) => {
  const permissions = Permissions[role];
  return permissions.includes('all') || permissions.includes(permission);
};
