// Import Packages
import { FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

// Import Files
import textCss from './FormFields.module.scss'

interface Props {
    name: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal"; // small | normal
    defaultValue?: any; // optional default value
    control?: any;
    errors?: any;
    errorMessage?: any;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    onChange?: (value: any) => void;
}

export default function InputText({ name, label, placeholder, variant = "outlined", size = "small", defaultValue = "", control,
    errors, errorMessage, value, required = false, disabled = false, className, onChange }: Props) {
    const isLabeled = variant === "labeled";

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

    const validationError = getNestedError(errors, name);
    const finalError = validationError?.message || errorMessage || "";

    // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size

    return (
        <FormControl fullWidth error={!!finalError}>
            {isLabeled && (
                <FormLabel htmlFor={name} className="formLabel">{
                    required ? (
                        <span>
                            <span className={textCss.required}>*</span> {label}
                        </span>
                    ) : (label)}
                </FormLabel>
            )}
            {control ?
                (<Controller name={name} control={control} defaultValue={defaultValue} render={({ field }) => (
                    <TextField {...field} fullWidth id={name} disabled={disabled} inputProps={{ required }}
                        label={isLabeled ? undefined : required ? (
                            <span>
                                <span className={textCss.required}>*</span> {label}
                            </span>
                        ) : (label)
                        }
                        placeholder={placeholder} variant={!isLabeled ? variant : 'outlined'} size={muiSize} error={!!finalError}
                        className={`${textCss.error} ${className || ''}`} helperText={finalError}
                        onChange={(e) => { field.onChange(e); onChange && onChange(e); }}
                    />
                )}
                />) : (
                    <TextField fullWidth id={name}
                        label={isLabeled ? undefined : required ? (
                            <span>
                                <span className={textCss.required}>*</span> {label}
                            </span>
                        ) : (label)}
                        placeholder={placeholder} variant={!isLabeled ? variant : 'outlined'} size={muiSize} error={!!finalError}
                        className={`${textCss.error} ${className || ''}`} helperText={finalError} value={value}
                        onChange={(e) => { onChange && onChange(e); }} slotProps={{ input: { className: className || "" } }}
                        disabled={disabled}
                    />
                )}
        </FormControl>
    );
}
