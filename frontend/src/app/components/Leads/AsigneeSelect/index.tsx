import { InputLabel, MenuItem, Select, Skeleton } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { Field, useFormikContext } from "formik";
import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeErrorActions } from "../../../store/activeError.slice";
import { selectActiveUser } from "../../../store/activeUser.slice";
import {
  activeUsersActions,
  selectActiveUsers,
} from "../../../store/activeUsers.slice";
import { AppDispatch } from "../../../store/store";
import { getAllUsers } from "../../../store/thunks";
import { PostLead, UsersDetails } from "../../../store/types";

const AsigneeSelect = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const activeUser = useSelector(selectActiveUser);
  const activeUsers = useSelector(selectActiveUsers);

  const {
    values: { asigneeId },
    setFieldValue,
    touched,
    errors,
  } = useFormikContext<PostLead>();

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeUser)
        try {
          const users: UsersDetails = unwrapResult(
            await dispatch(getAllUsers({ userId: activeUser.id }))
          );
          dispatch(activeUsersActions.setUsersList(users));
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
      fetchUsers();
    }
  }, []);

  return (
    <>
      {activeUsers && (
        <>
          <InputLabel>Assignee</InputLabel>
          <Field
            fullWidth
            placeholder="Select"
            id="asigneeId"
            value={asigneeId || 0}
            onChange={(e: any) => {
              setFieldValue("asigneeId", e.target.value);
            }}
            component={Select}
            error={touched.asigneeId && Boolean(errors.asigneeId)}
            helperText={touched.asigneeId && errors.asigneeId}
          >
            <MenuItem value={0}>Unasign</MenuItem>

            {activeUsers &&
              activeUsers.users.map((user) => {
                return <MenuItem value={user.id}>{user.email}</MenuItem>;
              })}
          </Field>
        </>
      )}
      {!activeUsers && <Skeleton />}
    </>
  );
};

export default AsigneeSelect;
