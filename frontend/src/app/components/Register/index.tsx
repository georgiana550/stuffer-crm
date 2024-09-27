import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFormik } from "formik";
import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activeErrorActions } from "../../store/activeError.slice";
import { activeNotificationActions } from "../../store/activeNotification.slice";
import { selectActiveUser } from "../../store/activeUser.slice";
import { AppDispatch } from "../../store/store";
import { registerUser } from "../../store/thunks";
import { PostRegisterArgs } from "../../store/types";
import { CustomTextField, ThemeColors } from "../CustomStyles";
import { Pages } from "../constants";

type Props = {
  onChange?: (loggin: boolean) => void;
};

const Register = ({ onChange }: Props): ReactElement => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (isChecked) navigate(Pages.LOGIN, { replace: true });
  }, [isChecked]);

  const handleRegister = async (args: PostRegisterArgs) => {
    try {
      const user = unwrapResult(await dispatch(registerUser({ ...args })));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "User created successfully!",
        })
      );
      navigate(Pages.LOGIN, { replace: true });
    } catch (error: any) {
      dispatch(
        activeErrorActions.setActiveError({
          message: error.message,
          code: error.statusCode,
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    },
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  return (
    <>
      {!activeUser && (
        <Box padding={"5%"} justifyItems={"center"}>
          <form onSubmit={formik.handleSubmit}>
            <InputLabel style={{ color: ThemeColors.light }}>
              First name
            </InputLabel>
            <CustomTextField
              fullWidth
              id="first_name"
              name="first_name"
              placeholder="Enter first name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              error={
                formik.touched.first_name && Boolean(formik.errors.first_name)
              }
              helperText={formik.touched.first_name && formik.errors.first_name}
            />
            <InputLabel style={{ color: ThemeColors.light }}>
              Last name
            </InputLabel>

            <CustomTextField
              fullWidth
              id="last_name"
              name="last_name"
              placeholder="Enter last name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              error={
                formik.touched.last_name && Boolean(formik.errors.last_name)
              }
              helperText={formik.touched.last_name && formik.errors.last_name}
            />
            <InputLabel style={{ color: ThemeColors.light }}>
              Phone number
            </InputLabel>

            <CustomTextField
              fullWidth
              id="phone_number"
              name="phone_number"
              placeholder="Enter phone number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              error={
                formik.touched.phone_number &&
                Boolean(formik.errors.phone_number)
              }
              helperText={
                formik.touched.phone_number && formik.errors.phone_number
              }
            />
            <InputLabel style={{ color: ThemeColors.light }}>Email</InputLabel>

            <CustomTextField
              fullWidth
              id="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <InputLabel style={{ color: ThemeColors.light }}>
              Password
            </InputLabel>

            <CustomTextField
              fullWidth
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              style={{
                backgroundColor: ThemeColors.secondary,
              }}
              variant="contained"
              fullWidth
              type="submit"
            >
              Submit
            </Button>
          </form>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setIsChecked(true)}
                value={isChecked}
                style={{ color: ThemeColors.light }}
              />
            }
            style={{ color: ThemeColors.light }}
            label="I already have an account. Loggin"
          />
        </Box>
      )}
    </>
  );
};

export default Register;
