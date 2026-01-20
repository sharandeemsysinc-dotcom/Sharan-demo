
// Import packages
import React, { useState } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import Files
import InputPassword from "../../../../shared/components/formFields/InputPassword";
import Button from "../../../../shared/components/button/Button";
import styles from "../auth.module.scss";
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";
import { selectUserId } from "../../../stores/authSlice";

// Import Images
import logo from "../../../../assets/images/logo.webp";
import { useChangePasswordMutation } from "../services/loginService";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Define TypeScript interface for form data
interface ChangePasswordFormData {
    user_id?: string; // Optional since it might come from auth context
    old_password: string;
    new_password: string;
    confirm_password: string;
}

// Define Yup schema
const changePasswordSchema = yup.object().shape({
    old_password: yup.string().required("Old Password is required"),
    new_password: yup
        .string()
        .required("New Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirm_password: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("new_password")], "Passwords must match"),
});

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info" as "success" | "error" | "warning" | "info",
    });

    // Get the user ID from Redux state
    const userId = useSelector(selectUserId);
    const [changePassword] = useChangePasswordMutation();

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setToast({ open: true, message, severity });
    };

    const closeToast = () => {
        setToast({ ...toast, open: false });
    };

    function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
        return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
    }

    const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
        // Include user_id from Redux state in the payload

        setIsLoading(true);

        try {
            const payload = {
                ...data,
                user_id: userId || undefined,
            };
            const apiResponse = await changePassword(payload);

            const res = apiResponse?.data; // normalize
            if (res?.status) {
                setIsLoading(false);
                showToast(res?.message || "Password changed successfully!", "success");
                reset();
                navigate("/auth/login");
            } else {
                let errorMessage = "Failed to change password";

                if (apiResponse?.error) {
                    if (isFetchBaseQueryError(apiResponse.error)) {
                        errorMessage = (apiResponse.error.data as any)?.message || errorMessage;
                    }
                }
                showToast(errorMessage, "error");
            }
        } catch (err: any) {
            const errorMessage = err.data?.message || "Failed to change password. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <Box className={styles.loginContainer}>
            <Card className={styles.loginCard}>
                <img src={logo} alt="logo" width="80" height={80} className={styles.logoImage} />

                <Typography variant="h5" className={styles.heading}>
                    Change Password
                </Typography>

                <Typography variant="body2" className={styles.subHeading}>
                    Enter your old password and new password to update your credentials
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2} mb={2} mt={3}>
                        <InputPassword className={styles.customInput} name="old_password" label="Old Password" placeholder="Enter old password" control={control} errors={errors} variant="outlined" size="normal" required />
                        <InputPassword className={styles.customInput} name="new_password" label="New Password" placeholder="Enter new password" control={control} errors={errors} variant="outlined" size="normal" required />
                        <InputPassword className={styles.customInput} name="confirm_password" label="Confirm Password" placeholder="Confirm new password" control={control} errors={errors} variant="outlined" size="normal" required />
                        <Button label={isLoading ? "Updating..." : "Update Password"} type="submit" disabled={isLoading} />
                    </Stack>
                </form>
            </Card>
            <ToastMessage
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </Box>
    );
};

export default ChangePassword;


