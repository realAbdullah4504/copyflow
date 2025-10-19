import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { hasPermission } from "@/config/roles";
import { getAllowedRolesForPath } from "@/config/routeRoles";
import type { UserRole, ProtectedRouteProps } from "@/types";

export const ProtectedRoute = ({
  allowedRoles,
  public: isPublic = false,
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Get allowed roles from route config if not explicitly provided
  const routeAllowedRoles = isPublic
  ? undefined
  : allowedRoles || getAllowedRolesForPath(path);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If route is public or has no role restrictions, allow access
  if (isPublic || !routeAllowedRoles) {
    return children;
  }

  // Check if user has any of the required roles
  const userRole = user?.role;
  const hasRequiredRole = userRole
    ? routeAllowedRoles.some((role) =>
        hasPermission(userRole, role as UserRole)
      )
    : false;

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole) {
    console.warn(
      `Access denied for user ${user?.email} (${userRole}) to ${path}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
