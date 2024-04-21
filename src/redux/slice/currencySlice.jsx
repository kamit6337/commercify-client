import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: null,
  name: null,
  symbol: null,
  exchangeRate: null,
};

const currencySlice = createSlice({
  name: "CurrencySlice",
  initialState,
  reducers: {
    initialCurrencyData: (state, { payload }) => {
      const { code, name, symbol, exchangeRate } = payload;

      state.code = code || "USD";
      state.name = name;
      state.symbol = symbol || "$";
      state.exchangeRate = exchangeRate || 1;
      return state;
    },
  },
});

export const { initialCurrencyData } = currencySlice.actions;

export const currencyReducer = currencySlice.reducer;

export const currencyState = (state) => state.currency;
