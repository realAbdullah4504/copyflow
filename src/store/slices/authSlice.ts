import type { StateCreator } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type AuthSlice = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const createAuthSlice: StateCreator<
  AuthSlice,
  [['zustand/devtools', never]],
  [],
  AuthSlice
> = (set, get) => ({
  ...initialState,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Replace with your actual API call
      // const response = await authApi.login({ email, password });
      // set({ 
      //   user: response.user, 
      //   token: response.token, 
      //   isAuthenticated: true,
      //   isLoading: false 
      // });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Replace with your actual API call
      // const response = await authApi.register(userData);
      // set({ 
      //   user: response.user, 
      //   token: response.token, 
      //   isAuthenticated: true,
      //   isLoading: false 
      // });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
    }
  },

  logout: () => {
    // Clear any stored tokens or user data
    // await authApi.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
});
