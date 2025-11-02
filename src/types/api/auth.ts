/**
 * Authentication API types
 * Request/response types for auth endpoints
 */

import type { User } from "@/types/domain";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}
export interface SignupResponse {
  user: User;
}

export interface AuthResponse {
  user: User;
  refreshToken?: string;
}


