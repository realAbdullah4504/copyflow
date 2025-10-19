import { ROLES } from './roles';
import type { UserRole, RouteRoleConfig } from '@/types';

export const routeRoles: RouteRoleConfig[] = [
  {
    path: 'dashboard',
    roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SECRETARY, ROLES.PRINCIPAL], // All authenticated users can access dashboard
    children: [
      {
        path: 'admin',
        roles: [ROLES.ADMIN],
        children: [
          { path: 'users', roles: [ROLES.TEACHER] },
          { path: 'settings', roles: [ROLES.ADMIN] },
        ],
      },
      {
        path: 'teacher',
        roles: [ROLES.TEACHER, ROLES.ADMIN],
        children: [
          { path: 'classes', roles: [ROLES.TEACHER, ROLES.ADMIN] },
          { path: 'attendance', roles: [ROLES.TEACHER, ROLES.ADMIN] },
        ],
      },
      {
        path: 'secretary',
        roles: [ROLES.SECRETARY, ROLES.ADMIN],
        children: [
          { path: 'reports', roles: [ROLES.SECRETARY, ROLES.ADMIN] },
          { path: 'documents', roles: [ROLES.SECRETARY, ROLES.ADMIN] },
        ],
      },
      {
        path: 'principal',
        roles: [ROLES.PRINCIPAL, ROLES.ADMIN],
        children: [
          { path: 'overview', roles: [ROLES.PRINCIPAL, ROLES.ADMIN] },
          { path: 'reports', roles: [ROLES.PRINCIPAL, ROLES.ADMIN] },
        ],
      },
    ],
  },
];

/**
 * Gets the allowed roles for a specific route
 * @param path The route path to check
 * @returns Array of allowed roles or undefined if route doesn't have role restrictions
 */
export const getAllowedRolesForPath = (path: string): UserRole[] | undefined => {
  // Remove leading/trailing slashes and split into segments
  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  if (segments.length === 0) return undefined;

  // Navigate through the route hierarchy
  let currentRoles: UserRole[] | undefined;
  let currentConfigs: RouteRoleConfig[] = routeRoles;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const config = currentConfigs.find(c => c.path === segment);

    if (!config) {
      // No config found, return the last known roles
      return currentRoles;
    }

    currentRoles = config.roles;

    // If this is an exact match requirement and we have more segments, deny
    if (config.exact && i < segments.length - 1) {
      return undefined;
    }

    // Move to children if available
    if (config.children && i < segments.length - 1) {
      currentConfigs = config.children;
    } else {
      // No more children to traverse
      break;
    }
  }

  return currentRoles;
};

/**
 * Helper to check if a path matches a route pattern
 * @param path The actual path
 * @param pattern The route pattern
 * @returns True if the path matches the pattern
 */
export const matchesRoute = (path: string, pattern: string): boolean => {
  const pathSegments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const patternSegments = pattern.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  if (pathSegments.length !== patternSegments.length) return false;

  return patternSegments.every((segment, i) => {
    return segment === pathSegments[i] || segment.startsWith(':');
  });
};
