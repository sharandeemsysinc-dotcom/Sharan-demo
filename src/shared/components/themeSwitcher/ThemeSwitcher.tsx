import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// import themeSwitcher from "./ThemeSwitcher.module.scss";

type Props = {
  isDarkMode: boolean;
  onToggle: () => void;
};

const ThemeSwitcher: React.FC<Props> = ({ isDarkMode, onToggle }) => {
  return (
    <FormControlLabel
      control={<Switch checked={isDarkMode} onChange={onToggle} />}
      label={isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
    />
  );
};

export default ThemeSwitcher;
