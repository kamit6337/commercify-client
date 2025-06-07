import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  id: "683cb84daa7f92326b3dfe17",
  currency_code: "INR",
  currency_name: "Rupee",
  symbol: "₹",
  country: "India",
  dial_code: "+91",
  flag: "https://res.cloudinary.com/deuwn3h4v/image/upload/v1748809211/Country/India/z61dplbegos7zk4n8n0n.png",
  conversionRate: 1,
};

const currencySlice = createSlice({
  name: "CurrencySlice",
  initialState,
  reducers: {
    initialCountryData: (state, { payload }) => {
      const {
        id,
        currency_code,
        currency_name,
        symbol,
        country,
        flag,
        dial_code,
      } = payload;

      state.id = id;
      state.currency_code = currency_code;
      state.currency_name = currency_name;
      state.symbol = symbol;
      state.country = country;
      state.dial_code = dial_code;
      state.flag = flag;
      return state;
    },
    initialCurrencyData: (state, { payload }) => {
      state.conversionRate = payload;
      return state;
    },
  },
});

export const { initialCountryData, initialCurrencyData } =
  currencySlice.actions;

export const currencyReducer = currencySlice.reducer;

export const currencyState = (state: RootState) => state.currency;
