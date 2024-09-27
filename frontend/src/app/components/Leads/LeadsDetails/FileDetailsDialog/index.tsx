import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { selectActiveImport } from "../../../../store/activeLeads.slice";
import { ThemeColors } from "../../../CustomStyles";
import { Info } from "@mui/icons-material";

type Props = {
  onClose: () => void;
};

const FileDetailsDialog = ({ onClose }: Props): ReactElement => {
  const activeImport = useSelector(selectActiveImport);

  return (
    <Dialog fullWidth onClose={onClose} open>
      <DialogTitle>File details</DialogTitle>
      <DialogContent style={{ margin: "1px" }}>
        <Grid item xs={6} style={{ marginBottom: "4px" }}>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              color: ThemeColors.warning,
              textAlign: "center",
            }}
          >
            {<Info />} Important: these information will disappear when you
            close the browser. Please take necessary actions.
          </Typography>
        </Grid>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography>
              <b>Filename:</b>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{activeImport.filename}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Lines containing duplicate lines:</b>
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              color={
                activeImport.duplicateLines.length > 0
                  ? ThemeColors.danger
                  : ThemeColors.dark
              }
            >
              {activeImport.duplicateLines.length > 0
                ? activeImport.duplicateLines.join(", ")
                : "None"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Lines containing leads that could not be imported:</b>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              color={
                activeImport.errorLines.length > 0
                  ? ThemeColors.danger
                  : ThemeColors.dark
              }
            >
              {activeImport.errorLines.length > 0
                ? activeImport.errorLines.join(", ")
                : "None"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default FileDetailsDialog;
