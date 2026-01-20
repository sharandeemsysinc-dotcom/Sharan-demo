import { FormControl, FormLabel, TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller } from "react-hook-form";

import passwordCss from './FormFields.module.scss';
import { useState } from "react";

interface Props {
    name: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal";
    control: any;
    errors?: any;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    onChange?: (value: any) => void;
}

export default function InputPassword({
    name,
    label,
    placeholder,
    variant = "outlined",
    size = "small",
    control,
    errors,
    className,
    required = false,
    disabled = false,
    onChange
}: Props) {

    const isLabeled = variant === "labeled";

    const [showPassword, setShowPassword] = useState(false);

    // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size


    return (
        <FormControl fullWidth error={!!errors?.[name]}>
            {isLabeled && (
                <FormLabel className="formLabel">
                    {required ? (
                        <span>
                            <span className={passwordCss.required}>*</span>
                            {label}
                        </span>
                    ) : label}
                </FormLabel>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        id={name}
                        disabled={disabled}
                        type={showPassword ? "text" : "password"}
                        label={
                            isLabeled
                                ? undefined
                                : required
                                    ? <span><span className={passwordCss.required}>*</span>{label}</span>
                                    : label
                        }
                        placeholder={placeholder}
                        variant={!isLabeled ? variant : "outlined"}
                        error={!!errors?.[name]}
                        className={`${passwordCss.error} ${className || ""}`}
                        size={muiSize}
                        slotProps={{
                            input: {
                                className: className || "",
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            sx={{ color: 'inherit' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        helperText={errors?.[name]?.message}
                        onChange={(e) => {
                            field.onChange(e);
                            onChange && onChange(e);
                        }}
                    />
                )}
            />
        </FormControl>
    );
}
