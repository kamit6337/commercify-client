import { configureStore } from "@reduxjs/toolkit";
import { toggleReducer } from "./slice/toggleSlice";
import { localStorageReducer } from "./slice/localStorageSlice";
import { addressReducer } from "./slice/addressSlice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    localStorage: localStorageReducer,
    address: addressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable strict mode
    }),
});
