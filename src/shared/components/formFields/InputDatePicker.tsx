// Import Packages
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, FormLabel } from "@mui/material";

// Import Files
import datePickerCss from './FormFields.module.scss'

interface Props {
    name: string;
    label: string;
    placeholder: string
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal";
    control: any;
    errors?: any;
    required?: boolean
    disabled?: boolean
    onChange?: (value: any) => void;
}

export default function InputDatePicker({ name, label, placeholder, variant = 'outlined', size = "small", control, errors, required = false, disabled = false,
    onChange }: Props) {
    const isLabeled = variant === "labeled";
    const variantValue = !isLabeled ? variant : 'outlined'
    
    // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size

    return (
        <FormControl fullWidth error={!!errors?.[name]}>
            {isLabeled && (
                <FormLabel className="formLabel">{
                    required ? (
                        <span>
                            <span className={datePickerCss.required}>*</span> {label}
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
                        <DatePicker
                            {...field}
                            label={
                                isLabeled ? undefined :
                                    required ? (
                                        <span>
                                            <span className={datePickerCss.required}>*</span> {label}
                                        </span>
                                    ) : (label)
                            }
                            className={`${datePickerCss.error}`}

                            disabled={disabled}
                            slotProps={{
                                textField: {
                                    id: name,
                                    fullWidth: true,
                                    error: !!errors[name],
                                    helperText: errors[name]?.message,
                                    placeholder: placeholder,
                                    variant: variantValue,
                                    disabled: disabled,
                                    size:muiSize
                                },
                            }}

                            onChange={(e) => {
                                field.onChange(e);
                                onChange && onChange(e);
                            }}
                        />
                    </>
                )}
            />
        </FormControl>
    );
}