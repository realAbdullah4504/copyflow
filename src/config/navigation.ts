import type { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: "dashboard-icon",
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: "users-icon",
    roles: ["admin"],
  },
];
