import { createSlice } from "@reduxjs/toolkit";
import removeDuplicateId from "../../utils/javascript/removeDuplicateId";

const initialState = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: "RatingSlice",
  initialState,
  reducers: {
    addNewRatings: (state, { payload }) => {
      state.ratings = [...state.ratings, ...payload];
      state.ratings = removeDuplicateId(state.ratings);
      return state;
    },
    addUserRating: (state, { payload }) => {
      state.ratings = [payload, ...state.ratings];
      return state;
    },
    updateRating: (state, { payload }) => {
      state.ratings = state.ratings.map((obj) => {
        if (obj._id === payload._id) {
          return payload;
        }
        return obj;
      });
      return state;
    },
    deleteRating: (state, { payload }) => {
      const id = payload;
      state.ratings = state.ratings.filter((obj) => obj._id !== id);
      return state;
    },
  },
});

export const { addNewRatings, addUserRating, updateRating, deleteRating } =
  ratingSlice.actions;

export const ratingReducer = ratingSlice.reducer;

export const ratingState = (state) => state.rating;
