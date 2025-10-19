import type { StateCreator } from 'zustand';

export interface LoadingState {
  loadingStates: Record<string, boolean>;
  loadingMessages: Record<string, string>;
}

export interface LoadingActions {
  startLoading: (key: string, message?: string) => void;
  stopLoading: (key: string) => void;
  getLoadingState: (key: string) => boolean;
  getLoadingMessage: (key: string) => string | undefined;
  clearAllLoading: () => void;
}

export type DataLoadingSlice = LoadingState & LoadingActions;

const initialState: LoadingState = {
  loadingStates: {},
  loadingMessages: {},
};

export const createDataLoadingSlice: StateCreator<
  DataLoadingSlice,
  [['zustand/devtools', never]],
  [],
  DataLoadingSlice
> = (set, get) => ({
  ...initialState,
  
  startLoading: (key, message = 'Loading...') =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: true },
      loadingMessages: { ...state.loadingMessages, [key]: message },
    })),

  stopLoading: (key) =>
    set((state) => {
      const newLoadingStates = { ...state.loadingStates };
      const newLoadingMessages = { ...state.loadingMessages };
      delete newLoadingStates[key];
      delete newLoadingMessages[key];
      return {
        loadingStates: newLoadingStates,
        loadingMessages: newLoadingMessages,
      };
    }),

  getLoadingState: (key) => get().loadingStates[key] || false,
  
  getLoadingMessage: (key) => get().loadingMessages[key],
  
  clearAllLoading: () =>
    set({
      loadingStates: {},
      loadingMessages: {},
    }),
});

// Selectors
export const selectIsLoading = (state: { dataLoading: DataLoadingSlice }, key: string) => 
  state.dataLoading.loadingStates[key] || false;

export const selectLoadingMessage = (state: { dataLoading: DataLoadingSlice }, key: string) => 
  state.dataLoading.loadingMessages[key];

export const selectAnyLoading = (state: { dataLoading: DataLoadingSlice }) => 
  Object.keys(state.dataLoading.loadingStates).length > 0;

// Helper hook for async operations
export const withLoading = async (
  store: DataLoadingSlice,
  key: string,
  asyncFn: () => Promise<void>,
  loadingMessage: string = 'Loading...'
) => {
  try {
    store.startLoading(key, loadingMessage);
    await asyncFn();
  } finally {
    store.stopLoading(key);
  }
};
