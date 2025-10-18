import { ROLES } from '@/config/roles';

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Add other user properties as needed
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
