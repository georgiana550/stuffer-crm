import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { Course } from "../../../../store/types";
import { ThemeColors } from "../../../CustomStyles";
import notFound from "../../../CustomStyles/asserts/not-found.png";

type Props = {
  course: Course;
  onClose: () => void;
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Adjust as needed based on your layout
};

const contentStyle = {
  textAlign: "center",
};

const imageStyle = {
  width: "150px", // Adjust the size of the image as desired
};

const textStyle = {
  fontSize: "18px", // Adjust the font size as desired
  marginTop: "16px", // Add some spacing between the image and text
};

const LeadsDialog = ({ onClose, course }: Props): ReactElement => {
  return (
    <>
      <Dialog onClose={onClose} open={true}>
        <DialogTitle>Leads following this course</DialogTitle>
        <DialogContent>
          <List
            sx={{
              width: "100%",
              maxWidth: "fit-content",
              bgcolor: "background.paper",
            }}
          >
            {course.leads.length === 0 && (
              <div style={{ textAlign: "center" }}>
                <img src={notFound} alt="Not found" style={imageStyle} />
                <p style={textStyle}>
                  None of your leads are registered to this course.
                </p>
              </div>
            )}
            {course.leads.length > 0 &&
              course.leads.map((lead, index) => {
                const leadName = lead.fullName.split(" ");
                return (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: ThemeColors.info,
                          }}
                        >
                          {leadName[0]?.charAt(0)}
                          {leadName[1]?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        style={{ paddingLeft: "4px" }}
                        primary={lead.email}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              Full name: {lead.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              Created by: {lead.createdBy}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index !== course.leads.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </>
                );
              })}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsDialog;
