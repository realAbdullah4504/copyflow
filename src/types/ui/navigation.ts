/**
 * Navigation UI types
 * Types related to navigation and routing UI
 */

export type IconName = 'dashboard-icon' | 'users-icon';

export interface NavItem {
  title: string;
  href: string;
  icon: IconName;
  roles?: string[];
}
