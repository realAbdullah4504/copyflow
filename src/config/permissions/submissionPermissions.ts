import type { SubmissionAction } from "@/components/submissions";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { canPerformAction } from "./shared";

export const SUBMISSION_ALLOWED_ACTIONS: Record<Role, SubmissionAction[]> = {
  admin: ["view"],
  teacher: ["view", "edit", "delete"],
  secretary: ["view", "edit", "printed", "censorship", "delete"],
  principal: ["view"],
} as const;

export const ALLOWED_CREATION_ROLES: Role[] = [ROLES.TEACHER, ROLES.SECRETARY];

export const submissionPolicy = (role: Role) => ({
  canViewSubmission: () =>
    canPerformAction(SUBMISSION_ALLOWED_ACTIONS, role, "view"),
  canMarkPrinted: () =>
    canPerformAction(SUBMISSION_ALLOWED_ACTIONS, role, "printed"),
  canSendToCensorship: () =>
    canPerformAction(SUBMISSION_ALLOWED_ACTIONS, role, "censorship"),
});
