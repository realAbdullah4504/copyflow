import type { CensorshipAction } from "@/components/submissions";
import type { Role } from "@/config/roles";

export const CENSORSHIP_ALLOWED_ACTIONS: Record<Role, CensorshipAction[]> = {
  admin: [],
  teacher: [],
  secretary: ["view","approve"],
  principal: ["view", "approve", "reject"],
} as const;
