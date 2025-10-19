import { StateCreator } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  createdAt: number;
}

export interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

export interface NotificationActions {
  addNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    duration?: number
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export type NotificationSlice = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  maxNotifications: 5,
};

export const createNotificationSlice: StateCreator<
  NotificationSlice,
  [['zustand/devtools', never]],
  [],
  NotificationSlice
> = (set, get) => ({
  ...initialState,
  
  addNotification: (type, message, title, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      type,
      message,
      title,
      duration,
      createdAt: Date.now(),
    };

    set((state) => ({
      notifications: [
        ...state.notifications.slice(-(state.maxNotifications - 1)),
        notification,
      ],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),
});

// Helper functions for common notification types
export const notificationActions = (set: any) => ({
  success: (message: string, title?: string, duration?: number) =>
    set((state: NotificationSlice) => 
      state.addNotification('success', message, title, duration)),
      
  error: (message: string, title?: string, duration?: number) =>
    set((state: NotificationSlice) => 
      state.addNotification('error', message, title, duration || 10000)),
      
  info: (message: string, title?: string, duration?: number) =>
    set((state: NotificationSlice) => 
      state.addNotification('info', message, title, duration)),
      
  warning: (message: string, title?: string, duration?: number) =>
    set((state: NotificationSlice) => 
      state.addNotification('warning', message, title, duration)),
});

// Selectors
export const selectNotifications = (state: { notification: NotificationSlice }) => 
  state.notification.notifications;
