'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Inbox, ChartBar as BarChart3, Users, LogOut, ClipboardCheck } from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
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

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ userRole, userName, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-slate-900">CopyFlow</h1>
        <p className="text-sm text-slate-600 mt-1">School Workflow</p>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-slate-200 text-slate-900'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-slate-900">{userName}</p>
          <p className="text-xs text-slate-600 capitalize">{userRole}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
