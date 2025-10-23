import {
  ChartBar as BarChart3,
  ClipboardCheck,
  FileText,
  Inbox,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { ROLES } from "./roles";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "My Submissions",
    href: "/dashboard/teacher",
    icon: FileText,
    roles: [ROLES.TEACHER],
  },
  {
    title: "Inbox",
    href: "/dashboard/secretary",
    icon: Inbox,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Attendance",
    href: "/dashboard/secretary/attendance",
    icon: ClipboardCheck,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: BarChart3,
    roles: [ROLES.ADMIN],
  },
  {
    title: "All Submissions",
    href: "/dashboard/admin/submissions",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
];

export const getNavForRole = (role: string): NavItem[] => {
  return NAV_ITEMS.filter((item) => item.roles?.includes(role));
};
