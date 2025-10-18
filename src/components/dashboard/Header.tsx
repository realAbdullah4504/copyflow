import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-semibold">
          {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'Dashboard'}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
