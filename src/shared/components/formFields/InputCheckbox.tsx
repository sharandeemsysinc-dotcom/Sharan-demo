// Import Packages
import { Controller } from "react-hook-form";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, TextField } from "@mui/material";

// Import Files
import checkboxCss from './FormFields.module.scss'

interface Props {
    name: string;
    label?: string;
    size?: "small" | "normal";
    control: any;
    options: { value: string | number | boolean; label: string }[];
    errors?: any;
    multiple?: boolean;
    required?: boolean;
    onChange?: (value: any) => void;
    showOtherField?: boolean;
}

export default function InputCheckbox({ name, label, size = "small", control, options, errors, multiple = false, required = false, onChange, showOtherField = false }: Props) {
    const finalOptions = showOtherField
        ? [...options, { value: "other", label: "Others" }]
        : options;
    // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size

    return (
        <FormControl fullWidth error={!!errors?.[name]}>
            {multiple && (
                <FormLabel className="formLabel">
                    {required && <span className={checkboxCss.required}>* </span>}
                    {label}
                </FormLabel>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        {finalOptions.map((item: any) => {
                            const checked = multiple
                                ? (field.value || []).includes(item.value)
                                : field.value === item.value;

                            const handleChange = (e: any) => {
                                if (multiple) {
                                    const arr = field.value || [];
                                    const newArr = e.target.checked
                                        ? [...arr, item.value]
                                        : arr.filter((v: any) => v !== item.value);

                                    field.onChange(newArr);
                                } else {
                                    field.onChange(e.target.checked ? item.value : false);
                                }
                            };

                            return (
                                <FormControlLabel
                                    key={String(item.value)}
                                    id={item.label}
                                    control={<Checkbox size={muiSize} checked={checked} onChange={(e) => {
                                        handleChange(e);
                                        onChange?.(item.value);
                                    }} />}
                                    label={item.label}
                                />
                            );
                        })}

                        {errors?.[name] && (
                            <FormHelperText className={checkboxCss.error}>
                                {errors[name]?.message}
                            </FormHelperText>
                        )}

                        {showOtherField &&
                            multiple &&
                            Array.isArray(field.value) &&
                            field.value.includes("other") && (
                                <Controller
                                    name={`other_${name}`}
                                    control={control}
                                    render={({ field: otherField }) => (
                                        <TextField
                                            label={`${label} (Specify)`}
                                            {...otherField}
                                            error={!!errors?.[`other_${name}`]}
                                            helperText={errors?.[`other_${name}`]?.message}
                                            className={`${checkboxCss.error} mt-2`}
                                        />
                                    )}
                                />
                            )}

                        {showOtherField && !multiple && field.value === "other" && (
                            <Controller
                                name={`${name}_other`}
                                control={control}
                                render={({ field: otherField }) => (
                                    <TextField
                                        label={`${label} (Specify)`}
                                        {...otherField}
                                        error={!!errors?.[`${name}_other`]}
                                        helperText={errors?.[`other_${name}`]?.message}
                                        className={`${checkboxCss.error} mt-2`}
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

