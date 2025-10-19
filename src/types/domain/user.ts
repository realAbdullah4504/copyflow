/**
 * User domain types
 * Core business entities related to users and roles
 */

export type UserRole = 'teacher' | 'secretary' | 'admin' | 'principal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
