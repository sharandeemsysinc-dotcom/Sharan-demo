// Import Packages
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, FormLabel, Slider } from "@mui/material";

// Import Files
import rangeCss from './FormFields.module.scss'

interface Props {
  name: string;
  label: string;
  control: any;
  errors?: any;
  required?: boolean
  disabled?: boolean
  onChange?: (value: any) => void;
}

export default function InputRange({ name, label, control, errors, required = false, disabled = false, onChange }: Props) {
  return (
    <FormControl fullWidth error={!!errors?.[name]}>
      <FormLabel className="formLabel">
        {required && label ? (
          <span>
            <span className={rangeCss.required}>*</span> {label}
          </span>
        ) : (label)
        }
      </FormLabel>
      <Controller
        name={name}
        control={control}
        disabled={disabled}
        render={({ field }) => (
          <>
            <Slider {...field} id={name} value={field.value} min={0} max={100} onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
            }} />
            {errors && errors?.[name] && (
              <FormHelperText className={rangeCss.error}>{errors?.[name]?.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}
