import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: null,
  name: null,
  symbol: null,
  exchangeRate: null,
  country: null,
};

const currencySlice = createSlice({
  name: "CurrencySlice",
  initialState,
  reducers: {
    initialCurrencyData: (state, { payload }) => {
      const { code, name, symbol, exchangeRate, country } = payload;

      state.code = code || "USD";
      state.name = name || "Dollars";
      state.symbol = symbol || "$";
      state.exchangeRate = Math.trunc(exchangeRate) || 1;
      state.country = country || "United States";
      return state;
    },
  },
});

export const { initialCurrencyData } = currencySlice.actions;

export const currencyReducer = currencySlice.reducer;

export const currencyState = (state) => state.currency;
