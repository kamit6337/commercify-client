import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: "RatingSlice",
  initialState,
  reducers: {
    addNewRatings: (state, { payload }) => {
      state.ratings = [...payload, ...state.ratings];
      return state;
    },
    addUserRating: (state, { payload }) => {
      state.ratings = [payload, ...state.ratings];
      return state;
    },
  },
});

export const { addNewRatings, addUserRating } = ratingSlice.actions;

export const ratingReducer = ratingSlice.reducer;

export const ratingState = (state) => state.rating;
