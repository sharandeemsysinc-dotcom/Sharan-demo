// Import Package
import { FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
 
// Import Files
import numberCss from './FormFields.module.scss'
 
interface Props {
    name: string;
    label?: string;
    placeholder: string
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal";
    control?: any;
    errors?: any;
    errorMessage?: any;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    className?: any;
    onChange?: (value: any) => void
}
 
export default function InputNumber({ name, label, placeholder, variant = "outlined", size = "small", control, errors, errorMessage, value,
    required, disabled, className, onChange }: Props) {
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
                <FormLabel className="formLabel" htmlFor={name}>
                    {required ? (
                        <span>
                            <span className={numberCss.required}>*</span> {label}
                        </span>
                    ) : (label)}
                </FormLabel>
            )}
            {control ? (
                <Controller name={name} control={control} disabled={disabled} render={({ field }) => (
                    <TextField {...field} id={name} type="number" disabled={disabled} fullWidth
                        label={isLabeled ? undefined : required ? (
                            <span>
                                <span className={numberCss.required}>* {label}</span>
                            </span>
                        ) : (label)} placeholder={placeholder} variant={!isLabeled ? variant : 'outlined'} size={muiSize}
                        className={`${numberCss.error} ${className}`} error={!!finalError} helperText={finalError}
                        onChange={(e) => { field.onChange(e); onChange?.(e); }}
                    />
                )} />
            ) : (
                <TextField id={name} type="number" disabled={disabled} fullWidth value={value}
                    label={isLabeled ? undefined : required ? (
                        <span>
                            <span className={numberCss.required}>*</span> {label}
                        </span>
                    ) : (label)} placeholder={placeholder} variant={!isLabeled ? variant : 'outlined'} size={muiSize}
                    className={`${numberCss.error} ${className}`} error={!!finalError} helperText={finalError}
                    onChange={(e) => { onChange && onChange(e); }}
                />
            )}
        </FormControl>
    );
}