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
        const modifyCartList = [{ id, quantity: 1 }];
        localStorage.setItem("_cart", JSON.stringify(modifyCartList));
        state.cart = modifyCartList;
        return state;
      }

      if (add && cartList) {
        const modifyCartList = [{ id, quantity: 1 }, ...cartList];
        localStorage.setItem("_cart", JSON.stringify(modifyCartList));
        state.cart = modifyCartList;
        return state;
      }

      const modifyCartList = cartList.filter((obj) => obj.id !== id);
      localStorage.setItem("_cart", JSON.stringify(modifyCartList));
      state.cart = state.cart.filter((obj) => obj.id !== id);
      return state;
    },
    updateWishlist: (state, { payload }) => {
      const { id, add = true } = payload;

      const wishlist = JSON.parse(localStorage.getItem("_wishlist"));

      if (add && !wishlist) {
        const modifyWishlist = [id];
        localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
        state.wishlist = modifyWishlist;
        return state;
      }

      if (add && wishlist) {
        const modifyWishlist = [id, ...wishlist];
        localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
        state.wishlist = modifyWishlist;
        return state;
      }

      const modifyWishlist = wishlist.filter((productId) => productId !== id);
      localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
      state.wishlist = state.wishlist.filter((productId) => productId !== id);
      return state;
    },
    updateProductQuantity: (state, { payload }) => {
      const { id, quantity } = payload;

      const cartList = JSON.parse(localStorage.getItem("_cart"));

      const modifyProduct = cartList.map((obj) => {
        if (obj.id === id) {
          obj.quantity = quantity;
        }
        return obj;
      });

      localStorage.setItem("_cart", JSON.stringify(modifyProduct));

      state.cart = state.cart.map((obj) => {
        if (obj.id === id) {
          obj.quantity = quantity;
        }
        return obj;
      });

      return state;
    },
  },
});

export const { updateCart, updateWishlist, updateProductQuantity } =
  localStorageSlice.actions;

export const localStorageReducer = localStorageSlice.reducer;

export const localStorageState = (state) => state.localStorage;
