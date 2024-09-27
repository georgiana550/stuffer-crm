import { InputLabel, MenuItem, Select, Skeleton } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { Field, useFormikContext } from "formik";
import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeCoursesActions,
  selectActiveCourses,
} from "../../../store/activeCourses.slice";
import { activeErrorActions } from "../../../store/activeError.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { getCourses } from "../../../store/thunks";
import {
  CoursesDetails as CoursesDetailsType,
  INITIAL_PAGINATION,
  PostLead,
} from "../../../store/types";

const CoursesSelect = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);
  const activeCourses = useSelector(selectActiveCourses);

  const {
    values: { coursesIds },
    setFieldValue,
    touched,
    errors,
  } = useFormikContext<PostLead>();

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

  return (
    <>
      {activeCourses && (
        <>
          <InputLabel>Courses</InputLabel>
          <Field
            fullWidth
            placeholder="Select"
            id="coursesIds"
            multiple
            value={coursesIds.length > 0 ? coursesIds : [""]}
            onChange={(e: any) => {
              if (e.target.value.includes(""))
                e.target.value = e.target.value.splice(1, 1);
              setFieldValue("coursesIds", e.target.value);
            }}
            component={Select}
            error={touched.coursesIds && Boolean(errors.coursesIds)}
            helperText={touched.coursesIds && errors.coursesIds}
          >
            <MenuItem disabled value="">
              Select one or more courses
            </MenuItem>

            {activeCourses &&
              activeCourses.courses.map((course) => {
                return (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                );
              })}
          </Field>
        </>
      )}
      {!activeCourses && <Skeleton />}
    </>
  );
};

export default CoursesSelect;
