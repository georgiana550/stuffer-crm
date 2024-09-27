import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  CircleRounded,
  Mail,
} from "@mui/icons-material";
import {
  Badge,
  Button,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { selectActiveUser } from "../../../store/activeUser.slice";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../store/store";
import { getNotifications, seeNotifications } from "../../../store/thunks";
import {
  selectActiveLiveNotSeenNotificationsCount,
  selectActiveLiveNotifications,
  selectActiveLiveNotificationsCount,
  selectActiveLiveToalNotificationsCount,
} from "../../../store/activeLiveNotifications.slice";
import { activeErrorActions } from "../../../store/activeError.slice";
import { Notification } from "../../../store/types";
import { NotificationsTypography } from "../../CustomStyles";
import { useNavigate } from "react-router-dom";
import { Pages } from "../../constants";
import { activeLeadsActions } from "../../../store/activeLeads.slice";

const DEFAULT_ROWS_PER_PAGINATION = 10;

const Notifications = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const activeUser = useSelector(selectActiveUser);
  const activeNotifications = useSelector(selectActiveLiveNotifications);
  const activeNotificationsCount = useSelector(
    selectActiveLiveNotificationsCount
  );
  const activeNotSeenNotifications = useSelector(
    selectActiveLiveNotSeenNotificationsCount
  );
  const activeTotalNotificationsCount = useSelector(
    selectActiveLiveToalNotificationsCount
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);

    useEffect(() => {
      // Function to close the Popper when clicking outside
      const handleClosePopper = (event: MouseEvent) => {
        if (
          anchorRef.current &&
          anchorRef.current.contains(event.target as Node)
        ) {
          return;
        }
        setOpen(false);
      };

      // Adding event listener for clicks outside of the component
      document.addEventListener("mousedown", handleClosePopper);

      // Cleanup: Remove the event listener when the component unmounts
      return () => {
        document.removeEventListener("mousedown", handleClosePopper);
      };
    }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (activeUser && offset >= 0)
        try {
          const notifications = unwrapResult(
            await dispatch(
              getNotifications({
                userId: activeUser.id,
                limit: DEFAULT_ROWS_PER_PAGINATION,
                offset: offset,
              })
            )
          );

          if (notifications.notificationsCount === 0) setOffset(0);
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
      fetchNotifications();
    }
  }, [DEFAULT_ROWS_PER_PAGINATION, offset]);

  const handleChangeOffset = (option: "previous" | "next") => {
    if (option === "next") setOffset(offset + DEFAULT_ROWS_PER_PAGINATION);
    if (option === "previous" && offset - DEFAULT_ROWS_PER_PAGINATION >= 0)
      setOffset(offset - DEFAULT_ROWS_PER_PAGINATION);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const getPaginationDetails = (offset: number, total: number): string => {
    if (total > 0) {
      if (offset + DEFAULT_ROWS_PER_PAGINATION < total)
        return `${offset + 1} - ${
          offset + DEFAULT_ROWS_PER_PAGINATION
        } / ${total}`;
      return `${offset + 1} -  ${total} / ${total}`;
    }
    return `0 -  0 / 0`;
  };

  const handleSeeNotifications = async (notifications: Notification[]) => {
    if (activeUser)
      try {
        const notificationsIds = notifications.map((notif) => notif.id);
        const activeNotifications = unwrapResult(
          await dispatch(
            seeNotifications({
              notificationsIds: notificationsIds,
              userId: activeUser.id,
            })
          )
        );
      } catch (error: any) {
        dispatch(
          activeErrorActions.setActiveError({
            message: error.message,
            code: error.statusCode,
          })
        );
      }
  };

  const handleMenuItem = async (notification: Notification) => {
    handleSeeNotifications([notification]);
    // it will redirect to leads Pages.LEADS: applied filter= fullName: leadNotificationFullName(from message)
    if (notification.message.includes("lead")) {
      const parts = notification.message.split(":");
      const leadNotificationFullName = parts[1].trim();

      dispatch(
        activeLeadsActions.setFilters({
          fullName: leadNotificationFullName,
          email: null,
          status: null,
        })
      );
      return navigate(Pages.LEADS, { replace: true });
    }
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Badge badgeContent={activeNotSeenNotifications} color="info">
            <Mail style={{ color: "white" }} />
          </Badge>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          style={{ zIndex: "3", width: "30%" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <Grid
                  container
                  alignSelf="center"
                  alignItems="center"
                  justifyContent="space-between" // Add it here :)
                >
                  <Grid item>
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => handleChangeOffset("previous")}
                    >
                      <ChevronLeftOutlined />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {getPaginationDetails(
                        offset,
                        activeTotalNotificationsCount
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => handleChangeOffset("next")}
                    >
                      <ChevronRightOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
                {activeNotifications && (
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {activeNotifications.map((notification) => {
                      return (
                        <MenuItem
                          style={{
                            zIndex: "3",
                            whiteSpace: "normal",
                          }}
                          onClick={() => handleMenuItem(notification)}
                        >
                          {!notification.seen && (
                            <CircleRounded
                              onClick={() =>
                                handleSeeNotifications([notification])
                              }
                              color="info"
                              style={{ marginRight: "8px" }}
                            />
                          )}
                          <NotificationsTypography
                            seen={notification.seen}
                            label={notification.message}
                          />
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                )}
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
};

export default Notifications;
