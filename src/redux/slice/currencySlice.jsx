import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: "USD",
  name: "Dollar",
  symbol: "$",
  exchangeRate: 1,
  country: "United States",
};

const currencySlice = createSlice({
  name: "CurrencySlice",
  initialState,
  reducers: {
    initialCurrencyData: (state, { payload }) => {
      const { code, name, symbol, exchangeRate, country } = payload;

      state.code = code;
      state.name = name;
      state.symbol = symbol;
      state.exchangeRate = Math.trunc(exchangeRate);
      state.country = country;
      return state;
    },
  },
});

export const { initialCurrencyData } = currencySlice.actions;

export const currencyReducer = currencySlice.reducer;

export const currencyState = (state) => state.currency;
