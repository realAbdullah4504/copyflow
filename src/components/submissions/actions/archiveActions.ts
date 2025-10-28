import { Eye, Trash2, Archive } from "lucide-react";
import type { ActionKey } from "./shared";

export const ARCHIVE_ACTION_CONFIG = {
  view: {
    label: "View",
    icon: Eye,
    color: "default",
  },
  delete: {
    label: "Delete",
    icon: Trash2,
    color: "destructive",
  },
  unarchive: {
    label: "Unarchive",
    icon: Archive,
    color: "default",
  },
} as const;

export type ArchiveAction = ActionKey<typeof ARCHIVE_ACTION_CONFIG>;
