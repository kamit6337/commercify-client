import removeDuplicate from "@/utils/javascript/removeDuplicate";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type Product = {
  id: string;
  quantity: number;
};

type InitialState = {
  cart: Product[];
  wishlist: Product[];
};

const initialState: InitialState = {
  cart: JSON.parse(localStorage.getItem("_cart") || "") || [],
  wishlist: JSON.parse(localStorage.getItem("_wishlist") || "") || [],
};

const cartAndWishlistSlice = createSlice({
  name: "localStorageSlice",
  initialState,
  reducers: {
    updateCart: (state, { payload }) => {
      const { id, add = true } = payload;

      if (add) {
        const cartList = [{ id, quantity: 1 }, ...state.cart];
        localStorage.setItem("_cart", JSON.stringify(cartList));
        state.cart = cartList;
        return state;
      }

      const modifyCartList = state.cart.filter((obj) => obj.id !== id);
      localStorage.setItem("_cart", JSON.stringify(modifyCartList));
      state.cart = modifyCartList;
      return state;
    },
    updateWishlist: (state, { payload }) => {
      const { id, add = true } = payload;

      if (add) {
        const wishlist = [{ id, quantity: 1 }, ...state.wishlist];
        localStorage.setItem("_wishlist", JSON.stringify(wishlist));
        state.wishlist = wishlist;
        return state;
      }

      const modifyWishlist = state.wishlist.filter((obj) => obj.id !== id);
      localStorage.setItem("_wishlist", JSON.stringify(modifyWishlist));
      state.wishlist = modifyWishlist;
      return state;
    },
    updateProductQuantity: (state, { payload }) => {
      const { id, quantity } = payload;

      const modifyProduct = state.cart.map((obj) => {
        if (obj.id === id) {
          obj.quantity = quantity;
        }
        return obj;
      });

      state.cart = modifyProduct;
      localStorage.setItem("_cart", JSON.stringify(modifyProduct));
      return state;
    },
  },
});

export const { updateCart, updateWishlist, updateProductQuantity } =
  cartAndWishlistSlice.actions;

export const cartAndWishlistReducer = cartAndWishlistSlice.reducer;

export const cartAndWishlistState = (state: RootState) => state.cartAndWishlist;
