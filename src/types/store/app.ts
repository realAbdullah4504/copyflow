/**
 * Application store types
 * State management types for Zustand stores
 */

export interface StoreState {
  // Add your state properties here
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
