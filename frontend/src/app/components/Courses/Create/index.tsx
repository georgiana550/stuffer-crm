import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { unwrapResult } from "@reduxjs/toolkit";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveCourse,
  selectIsCreating,
  selectIsEditing,
} from "../../../store/activeCourse.slice";
import { activeErrorActions } from "../../../store/activeError.slice";
import { activeNotificationActions } from "../../../store/activeNotification.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { createCourse, updateCourse } from "../../../store/thunks";
import { Course, PostCourseArgs, UpdateCourseArgs } from "../../../store/types";
import {
  CustomTextField,
  RequiredAsterisks,
  ThemeColors,
} from "../../CustomStyles";
import courseSchema from "./course";

const EMPTY_COURSE = {
  name: "",
  description: "",
  additionalInformation: "",
  startDate: undefined,
  endDate: undefined,
  location: "",
  universityName: "",
  leads: [],
};

type Props = {
  onClose: () => void;
};

const CreateCourse = ({ onClose }: Props): ReactElement => {
  const activeCourse = useSelector(selectActiveCourse);
  const isEditing = useSelector(selectIsEditing);
  const isCreating = useSelector(selectIsCreating);

  const initialFormValues: Course =
    activeCourse && isEditing
      ? {
          id: activeCourse.id,
          name: activeCourse.name,
          description: activeCourse.description,
          additionalInformation: activeCourse.additionalInformation,
          startDate: activeCourse.startDate,
          endDate: activeCourse.endDate,
          location: activeCourse.location,
          universityName: activeCourse.universityName,
          leads: activeCourse.leads,
        }
      : EMPTY_COURSE;

  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);

  const handleCourseCreate = async (args: PostCourseArgs) => {
    try {
      const course = unwrapResult(await dispatch(createCourse({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Course created successfully!",
        })
      );
      onClose();
    } catch (error: any) {
      dispatch(
        activeErrorActions.setActiveError({
          message: error.message,
          code: error.statusCode,
        })
      );
    }
  };

  const handleCourseUpdate = async (args: UpdateCourseArgs) => {
    try {
      const course = unwrapResult(await dispatch(updateCourse({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Course updated successfully!",
        })
      );
      onClose();
    } catch (error: any) {
      dispatch(
        activeErrorActions.setActiveError({
          message: error.message,
          code: error.statusCode,
        })
      );
    }
  };

  const handleSubmit = (
    values: Course,
    actions: FormikHelpers<Course>
  ): void => {
    if (activeUser && isCreating)
      handleCourseCreate({ ...values, userId: activeUser.id });
    if (activeUser && isEditing && activeCourse?.id) {
      handleCourseUpdate({
        ...values,
        userId: activeUser.id,
        courseId: activeCourse.id,
      });
    }
    actions.setSubmitting(false);
  };

  return (
    <>
      <Dialog onClose={onClose} open={isCreating || isEditing}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={(values, actions) => {
            handleSubmit(values, actions);
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={courseSchema}
        >
          {({ values, handleChange, touched, errors }) => (
            <Form>
              <DialogTitle>
                {isCreating ? "Create course" : "Update course"}
              </DialogTitle>
              <DialogContent>
                <Grid
                  container
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid style={{ width: "50%" }} item>
                    <RequiredAsterisks label={"Name"} />
                    <Field
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      defaultValue={values.name}
                      component={CustomTextField}
                      onChange={handleChange}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid style={{ width: "50%" }} item>
                    <RequiredAsterisks label={"Description"} />
                    <Field
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      defaultValue={values.description}
                      component={CustomTextField}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid style={{ width: "50%" }} item>
                    <RequiredAsterisks label={"Location"} />
                    <Field
                      id="location"
                      name="location"
                      placeholder="Enter course location"
                      component={CustomTextField}
                      defaultValue={values.location}
                      onChange={handleChange}
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                    />
                  </Grid>{" "}
                  <Grid item xs={6} />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid style={{ width: "50%" }} item>
                      <InputLabel>Start date</InputLabel>
                      <Field
                        id="startDate"
                        name="startDate"
                        placeholder="Enter start date"
                        component={DateTimePicker}
                        defaultValue={
                          values.startDate
                            ? new Date(values.startDate)
                            : values.startDate
                        }
                        onChange={(e: any) => {
                          handleChange({
                            target: {
                              name: "startDate",
                              value: new Date(e).toISOString(),
                            },
                          });
                        }}
                        error={touched.startDate && Boolean(errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                      />
                    </Grid>
                    <Grid style={{ width: "50%" }} item>
                      <InputLabel>End date</InputLabel>
                      <Field
                        id="endDate"
                        name="endDate"
                        placeholder="Enter end date"
                        component={DateTimePicker}
                        defaultValue={
                          values.endDate
                            ? new Date(values.endDate)
                            : values.endDate
                        }
                        onChange={(e: any) => {
                          handleChange({
                            target: {
                              name: "endDate",
                              value: new Date(e).toISOString(),
                            },
                          });
                        }}
                        error={touched.endDate && Boolean(errors.endDate)}
                        helperText={touched.endDate && errors.endDate}
                      />
                    </Grid>
                  </LocalizationProvider>
                  <Grid style={{ width: "50%" }} item>
                    <InputLabel>Additional information</InputLabel>
                    <Field
                      id="additionalInformation"
                      name="additionalInformation"
                      placeholder="Enter additional information"
                      component={CustomTextField}
                      defaultValue={values.additionalInformation}
                      onChange={handleChange}
                      error={
                        touched.additionalInformation &&
                        Boolean(errors.additionalInformation)
                      }
                      helperText={
                        touched.additionalInformation &&
                        errors.additionalInformation
                      }
                    />
                  </Grid>
                  <Grid style={{ width: "50%" }} item>
                    <InputLabel>University Name</InputLabel>
                    <Field
                      id="universityName"
                      name="universityName"
                      placeholder="Enter university Name"
                      component={CustomTextField}
                      defaultValue={values.universityName}
                      onChange={handleChange}
                      error={
                        touched.universityName && Boolean(errors.universityName)
                      }
                      helperText={
                        touched.universityName && errors.universityName
                      }
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button
                  style={{ backgroundColor: ThemeColors.secondary }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default CreateCourse;
