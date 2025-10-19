/**
 * Route configuration types
 * Types for route definitions and access control
 */

import type { UserRole } from '../domain';

export interface RouteRoleConfig {
  path: string;
  roles: UserRole[];
  exact?: boolean;
  children?: RouteRoleConfig[];
}
