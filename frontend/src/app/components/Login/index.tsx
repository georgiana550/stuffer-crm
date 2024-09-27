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
import { activeLeadsActions } from "../../store/activeLeads.slice";
import { activeNotificationActions } from "../../store/activeNotification.slice";
import { selectActiveUser } from "../../store/activeUser.slice";
import { AppDispatch } from "../../store/store";
import { loginUser } from "../../store/thunks";
import { PostLoginArgs } from "../../store/types";
import { CustomTextField, ThemeColors } from "../CustomStyles";
import { Pages } from "../constants";

const Login = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const [isChecked, setIsChecked] = useState(false);
  const activeUser = useSelector(selectActiveUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (isChecked) navigate(Pages.REGISTER, { replace: true });
  }, [isChecked]);

  const handleLogin = async (args: PostLoginArgs) => {
    try {
      const user = unwrapResult(await dispatch(loginUser({ ...args })));
      dispatch(activeLeadsActions.setUserDetails(user));
      dispatch(
        activeNotificationActions.setActiveNotification({
          level: "info",
          message: "Hello!",
        })
      );
      navigate(Pages.HOMEPAGE, { replace: true });
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
    },
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <>
      {!activeUser && (
        <Box padding={"10%"}>
          <form onSubmit={formik.handleSubmit}>
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
              placeholder="Enter password"
              id="password"
              name="password"
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
            label="I don't have an account. Register me"
          />
        </Box>
      )}
    </>
  );
};

export default Login;
