import type { SubmissionAction } from "@/components/submissions";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

export const SUBMISSION_ALLOWED_ACTIONS: Record<Role, SubmissionAction[]> = {
  admin: [],
  teacher: ["view", "edit", "delete"],
  secretary: ["view", "edit", "printed", "censorship", "delete"],
  principal: ["view"],
} as const;

export const ALLOWED_CREATION_ROLES: Role[] = [ROLES.TEACHER,ROLES.SECRETARY];