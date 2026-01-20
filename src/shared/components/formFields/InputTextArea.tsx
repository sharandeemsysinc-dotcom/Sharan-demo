// Import Packages
import { FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

// Import Files
import textAreaCss from './FormFields.module.scss'

interface Props {
  name: string;
  label: string;
  placeholder: string
  variant?: "outlined" | "filled" | "standard" | "labeled";
  size?: "small" | "normal";
  required?: boolean
  disabled?: boolean
  control?: any;
  errors?: any;
  errorMessage?: any;
  onChange?: (value: any) => void;
  value?: string
}

export default function InputTextArea({ name, label, placeholder, variant = 'outlined', size = "small", control, errors, errorMessage,
  required = false, disabled = false, onChange, value }: Props) {
  const isLabeled = variant === "labeled";
  // Map size prop to MUI size
  const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size
  const finalError = errors?.[name]?.message || errorMessage || "";

  return (
    <FormControl fullWidth error={!!finalError}>
      {isLabeled && (
        <FormLabel htmlFor={name} className="formLabel">
          {required ? <span><span className={textAreaCss.required}>*</span> {label}</span> : label}
        </FormLabel>
      )}

      {control ? (
        <Controller name={name} control={control} render={({ field }) => (
          <TextField {...field} fullWidth id={name} rows={4} placeholder={placeholder} size={muiSize} className={textAreaCss.error}
            label={isLabeled ? undefined : (required ? <span><span className={textAreaCss.required}>*</span> {label}</span> : label)}
            variant={!isLabeled ? variant : 'outlined'} multiline disabled={disabled} error={!!finalError} helperText={finalError}
            onChange={(e) => { field.onChange(e); onChange && onChange(e); }}
          />
        )}
        />
      ) : (
        <TextField fullWidth id={name} rows={4} placeholder={placeholder} size={muiSize} value={value} className={textAreaCss.error}
          label={isLabeled ? undefined : (required ? <span><span className={textAreaCss.required}>*</span> {label}</span> : label)}
          variant={!isLabeled ? variant : 'outlined'} error={!!finalError} helperText={finalError} multiline disabled={disabled}
          onChange={onChange}
        />
      )}
    </FormControl>
  );
}
