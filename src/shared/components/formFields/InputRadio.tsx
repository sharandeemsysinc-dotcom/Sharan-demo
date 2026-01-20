import { Controller } from "react-hook-form";
import {FormControl,FormControlLabel,FormHelperText,FormLabel,Radio,RadioGroup,TextField,} from "@mui/material";
import radioCss from "./FormFields.module.scss";

interface OptionType {
  value: string | number;
  label: string;
}

interface Props {
  name: string;
  label: string;
  size?: "small" | "normal";
  control: any;
  options: (string | OptionType)[];
  errors?: any;
  required?: boolean;
  onChange?: (value: any) => void;
  showOtherField?: boolean;
}

export default function InputRadio({
  name,
  label,
  size = "small",
  control,
  options,
  errors,
  required,
  onChange,
  showOtherField = false,
}: Props) {
  // Normalize options → convert string[] into objects
  const normalizedOptions: OptionType[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  // Add “other” option if required
  const finalOptions = showOtherField
    ? [...normalizedOptions, { value: "other", label: "Others" }]
    : normalizedOptions;

  const muiSize = size === "small" ? "small" : undefined;

  return (
    <FormControl fullWidth error={!!errors?.[name]}>
      <FormLabel className="formLabel">
        {required ? (
          <span>
            <span style={{ color: "red", marginLeft: 4 }}>*</span>
            {label}
          </span>
        ) : (
          label
        )}
      </FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <RadioGroup {...field}>
              {finalOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size={muiSize} />}
                  label={opt.label}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    onChange?.(e.target.value);
                  }}
                />
              ))}
            </RadioGroup>

            {errors?.[name] && (
              <FormHelperText className={radioCss.error}>
                {errors[name]?.message}
              </FormHelperText>
            )}

            {/* Show text field when “other” is selected */}
            {showOtherField && field.value === "other" && (
              <Controller
                name={`${name}_other`}
                control={control}
                render={({ field: otherField }) => (
                  <TextField
                    label={`${label} (Specify)`}
                    className={`${radioCss.error} mt-2`}
                    {...otherField}
                  />
                )}
              />
            )}
          </>
        )}
      />
    </FormControl>
  );
}
