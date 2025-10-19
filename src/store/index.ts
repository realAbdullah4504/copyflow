import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";
import { createUiSlice, type UiSlice } from "./slices/uiSlice";
import {
  createNotificationSlice,
  type NotificationSlice,
} from "./slices/notificationSlice";
import {
  createDataLoadingSlice,
  type DataLoadingSlice,
} from "./slices/dataLoadingSlice";

type StoreState = AuthSlice & UiSlice & NotificationSlice & DataLoadingSlice;

const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
      ...createNotificationSlice(...a),
      ...createDataLoadingSlice(...a),
    }),
    {
      name: "app-store",
      // Enable Redux DevTools
      enabled: import.meta.env.MODE === "development",
    }
  )
);

export default useStore;
