import { configureStore } from "@reduxjs/toolkit";
import { exampleReducer } from "./slice/exampleSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable strict mode
    }),
  devTools: false,
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
