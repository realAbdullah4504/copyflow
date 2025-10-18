import { ROLES } from './roles';

type RouteRoleConfig = {
  path: string;
  roles: string[];
  children?: RouteRoleConfig[];
};

export const routeRoles: RouteRoleConfig[] = [
  {
    path: '/admin',
    roles: [ROLES.ADMIN],
    children: [
      { path: 'users', roles: [ROLES.ADMIN] },
      { path: 'settings', roles: [ROLES.ADMIN] },
    ],
  },
  {
    path: '/teacher',
    roles: [ROLES.TEACHER, ROLES.ADMIN],
    children: [
      { path: 'classes', roles: [ROLES.TEACHER, ROLES.ADMIN] },
      { path: 'attendance', roles: [ROLES.TEACHER, ROLES.ADMIN] },
    ],
  },
  {
    path: '/secretary',
    roles: [ROLES.SECRETARY, ROLES.ADMIN],
    children: [
      { path: 'reports', roles: [ROLES.SECRETARY, ROLES.ADMIN] },
      { path: 'documents', roles: [ROLES.SECRETARY, ROLES.ADMIN] },
    ],
  },
  {
    path: '/principal',
    roles: [ROLES.PRINCIPAL, ROLES.ADMIN],
    children: [
      { path: 'overview', roles: [ROLES.PRINCIPAL, ROLES.ADMIN] },
      { path: 'reports', roles: [ROLES.PRINCIPAL, ROLES.ADMIN] },
    ],
  },
];

/**
 * Gets the allowed roles for a specific route
 * @param path The route path to check
 * @returns Array of allowed roles or undefined if route doesn't have role restrictions
 */
export const getAllowedRolesForPath = (path: string): string[] | undefined => {
  // Remove leading/trailing slashes and split into segments
  const segments = path.replace(/^\/+|\/+$/g, '').split('/');
  
  // Start with the root route roles
  let currentRoles: string[] | undefined;
  let currentConfigs: RouteRoleConfig[] = routeRoles;
  console.log(currentConfigs,segments,path)
  for (const segment of segments) {
    const config = currentConfigs.find(c => c.path === segment);
    if (!config) break;
    
    currentRoles = config.roles;
    if (config.children) {
      currentConfigs = config.children;
    } else {
      break;
    }
  }
  
  return currentRoles;
};
