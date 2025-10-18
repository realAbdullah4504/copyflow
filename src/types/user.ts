export type UserRole = 'teacher' | 'secretary' | 'admin' | 'principal';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}