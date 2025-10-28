import type { ActionKey, GenericActionConfig } from "@/components/submissions/actions/shared";
import { type Role } from "@/config/roles";
import { ALLOWED_CREATION_ROLES } from "./submissionPermissions";

export const canCreate = (role: Role): boolean => ALLOWED_CREATION_ROLES.includes(role);

export const canPerformAction = <T extends GenericActionConfig>(
  actions: Record<Role, ReadonlyArray<ActionKey<T>>>,
  role: Role,
  action: ActionKey<T>
): boolean => {
  return actions[role]?.includes(action) ?? false;
};

export const getAllowedActions = <T extends GenericActionConfig>(
  actions: Record<Role, ReadonlyArray<ActionKey<T>>>,
  role: Role
): ReadonlyArray<ActionKey<T>> => {
  return actions[role] ?? [];
};