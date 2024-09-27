import { ReactElement } from "react";
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
  TableRow,
  Typography,
} from "@mui/material";
import { PageModes } from "../../../store/types";
import { useDispatch, useSelector } from "react-redux";
import {
  activeCourseActions,
  selectActiveCourse,
  selectIsViewing,
} from "../../../store/activeCourse.slice";
import { AppDispatch } from "../../../store/store";
import Moment from "moment";
import { StatusColors, ThemeColors } from "../../CustomStyles";

type Props = {
  onClose: () => void;
};

const ViewCourse = ({ onClose }: Props): ReactElement => {
  const activeCourse = useSelector(selectActiveCourse);
  const isViewing = useSelector(selectIsViewing);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {isViewing && activeCourse?.id && (
        <Dialog
          onClose={() => {
            onClose();
            dispatch(activeCourseActions.setPageMode(PageModes.INITIAL));
          }}
          open={isViewing}
          maxWidth={"md"}
        >
          <DialogTitle
            style={{
              fontWeight: "bold",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            Course information
            <Chip
              variant="outlined"
              style={{
                backgroundColor:
                  activeCourse.leads && activeCourse.leads.length > 0
                    ? StatusColors.open
                    : StatusColors.unqualified,
                color: ThemeColors.dark,
                textOverflow: "initial",
                textAlign: "center",
                whiteSpace: "initial",
                width: "50%",
              }}
              label={
                activeCourse.leads && activeCourse.leads.length > 0
                  ? "You have leads assigned to this course"
                  : "You don't have leads assigned to this course"
              }
            />
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow key={activeCourse.name}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Name:
                    </TableCell>
                    <TableCell align="right">{activeCourse.name}</TableCell>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Description:
                    </TableCell>
                    <TableCell align="right">
                      {activeCourse.description || "Not provided"}
                    </TableCell>
                  </TableRow>
                  <TableRow key={activeCourse.startDate}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Start date:
                    </TableCell>
                    <TableCell align="right">
                      {activeCourse.startDate
                        ? Moment(activeCourse.startDate).format("DD/MM/yyyy")
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
                      End date:
                    </TableCell>
                    <TableCell align="right">
                      {activeCourse.endDate
                        ? Moment(activeCourse.endDate).format("DD/MM/yyyy")
                        : "Not provided"}
                    </TableCell>
                  </TableRow>

                  <TableRow key={activeCourse.location}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Course's location:
                    </TableCell>
                    <TableCell align="right">{activeCourse.location}</TableCell>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Belonging to university:
                    </TableCell>
                    <TableCell align="right">
                      {activeCourse.universityName || "Not provided"}
                    </TableCell>
                  </TableRow>

                  <TableRow key={activeCourse.additionalInformation}>
                    <TableCell
                      style={{
                        color: ThemeColors.secondary,
                        fontWeight: "bold",
                      }}
                      component="th"
                      scope="row"
                    >
                      Additional information:
                    </TableCell>
                    <TableCell align="right">
                      {activeCourse.additionalInformation || "Not provided"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {/* <List
              sx={{ width: "100%", maxWidth: 360, color: ThemeColors.info }}
            >
              <Grid container columns={2}>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Name:"
                      secondary={activeCourse.name}
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Description:"
                      secondary={activeCourse.description}
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Start date:"
                      secondary={
                        activeCourse.startDate
                          ? Moment(activeCourse.startDate).format("DD/MM/yyyy")
                          : "Not provided"
                      }
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="End date:"
                      secondary={
                        activeCourse.endDate
                          ? Moment(activeCourse.endDate).format("DD/MM/yyyy")
                          : "Not provided"
                      }
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Course's location:"
                      secondary={
                        <Typography
                          style={{
                            textTransform: "capitalize",
                            color: "gray",
                            fontSize: "0.875rem",
                          }}
                        >
                          {activeCourse.location}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Belonging to the university:"
                      secondary={activeCourse.universityName || "Not provided"}
                    />
                  </ListItem>
                </Grid>
                <Grid style={{ width: "50%" }} item>
                  <ListItem>
                    <ListItemText
                      primary="Additional information:"
                      secondary={
                        activeCourse.additionalInformation || "Not provided"
                      }
                    />
                  </ListItem>
                </Grid>
              </Grid>
            </List> */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewCourse;
