import { configureStore } from "@reduxjs/toolkit";
import problemReducer from "./problemSlice";

const store = configureStore({
  reducer: {
    problem: problemReducer,
  },
});

export default store;
