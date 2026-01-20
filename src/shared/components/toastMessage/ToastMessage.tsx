import React from "react";
import { Snackbar, Alert } from "@mui/material";
// import toastMessage from "./ToastMessage.scss";

type Props = {
  message: string;
  severity: any;
  open?: boolean;
  onClose: () => void;
  autoHideMs?: number;
};

const ToastMessage: React.FC<Props> = ({ message, severity, open = false, onClose, autoHideMs = 4000 }) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideMs} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;
