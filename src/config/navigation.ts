import {
  // General
  LayoutDashboard,
  FileText,
  Archive,
  Users,
  Settings,
  // File related
  FileArchive,
  FileCheck,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { ROLES } from "./roles";

const TEACHER_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/teacher",
    icon: LayoutDashboard,
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
    icon: FileArchive,
    roles: [ROLES.TEACHER],
  },
];

const SECRETARY_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/secretary",
    icon: LayoutDashboard,
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
    icon: FileCheck,
    roles: [ROLES.SECRETARY],
  },
  {
    title: "Archive",
    href: "/dashboard/secretary/archive",
    icon: Archive,
    roles: [ROLES.SECRETARY],
  },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Submissions",
    href: "/dashboard/admin/submissions",
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    roles: [ROLES.ADMIN],
  },
];

const PRINCIPAL_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/principal",
    icon: LayoutDashboard,
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
