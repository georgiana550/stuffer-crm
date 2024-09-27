import {
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import { ReactElement, useState } from "react";
import { ThemeColors } from "../../../CustomStyles";
import {
  FiltersLeads,
  LeadStatusCodes,
  LeadStatusNames,
} from "../../../../store/types";
import { useDispatch, useSelector } from "react-redux";
import {
  activeLeadsActions,
  selectFilters,
} from "../../../../store/activeLeads.slice";
import { AppDispatch } from "../../../../store/store";

type Props = {
  onApply: (filters: FiltersLeads) => void;
  onClear: (filters: FiltersLeads) => void;
};

const FiltersBox = ({ onApply, onClear }: Props): ReactElement => {

  const activeFilters = useSelector(selectFilters);
  const dispatch = useDispatch<AppDispatch>();

  const handleFullname = async (event: any) => {
    const oldFilters: FiltersLeads | undefined = activeFilters;

    dispatch(
      activeLeadsActions.setFilters({
        ...oldFilters,
        fullName: event.target.value || null,
      })
    );
  };

  const handleEmail = async (event: any) => {
    const oldFilters: FiltersLeads | undefined = activeFilters;

    dispatch(
      activeLeadsActions.setFilters({
        ...oldFilters,
        email: event.target.value || null,
      })
    );
  };

  const handleStatus = async (event: any) => {
    const oldFilters: FiltersLeads | undefined = activeFilters;

    dispatch(
      activeLeadsActions.setFilters({
        ...oldFilters,
        status: event.target.value || null,
      })
    );
  };

  const handleClear = async () => {
    dispatch(
      activeLeadsActions.setFilters({
        fullName: null,
        email: null,
        status: null,
      })
    );
    onClear({ fullName: null, email: null, status: null });
  };

  const statusName = Object.keys(LeadStatusCodes).find(
    (key) =>
      LeadStatusCodes[key as keyof typeof LeadStatusCodes] ===
      activeFilters.status
  );

  return (
    <>
      <Box
        style={{
          paddingTop: "8px",
          paddingBottom: "4px",
          display: "flex",
          flexDirection: "row",
          backgroundColor: ThemeColors.filters,
          borderRadius: "8px", // Rounded corners
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Add a shadow
          border: "1px solid rgba(0, 0, 0, 0.1)", // Add a border
        }}
      >
        <Typography style={{ padding: "8px", color: ThemeColors.primary }}>
          Filters:
        </Typography>
        <Grid item style={{ padding: "8px" }}>
          <TextField
            style={{
              paddingRight: "4px",
              paddingLeft: "8px",
              minWidth: "200px",
              border: "red",
            }}
            InputLabelProps={{
              sx: {
                color: ThemeColors.white,
                "&.Mui-focused": { color: ThemeColors.white },
              },
            }}
            InputProps={{ sx: { color: "white" } }}
            label="Full name"
            size="small"
            onKeyDown={() =>
              onApply({
                fullName: activeFilters.fullName,
                email: activeFilters.email,
                status: activeFilters.status,
              })
            }
            onChange={handleFullname}
            value={activeFilters.fullName}
            placeholder="Search by full name"
          />
        </Grid>
        <Grid item style={{ padding: "8px" }}>
          <TextField
            style={{ paddingRight: "4px", minWidth: "200px" }}
            InputLabelProps={{
              sx: {
                color: ThemeColors.white,
                "&.Mui-focused": { color: ThemeColors.white },
              },
            }}
            InputProps={{ sx: { color: "white" } }}
            size="small"
            label="Email"
            value={activeFilters.email}
            onKeyDown={() =>
              onApply({
                fullName: activeFilters.fullName,
                email: activeFilters.email,
                status: activeFilters.status,
              })
            }
            onChange={handleEmail}
            placeholder="Search by email"
          />
        </Grid>
        <Grid item style={{ padding: "8px" }}>
          <FormControl
            size="small"
            style={{ paddingRight: "4px", minWidth: "200px" }}
          >
            <InputLabel style={{ color: "white" }}>Status</InputLabel>
            <Select
              SelectDisplayProps={{ style: { color: "white" } }}
              value={
                LeadStatusCodes[statusName as keyof typeof LeadStatusNames] ||
                ""
              }
              label="Status"
              onChange={handleStatus}
            >
              {(
                Object.keys(LeadStatusNames) as Array<
                  keyof typeof LeadStatusNames
                >
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
            </Select>
          </FormControl>
        </Grid>
      </Box>
      <Box
        style={{
          paddingTop: "4px",
          paddingBottom: "4px",
          marginBottom: "4px",
        }}
      >
        <Button
          style={{
            backgroundColor: ThemeColors.highlight,
            color: ThemeColors.white,
            marginRight: "4px",
          }}
          variant="contained"
          size="small"
          onClick={() =>
            onApply({
              fullName: activeFilters.fullName,
              email: activeFilters.email,
              status: activeFilters.status,
            })
          }
        >
          Apply filters
        </Button>
        <Button
          style={{
            backgroundColor: ThemeColors.highlight,
            color: ThemeColors.white,
          }}
          variant="contained"
          size="small"
          onClick={() => handleClear()}
        >
          Clear filters
        </Button>
      </Box>
    </>
  );
};

export default FiltersBox;
