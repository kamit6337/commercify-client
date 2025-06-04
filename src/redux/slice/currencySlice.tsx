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
    initialCurrencyData: (state, { payload }) => {
      const {
        id,
        code,
        name,
        symbol,
        conversionRate,
        country,
        flag,
        dial_code,
      } = payload;

      state.id = id;
      state.currency_code = code;
      state.currency_name = name;
      state.symbol = symbol;
      state.country = country;
      state.dial_code = dial_code;
      state.flag = flag;
      state.conversionRate = conversionRate;
      return state;
    },
  },
});

export const { initialCurrencyData } = currencySlice.actions;

export const currencyReducer = currencySlice.reducer;

export const currencyState = (state: RootState) => state.currency;
