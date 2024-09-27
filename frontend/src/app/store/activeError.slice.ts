import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { ErrorDetails, LevelType } from "./types";

export const LOGOUT_ERROR = {
  statusCode: 401,
  message: "User is not logged in",
  level: "error",
};

export const USER_NOT_FOUND_ERROR = {
  statusCode: 404,
  message: "User not found",
  level: "error",
};

export const USER_INCORRECT_CREDENTIALS_ERROR = {
  statusCode: 404,
  message: "Password or email are not correct",
  level: "error",
};

export type ActiveErrorState = {
  code?: number;
  message?: string;
  level?: LevelType;
};

export const initialState: ActiveErrorState = {
  code: undefined,
  message: undefined,
  level: "error",
};

export const activeErrorSlice = createSlice({
  name: "errors/active",
  initialState,
  reducers: {
    setActiveError: (
      state: ActiveErrorState,
      { payload }: PayloadAction<ErrorDetails>
    ) => {
      state.code = payload.code;
      state.message = payload.message;
      state.level = "error";
    },
    reset: (): ActiveErrorState => initialState,
  },
});

const selectEntityState = (state: RootState): ActiveErrorState =>
  state.activeError;

export const selectActiveError = createSelector(
  [selectEntityState],
  (state) => state
);
export const selectActiveErrorCode = createSelector(
  [selectEntityState],
  (state) => state.code
);
export const selectActiveErrorMessage = createSelector(
  [selectEntityState],
  (state) => state.message
);
export const selectActiveErrorLevel = createSelector(
  [selectEntityState],
  (state) => state.level
);

export const activeErrorActions = activeErrorSlice.actions;
export default activeErrorSlice.reducer;
