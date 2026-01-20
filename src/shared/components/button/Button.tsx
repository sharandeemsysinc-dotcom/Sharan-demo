// Import Packages
import React from "react";
import { Button as Buttons } from "@mui/material";
import type { ButtonProps as MUIButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

// Import Files
import buttonCss from "./Button.module.scss";

type ButtonVariant = "contained" | "outlined" | "text";
type ButtonSize = "small" | "medium" | "large";
type ColorOption = string;

interface ButtonProps extends Omit<MUIButtonProps, "color" | "variant" | "size"> {
  type?: 'submit' | 'button' | 'reset';
  label?: string;
  color?: ColorOption;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button", label, className, color = "primary", variant = "contained", size = "medium", children,
  startIcon, endIcon, ...rest }) => {
  const theme = useTheme();
  const isCustomColor = !(color in theme.palette);
  const sizeClass =
    size === "small" ? buttonCss.buttonSmall : size === "large" ? buttonCss.buttonLarge : buttonCss.buttonMedium;

  // Dynamic Styling
  const dynamicStyles = isCustomColor
    ? {
      backgroundColor: variant === "contained" ? color : "transparent",
      color: variant === "contained" ? "white" : color,
      border: variant === "outlined" ? `1px solid ${color}` : "1px solid transparent",
      "&:hover": { backgroundColor: variant === "contained" ? (color === "white") ? `var(--primary-main)` : `${color}DD` : `${color}1A` },
    }
    : {};

  return (
    <Buttons
      type={type}
      variant={variant}
      className={`${sizeClass} ${buttonCss.common} ${className || ""}`}
      disableElevation
      color={isCustomColor ? undefined : (color as any)}
      sx={dynamicStyles}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      {...rest}
    >
      {children ?? label}
    </Buttons>
  );
};

export default Button;
