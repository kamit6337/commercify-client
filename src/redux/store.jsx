import { configureStore } from "@reduxjs/toolkit";
import { toggleReducer } from "./slice/toggleSlice";
import { localStorageReducer } from "./slice/localStorageSlice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    localStorage: localStorageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable strict mode
    }),
});
