import { Eye, Edit, Trash2 } from "lucide-react";
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
} as const;

export const ALLOWED_ACTIONS: Record<Role, ActionType[]> = {
  admin: ["view", "edit", "delete"],
  teacher: ["view", "edit"],
  secretary: ["view", "delete"],
  principal: ["view"],
} as const;

export type ActionType = keyof typeof ACTION_CONFIG;
