import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  List,
  Select,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { unwrapResult } from "@reduxjs/toolkit";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeErrorActions } from "../../../store/activeError.slice";
import {
  selectActiveLead,
  selectIsCreating,
  selectIsEditing,
} from "../../../store/activeLead.slice";
import { activeNotificationActions } from "../../../store/activeNotification.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { createLead, updateLead } from "../../../store/thunks";
import {
  LeadStatusCodes,
  PostLead,
  PostLeadArgs,
  UpdateLeadArgs,
} from "../../../store/types";
import {
  CustomTextField,
  RequiredAsterisks,
  ThemeColors,
} from "../../CustomStyles";
import AsigneeSelect from "../AsigneeSelect";
import CoursesSelect from "../CoursesSelect";
import leadSchema from "./lead";
import StatusSelect from "../StatusSelect";

const EMPTY_LEAD: PostLead = {
  fullName: "",
  email: "",
  phone: "",
  coursesIds: [],
  asigneeId: 0,
  status: LeadStatusCodes.NEW,
};

type Props = {
  onClose: () => void;
};

const CreateLead = ({ onClose }: Props): ReactElement => {
  const activeLead = useSelector(selectActiveLead);
  const isEditing = useSelector(selectIsEditing);
  const isCreating = useSelector(selectIsCreating);

  const initialFormValues: PostLead =
    activeLead && isEditing
      ? {
          id: activeLead.id,
          fullName: activeLead.fullName,
          email: activeLead.email,
          phone: activeLead.phone,
          asigneeId: activeLead.asigneeId,
          asigneeEmail: activeLead.asigneeEmail,
          coursesIds:
            activeLead && activeLead.courses.length
              ? activeLead.courses.map((course) => course.id!)
              : [],
          refereeName: activeLead.refereeName,
          dateOfBirth: activeLead.dateOfBirth,
          language: activeLead.language,
          citizenship: activeLead.citizenship,
          status: activeLead.status,
        }
      : EMPTY_LEAD;

  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);

  const handleLeadCreate = async (args: PostLeadArgs) => {
    try {
      unwrapResult(await dispatch(createLead({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Lead created successfully!",
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

  const handleLeadUpdate = async (args: UpdateLeadArgs) => {
    try {
      const lead = unwrapResult(await dispatch(updateLead({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Lead updated successfully!",
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
    values: PostLead,
    actions: FormikHelpers<PostLead>
  ): void => {
    if (activeUser && isCreating)
      handleLeadCreate({ ...values, userId: activeUser.id });
    if (activeUser && isEditing && activeLead?.id) {
      handleLeadUpdate({
        ...values,
        userId: activeUser.id,
        leadId: activeLead.id,
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
          validationSchema={leadSchema}
        >
          {({ values, handleChange, touched, errors }) => (
            <Form>
              <DialogTitle>
                {isCreating ? "Create lead" : "Update lead"}
              </DialogTitle>
              <DialogContent>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item style={{ width: "50%" }}>
                    <InputLabel>
                      <RequiredAsterisks label={"Full name"} />
                    </InputLabel>
                    <Field
                      id="fullName"
                      name="fullName"
                      placeholder="Enter full name"
                      defaultValue={values.fullName}
                      component={CustomTextField}
                      onChange={handleChange}
                      error={touched.fullName && Boolean(errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <RequiredAsterisks label={"Email"} />
                    <Field
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      defaultValue={values.email}
                      component={CustomTextField}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <RequiredAsterisks label={"Phone"} />
                    <Field
                      id="phone"
                      name="phone"
                      component={CustomTextField}
                      defaultValue={values.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <StatusSelect />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <InputLabel>Date of birth</InputLabel>
                      <Field
                        id="dateOfBirth"
                        name="dateOfBirth"
                        placeholder="Enter date of birth"
                        component={DateTimePicker}
                        defaultValue={
                          values.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : values.dateOfBirth
                        }
                        onChange={(e: any) => {
                          handleChange({
                            target: {
                              name: "dateOfBirth",
                              value: new Date(e).toISOString(),
                            },
                          });
                        }}
                        error={
                          touched.dateOfBirth && Boolean(errors.dateOfBirth)
                        }
                        helperText={touched.dateOfBirth && errors.dateOfBirth}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <InputLabel>Referee name</InputLabel>
                    <Field
                      id="refereeName"
                      name="refereeName"
                      placeholder="Enter referee name"
                      component={CustomTextField}
                      defaultValue={values.refereeName}
                      onChange={handleChange}
                      error={touched.refereeName && Boolean(errors.refereeName)}
                      helperText={touched.refereeName && errors.refereeName}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <InputLabel>Language</InputLabel>
                    <Field
                      id="language"
                      name="language"
                      placeholder="Enter matern language"
                      component={CustomTextField}
                      defaultValue={values.language}
                      onChange={handleChange}
                      error={touched.language && Boolean(errors.language)}
                      helperText={touched.language && errors.language}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <InputLabel>Citizenship</InputLabel>
                    <Field
                      id="citizenship"
                      name="citizenship"
                      placeholder="Enter citizenship"
                      component={CustomTextField}
                      defaultValue={values.citizenship}
                      onChange={handleChange}
                      error={touched.citizenship && Boolean(errors.citizenship)}
                      helperText={touched.citizenship && errors.citizenship}
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <AsigneeSelect />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <CoursesSelect />
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

export default CreateLead;
