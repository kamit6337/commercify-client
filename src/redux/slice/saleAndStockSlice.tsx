import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PRODUCT } from "@/types";

type STOCK = {
  product: string;
  stock: number;
};

type InitialState = {
  productsSeen: string[];
  notReadyToSale: string[];
  zeroStock: string[];
};

const initialState: InitialState = {
  productsSeen: [],
  notReadyToSale: [],
  zeroStock: [],
};

const saleAndStockSlice = createSlice({
  name: "saleAndStockSlice",
  initialState,
  reducers: {
    addSaleAndStock: (state, { payload }) => {
      const products = payload as PRODUCT[];

      products.forEach((product) => {
        const productId = product._id;
        const currentStock = product.stock;
        const saleBoolean = product.isReadyToSale;

        if (state.productsSeen.includes(productId)) return state;

        state.productsSeen = [...state.productsSeen, productId];

        if (!saleBoolean) {
          state.notReadyToSale = [...state.notReadyToSale, productId];
        }

        if (currentStock === 0) {
          state.zeroStock = [...state.zeroStock, productId];
        }
      });
      return state;
    },
    updateSale: (state, { payload }) => {
      const productId = payload.productId;
      const saleBoolean = payload.isReadyToSale;

      state.productsSeen = [...new Set([...state.productsSeen, productId])];

      if (saleBoolean) {
        state.notReadyToSale = state.notReadyToSale.filter(
          (id) => id !== productId
        );
      } else {
        state.notReadyToSale = [
          ...new Set([...state.notReadyToSale, productId]),
        ];
      }

      return state;
    },
    updateStock: (state, { payload }) => {
      const stocks = payload as STOCK[];

      stocks.forEach((obj) => {
        if (!state.productsSeen.includes(obj.product)) return;

        state.productsSeen = [...new Set([...state.productsSeen, obj.product])];

        if (obj.stock === 0) {
          state.zeroStock = [...new Set([...state.zeroStock, obj.product])];
        } else {
          state.zeroStock = state.zeroStock.filter(
            (productId) => productId !== obj.product
          );
        }
      });

      return state;
    },
  },
});

export const { addSaleAndStock, updateSale, updateStock } =
  saleAndStockSlice.actions;

export const saleAndStockReducer = saleAndStockSlice.reducer;

export const saleAndStockState = (state: RootState) => state.saleAndStock;
