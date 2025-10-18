export type UserRole = 'teacher' | 'secretary' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}