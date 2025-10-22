import { ChartBar as BarChart3, ClipboardCheck, FileText, Inbox } from "lucide-react";
import type { NavItem } from "@/types/navigation";


export const navItems: NavItem[] = [
  {
    title: 'My Submissions',
    href: '/dashboard/teacher',
    icon: FileText,
    roles: ['teacher']
  },
  {
    title: 'Inbox',
    href: '/dashboard/secretary',
    icon: Inbox,
    roles: ['secretary']
  },
  {
    title: 'Attendance',
    href: '/dashboard/secretary/attendance',
    icon: ClipboardCheck,
    roles: ['secretary']
  },
  {
    title: 'Overview',
    href: '/dashboard/admin',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'All Submissions',
    href: '/dashboard/admin/submissions',
    icon: FileText,
    roles: ['admin']
  }
];
