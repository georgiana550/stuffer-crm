import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { LevelType, NotificationDetails } from "./types";

export type ActiveNotificationState = {
  message?: string;
  level?: LevelType;
};

export const initialState: ActiveNotificationState = {
  message: undefined,
  level: "initial",
};

export const activeNotificationSlice = createSlice({
  name: "Notifications/active",
  initialState,
  reducers: {
    setActiveNotification: (
      state: ActiveNotificationState,
      { payload }: PayloadAction<NotificationDetails>
    ) => {
      state.message = payload.message;
      state.level = payload.level;
    },
    reset: (): ActiveNotificationState => initialState,
  },
});

const selectEntityState = (state: RootState): ActiveNotificationState =>
  state.activeNotification;

export const selectActiveNotification = createSelector(
  [selectEntityState],
  (state) => state
);
export const selectActiveNotificationMessage = createSelector(
  [selectEntityState],
  (state) => state.message
);
export const selectActiveNotificationLevel = createSelector(
  [selectEntityState],
  (state) => state.level
);

export const activeNotificationActions = activeNotificationSlice.actions;
export default activeNotificationSlice.reducer;
