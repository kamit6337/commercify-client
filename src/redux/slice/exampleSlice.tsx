import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  todos: [],
};

const exampleSlice = createSlice({
  name: "exampleSlice",
  initialState,
  reducers: {},
});

export const exampleReducer = exampleSlice.reducer;

export const exampleState = (state: RootState) => state.example;
