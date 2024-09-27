import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Moment from "moment";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeLeadActions,
  selectActiveLead,
  selectIsViewing,
} from "../../../store/activeLead.slice";
import { AppDispatch } from "../../../store/store";
import { PageModes } from "../../../store/types";
import { ThemeColors } from "../../CustomStyles";
import { getBackgroundColor, getStatusName } from "../LeadsDetails";

type Props = {
  onClose: () => void;
};

const ViewLead = ({ onClose }: Props): ReactElement => {
  const activeLead = useSelector(selectActiveLead);
  const isViewing = useSelector(selectIsViewing);
  const dispatch = useDispatch<AppDispatch>();
  const additionalColumns =
    activeLead && activeLead.additionalColumns
      ? Object.entries(activeLead.additionalColumns)
      : [];

  return (
    <>
      {activeLead && (
        <Dialog
          maxWidth={"lg"}
          onClose={() => {
            onClose();
            dispatch(activeLeadActions.setPageMode(PageModes.INITIAL));
          }}
          open={isViewing}
        >
          <DialogTitle
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            Lead information
            <Chip
              variant="outlined"
              style={{
                backgroundColor: getBackgroundColor(activeLead.status),
                color: ThemeColors.dark,
                textOverflow: "initial",
                textAlign: "center",
                whiteSpace: "initial",
                width: "50%",
              }}
              label={getStatusName(activeLead.status)}
            />
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow key={activeLead.fullName}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Full name:
                    </TableCell>
                    <TableCell align="right">{activeLead.fullName}</TableCell>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Asignee email:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.asigneeEmail || "Not assigned"}
                    </TableCell>
                  </TableRow>
                  <TableRow key={activeLead.asigneeEmail}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Citizenship:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.citizenship
                        ? activeLead.citizenship
                        : "Not provided"}
                    </TableCell>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Courses:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.courses && activeLead.courses.length > 0 ? (
                        activeLead.courses.map((course) => (
                          <Tooltip title={course.description}>
                            <Chip
                              style={{ marginRight: "4px" }}
                              label={course.name}
                            />
                          </Tooltip>
                        ))
                      ) : (
                        <Chip label="Not registered" />
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow key={activeLead.createdBy}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Created by:
                    </TableCell>
                    <TableCell align="right">{activeLead.createdBy}</TableCell>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Date of birth:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.dateOfBirth
                        ? Moment(activeLead.dateOfBirth).format("DD/MM/yyyy")
                        : "Not provided"}
                    </TableCell>
                  </TableRow>

                  <TableRow key={activeLead.fullName}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Email:
                    </TableCell>
                    <TableCell align="right">{activeLead.email}</TableCell>{" "}
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Language:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.language || "Not provided"}
                    </TableCell>
                  </TableRow>
                  <TableRow key={activeLead.fullName}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Phone:
                    </TableCell>
                    <TableCell align="right">{activeLead.phone}</TableCell>{" "}
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Referee name:
                    </TableCell>
                    <TableCell align="right">
                      {activeLead.refereeName || "Not provided"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Typography style={{ fontWeight: "bold", padding: "8px" }}>
              Additional information from import:
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {additionalColumns.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell
                        style={{
                          color: ThemeColors.secondary,
                          fontWeight: "bold",
                        }}
                        component="th"
                        scope="row"
                      >
                        {`${key.charAt(0).toUpperCase() + key.slice(1)}:`}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          style={{
                            textTransform: "capitalize",
                            color: "gray",
                            fontSize: "0.875rem",
                          }}
                        >
                          {value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewLead;
