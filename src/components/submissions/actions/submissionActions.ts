import { Eye, Edit, Trash2, Archive, LockKeyhole } from "lucide-react";
import type { Role } from "@/config/roles";

export const ACTION_CONFIG = {
  view: {
    label: "View",
    icon: Eye,
    color: "default",
  },
  edit: {
    label: "Edit",
    icon: Edit,
    color: "default",
  },
  delete: {
    label: "Delete",
    icon: Trash2,
    color: "destructive",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    color: "default",
  },
  censorship: {
    label: "Censorship",
    icon: LockKeyhole,
    color: "default",
  },
} as const;

export const ALLOWED_ACTIONS: Record<Role, ActionType[]> = {
  admin: ["view", "edit", "archive", "censorship", "delete"],
  teacher: ["view", "edit", "delete"],
  secretary: ["view", "edit", "archive", "censorship", "delete"],
  principal: ["view"],
} as const;

export const getActionMeta = (action: ActionType) => {
  const meta = ACTION_CONFIG[action];
  if (!meta) {
    throw new Error(`Unknown action: ${action}`);
  }
  return meta;
};

export const ALLOWED_CREATION_ROLES: Role[] = ["secretary","teacher", "admin"];
export const canCreate = (role: Role) => ALLOWED_CREATION_ROLES.includes(role);

export const getAllowedActions = (role: Role): ActionType[] => {
  return ALLOWED_ACTIONS[role] ?? [];
};

export const canPerformAction = (role: Role, action: ActionType) => {
  return ALLOWED_ACTIONS[role].includes(action);
};

export type ActionType = keyof typeof ACTION_CONFIG;
