import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { ActionStatus, PageModes, Course } from "./types";
import { getCourse } from "./thunks";

export type ActiveCourseState = {
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  course: Course | undefined;
};

export const initialState: ActiveCourseState = {
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  course: undefined,
};

export const activeCourseSlice = createSlice({
  name: "course/active",
  initialState,
  reducers: {
    setPageMode: (
      state: ActiveCourseState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    setCourse: (
      state: ActiveCourseState,
      { payload }: PayloadAction<Course | undefined>
    ) => {
      state.course = payload;
    },
    reset: (): ActiveCourseState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(getCourse.pending, (state: ActiveCourseState) => {
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(getCourse.fulfilled, (state: ActiveCourseState, { payload }) => {
        state.mode = PageModes.VIEW;
        state.course = payload;
        state.loadingStatus = ActionStatus.SUCCESS;
      })
      .addCase(getCourse.rejected, (state: ActiveCourseState) => {
        state.course = undefined;
        state.loadingStatus = ActionStatus.FAILURE;
      });
  },
});

const selectEntityState = (state: RootState): ActiveCourseState =>
  state.activeCourse;

export const selectActiveCourse = createSelector(
  [selectEntityState],
  (state) => state.course
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

export const activeCourseActions = activeCourseSlice.actions;
export default activeCourseSlice.reducer;
