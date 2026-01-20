import React from "react";
import { CircularProgress, Box } from "@mui/material";
// import loader from "./Loader.module.scss";

type Props = {
  size?: number;
  color?: "primary" | "secondary" | "inherit" | "success" | "error" | "info" | "warning";
};

const Loader: React.FC<Props> = ({ size = 48, color = "primary" }) => {
  return (
    <Box className="loader-container d-flex justify-content-center align-items-center ">
      <CircularProgress size={size} color={color as any} />
    </Box>
  );
};

export default Loader;
