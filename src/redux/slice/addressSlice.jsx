import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  selectedAddress: null,
};

const addressSlice = createSlice({
  name: "AddressSlice",
  initialState,
  reducers: {
    initialAddressData: (state, { payload }) => {
      const { data } = payload;

      const firstAddress = data[0];
      state.addresses = data;
      state.selectedAddress = firstAddress;
      localStorage.setItem("_add", firstAddress._id);
      return state;
    },
    createNewAddress: (state, { payload }) => {
      const { data } = payload;
      state.addresses = [data, ...state.addresses];
      return state;
    },
    updateAddressData: (state, { payload }) => {
      const { data } = payload;
      state.addresses = state.addresses.map((address) => {
        if (address._id === data._id) {
          return data;
        }
        return address;
      });
    },
    updateSelectedAddress: (state, { payload }) => {
      const address = payload;
      state.selectedAddress = address;
      localStorage.setItem("_add", address._id);
      return state;
    },
    deleteAddress: (state, { payload }) => {
      const addressId = payload;

      state.addresses = state.addresses.filter(
        (address) => address._id !== addressId
      );
      return state;
    },
  },
});

export const {
  initialAddressData,
  updateAddressData,
  createNewAddress,
  updateSelectedAddress,
  deleteAddress,
} = addressSlice.actions;

export const addressReducer = addressSlice.reducer;

export const addressState = (state) => state.address;
