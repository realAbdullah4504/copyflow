/**
 * Authentication API types
 * Request/response types for auth endpoints
 */

import type { User } from '../domain';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
