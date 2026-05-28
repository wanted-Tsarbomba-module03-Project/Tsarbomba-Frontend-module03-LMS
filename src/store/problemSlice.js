import { createSlice } from "@reduxjs/toolkit";

import {
  INITIAL_PROBLEM_INFO,
  INITIAL_SUB_PROBLEM,
} from "../services/problemService";

const initialState = {
  problemInfo: INITIAL_PROBLEM_INFO,

  problems: [INITIAL_SUB_PROBLEM],
};

const problemSlice = createSlice({
  name: "problem",

  initialState,

  reducers: {
    setProblemInfo(state, action) {
      state.problemInfo = {
        ...state.problemInfo,
        ...action.payload,
      };
    },

    setProblems(state, action) {
      state.problems = action.payload;
    },

    addProblem(state) {
      state.problems.push({
        ...INITIAL_SUB_PROBLEM,
      });
    },

    removeProblem(state, action) {
      if (state.problems.length === 1) return;

      state.problems = state.problems.filter(
        (_, index) => index !== action.payload,
      );
    },

    resetProblemState() {
      return initialState;
    },
  },
});

export const {
  setProblemInfo,
  setProblems,
  addProblem,
  removeProblem,
  resetProblemState,
} = problemSlice.actions;

export default problemSlice.reducer;
