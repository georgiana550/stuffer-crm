import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ReactElement } from "react";

type Props = {
  message: string;
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string | boolean) => void;
};

const CustomDialog = ({
  message,
  title,
  open,
  onClose,
  onSubmit,
}: Props): ReactElement => {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(true)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomDialog;
