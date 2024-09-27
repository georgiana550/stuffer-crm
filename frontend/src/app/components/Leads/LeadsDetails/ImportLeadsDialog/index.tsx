import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ChangeEvent, ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeErrorActions } from "../../../../store/activeError.slice";
import { activeNotificationActions } from "../../../../store/activeNotification.slice";
import { selectActiveUser } from "../../../../store/activeUser.slice";
import { AppDispatch } from "../../../../store/store";
import { importLeads } from "../../../../store/thunks";
import {
  AvailbaleImportLeadsFilesTypes,
  getTypeName,
} from "../../../../store/types";
import { ThemeColors } from "../../../CustomStyles";
import { Info } from "@mui/icons-material";
import BasicTable from "../ExampleTable";

type Props = {
  onClose: () => void;
};

const ImportLeadsDialog = ({ onClose }: Props): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [viewExample, setViewExample] = useState(false);
  const availbaleImportLeadsFilesTypes = AvailbaleImportLeadsFilesTypes.flat();
  const activeUser = useSelector(selectActiveUser);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const { name, type } = file;
      setFile(file);
      setFileName(name);
      setFileType(type);
    }
  };

  const handleSubmit = async () => {
    if (
      file &&
      availbaleImportLeadsFilesTypes.includes(getTypeName(fileType) || "") &&
      activeUser
    ) {
      try {
        unwrapResult(
          await dispatch(importLeads({ file: file, userId: activeUser.id }))
        );
        dispatch(
          activeNotificationActions.setActiveNotification({
            level: "info",
            message: "Successfull!",
          })
        );
        onClose();
      } catch (error: any) {
        dispatch(
          activeErrorActions.setActiveError({
            message: error.message,
            code: error.statusCode,
          })
        );
      }
    }
  };

  const handleViewExample = () => {
    setViewExample(true);
  };

  return (
    <Dialog maxWidth={viewExample ? "xl" : "md"} onClose={onClose} open>
      <DialogTitle>
        {!viewExample ? "Import leads" : "XLSX file example"}
      </DialogTitle>

      {!viewExample && (
        <DialogContent style={{ margin: "1px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Info style={{ color: ThemeColors.info }} />
            <Typography
              align="center"
              style={{ marginLeft: "12px", color: ThemeColors.info }}
            >
              For the moment the possible way to import leads is by XLSX file as
              follows:
            </Typography>
          </div>
          <Typography>
            If the XLSX columns are in the following list, will be created a
            specific lead entity that can be filtered by, if not, the additional
            columns will be stored, but can't be filtered:
            <li>
              <b style={{ color: ThemeColors.secondary }}>source:</b> may be the
              facebook campaign identifer
            </li>
            <li>
              <b style={{ color: ThemeColors.secondary }}>submittedDate</b>
            </li>
            <li>
              <b style={{ color: ThemeColors.secondary }}>fullName:</b> lead's
              full name
            </li>
            <li>
              <b style={{ color: ThemeColors.secondary }}>email:</b> lead's
              email
            </li>
            <li>
              <b style={{ color: ThemeColors.secondary }}>phone:</b> lead's
              phone
            </li>
            <li>
              <b style={{ color: ThemeColors.secondary }}>course:</b> this
              course name must be created before
            </li>
            Click 'View example' to see how a XLSX file should look
          </Typography>
          <br />
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Typography>
                <b>Accepted format:</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography style={{ color: ThemeColors.info }}>
                {availbaleImportLeadsFilesTypes.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Filename:</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{fileName || "Not found"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Filetype:</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                color={
                  availbaleImportLeadsFilesTypes.includes(
                    getTypeName(fileType) || ""
                  )
                    ? ThemeColors.success
                    : ThemeColors.danger
                }
              >
                {getTypeName(fileType) ? getTypeName(fileType) : "Not detected"}
              </Typography>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              style={{
                marginTop: "12px",
                backgroundColor: ThemeColors.buttonsecondary,
              }}
              variant="contained"
              component="label"
              onClick={handleViewExample}
            >
              View example
            </Button>
            <Button
              style={{ marginTop: "12px" }}
              variant="contained"
              component="label"
            >
              Upload File
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
            <Button
              style={{
                marginTop: "12px",
                backgroundColor: availbaleImportLeadsFilesTypes.includes(
                  getTypeName(fileType) || ""
                )
                  ? ThemeColors.buttonprimary
                  : "inherit",
              }}
              variant="contained"
              component="label"
              onClick={handleSubmit}
              disabled={
                !availbaleImportLeadsFilesTypes.includes(
                  getTypeName(fileType) || ""
                )
              }
            >
              Import
            </Button>
          </DialogActions>
        </DialogContent>
      )}
      {viewExample && (
        <DialogContent style={{ overflow: "visible" }}>
          <BasicTable />
          <DialogActions>
            <Button
              style={{ marginTop: "12px" }}
              variant="contained"
              component="label"
              onClick={() => setViewExample(false)}
            >
              I understand
            </Button>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
};


export default ImportLeadsDialog;
