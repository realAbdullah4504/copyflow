import type { StateCreator } from 'zustand';

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

export interface LayoutState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: Theme;
  language: string;
}

export interface UIActions {
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: Partial<Theme>) => void;
}

export type UiSlice = LayoutState & UIActions;

const initialState: LayoutState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  theme: {
    mode: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
  },
  language: 'en',
};

export const createUiSlice: StateCreator<
  UiSlice,
  [['zustand/devtools', never]],
  [],
  UiSlice
> = (set) => ({
  ...initialState,
  
  toggleSidebar: () => 
    set((state) => ({ 
      isSidebarOpen: !state.isSidebarOpen 
    })),
    
  toggleMobileMenu: () => 
    set((state) => ({ 
      isMobileMenuOpen: !state.isMobileMenuOpen 
    })),
    
  toggleTheme: () => 
    set((state) => ({ 
      theme: { 
        ...state.theme, 
        mode: state.theme.mode === 'light' ? 'dark' : 'light' 
      } 
    })),
    
  setLanguage: (language) => 
    set({ language }),
    
  setTheme: (theme) => 
    set((state) => ({ 
      theme: { ...state.theme, ...theme } 
    })),
});

// Selectors
export const selectTheme = (state: { ui: UiSlice }) => state.ui.theme;
export const selectIsSidebarOpen = (state: { ui: UiSlice }) => state.ui.isSidebarOpen;
export const selectIsMobileMenuOpen = (state: { ui: UiSlice }) => state.ui.isMobileMenuOpen;
export const selectLanguage = (state: { ui: UiSlice }) => state.ui.language;
