import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("_wishlist")) || [],
};

const localStorageSlice = createSlice({
  name: "localStorageSlice",
  initialState,
  reducers: {
    updateCart: (state, { payload }) => {
      const { id, add = true } = payload;

      const cartList = JSON.parse(localStorage.getItem("_cart"));

      if (add && !cartList) {
        localStorage.setItem("_cart", JSON.stringify([id]));
        state.cart = [...state.cart, id];
        return state;
      }

      if (add && cartList) {
        const modifyCartList = [...cartList, id];
        localStorage.setItem("_cart", JSON.stringify(modifyCartList));
        state.cart = [...state.cart, id];
        return state;
      }

      const modifyCartList = cartList.filter((productId) => productId !== id);
      localStorage.setItem("_cart", JSON.stringify(modifyCartList));
      state.cart = state.cart.filter((productId) => productId !== id);
      return state;
    },
    updateWishlist: (state, { payload }) => {
      const { id, add = true } = payload;

      const wishlist = JSON.parse(localStorage.getItem("_wishlist"));

      if (add && !wishlist) {
        localStorage.setItem("_wishlist", JSON.stringify([id]));
        state.wishlist = [...state.wishlist, id];
        return state;
      }

      if (add && wishlist) {
        const modifyWishlist = [...wishlist, id];
        localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
        state.wishlist = [...state.wishlist, id];
        return state;
      }

      const modifyWishlist = wishlist.filter((productId) => productId !== id);
      localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
      state.wishlist = state.wishlist.filter((productId) => productId !== id);
      return state;
    },
  },
});

export const { updateCart, updateWishlist } = localStorageSlice.actions;

export const localStorageReducer = localStorageSlice.reducer;

export const localStorageState = (state) => state.localStorage;
