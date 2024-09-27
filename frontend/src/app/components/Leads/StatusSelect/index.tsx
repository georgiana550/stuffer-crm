import { InputLabel, MenuItem, Select } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { ReactElement } from "react";
import {
  LeadStatusCodes,
  LeadStatusNames,
  PostLead,
} from "../../../store/types";

const StatusSelect = (): ReactElement => {
  const {
    values: { status },
    setFieldValue,
    touched,
    errors,
  } = useFormikContext<PostLead>();

  const statusName = Object.keys(LeadStatusCodes).find(
    (key) => LeadStatusCodes[key as keyof typeof LeadStatusCodes] === status
  );

  return (
    <>
      <InputLabel>Status</InputLabel>
      <Field
        fullWidth
        placeholder="Select status"
        id="status"
        value={LeadStatusCodes[statusName as keyof typeof LeadStatusNames]}
        onChange={(e: any) => {
          setFieldValue("status", e.target.value);
        }}
        component={Select}
        error={touched.coursesIds && Boolean(errors.coursesIds)}
        helperText={touched.coursesIds && errors.coursesIds}
      >
        {(
          Object.keys(LeadStatusNames) as Array<keyof typeof LeadStatusNames>
        ).map((statusKey) => {
          return (
            <MenuItem
              key={LeadStatusCodes[statusKey]}
              value={LeadStatusCodes[statusKey]}
            >
              {LeadStatusNames[statusKey]}
            </MenuItem>
          );
        })}
      </Field>
    </>
  );
};

export default StatusSelect;
