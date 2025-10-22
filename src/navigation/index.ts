import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: "dashboard-icon",
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: "settings-icon",
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: "users-icon",
    roles: ["admin"],
  },
];
