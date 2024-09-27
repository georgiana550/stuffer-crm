import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { createCourse, getCourses, updateCourse } from "./thunks";
import { ActionStatus, CoursesDetails, PageModes } from "./types";

export type ActiveCoursesState = {
  mode: PageModes;
  savingStatus: ActionStatus;
  loadingStatus: ActionStatus;
  courses?: CoursesDetails;
};

export const initialState: ActiveCoursesState = {
  mode: PageModes.VIEW,
  savingStatus: ActionStatus.INITIAL,
  loadingStatus: ActionStatus.INITIAL,
  courses: undefined,
};

export const activeCoursesSlice = createSlice({
  name: "courses/active",
  initialState,
  reducers: {
    setPageMode: (
      state: ActiveCoursesState,
      { payload }: PayloadAction<PageModes>
    ) => {
      state.mode = payload;
    },
    setCoursesList: (
      state: ActiveCoursesState,
      { payload }: PayloadAction<CoursesDetails>
    ) => {
      state.courses = payload;
    },
    reset: (): ActiveCoursesState => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch one
      .addCase(getCourses.pending, (state: ActiveCoursesState) => {
        state.loadingStatus = ActionStatus.PENDING;
      })
      .addCase(
        getCourses.fulfilled,
        (state: ActiveCoursesState, { payload }) => {
          state.mode = PageModes.VIEW;
          state.courses = payload;
          state.loadingStatus = ActionStatus.SUCCESS;
        }
      )
      .addCase(getCourses.rejected, (state: ActiveCoursesState) => {
        state.courses = undefined;
        state.loadingStatus = ActionStatus.FAILURE;
      })
      .addCase(
        createCourse.fulfilled,
        (state: ActiveCoursesState, { payload }) => {
          if (state.courses?.courses)
            state.courses.courses = [...state.courses?.courses, payload];

          state.loadingStatus = ActionStatus.SUCCESS;
        }
      )
      .addCase(
        updateCourse.fulfilled,
        (state: ActiveCoursesState, { payload }) => {
          if (state.courses && state.courses.courses) {
            const courseIndex = state.courses.courses.findIndex(
              (course) => course.id === payload.id
            );
            state.courses.courses[courseIndex] = payload;
          }
          state.loadingStatus = ActionStatus.SUCCESS;
        }
      );
  },
});

const selectEntityState = (state: RootState): ActiveCoursesState =>
  state.activeCourses;

export const selectActiveCourses = createSelector(
  [selectEntityState],
  (state) => state.courses
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

export const activeCoursesActions = activeCoursesSlice.actions;
export default activeCoursesSlice.reducer;
