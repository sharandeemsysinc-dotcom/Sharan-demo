// Import Packages
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, FormLabel, TextField } from "@mui/material";

// Import Files 
import colorPickerCss from './FormFields.module.scss'

interface Props {
  name: string;
  label: string;
  variant?: "outlined" | "filled" | "standard" | "labeled";
  size?: "small" | "normal";
  control: any;
  errors?: any;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: any) => void;
}

export default function ColorPickerInput({ name, label, variant = 'outlined', size = "small", control, errors, required = false, disabled = false, onChange }: Props) {
  const isLabeled = variant === "labeled";
      // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size

  return (
    <FormControl fullWidth error={!!errors?.[name]}>
      {isLabeled && (
        <FormLabel className="formLabel">{
          required ? (
            <span>
              <span className={colorPickerCss.required}>*</span> {label}
            </span>
          ) : (label)
        }
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              type="color"
              disabled={disabled}
              id={name}
              label={
                isLabeled ? undefined :
                  required ? (
                    <span>
                      <span className={colorPickerCss.required}>*</span> {label}
                    </span>
                  ) : (label)
              }
              variant={!isLabeled ? variant : 'outlined'}
              fullWidth
              className={`${colorPickerCss.error} `}
              size={muiSize}
              onChange={(e) => {
                field.onChange(e);
                onChange && onChange(e);
              }}
            />
            {errors && errors?.[name] && (
              <FormHelperText className={colorPickerCss.error}>{errors?.[name]?.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}
