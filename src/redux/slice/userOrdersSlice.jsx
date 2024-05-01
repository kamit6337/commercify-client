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
      state.orders = orderList;
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
    returnTheOrder: (state, { payload }) => {
      const order = payload;
      state.orders = state.orders.map((obj) => {
        if (obj._id === order._id) {
          return { ...obj, isReturned: true };
        }
        return obj;
      });
      return state;
    },
    failedOrders: (state, { payload }) => {
      const buysId = payload;

      buysId.forEach((id) => {
        state.orders = state.orders.filter((order) => order._id !== id);
      });

      return state;
    },
  },
});

export const {
  fillInitialOrders,
  returnTheOrder,
  cancelTheOrder,
  failedOrders,
} = userOrdersSlice.actions;

export const userOrdersReducer = userOrdersSlice.reducer;

export const userOrdersState = (state) => state.userOrders;
