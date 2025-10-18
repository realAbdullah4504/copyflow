import type { UserRole } from '@/types/user';

// Define all available roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  SECRETARY: 'secretary',
  PRINCIPAL: 'principal',
} as const;

export type Role = UserRole;

// Define role hierarchy (each role inherits permissions from roles to their right)
const roleHierarchy: Record<Role, Role[]> = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SECRETARY, ROLES.PRINCIPAL],
  [ROLES.TEACHER]: [ROLES.TEACHER],
  [ROLES.SECRETARY]: [ROLES.SECRETARY],
  [ROLES.PRINCIPAL]: [ROLES.PRINCIPAL],
};

// Check if a user's role has the required permission
export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};
