import { Menu as MenuBook } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LOGOUT_ERROR,
  USER_INCORRECT_CREDENTIALS_ERROR,
  USER_NOT_FOUND_ERROR,
  activeErrorActions,
  selectActiveError,
} from "../../store/activeError.slice";
import {
  activeUserActions,
  selectActiveUser,
} from "../../store/activeUser.slice";
import { AppDispatch } from "../../store/store";
import { logoutUser } from "../../store/thunks";
import { PageModes } from "../../store/types";
import { ThemeColors } from "../CustomStyles";
import { Pages } from "../constants";
import Notifications from "./Notifications";

const Navbar = (): ReactElement => {
  const activeUser = useSelector(selectActiveUser);
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const activeError = useSelector(selectActiveError);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoTo = (pageName: string) => {
    setAnchorEl(null);
    switch (pageName) {
      case Pages.PROFILE: {
        dispatch(activeUserActions.setPageMode(PageModes.VIEW));
        return navigate(Pages.PROFILE, { replace: true });
      }
      case Pages.COURSES: {
        return navigate(Pages.COURSES, { replace: true });
      }
      case Pages.LEADS: {
        return navigate(Pages.LEADS, { replace: true });
      }
      default:
        return;
    }
  };

  const handleLogout = async () => {
    if (activeUser)
      try {
        unwrapResult(await dispatch(logoutUser({ email: activeUser.email })));
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

  useEffect(() => {
    if (
      activeError.message === LOGOUT_ERROR.message ||
      activeError.message === USER_NOT_FOUND_ERROR.message ||
      activeError.message === USER_INCORRECT_CREDENTIALS_ERROR.message
    ) {
      dispatch(activeUserActions.reset());
    }
  }, [activeError]);

  {
    return (
      <>
        {activeUser && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar
                position="static"
                sx={{ background: ThemeColors.secondary }}
              >
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MenuBook />
                  </IconButton>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem onClick={() => handleGoTo(Pages.PROFILE)}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleGoTo(Pages.LEADS)}>
                      My leads
                    </MenuItem>
                    <MenuItem onClick={() => handleGoTo(Pages.COURSES)}>
                      Courses
                    </MenuItem>
                  </Menu>
                  <Typography
                    style={{ textTransform: "capitalize" }}
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    {activeUser.first_name + " " + activeUser.last_name}
                  </Typography>
                  <Notifications />
                  <Button onClick={handleLogout} color="inherit">
                    Logout
                  </Button>
                </Toolbar>
              </AppBar>
            </Box>
          </>
        )}
      </>
    );
  }
};

export default Navbar;
