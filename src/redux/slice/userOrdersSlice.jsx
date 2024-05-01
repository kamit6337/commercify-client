import { createSlice } from "@reduxjs/toolkit";
import removeDuplicateId from "../../utils/javascript/removeDuplicateId";

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
    addNewOrders: (state, { payload }) => {
      const newOrders = payload;
      const newList = [...newOrders, ...state.orders];
      state.orders = removeDuplicateId(newList);
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
  addNewOrders,
  returnTheOrder,
  cancelTheOrder,
  failedOrders,
} = userOrdersSlice.actions;

export const userOrdersReducer = userOrdersSlice.reducer;

export const userOrdersState = (state) => state.userOrders;
