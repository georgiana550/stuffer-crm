import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { ReactElement, useState } from "react";
import { ThemeColors } from "../../../CustomStyles";
import { FiltersCourses } from "../../../../store/types";

type Props = {
  onApply: (filters: FiltersCourses) => void;
  onClear: (filters: FiltersCourses) => void;
};

const FiltersBox = ({ onApply, onClear }: Props): ReactElement => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [universityName, setUniversityName] = useState("");

  const handleName = async (event: any) => {
    setName(event.target.value);
  };

  const handleUniversityName = async (event: any) => {
    setUniversityName(event.target.value);
  };

  const handleLocation = async (event: any) => {
    setLocation(event.target.value);
  };

  const handleClear = async () => {
    setLocation("");
    setName("");
    onClear({ name, location, universityName });
  };

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
            }}
            InputLabelProps={{
              sx: {
                color: ThemeColors.white,
                "&.Mui-focused": { color: ThemeColors.white },
              },
            }}
            size="small"
            InputProps={{ sx: { color: "white" } }}
            label="Name"
            onKeyDown={() => onApply({ name, location, universityName })}
            onChange={handleName}
            value={name}
            placeholder="Search by name"
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
            label="Location"
            size="small"
            value={location}
            onKeyDown={() => onApply({ name, location, universityName })}
            onChange={handleLocation}
            placeholder="Search by location"
          />
        </Grid>
        <Grid item style={{ padding: "8px" }}>
          <TextField
            style={{
              paddingRight: "4px",
              paddingLeft: "8px",
              minWidth: "200px",
            }}
            InputLabelProps={{
              sx: {
                color: ThemeColors.white,
                "&.Mui-focused": { color: ThemeColors.white },
              },
            }}
            size="small"
            InputProps={{ sx: { color: "white" } }}
            label="University"
            onKeyDown={() => onApply({ name, location, universityName })}
            onChange={handleUniversityName}
            value={universityName}
            placeholder="Search by university"
          />
        </Grid>
      </Box>
      <Box
        style={{ paddingTop: "4px", paddingBottom: "4px", marginBottom: "4px" }}
      >
        <Button
          style={{
            backgroundColor: ThemeColors.highlight,
            color: ThemeColors.white,
            marginRight: "4px",
          }}
          variant="contained"
          size="small"
          onClick={() => onApply({ name, location, universityName })}
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
