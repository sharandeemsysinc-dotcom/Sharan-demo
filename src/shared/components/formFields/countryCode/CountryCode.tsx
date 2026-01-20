import {
  Autocomplete,
  FormControl,
  FormLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Controller } from "react-hook-form";
import autoCompleteCss from "../../formFields/FormFields.module.scss";

interface OptionType {
  value: string; // stored in form (IN)
  label: string; // search text (India)
  code: string;  // +91
  iso: string;   // IN (flag)
}

interface Props {
  name: string;
  label?: string;
  placeholder: string;
  variant?: "outlined" | "filled" | "standard" | "labeled";
  size?: "small" | "normal";
  control: any;
  options: OptionType[];
  errors?: any;
  disabled?: boolean;
  required?: boolean;
}

export default function CountryCode({
  name,
  label,
  placeholder,
  variant = "outlined",
  size = "small",
  control,
  options,
  disabled = false,
  errors,
  required = false,
}: Props) {
  const isLabeled = variant === "labeled";
  const textFieldVariant = isLabeled ? "outlined" : variant;
  const muiSize = size === "small" ? "small" : undefined;

  return (
    <FormControl fullWidth error={!!errors?.[name]}>
      {isLabeled && (
        <FormLabel className="formLabel">
          {required && (
            <span className={autoCompleteCss.required}>*</span>
          )}{" "}
          {label}
        </FormLabel>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label || "This field"} is required` : false,
        }}
        render={({ field }) => {
          const selected =
            options.find((o) => o.value === field.value) || null;

          return (
            <Autocomplete
              options={options}
              value={selected}
              disabled={disabled}
              isOptionEqualToValue={(o, v) => o.value === v.value}

              /* 🔍 SEARCH BY COUNTRY NAME */
              getOptionLabel={(o) => o.label}

              /* ✅ FLAG + CODE IN DROPDOWN */
              renderOption={(props, option) => (
                <li
                  {...props}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <img
                    width="20"
                    loading="lazy"
                    src={`https://flagcdn.com/w20/${option.iso.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.iso.toLowerCase()}.png 2x`}
                  alt={option.label}
                  />
                  <span>{option.code}</span>
                  {/* <span style={{ color: "#666" }}>
                    {option.code}
                  </span> */}
                </li>
              )}

              onChange={(_, val) =>
                field.onChange(val ? val.value : "")
              }

              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  required={required}
                  variant={textFieldVariant}
                  size={muiSize}
                  error={!!errors?.[name]}
                  helperText={errors?.[name]?.message}
                  className={autoCompleteCss.error}

                  /* 🔑 hide typed text but keep search */
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      color: selected ? "transparent" : "inherit", // ✅ placeholder visible
                    },
                  }}

                  /* ✅ FLAG + CODE IN INPUT */
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selected ? (
                      <InputAdornment position="start">
                        <img
                          width="20"
                          src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${selected.iso.toLowerCase()}.png 2x`}
                          alt=""
                          style={{ marginRight: 6 }}
                        />
                        <span>{selected.code}</span>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              )}
            />
          );
        }}
      />
    </FormControl>
  );
}
