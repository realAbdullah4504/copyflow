import type { QueryParams } from './query';

export type UserRole = 'teacher' | 'secretary' | 'admin' | 'principal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserQueryParams extends QueryParams {
  role?: UserRole;
  search?: string;
}
