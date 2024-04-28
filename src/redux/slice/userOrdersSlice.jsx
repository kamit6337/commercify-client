import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const userOrdersSlice = createSlice({
  name: "UserOrdersSlice",
  initialState,
  reducers: {
    fillInitialOrders: (state, { payload }) => {
      const orderList = payload;
      state.orders = [...orderList];
      return state;
    },
    addNewOrders: (state, { payload }) => {
      const newOrders = payload;
      state.orders = [...newOrders, ...state.orders];
      return state;
    },
    cancelTheOrder: (state, { payload }) => {
      const order = payload;
      state.orders = state.orders.map((obj) => {
        if (obj._id === order._id) {
          return { ...obj, isCancelled: true };
        }
        return obj;
      });
      return state;
    },
  },
});

export const { fillInitialOrders, addNewOrders, cancelTheOrder } =
  userOrdersSlice.actions;

export const userOrdersReducer = userOrdersSlice.reducer;

export const userOrdersState = (state) => state.orders;
