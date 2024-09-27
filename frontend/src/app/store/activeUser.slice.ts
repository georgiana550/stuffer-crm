import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, updateUser } from "./thunks";
import { RootState } from "../../rootReducer";
import { ActionStatus, PageModes, UserDetails } from "./types";

export type ActiveUserState = {
  id: number;
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  user?: UserDetails;
};

export const initialState: ActiveUserState = {
  id: 0,
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  user: undefined,
};

// shortcuts when extraReducer only has to change "savingStatus"
const pendingStatus = (state: ActiveUserState) => ({
  ...state,
  savingStatus: ActionStatus.PENDING,
});
const failureStatus = (state: ActiveUserState) => ({
  ...state,
  savingStatus: ActionStatus.FAILURE,
});

export const activeUserSlice = createSlice({
  name: "users/active",
  initialState,
  reducers: {
    selectActiveUserId: (
      state: ActiveUserState,
      { payload }: PayloadAction<number>
    ) => {
      state.id = payload;
    },
    selectActiveUser: (
      state: ActiveUserState,
      { payload }: PayloadAction<UserDetails>
    ) => {
      state.user = payload;
    },
    setPageMode: (
      state: ActiveUserState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    reset: (): ActiveUserState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(loginUser.pending, (state: ActiveUserState) => {
        state.user = undefined;
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(loginUser.fulfilled, (state: ActiveUserState, { payload }) => {
        state.user = payload;
        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(loginUser.rejected, (state: ActiveUserState) => {
        state.user = undefined;
        state.loadingStatus = ActionStatus.FAILURE;
      })
      .addCase(logoutUser.fulfilled, (state: ActiveUserState) => {
        state.user = undefined;
        state.loadingStatus = ActionStatus.INITIAL;
      })
      // update user
      .addCase(updateUser.pending, pendingStatus)
      .addCase(updateUser.fulfilled, (state: ActiveUserState, { payload }) => {
        state.user = payload;
        state.mode = PageModes.VIEW;
        state.savingStatus = ActionStatus.SUCCESS;
      })
      .addCase(updateUser.rejected, failureStatus);
  },
});

const selectEntityState = (state: RootState): ActiveUserState =>
  state.activeUser;

export const selectActiveUserId = createSelector(
  [selectEntityState],
  (state) => state.id
);
export const selectActiveUser = createSelector(
  [selectEntityState],
  (state) => state.user
);

export const selectSavingStatus = createSelector(
  [selectEntityState],
  (state) => state.savingStatus
);
export const selectLoadingStatus = createSelector(
  [selectEntityState],
  (state) => state.loadingStatus
);
export const selectIsLoading = createSelector(
  [selectEntityState],
  (state) => state.loadingStatus === ActionStatus.PENDING
);
export const selectIsEditing = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.EDIT
);
export const selectIsViewing = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.VIEW
);
export const selectIsCreating = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.CREATE
);
export const selectIsMarkedForDelete = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.DELETE
);
export const selectIsCloning = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.CLONE
);
export const selectPageMode = createSelector(
  [selectEntityState],
  (state) => state.mode
);
export const selectIsEditingCreatingOrDeleting = createSelector(
  [selectIsEditing, selectIsCreating, selectIsMarkedForDelete],
  (editing, creating, deleting) => editing || creating || deleting
);

export const activeUserActions = activeUserSlice.actions;
export default activeUserSlice.reducer;
