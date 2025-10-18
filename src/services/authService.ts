import type { User } from "@/types/user";

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

type LoginResponse = {
  user: User;
  token: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, this would be returned from the server
    const token = `mock-jwt-token-${user.id}`;
    
    return { user, token };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },

  setCurrentUser: (data: { user: User; token: string }): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  },

  clearCurrentUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }
};
