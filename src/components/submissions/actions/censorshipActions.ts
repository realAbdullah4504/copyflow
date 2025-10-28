import { Eye, Check, X } from "lucide-react";
import type { ActionKey } from "./shared";

export const CENSORSHIP_ACTION_CONFIG = {
  view: {
    label: "View",
    icon: Eye,
    color: "default",
  },
  approve: {
    label: "Approve",
    icon: Check,
    color: "success",
  },
  reject: {
    label: "Reject",
    icon: X,
    color: "destructive",
  },
} as const;

export type CensorshipAction = ActionKey<typeof CENSORSHIP_ACTION_CONFIG>;
