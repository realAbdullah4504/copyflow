import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { UserRole } from "@/types";
import { getNavForRole } from "@/config/navigation";

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({
  userRole,
  userName,
  onLogout,
}: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navLinks = getNavForRole(userRole);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-slate-900">CopyFlow</h1>
        <p className="text-sm text-slate-600 mt-1">School Workflow</p>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-slate-200 text-slate-900",
                    "cursor-pointer"
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
