/**
 * UI Component types
 * Prop types for React components
 */

import type { UserRole } from '../domain';

export interface IconProps {
  className?: string;
}

export interface ProtectedRouteProps {
  /**
   * Optional: Explicitly specify allowed roles for this route
   * If not provided, will try to determine from route configuration
   */
  allowedRoles?: UserRole[];

  /**
   * Optional: Set to true to skip role checking (only check authentication)
   */
  public?: boolean;
  children: React.ReactNode;
}
