import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StoreState } from '@/types';

const useStore = create<StoreState>()(
  devtools(
    (set) => ({
      // Initial state
      count: 0,
      
      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'app-store', // Name for the store in devtools
    }
  )
);

export default useStore;
