import { configureStore } from "@reduxjs/toolkit";
import { exampleReducer } from "./slice/exampleSlice";
import { currencyReducer } from "./slice/currencySlice";
import { cartAndWishlistReducer } from "./slice/cartAndWishlistSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    currency: currencyReducer,
    cartAndWishlist: cartAndWishlistReducer,
    address: addressReducer,
    userOrders: userOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable strict mode
    }),
  devTools: false,
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
