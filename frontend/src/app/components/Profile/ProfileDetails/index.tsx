import { Edit, Save } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeErrorActions } from "../../../store/activeError.slice";
import { activeNotificationActions } from "../../../store/activeNotification.slice";
import {
  activeUserActions,
  selectActiveUser,
  selectIsEditing,
  selectIsViewing,
} from "../../../store/activeUser.slice";
import { AppDispatch } from "../../../store/store";
import { updateUser } from "../../../store/thunks";
import { PageModes, PutUserArgs } from "../../../store/types";
import { ThemeColors } from "../../CustomStyles";

const EMPTY_USER: PutUserArgs = {
  userId: 0,
  email: "",
  phone_number: "",
  first_name: "",
  last_name: "",
};

const ProfileDetails = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = useSelector(selectIsEditing);
  const isViewing = useSelector(selectIsViewing);
  const activeUser = useSelector(selectActiveUser);

  const initialFormValues: PutUserArgs = activeUser
    ? {
        userId: activeUser.id,
        first_name: activeUser.first_name,
        last_name: activeUser.last_name,
        email: activeUser.email,
        phone_number: activeUser.phone_number,
      }
    : EMPTY_USER;

  const handleSubmit = async (
    args: PutUserArgs,
    actions: FormikHelpers<PutUserArgs>
  ) => {
    try {
      const activeUser = unwrapResult(await dispatch(updateUser({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Profile updated successfully!",
        })
      );
      dispatch(activeUserActions.setPageMode(PageModes.VIEW));
    } catch (error: any) {
      dispatch(
        activeErrorActions.setActiveError({
          message: error.message,
          code: error.statusCode,
        })
      );
    }
    actions.setSubmitting(false);
  };

  const handleUpdate = () => {
    dispatch(activeUserActions.setPageMode(PageModes.EDIT));
  };

  return (
    <>
      {isViewing && activeUser && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          style={{ minHeight: "100vh", marginTop: "10px" }}
        >
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Your profile information
                </Typography>
                <Typography variant="h5" component="div">
                  {activeUser.first_name} {activeUser.last_name}
                  <Avatar sx={{ bgcolor: ThemeColors.info }}>
                    {activeUser.first_name.charAt(0)}
                    {activeUser.last_name.charAt(0)}
                  </Avatar>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {activeUser.email}
                </Typography>
                <Typography variant="body2">
                  You are:
                  {activeUser.is_active && (
                    <Chip
                      style={{
                        backgroundColor: ThemeColors.success,
                        color: ThemeColors.light,
                        margin: "3px",
                      }}
                      label="Active"
                    />
                  )}
                  {!activeUser.is_active && <Chip label="Inactive" />}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Phone: {activeUser.phone_number}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">
                  <Edit onClick={handleUpdate} />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
      {isEditing && (
        <Formik
          initialValues={initialFormValues}
          onSubmit={(values, actions) => {
            handleSubmit(values, actions);
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, handleChange, touched, errors }) => (
            <Form>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{ minHeight: "100vh", marginTop: "10px" }}
              >
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Your profile information
                      </Typography>
                      <InputLabel>First name and Last name:</InputLabel>
                      <Field
                        fullWidth
                        id="first_name"
                        name="first_name"
                        placeholder="Enter first name"
                        defaultValue={values.first_name}
                        component={TextField}
                        onChange={handleChange}
                      />
                      <Field
                        fullWidth
                        id="last_name"
                        name="last_name"
                        placeholder="Enter last name"
                        defaultValue={values.last_name}
                        component={TextField}
                        onChange={handleChange}
                      />
                      <InputLabel>Email:</InputLabel>
                      <Field
                        fullWidth
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        defaultValue={values.email}
                        component={TextField}
                        onChange={handleChange}
                      />
                      <InputLabel>Phone:</InputLabel>
                      <Field
                        fullWidth
                        id="phone_number"
                        name="phone_number"
                        placeholder="Enter phone number"
                        defaultValue={values.phone_number}
                        component={TextField}
                        onChange={handleChange}
                      />
                    </CardContent>
                    <CardActions>
                      {isViewing && (
                        <Button size="small">
                          <Edit onClick={handleUpdate} />
                        </Button>
                      )}
                      {isEditing && (
                        <Button type="submit" size="small">
                          <Save />
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default ProfileDetails;
