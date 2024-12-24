import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartValue: {
    bool: false,
  },
};

const toggleSlice = createSlice({
  name: "ToggleSlice",
  initialState,
  reducers: {
    toggleCartValue: (state, { payload }) => {
      const { bool } = payload;
      state.cartValue.bool = bool;
      return state;
    },
  },
});

export const { toggleCartValue } = toggleSlice.actions;

export const toggleReducer = toggleSlice.reducer;

export const toggleState = (state) => state.toggle;
