import { ROLES } from "./roles";

export const permissions = {
  [ROLES.ADMIN]: {
    canEdit: true,
    canDelete: true,
    canViewAll: true,
  },
  [ROLES.TEACHER]: {
    canEdit: true,
    canDelete: false,
    canViewAll: false,
  },
  [ROLES.SECRETARY]: {
    canEdit: false,
    canDelete: false,
    canViewAll: true,
  },
} as const;

export type Permission = keyof typeof permissions;
