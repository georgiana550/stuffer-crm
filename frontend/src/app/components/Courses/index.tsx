import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store/store";
import { selectActiveUser } from "../../store/activeUser.slice";
import { Skeleton } from "@mui/material";
import {
  CoursesDetails as CoursesDetailsType,
  INITIAL_PAGINATION,
  PageModes,
} from "../../store/types";
import { getCourses } from "../../store/thunks";
import { activeErrorActions } from "../../store/activeError.slice";
import Navbar from "../Navbar";
import {
  activeCoursesActions,
  selectActiveCourses,
  selectIsLoading,
  selectPageMode,
} from "../../store/activeCourses.slice";
import CoursesDetails from "./CoursesDetails";

const Courses = (): ReactElement => {
  const activeUser = useSelector(selectActiveUser);
  const dispatch = useDispatch<AppDispatch>();

  const activeCourses = useSelector(selectActiveCourses);
  const activeCoursesPageMode = useSelector(selectPageMode);
  const activeCoursesIsLoading = useSelector(selectIsLoading);

  useEffect(() => {
    const fetchCourses = async () => {
      if (activeUser)
        try {
          const courses: CoursesDetailsType = unwrapResult(
            await dispatch(
              getCourses({
                userId: activeUser.id,
                limit: INITIAL_PAGINATION.limit,
                offset: INITIAL_PAGINATION.offset,
                order: INITIAL_PAGINATION.order,
                orderBy: INITIAL_PAGINATION.orderBy,
                name: null,
                universityName: null,
                location: null,
              })
            )
          );
          dispatch(activeCoursesActions.setCoursesList(courses));
        } catch (error: any) {
          dispatch(
            activeErrorActions.setActiveError({
              message: error.message,
              code: error.statusCode,
            })
          );
        }
    };

    if (activeUser && activeUser.id) {
      fetchCourses();
    }
  }, []);

  {
    return (
      <>
        {activeUser && <Navbar />}
        {activeUser &&
          activeCourses &&
          activeCoursesPageMode === PageModes.VIEW && <CoursesDetails />}
        {activeUser &&
          !activeCourses &&
          activeCoursesPageMode === PageModes.VIEW &&
          "No courses found"}
        {activeUser && !activeCourses && activeCoursesIsLoading && <Skeleton />}
      </>
    );
  }
};

export default Courses;
