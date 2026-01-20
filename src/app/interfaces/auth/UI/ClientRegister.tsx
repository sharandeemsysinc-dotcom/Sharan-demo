import { Box, Container, Grid, Typography, Link, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputText from "../../../../shared/components/formFields/InputText";
import Stepper from "../../../../shared/components/stepper/Stepper"
import InputAutoComplete from "../../../../shared/components/formFields/InputAutoComplete";
import InputCheckbox from "../../../../shared/components/formFields/InputCheckbox";
import InputRadio from "../../../../shared/components/formFields/InputRadio";
import logo from '../../../../assets/images/logo.webp'
import styles from "../auth.module.scss";
import profileImg from '../../../../assets/images/defaultImages/profileImg.webp'
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";
import { useCreateClientMutation, useUpdateClientMutation, useGetClientByIdMutation } from "../../admin/client/service/Client";
import { useParams, useNavigate } from "react-router-dom";
import { industry, leadershipLevels, REFERRAL_SOURCE_OPTIONS, TIMEZONES } from "../../../../shared/constant";
import {
    COACHING_GOALS_OPTIONS, DEFAULT_RADIO_OPTIONS, URGENCY_OPTIONS, WORKING_STYLE_OPTIONS, ENGAGEMENT_OPTIONS, PREFERRED_COACH_OPTIONS, COACH_CREDENTIALS_OPTIONS, BUDGET_OPTIONS, countries
} from "../../../../shared/constant";
import CountryCode from "../../../../shared/components/formFields/countryCode/CountryCode";
import InputTextArea from "../../../../shared/components/formFields/InputTextArea";
import Loader from "../../../../shared/components/loader/Loader";
import InputNumber from "../../../../shared/components/formFields/InputNumber";
import { useGhostPostHTML } from "../../../../shared/hooks/useGhostPost";
import Dialog from "../../../../shared/components/dialog/Dialog";
import TickLoader from "../../../../shared/components/loader/TickLoader";

const schema = yup.object().shape({
    // ---------------- STEP 1 ----------------
    first_name: yup.string().required("First name is required"),
    middle_name: yup.string().optional(),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().optional(),
    country_code: yup
        .string()
        .optional(),
    city: yup.string(),
    time_zone: yup.string().required("Time zone is required"),
    linked_in_url: yup.string()
        .url("Enter a valid LinkedIn URL")
        .required("LinkedIn URL is required"),
    website_url: yup
        .string().optional(),
    image_url: yup
        .mixed()
        .test("fileSize", "Image size should be less than 2MB", (value: any) => {
            if (!value || value.length === 0) return true; // no file selected → skip
            return value[0].size <= 2 * 1024 * 1024; // 2MB
        })
        .test("fileType", "Only JPG/PNG allowed", (value: any) => {
            if (!value || value.length === 0) return true;
            return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(value[0].type);
        })
        .test("fileResolution", "Please upload an image between 130–150 px in width and height.", (value: any) => {
            if (!value || value.length === 0) return true; // skip if nothing selected

            const file = value[0];
            return new Promise((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    const isValidWidth = img.width >= 130 && img.width <= 150;
                    const isValidHeight = img.height >= 130 && img.height <= 150;
                    resolve(isValidWidth && isValidHeight);
                };

                img.onerror = () => resolve(false);
            });
        }),
    // .required("Profile image is required"),

    // ---------------- STEP 2 ----------------
    current_role: yup.string().required("Current role is required"),
    support_seek: yup
        .string()
        .oneOf(leadershipLevels.map((l: any) => l.value), "Please select a valid option")
        .required("Please select an option"),
    is_worked_with_coach: yup
        .number()
        .transform((_, originalValue) =>
            originalValue === "0" || originalValue === "1"
                ? Number(originalValue)
                : originalValue
        )
        .required("Please select an option"),
    coach_cred_preference: yup
        .number()
        .transform((_, originalValue) =>
            originalValue === "0" || originalValue === "1"
                ? Number(originalValue)
                : originalValue
        )
        .required("Please select an option"),

    work_reason: yup.string().nullable().notRequired(),

    coach_reason: yup.string().required("Coach reason role is required"),



    // .min(1, "Select at least one coaching goal"),
    // .required(),

    urgency: yup
        .number()
        .nullable()
        .notRequired(),

    // ---------------- STEP 3 ----------------
    // coaching_style: yup
    //     .string()
    //     .required("Work style is required"),
    coaching_style: yup
        .array()
        .min(1, "Select at least one option")
        .required("This fields is required"),
    industries: yup
        .array()
        .min(1, "Select at least one option")
        .required("This fields is required"),
    coach_comments: yup
        .string(),

    engagement_type: yup
        .number()
        .required("Please select your engagement type"),

    coach_experience: yup
        .string()
        .required("Preferred coach experience is required"),

    coaching_credentials: yup
        .array().nullable().notRequired(),
    coaching_goals: yup
        .array()
        .min(1, "Select at least one option")
        .required("This fields is required"),


    // range_per_session: yup
    //     .array()
    //     .min(1, "Select at least one budget option")
    //     .required("This field is required"),

    range_per_session: yup
        .mixed()
        .transform((value, originalValue) => {
            // radio gives string → convert to array
            if (typeof originalValue === "string") {
                return [originalValue];
            }

            // already array → keep as is
            if (Array.isArray(originalValue)) {
                return originalValue;
            }

            // fallback
            return [];
        })
        .test(
            "min-one",
            "Select at least one budget option",
            (value) => Array.isArray(value) && value.length > 0
        )
        .required("This field is required"),



    other_engagement_type: yup.string().optional(),

    // ---------------- STEP 4 ----------------
    // not_discuss_topics: yup.array().min(1, "Select at least one topic").required(),
    notes: yup.string(),
    ref_source: yup.string(),
    terms_conditions: yup
        .boolean()
        .oneOf([true], "You must accept Terms & Conditions"),
});


