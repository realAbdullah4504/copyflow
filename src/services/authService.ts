import { User, UserRole } from '@/types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'teacher'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@school.edu',
    role: 'teacher'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.edu',
    role: 'secretary'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@school.edu',
    role: 'admin'
  }
];

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },

  setCurrentUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearCurrentUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  }
};
