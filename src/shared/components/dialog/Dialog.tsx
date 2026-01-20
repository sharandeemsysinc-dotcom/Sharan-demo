import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Button from "../button/Button";
import dialog from "./Dialog.module.scss";

type ButtonDef = {
  variant?: any;
  label: string;
  onClick?: () => void;
  color?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
};

type Props = {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  buttons?: ButtonDef[];
  component?: React.ReactNode;
  onClose?: () => void;
  buttonPostion?: "center" | "right";
};

const Dialog: React.FC<Props> = ({
  open,
  title,
  content,
  buttons = [],
  component,
  onClose,
  buttonPostion = "right",
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      transitionDuration={400}
      classes={{ paper: dialog.dialogPaper }}
    >
      {/* Header */}
      {(title || onClose) && (
        <DialogTitle className={dialog.header}>
          <span className={dialog.titleText}>{title}</span>
          {onClose && (
            <IconButton className={dialog.closeBtn} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content */}
      <DialogContent className={dialog.content}>
        {content && <Typography className={dialog.message}>{content}</Typography>}
        {component && <div className={dialog.customComponent}>{component}</div>}
      </DialogContent>

      {/* Buttons */}
      <DialogActions className={buttonPostion==='center'?dialog.actions:dialog.actionsRight}>
        {buttons.map((b, i) => (
          <Button
            key={i}
            variant={b.variant}
            label={b.label}
            onClick={b.onClick}
            color={b.color}
          />
        ))}
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
