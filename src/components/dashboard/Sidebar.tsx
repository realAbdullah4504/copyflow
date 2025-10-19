import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@/components/icons";
import { navItems } from "@/config/navigation";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <aside className="hidden w-64 border-r md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">CopyFlow</h2>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon name={item.icon} />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
