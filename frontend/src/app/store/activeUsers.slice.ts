import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { ActionStatus, PageModes, UsersDetails } from "./types";
import { getAllUsers } from "./thunks";

export type ActiveUsersState = {
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  users?: UsersDetails;
};

export const initialState: ActiveUsersState = {
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  users: undefined,
};

export const activeUsersSlice = createSlice({
  name: "users/list",
  initialState,
  reducers: {
    setPageMode: (
      state: ActiveUsersState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    setUsersList: (
      state: ActiveUsersState,
      { payload }: PayloadAction<UsersDetails>
    ) => {
      state.users = payload;
    },
    reset: (): ActiveUsersState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(getAllUsers.pending, (state: ActiveUsersState) => {
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state: ActiveUsersState, { payload }) => {
          state.mode = PageModes.VIEW;
          state.users = payload;
          state.loadingStatus = ActionStatus.SUCCESS;
        }
      )
      .addCase(getAllUsers.rejected, (state: ActiveUsersState) => {
        state.users = undefined;
        state.loadingStatus = ActionStatus.FAILURE;
      });
  },
});

const selectEntityState = (state: RootState): ActiveUsersState =>
  state.activeUsers;

export const selectActiveUsers = createSelector(
  [selectEntityState],
  (state) => state.users
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
export const selectIsViewing = createSelector(
  [selectEntityState],
  (state) => state.mode === PageModes.VIEW
);
export const selectPageMode = createSelector(
  [selectEntityState],
  (state) => state.mode
);
export const selectIsEditingCreatingOrDeleting = createSelector(
  [selectIsEditing, selectIsCreating, selectIsMarkedForDelete],
  (editing, creating, deleting) => editing || creating || deleting
);

export const activeUsersActions = activeUsersSlice.actions;
export default activeUsersSlice.reducer;
