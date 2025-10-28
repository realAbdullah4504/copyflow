import type { SubmissionAction } from "@/components/submissions";
import type { Role } from "@/config/roles";

export const SUBMISSION_ALLOWED_ACTIONS: Record<Role, SubmissionAction[]> = {
  admin: ["view", "edit", "archive", "censorship", "delete"],
  teacher: ["view", "edit", "delete"],
  secretary: ["view", "edit", "archive", "censorship", "delete"],
  principal: ["view"],
} as const;
