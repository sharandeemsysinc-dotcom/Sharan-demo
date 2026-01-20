// Import Packages
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, FormLabel, MenuItem, Select, TextField } from "@mui/material";

// Import Files
import selectCss from './FormFields.module.scss'
import { useState } from "react";

interface Props {
    name: string;
    label: string;
    placeholder: string;
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal";
    defaultValue?: any;
    control?: any;
    options: { value: any; label: string }[];
    errors?: any;
    value?: any;
    multiple?: boolean;
    required?: boolean;
    disabled?: boolean;
    showOtherField?: boolean;
    onChange?: (value: any) => void;
}

export default function InputSelect({
    name,
    label,
    placeholder,
    variant = "outlined",
    size = "small",
    control,
    options,
    errors,
    value,
    disabled = false,
    showOtherField = false,
    multiple = false,
    required = false,
    onChange,
}: Props) {
    const isLabeled = variant === "labeled";
    const muiSize = size === "small" ? "small" : undefined;

    // Local state only used when no form control exists
    const [defaultValue, setDefaultValue] = useState("");

    // Helper function to get nested error messages
    const getNestedError = (errors: any, path: string) => {
        const keys = path.split('.');
        let current = errors;
        for (const key of keys) {
            if (current?.[key] === undefined) return undefined;
            current = current[key];
        }
        return current;
    };

    const fieldError = getNestedError(errors, name);

    if (control) {
        return (
            <FormControl fullWidth error={!!fieldError}>
                {isLabeled && (
                    <FormLabel className="formLabel" htmlFor={name}>
                        {required ? (
                            <span>
                                <span className={selectCss.required}>*</span> {label}
                            </span>
                        ) : (
                            label
                        )}
                    </FormLabel>
                )}

                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => {
                        const handleChange = (e: any) => {
                            field.onChange(e);
                            onChange && onChange(e);
                        };

                        return (
                            <>
                                <Select {...field} disabled={disabled} multiple={multiple} displayEmpty
                                    value={field.value !== undefined ? field.value : multiple ? [] : ""}
                                    variant={!isLabeled ? variant : "outlined"}
                                    size={muiSize}
                                    className={selectCss.error}
                                    renderValue={(selected) => {
                                        // FIX: Correct handling of number 0
                                        const isEmpty = selected === "" || selected === null || selected === undefined || (Array.isArray(selected) && selected.length === 0);

                                        if (isEmpty) {
                                            return (
                                                <span className={selectCss.placeholder}>
                                                    {placeholder}
                                                </span>
                                            );
                                        }

                                        // MULTIPLE SELECT
                                        if (multiple) { return selected.join(", "); }

                                        return options.find((option) => option.value === selected)?.label || selected;
                                    }}
                                    onChange={handleChange}
                                >
                                    {/* Placeholder */}
                                    {!multiple && (
                                        <MenuItem value="">
                                            <em>{placeholder}</em>
                                        </MenuItem>
                                    )}

                                    {options.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}

                                    {showOtherField && (
                                        <MenuItem value="other">Others</MenuItem>
                                    )}
                                </Select>

                                {fieldError && <FormHelperText className={selectCss.error}>{fieldError?.message}</FormHelperText>}

                                {showOtherField && field.value === "other" && (
                                    <Controller name={`${name}_other`} control={control} render={({ field: otherField }) => <TextField label={`${label} (Specify)`} className="mt-2" {...otherField} />} />
                                )}
                            </>
                        );
                    }}
                />
            </FormControl>
        )
    }

    return (
        <FormControl fullWidth>
            {isLabeled && (
                <FormLabel className="formLabel" htmlFor={name}>
                    {required ? (
                        <>
                            <span className={selectCss.required}>*</span> {label}
                        </>
                    ) : label}
                </FormLabel>
            )}

            <Select
                onChange={(e) => {
                    setDefaultValue(e.target.value);
                    onChange?.(e.target.value);
                }}
                disabled={disabled}
                displayEmpty
                size={muiSize}
                variant={!isLabeled ? variant : "outlined"}
                value={value ?? defaultValue}
            >
                <MenuItem value="">
                    <em>{placeholder}</em>
                </MenuItem>

                {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}

                {showOtherField && <MenuItem value="other">Others</MenuItem>}
            </Select>

            {showOtherField && value === "other" && (
                <TextField label={`${label} (Specify)`} className="mt-2" />
            )}
        </FormControl>
    );
}