const Register = () => {
    const { id } = useParams();  // If id exists → editing mode
    const navigate = useNavigate();

    const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
    const [getClientById, { isLoading: isFetchingClient, data: clientResult }] = useGetClientByIdMutation();
    const isSubmitting = isCreating || isUpdating || isFetchingClient;
    const [completed, setCompleted] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successAction, setSuccessAction] = useState<'login' | 'none'>('login');
    const [termsDialogBody, setTermsDialogBody] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getClientById({});
        }
    }, [id]);

    const [activeStep, setActiveStep] = useState(0);
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary", autoHide: 6000 });

    // Fetch Terms & Conditions from Ghost using custom hook
    const { html: termsHtml, loading: termsLoading } = useGhostPostHTML(
        "limit=1&fields=html"
    );
    const [termsOpen, setTermsOpen] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    useEffect(() => {
        // populate dynamic dialog body when fetched
        setTermsDialogBody(termsHtml || "<p>No terms available.</p>");
    }, [termsHtml]);




    const onSubmit = async (formData: any) => {
        const cleanedData = {
            ...formData,
            work_reason:
                formData.is_worked_with_coach === 1 ? formData.work_reason : "",
            coach_reason:
                formData.is_worked_with_coach === 0 ? formData.coach_reason : "",
        };

        const payload = {
            first_name: cleanedData.first_name,
            middle_name: cleanedData.middle_name,
            last_name: cleanedData.last_name,
            email: cleanedData.email,
            country_code: cleanedData.country_code,
            mobile: cleanedData.mobile,
            linked_in_url: cleanedData.linked_in_url,
            website_url: cleanedData.website_url,

            client_history: {
                current_role: cleanedData.current_role,
                coaching_goals: cleanedData.coaching_goals || [],
                coaching_style: cleanedData.coaching_style || [],
                is_worked_with_coach: cleanedData.is_worked_with_coach,
                work_reason: cleanedData.work_reason,
                coach_reason: cleanedData.coach_reason,
                coach_comments: cleanedData.coach_comments || null,
                engagement_type: cleanedData.engagement_type,
                other_engagement_type:
                    cleanedData.engagement_type === 4
                        ? cleanedData.other_engagement_type
                        : null,
                coach_experience: cleanedData.coach_experience,
                coach_cred_preference: cleanedData.coach_cred_preference,
                coaching_credentials:
                    cleanedData.coach_cred_preference === 1
                        ? cleanedData.coaching_credentials || []
                        : [],
                range_per_session: cleanedData.range_per_session || [],
                ref_source: cleanedData.ref_source || null,
                notes: cleanedData.notes || null,
                time_zone: cleanedData.time_zone || null,
                terms_conditions: cleanedData.terms_conditions || false,
            },
        };

        try {
            let response;

            if (!id) {
                response = await createClient(payload).unwrap();
                setSuccessMessage(response?.message || "Client registered successfully");
            } else {
                response = await updateClient({ id, data: payload }).unwrap();
                setSuccessMessage(response?.message || "Client updated successfully");
            }

            setSuccessAction("login");
            setSuccessOpen(true);
        } catch (error: any) {
            setToast({
                open: true,
                message: error?.data?.message || "Something went wrong",
                severity: "error",
                autoHide: 5000,
            });
        }
    };


    const { handleSubmit, control, trigger, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            range_per_session: [],
            is_worked_with_coach: undefined,
            support_seek: undefined,
            coach_cred_preference: undefined,
            industries: [],
            terms_conditions: false,
            other_engagement_type: undefined,
        },
    });
    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeStep]);

    const selectedBudget = useWatch({
        control,
        name: "range_per_session",
    });

    useEffect(() => {
        if (selectedBudget && !Array.isArray(selectedBudget)) {
            setValue("range_per_session", [selectedBudget], {
                shouldValidate: true,
            });
        }
    }, [selectedBudget, setValue]);
    const isWorkedWithCoachRaw = useWatch({
        control,
        name: "is_worked_with_coach",
    });
    const isCoachCredPreference = useWatch({
        control,
        name: "coach_cred_preference",
    });
    const isWorkedWithCoach =
        isWorkedWithCoachRaw !== undefined
            ? Number(isWorkedWithCoachRaw)
            : undefined;

    // Watch for checkbox changes and open modal when checked manually
    const termsChecked = useWatch({
        control,
        name: "terms_conditions",
        defaultValue: false,
    });

    // Watch for engagement_type to show other_engagement_type field
    const engagementType = useWatch({
        control,
        name: "engagement_type",
        defaultValue: undefined,
    });

    useEffect(() => {
        if (termsChecked) {
            setTermsOpen(true);
        }
    }, [termsChecked]);

    useEffect(() => {
        const resultAny = clientResult as any;
        if (resultAny?.data) {
            const client = resultAny.data;

            reset({
                ...client,
                image_url: client.image_url || profileImg
            });

            // setImageUrl(client.image_url);
        }
    }, [clientResult]);

    const countryOptions = countries.map((c) => ({
        value: `+${c.phone}`,          // stored in form → "IN"
        label: c.label,         // used for search → "India"
        code: `+${c.phone}`,
        iso: c.code,            // flag source → "IN"
    }));

    const terms = [{ label: "Accept Terms and Conditions", value: true }];

    useEffect(() => {
        console.log("isWorkedWithCoach:", isWorkedWithCoach, typeof isWorkedWithCoach);
    }, [isWorkedWithCoach]);
    // Define fields for each step to validate
    const stepFields = [
        ["first_name", "middle_name", "last_name", "email", "city", "time_zone", "linked_in_url", "website_url", ""], // Step 1
        ["current_role", "support_seek", "industries", "is_worked_with_coach", "coach_reason", "coaching_goals",], // Step 2
        ["coaching_style", "coach_comments", "engagement_type", "coach_cred_preference", "range_per_session", "coach_experience"], // Step 3
        ["notes", "ref_source", "terms_conditions"] // Step 4
    ];

    const handleNext = async () => {
        const fields = stepFields[activeStep];

        const isValid = await trigger(fields as any);
        if (!isValid) return;

        // ✅ LAST STEP → SUBMIT FORM
        if (activeStep === steps.length - 1) {
            handleSubmit(onSubmit)();
            setCompleted(true);
            return;
        }

        // ✅ NORMAL STEP → GO NEXT
        setActiveStep((prev) => prev + 1);
    };

    const steps = [
        {
            label: "Step 1", title: "Enter Your Basic Information", content:
                <Grid container spacing={4} className="mt-5" >
                    <Container maxWidth="md">
                        <Grid size={{ xs: 12, md: 12 }} >

                            {/* Left Side Inputs */}
                            <Box className="formLeft">
                                <Box className="formGroup"><InputText name="first_name" label="What is your first name" placeholder="What is your first name" variant="labeled" control={control} errors={errors} required /></Box>
                                <Box className="formGroup"><InputText name="middle_name" label="What is your middle name" placeholder="What is your middle name" variant="labeled" control={control} errors={errors} /></Box>
                                <Box className="formGroup"><InputText name="last_name" label="What is your last name" placeholder="What is your last name" variant="labeled" control={control} errors={errors} required /></Box>
                                <Box className="formGroup"><InputText name="email" label="What is your email address" placeholder="Enter email" variant="labeled" control={control} errors={errors} required /></Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 2 }}>
                                        {/* <CountryCode control={control} errors={errors} /> */}
                                        <CountryCode name="country_code"
                                            label="Code" placeholder="+1" variant="labeled"
                                            control={control} errors={errors} options={countryOptions}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 10 }}>
                                        <InputNumber name="mobile" label="What is your phone number" placeholder="What is your phone number" control={control} errors={errors} variant="labeled"
                                        />
                                    </Grid>
                                </Grid>
                                {/* <Box className="formGroup"><InputText name="city" label="City" placeholder="Enter City" variant="labeled" control={control} errors={errors} /></Box> */}
                                <Box className="formGroup"><InputText name="linked_in_url" label="Please share your linkedIn Profile " placeholder="Enter url" variant="labeled" control={control} errors={errors} required /></Box>
                                <Box className="formGroup"><InputText name="website_url" label="Please share your website or another link that gives us a sense of your work." placeholder="Enter url" variant="labeled" control={control} errors={errors} /></Box>
                                <Box className="formGroup"><InputAutoComplete name="time_zone" label="Which time zone are you in" required placeholder="Select Timezone" variant="labeled" control={control} errors={errors} options={TIMEZONES} /></Box>
                            </Box>
                        </Grid>
                    </Container>
                </Grid>
        },
        {
            label: "Step 2", title: "Role and Coaching Goals", content:
                <Grid container spacing={4} className="formContent mt-5">
                    <Container maxWidth="md">
                        <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>

                            {/* Left Side Inputs */}
                            <Box className="formLeft">
                                <Box className="formGroup"><InputText name="current_role" label="What is your current role" placeholder="Type here" variant="labeled" control={control} errors={errors} required /></Box>
                                <Box className="formGroup"><InputRadio name="support_seek" label="What best describes your current career or leadership level?" control={control} errors={errors} options={leadershipLevels} showOtherField required /></Box>
                                <Box className="formGroup"><InputCheckbox name="industries" label=" Which industry or industries do you work in?" control={control} errors={errors} options={industry} required multiple showOtherField /></Box>
                                <Box className="formGroup"><InputRadio name="is_worked_with_coach" label="Have you worked with a coach before?" control={control} errors={errors} options={DEFAULT_RADIO_OPTIONS} required /></Box>
                                {isWorkedWithCoach === 1 && (<Box className="formGroup"><InputTextArea name="work_reason" label="If yes, what worked well and what didn't??" placeholder="Type here" variant="labeled" control={control} errors={errors} /></Box>)}
                                <Box className="formGroup"><InputTextArea name="coach_reason" label="What brings you to coaching now, and what prompted you to seek support at this moment?" placeholder="Type here" variant="labeled" control={control} errors={errors} required /></Box>
                                <Box className="formGroup"><InputCheckbox name="coaching_goals" label="What are your primary coaching goals ?" control={control} errors={errors} options={COACHING_GOALS_OPTIONS} required multiple showOtherField /></Box>
                                <Box className="formGroup"><InputRadio name="urgency" label="When are you hoping to begin coaching" control={control} errors={errors} options={URGENCY_OPTIONS} /></Box>
                            </Box>
                        </Grid>
                    </Container>

                    {/* Right Side Inputs */}
                    <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 3 }}>

                    </Grid>
                </Grid>
        },
        {
            label: "Step 3", title: "Working Style and Logistics", content:
                <Grid container spacing={4} className="formContent mt-5">
                    <Container maxWidth="md">
                        <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>

                            {/* Left Side Inputs */}
                            <Box className="formLeft">
                                <Box className="formGroup"><InputCheckbox name="coaching_style" label="What coaching styles or approaches tend to work for you" control={control} errors={errors} options={WORKING_STYLE_OPTIONS} multiple required showOtherField /></Box>
                                {/* <Box className="formGroup"><InputRadio name="motivation_history" label="Motivation in Coaching" control={control} errors={errors} options={MOTIVATION_OPTIONS} required /></Box> */}
                                <Box className="formGroup"><InputTextArea name="coach_comments" label="Any coaching styles or approaches that don't work for you?" placeholder="Type here" variant="labeled" control={control} errors={errors} /></Box>
                                <Box className="formGroup"><InputRadio name="coach_experience" label="How much coaching experience feels right for the coach you want to work with?" control={control} errors={errors} options={PREFERRED_COACH_OPTIONS} required /></Box>
                                <Box className="formGroup"><InputRadio name="coach_cred_preference" label="Do you prefer a coach with formal coaching credentials?" control={control} errors={errors} options={DEFAULT_RADIO_OPTIONS} required /></Box>
                                {(isCoachCredPreference == 1) && (<Box className="formGroup"><InputCheckbox name="coaching_credentials" label="Which coaching credentials do you prefer your coach to have?" control={control} errors={errors} options={COACH_CREDENTIALS_OPTIONS} multiple /></Box>)}
                                <Box className="formGroup"><InputRadio name="engagement_type" label="What type of coaching engagement are you looking for?" control={control} errors={errors} options={ENGAGEMENT_OPTIONS} required /></Box>
                                {(engagementType == 4) && (<Box className="formGroup"><InputText name="other_engagement_type" label="Please specify other engagement type" placeholder="Type here" variant="labeled" control={control} errors={errors} /></Box>)}
                                {/* <Box className="formGroup"><InputCheckbox name="range_per_session" label="What is your budget range per coaching session?" control={control} errors={errors} options={BUDGET_OPTIONS} required multiple /></Box> */}
                                <InputRadio
                                    name="range_per_session"
                                    label="What is your budget range per coaching session?"
                                    control={control}
                                    errors={errors}
                                    options={BUDGET_OPTIONS}
                                    required
                                />


                            </Box>
                        </Grid>
                    </Container>
                </Grid>
        },
        {
            label: "Step 4", title: "Fit and Boundaries", content:
                <Grid container spacing={4} className="formContent mt-5">
                    <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>
                        <Container maxWidth="md">
                            <Box className="formLeft">
                                {/* <Box className="formGroup"><InputCheckbox name="not_discuss_topics" label="Topics You Don't Want to Discuss?" control={control} errors={errors} options={TOPIC_OPTIONS} required multiple /></Box> */}
                                <Box className="formGroup"><InputRadio name="ref_source" label="Where did you first learn about Alefitt" control={control} errors={errors} options={REFERRAL_SOURCE_OPTIONS} /></Box>
                                <Box className="formGroup">
                                    <InputTextArea name="notes" label="Is there anything else you’d like to share?" placeholder="Type Here..." variant="labeled" control={control} errors={errors} />
                                </Box>                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <InputCheckbox name="terms_conditions" control={control} errors={errors} options={terms} required />
                                    <Link component="button" variant="body2" onClick={() => setTermsOpen(true)}>
                                    </Link>
                                </Box>                            </Box>
                        </Container>

                        {/* Left Side Inputs */}
                    </Grid>
                </Grid>
        },
    ];
    return (
        <>
            {/* <Grid size={12} {...({} as any)} > */}
            {isSubmitting && <Loader />}
            <Box className="p-4 mb-3 text-start" >
                <Box className={styles.container}>
                    <Box className=" row align-items-center">

                        <Box className="col-2">
                            <img src={logo} alt="Logo" className={styles.logo} />
                        </Box>

                        <Box className="col-8 text-center">
                            <Typography variant="h4" color="black">
                                Client Registration Form
                            </Typography>
                        </Box>

                        <Box className="col-2" />
                    </Box>


                </Box>

                <form onSubmit={handleSubmit(onSubmit)}  >
                    <Stepper
                        steps={steps}
                        activeStep={activeStep}
                        onNext={handleNext}
                        onBack={() => setActiveStep((prev) => prev - 1)}
                        completed={completed}
                    />
                </form>
            </Box>
            <ToastMessage autoHideMs={toast.autoHide} open={toast.open} message={toast.message} severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })} />
            <Dialog
                open={successOpen}
                buttonPostion="center"
                content={
                    <Box className={styles.successDialogContent}>
                        <TickLoader />
                        <Typography className={styles.successText}>
                            {successMessage || "Operation successful."}
                        </Typography>
                    </Box>
                }
                buttons={[
                    {
                        label: "OK",
                        variant: "contained",
                        color: "primary",
                        onClick: () => {
                            setSuccessOpen(false);
                            if (successAction === "login") {
                                navigate("/auth/login", { replace: true });
                            }
                        },
                    },
                ]}
            />
            <Dialog
                open={termsOpen}
                title="Terms & Conditions"
                component={
                    termsLoading ? (
                        <Box className="d-flex justify-content-center p-4"><CircularProgress /></Box>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: termsDialogBody || "<p>No terms available.</p>" }} />
                    )
                }
                buttons={[
                    {
                        label: 'Close',
                        onClick: () => {
                            setTermsOpen(false);
                            setValue("terms_conditions", false);
                        },
                    },
                    {
                        label: 'I Agree',
                        variant: 'contained',
                        color: 'primary',
                        onClick: () => {
                            setTermsAgreed(true);
                            setTermsOpen(false);
                        },
                    },
                ]}
                onClose={() => {
                    setTermsOpen(false);
                    if (!termsAgreed) {
                        setValue("terms_conditions", false);
                    }
                }}
            />
            {/* </Grid> */}
        </>
    );

}

export default Register

