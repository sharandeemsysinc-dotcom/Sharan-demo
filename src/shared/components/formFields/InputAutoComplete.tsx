// Import Packages
import { Autocomplete, FormControl, FormLabel, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

// Import Files
import autoCompleteCss from './FormFields.module.scss'
interface Props {
    name: string;
    label?: string;
    placeholder: string;
    variant?: "outlined" | "filled" | "standard" | "labeled";
    size?: "small" | "normal";
    control: any;
    options: { value: any; label: string }[];
    errors?: any;
    multiple?: boolean;
    required?: boolean;
    disabled?: boolean;
    showOtherField?: boolean;
    onChange?: (value: any) => void;
}

export default function InputAutoComplete({ name, label, placeholder, variant, size = "small", control, options, multiple = false,
    required = false, disabled = false, showOtherField = false, errors, onChange }: Props) {
    const isLabeled = variant === "labeled";
        // Map size prop to MUI size
    const muiSize = size === "small" ? "small" : undefined; // undefined = normal MUI size

    // Automatically add the "other" option
    const finalOptions = showOtherField
        ? [...options, { value: "other", label: "Others" }]
        : options;

    return (
        <FormControl fullWidth error={!!errors?.[name]}>
            {isLabeled && (
                <FormLabel className="formLabel">
                    {required ? (
                        <span>
                            <span className={autoCompleteCss.required}>*</span> {label}
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

                    const selectedValue = multiple
                        ? finalOptions.filter((opt) => field.value?.includes(opt.value))
                        : finalOptions.find((opt) => opt.value === field.value) || null;

                    return (
                        <>
                            <Autocomplete
                                multiple={multiple}
                                disabled={disabled}
                                options={finalOptions}
                                value={selectedValue}
                                getOptionLabel={(opt) => opt.label}
                                onChange={(_, selected: any) => {
                                    if (multiple) {
                                        field.onChange(
                                            Array.isArray(selected)
                                                ? selected.map((x) => x.value)
                                                : []
                                        );
                                    } else {
                                        field.onChange(selected ? selected.value : "");
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        id={name}
                                        placeholder={placeholder}
                                        label={
                                            isLabeled
                                                ? undefined
                                                : required ? (
                                                    <span>
                                                        <span className={autoCompleteCss.required}>*</span>
                                                        {label}
                                                    </span>
                                                ) : label
                                        }
                                        variant={!isLabeled ? variant : "outlined"}
                                        className={`${autoCompleteCss.error} `}
                                        size={muiSize}
                                        error={!!errors?.[name]}
                                        helperText={errors?.[name]?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            onChange && onChange(e);
                                        }}
                                    />
                                )}
                            />

                            {/* OTHER TEXT FIELD (Multi + Single support) */}
                            {showOtherField && (
                                (multiple
                                    ? field.value?.includes("other")
                                    : field.value === "other"
                                ) && (
                                    <Controller
                                        name={`${name}_other`}
                                        control={control}
                                        render={({ field: otherField }) => (
                                            <TextField
                                                {...otherField}
                                                className="mt-2"
                                                label={`${label} (Specify)`}
                                            />
                                        )}
                                    />
                                )
                            )}
                        </>
                    );
                }}
            />
        </FormControl>
    );
}
