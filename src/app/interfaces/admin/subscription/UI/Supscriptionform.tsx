import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Grid, Box, Typography, Paper } from "@mui/material";
import BackIcon from '@mui/icons-material/Reply';

import InputText from "../../../../../shared/components/formFields/InputText";
import InputNumber from "../../../../../shared/components/formFields/InputNumber";
import Card from "../../../../../shared/components/card/Card";
import { useCreateSubscriptionMutation, useUpdateSubscriptionMutation, useGetSubscriptionByIdQuery, type CreateSubscriptionInput } from "../service/subscriptionservice";

import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "../../../../../shared/components/formFields/InputSelect";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import Button from "../../../../../shared/components/button/Button";
import styles from "../Subscription.module.scss";

// ---------- VALIDATION ----------
const subscriptionSchema = yup.object().shape({
    plan_name: yup.string().required("Plan name is required"),
    plan_type: yup.array().of(
        yup.object().shape({
            plan_type_name: yup.string().required("Plan type name is required"),
            amount: yup.number().required("Amount is required").positive("Amount must be positive"),
            currency: yup.number().required("Currency is required"),
        })
    ).min(1, "At least one plan type is required").required(),
});

export const SubscriptionForm = () => {
    const { id } = useParams(); // <-- get id from URL
    const isEdit = Boolean(id);

    const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();

    const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

    const { data: editData } = useGetSubscriptionByIdQuery(id!, { skip: !isEdit, });

    const currencyOptions = [
        { value: 0, label: "INR" },
        { value: 1, label: "USD" },
    ];
    const navigate = useNavigate();
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info" as "success" | "error" | "warning" | "info",
    });

    const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setToast({ open: true, message, severity });
    };

    const close = () => {
        setToast({ ...toast, open: false });
    }

    // Type guard to check if error is FetchBaseQueryError
    function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
        return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateSubscriptionInput>({
        resolver: yupResolver(subscriptionSchema) as any,
        defaultValues: {
            plan_name: "",
            plan_type: [
                { plan_type_name: "Monthly", amount: 0, currency: 0 },
                { plan_type_name: "Yearly", amount: 0, currency: 0 }
            ]
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "plan_type"
    });

    // ----------- LOAD EDIT DATA ------------
    useEffect(() => {
        if (editData) {
            reset({
                plan_name: editData.plan_name,
                plan_type: [
                    {
                        plan_type_name: "Monthly",
                        amount: editData.plan_type?.find((p: any) => p.plan_type_name === "Monthly")?.amount || 0,
                        currency: editData.plan_type?.find((p: any) => p.plan_type_name === "Monthly")?.currency || 0
                    },
                    {
                        plan_type_name: "Yearly",
                        amount: editData.plan_type?.find((p: any) => p.plan_type_name === "Yearly")?.amount || 0,
                        currency: editData.plan_type?.find((p: any) => p.plan_type_name === "Yearly")?.currency || 0
                    }
                ],
            });
        }
    }, [editData, reset]);

    // ---------- SUBMIT ----------

    const onSubmit: SubmitHandler<CreateSubscriptionInput> = async (data) => {
        try {
            let apiResponse;

            if (isEdit && id) {
                // ---------------- UPDATE ----------------
                apiResponse = await updateSubscription({
                    id,
                    data: {
                        plan_name: data.plan_name,
                        plan_type: data.plan_type,
                    },
                });

                const res = apiResponse?.data ?? apiResponse; // normalize
                if (res) {
                    showToast("Subscription updated successfully!", "success");
                    navigate("/admin/subscription");
                } else {
                    showToast("Failed to update subscription.", "error");
                }
            } else {
                // ---------------- CREATE ----------------
                apiResponse = await createSubscription(data);
                const res = apiResponse?.data ?? apiResponse; // normalize
                if (res) {
                    showToast("Subscription created successfully!", "success");
                    navigate("/admin/subscription");
                    return;
                } else {
                    showToast("Failed to create subscription.", "error");
                }
            }
        } catch (error: any) {
            // ---------------- ERROR HANDLING ----------------
            let errorMessage = "Something went wrong. Please try again.";

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.error) {
                // handle RTK Query baseQuery errors
                errorMessage =
                    (isFetchBaseQueryError(error.error) &&
                        (error.error.data as any)?.message) ||
                    errorMessage;
            }

            showToast(errorMessage, "error");
            console.error("Subscription API error:", error);
        }
    };

    const goBack = () => { navigate("/admin/subscription") }

    const renderPlanCard = (field: any, index: number) => (
        <Card key={field.id} className={styles.subplanCard}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">Plan Type #{index + 1}</Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <InputText name={`plan_type.${index}.plan_type_name`} label="Type Name" placeholder="e.g. Monthly" control={control} errors={errors} variant="labeled" required disabled={true} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputNumber name={`plan_type.${index}.amount`} label="Amount" placeholder="0.00" control={control} errors={errors} variant="labeled" required />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputSelect name={`plan_type.${index}.currency`} label="Currency" placeholder="Select" control={control} options={currencyOptions} required={true} errors={errors} variant="labeled" />
                </Grid>
            </Grid>
        </Card>
    );

    return (
        <>
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Subscription Management
                    </Typography>
                    <Typography variant="body2"> {isEdit ? "Edit Subscription" : "Add Subscription"}</Typography>
                </Box>

            </Box>


            <Paper elevation={3}>
                <Box className="formContainer" component={'form'} noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h5" className="formTitle">
                        Subscription
                    </Typography>

                    {/* Plan Name at the Top */}
                    <Box className="formContent" mb={4}>
                        <div className="formGroup">
                            <InputText name="plan_name" label="Plan Name" placeholder="Enter plan name" control={control} errors={errors} variant="labeled" required />
                        </div>
                    </Box>

                    {/* Plan Types Section Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="bold">Plan Types</Typography>
                    </Box>

                    {/* Plan Types Grid with Alternating Layout */}
                    <Grid container spacing={4} className="formContent">
                        {/* Left Column - Even Indices (0, 2, 4...) */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box>
                                {fields.map((field, index) => (
                                    index % 2 === 0 ? renderPlanCard(field, index) : null
                                ))}
                            </Box>
                        </Grid>

                        {/* Divider */}
                        <Grid size={{ md: 2 }} className="dividerWrapper">
                            <div className="divider" />
                        </Grid>

                        {/* Right Column - Odd Indices (1, 3, 5...) */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box>
                                {fields.map((field, index) => (
                                    index % 2 !== 0 ? renderPlanCard(field, index) : null
                                ))}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box className="submitWrapper">
                        <Button type="submit" label={isEdit ? isUpdating ? "Updating..." : "Submit" : isCreating ? "Creating..." : "Submit"} disabled={isCreating || isUpdating} />
                    </Box>
                </Box>
            </Paper>

            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={close} />

        </>
    );
};
