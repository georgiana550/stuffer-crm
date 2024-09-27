import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { ReactElement, forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeErrorActions,
  selectActiveError,
} from "../../store/activeError.slice";
import {
  activeNotificationActions,
  selectActiveNotification,
} from "../../store/activeNotification.slice";
import { AppDispatch } from "../../store/store";
import { ThemeColors } from "../CustomStyles";
import _ from "lodash";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notify = (): ReactElement => {
  const [open, setOpen] = useState(true);
  const activeError = useSelector(selectActiveError);
  const activeNotification = useSelector(selectActiveNotification);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    if (activeError.message) dispatch(activeErrorActions.reset());
    if (activeNotification.message) dispatch(activeNotificationActions.reset());

    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, [activeError.message, activeNotification.message]);

  const renderNotification = () => {
    if (activeNotification)
      switch (activeNotification.level) {
        case "success":
          return (
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                sx={{ width: "100%", background: ThemeColors.success }}
              >
                {activeNotification.message || "Success"}
              </Alert>
            </Snackbar>
          );
        case "info":
          return (
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                sx={{ width: "100%", background: ThemeColors.info }}
              >
                {activeNotification.message}
              </Alert>
            </Snackbar>
          );
        case "warning":
          return (
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                sx={{ width: "100%", background: ThemeColors.warning }}
              >
                {activeNotification.message}
              </Alert>
            </Snackbar>
          );
        default:
          return null;
      }
  };

  return (
    <>
      {activeError.message && (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            sx={{ width: "100%", background: ThemeColors.danger }}
          >
            {activeError.message || "Something went wrong"}
          </Alert>
        </Snackbar>
      )}
      {activeNotification.message && renderNotification()}
    </>
  );
};

export default Notify;
