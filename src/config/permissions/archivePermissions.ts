import type { ArchiveAction } from "@/components/submissions";
import type { Role } from "@/config/roles";

export const ARCHIVE_ALLOWED_ACTIONS: Record<Role, ArchiveAction[]> = {
  admin: ["view"],
  teacher: [],
  secretary: ["view"],
  principal: ["view"],
} as const;
