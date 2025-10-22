/**
 * Navigation UI types
 * Types related to navigation and routing UI
 */

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}
