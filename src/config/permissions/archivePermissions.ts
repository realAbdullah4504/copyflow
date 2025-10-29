import type { ArchiveAction } from "@/components/submissions";
import type { Role } from "@/config/roles";

export const ARCHIVE_ALLOWED_ACTIONS: Record<Role, ArchiveAction[]> = {
  admin: [],
  teacher: ["view","delete"],
  secretary: ["view","delete"],
  principal: ["view"],
} as const;
