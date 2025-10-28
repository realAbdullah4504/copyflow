import { Eye, Edit, Trash2, Archive, LockKeyhole } from "lucide-react";
import type { ActionKey } from "./shared";

export const SUBMISSION_ACTION_CONFIG = {
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

export type SubmissionAction = ActionKey<typeof SUBMISSION_ACTION_CONFIG>;
