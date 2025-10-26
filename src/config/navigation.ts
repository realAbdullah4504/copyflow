import {
  ChartBar as BarChart3,
  ClipboardCheck,
  FileText,
  Inbox,
  Users,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { ROLES } from "./roles";

const TEACHER_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/teacher",
    icon: FileText,
    roles: [ROLES.TEACHER],
  },
  {
    title: "Submissions",
    href: "/dashboard/teacher/submissions",
    icon: FileText,
    roles: [ROLES.TEACHER],
  },
  {
    title: "Archive Submissions",
    href: "/dashboard/teacher/archive",
    icon: FileText,
    roles: [ROLES.TEACHER],
  },
];

const SECRETARY_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/secretary",
    icon: FileText,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Submissions",
    href: "/dashboard/secretary/submissions",
    icon: FileText,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Censored Submissions",
    href: "/dashboard/secretary/censorship",
    icon: FileText,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Archive Submissions",
    href: "/dashboard/secretary/archive",
    icon: FileText,
    roles: [ROLES.SECRETARY],
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Submissions",
    href: "/dashboard/admin/submissions",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Archive Submissions",
    href: "/dashboard/admin/archive",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
];

const PRINCIPAL_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/principal",
    icon: FileText,
    roles: [ROLES.PRINCIPAL],
  },
  {
    title: "Submissions",
    href: "/dashboard/principal/submissions",
    icon: FileText,
    roles: [ROLES.PRINCIPAL],
  },
  {
    title: "Archive Submissions",
    href: "/dashboard/principal/archive",
    icon: FileText,
    roles: [ROLES.PRINCIPAL],
  },
];

export const NAV_ITEMS: NavItem[] = [
  ...TEACHER_NAV_ITEMS,
  ...SECRETARY_NAV_ITEMS,
  ...ADMIN_NAV_ITEMS,
  ...PRINCIPAL_NAV_ITEMS,
];

export const getNavForRole = (role: string): NavItem[] => {
  return NAV_ITEMS.filter((item) => item.roles?.includes(role));
};
