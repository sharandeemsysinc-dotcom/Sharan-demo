// Import Packages
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Import Images
import profileImg from '../../../../../assets/images/defaultImages/profileImg.webp'

// Import Icons
import BackIcon from '@mui/icons-material/Reply';

// Import Files
import { useGetStaffByIdMutation, useSaveStaffMutation, useUpdateStaffMutation } from "../service/staffs";
import { countries } from "../../../../../shared/constant";
import staff from '../Staff.module.scss'
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import InputFileUpload from "../../../../../shared/components/formFields/InputFileUpload";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import Loader from "../../../../../shared/components/loader/Loader";
import CountryCode from "../../../../../shared/components/formFields/countryCode/CountryCode";

const schema = yup.object().shape({
    first_name: yup.string().default('').trim().required("First name is required"),
    middle_name: yup.string().default(''),
    last_name: yup.string().default('').trim().required("Last name is required"),
    email: yup.string().default('').trim().required("Email is required")
        .matches(/^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, "Enter a valid email"),
    country_code: yup.string().default('').required("Country code is required"),
    mobile: yup.string().default('').required("Phone number is required").matches(/^[0-9]+$/, "Only numbers are allowed")
        .min(10, "Minimum 10 digits required").max(15, "Maximum 15 digits allowed"),
    image_url: yup.mixed().test("fileSize", "Image size should be less than 2MB", (value: any) => {
        if (!value || value.length === 0) return true;
        const file = value[0];
        if (!(file instanceof File)) return true; //skip for existing image
        return file.size <= 2 * 1024 * 1024;
    }).test("fileType", "Only JPG/PNG allowed", (value: any) => {
        if (!value || value.length === 0) return true;
        const file = value[0];
        if (!(file instanceof File)) return true; // skip for existing image
        return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type);
    }).test("fileResolution", "Please upload an image between 130–150 px in width and height.", (value: any) => {
        if (!value || value.length === 0) return true;
        const file = value[0];
        if (!(file instanceof File)) return true; // IMPORTANT FIX
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;
            img.onload = () => {
                URL.revokeObjectURL(objectUrl); // cleanup
                resolve(img.width >= 130 && img.width <= 150 && img.height >= 130 && img.height <= 150);
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(false);
            };
        });
    })
});

export const StaffForm = () => {
    const { handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const navigate = useNavigate();
    const { id } = useParams();

    const [imageUrl, setImageUrl] = useState('');
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

    const [save, { isLoading: saveLoading }] = useSaveStaffMutation();
    const [update, { isLoading: updateLoading }] = useUpdateStaffMutation();
    const [getStaffById, { data: staffDetails, isSuccess, isLoading: staffDetailsLoading }] = useGetStaffByIdMutation();

    useEffect(() => {
        id && getStaffById({ staff_id: id });
    }, [id]);

    // Call get staff by id api intially if id detects in params
    useEffect(() => {
        if (id && isSuccess && staffDetails?.data) {
            (staffDetails?.data?.image_url != null) ? setImageUrl(staffDetails?.data?.image_url) : profileImg;
            reset({
                ...staffDetails.data,
                image_url: staffDetails.data?.image_url ? [staffDetails.data?.image_url] : '',
            });
        }
    }, [id, staffDetails, isSuccess, reset]);

    const countryOptions = countries.map((c) => ({
        value: `+${c.phone}`,   // stored in form → "IN"
        label: c.label,         // used for search → "India"
        code: `+${c.phone}`,    // displayed code → "+91"
        iso: c.code,            // flag source → "IN"
    }));

    // Navigate Back to Table
    const goBack = () => { navigate("/admin/staff") }

    // Convert image to base 64 url
    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    // Save and Update Staff Function
    const submitStaff = async (data: any) => {
        // Handle the image conversion correctly
        if (data.image_url && Array.isArray(data.image_url) && data.image_url.length > 0) {
            const file = data.image_url[0];
            if (file instanceof File) data.image_url = await convertToBase64(file)
            else if (typeof file === 'string') data.image_url = file // If it's already a string (backend URL), keep it as is
            else data.image_url = ""
        } else data.image_url = ""

        try {
            let res;
            if (!id) { res = await save(data).unwrap() }
            else { res = await update({ id, data }).unwrap() }
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
                navigate("/admin/staff");
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
        } catch (error) {
            console.error("Error creating demo:", error);
        }
    }

    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Staff Management
                    </Typography>
                    <Typography variant="body2">{!id ? "Add Staff" : "Edit Staff"}</Typography>
                </Box>
            </Box>

            {/* Body */}
            {staffDetailsLoading ? <Loader /> : (
                <Paper elevation={3}>
                    <Box className="formContainer" component={'form'} onSubmit={handleSubmit(submitStaff)}>
                        <Typography variant="h5" className="formTitle">Basic Information</Typography>
                        <Grid container spacing={4} className="formContent">
                            {/* Left Side Inputs */}
                            <Grid size={{ xs: 12, md: 5 }} order={{ xs: 2, md: 1 }}>
                                <Box className="formLeft">
                                    <Box className="formGroup">
                                        <InputText name="first_name" label="First Name" placeholder="Enter first name" variant="labeled" control={control}
                                            errors={errors} required />
                                    </Box>

                                    <Box className="formGroup">
                                        <InputText name="middle_name" label="Middle Name" placeholder="Enter middle name" variant="labeled" control={control}
                                            errors={errors} />
                                    </Box>

                                    <Box className="formGroup">
                                        <InputText name="last_name" label="Last Name" placeholder="Enter last name" variant="labeled" control={control}
                                            errors={errors} required />
                                    </Box>

                                    <Box className="formGroup">
                                        <InputText name="email" label="Email" placeholder="Enter email" variant="labeled" control={control}
                                            errors={errors} required />
                                    </Box>

                                    <Box className="formGroup">
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, lg: 4 }}>
                                                <CountryCode name="country_code" label="Code" placeholder="Enter Code" variant="labeled"
                                                    control={control} errors={errors} options={countryOptions} required />
                                            </Grid>
                                            <Grid size={{ xs: 12, lg: 8 }}>
                                                <InputText name="mobile" label="Phone Number" placeholder="Enter phone number" control={control}
                                                    errors={errors} variant="labeled" required />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Divider */}
                            <Grid size={{ md: 2 }} className="dividerWrapper" order={{ md: 2 }}>
                                <Box className="divider" />
                            </Grid>

                            {/* Right Photo Upload Section */}
                            <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 3 }} className="d-flex align-items-center">
                                <InputFileUpload name="image_url" label="Add Photo" control={control} errors={errors} showImagePreview
                                    key="staff_profile" accept="image/png, image/jpeg, image/jpg, image/webp" defaultImage={imageUrl || profileImg}
                                    infoTooltip="Supported formats: JPG, JPEG, PNG, WEBP. File size must not exceed 2 MB. Image width and height must each be within 130–150 px."
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <Box className="submitWrapper">
                            <Button type="submit" label="Submit" className={staff.submitBtn} disabled={saveLoading || updateLoading} />
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} />
        </>
    );
};