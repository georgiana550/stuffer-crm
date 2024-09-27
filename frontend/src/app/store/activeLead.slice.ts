import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { getLead } from "./thunks";
import { ActionStatus, Lead, PageModes } from "./types";

export type ActiveLeadState = {
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  lead: Lead | undefined;
};

export const initialState: ActiveLeadState = {
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  lead: undefined,
};

export const activeLeadSlice = createSlice({
  name: "lead/active",
  initialState,
  reducers: {
    setPageMode: (
      state: ActiveLeadState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    setLead: (state: ActiveLeadState, { payload }: PayloadAction<Lead>) => {
      state.lead = payload;
    },
    reset: (): ActiveLeadState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(getLead.pending, (state: ActiveLeadState) => {
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(getLead.fulfilled, (state: ActiveLeadState, { payload }) => {
        state.mode = PageModes.VIEW;
        state.lead = payload;
        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(getLead.rejected, (state: ActiveLeadState) => {
        state.lead = undefined;
        state.loadingStatus = ActionStatus.FAILURE;
      });
  },
});

const selectEntityState = (state: RootState): ActiveLeadState =>
  state.activeLead;

export const selectActiveLead = createSelector(
  [selectEntityState],
  (state) => state.lead
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

export const activeLeadActions = activeLeadSlice.actions;
export default activeLeadSlice.reducer;
