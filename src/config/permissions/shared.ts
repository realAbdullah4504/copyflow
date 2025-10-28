import { ROLES, type Role } from "@/config/roles";

export const ALLOWED_CREATION_ROLES: Role[] = Object.values(ROLES);
export const canCreate = (role: Role) => ALLOWED_CREATION_ROLES.includes(role);

export const canPerformAction = (
  actions: Record<Role, string[]>,
  role: Role,
  action: string
) => {
  return actions[role]?.includes(action) ?? false;
};

export const getAllowedActions = (
  actions: Record<Role, string[]>,
  role: Role
): string[] => {
  return actions[role] ?? [];
};
