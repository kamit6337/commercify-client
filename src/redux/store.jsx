/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import { toggleReducer } from "./slice/toggleSlice";
import { localStorageReducer } from "./slice/localStorageSlice";
import { addressReducer } from "./slice/addressSlice";
import environment from "../utils/environment";

const PRODUCTION = "production";

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

  devtools: environment.NODE_ENV === PRODUCTION ? true : false,
});
