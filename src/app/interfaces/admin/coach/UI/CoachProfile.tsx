// Import Packages
import { Box, Grid, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

// Import Images
import profileImg from '../../../../../assets/images/defaultImages/profileImg.webp'

// Import Icons
import FileIcon from '@mui/icons-material/DescriptionOutlined';
import EditIcon from '@mui/icons-material/Edit';

// Import Files
import { useApproveRejectCoachMutation, useGetCoachByIdMutation } from "../service/Coach"
import { coachingHours } from "../../../../../shared/constant";
import { selectCurrentScope } from "../../../../stores/authSlice";
import Button from "../../../../../shared/components/button/Button"
import Card from "../../../../../shared/components/card/Card"
import UserAvatar from "../../../../../shared/components/avatar/Avatar"
import Loader from "../../../../../shared/components/loader/Loader"
import Dialog from "../../../../../shared/components/dialog/Dialog"
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage"
import InputTextArea from "../../../../../shared/components/formFields/InputTextArea"
import InputNumber from "../../../../../shared/components/formFields/InputNumber"
import { useSelector } from "react-redux";

interface CoachInfoItem {
    label: string;
    value?: string | string[] | any | null;
    other?: boolean;
    otherValue?: string | null;
    file?: boolean;
    fileName?: string;
}

export const CoachProfile = () => {
    const navigate = useNavigate();
    const { id, page } = useParams();
    const scope = useSelector(selectCurrentScope);

    const [imageUrl, setImageUrl] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [months, setMonths] = useState(0);
    const [discountPercentageAnnual, setDiscountPercentageAnnual] = useState(0);
    const [monthsAnnual, setMonthsAnnual] = useState(0);
    const [comments, setComments] = useState("");
    const [rejectReason, setRejectReason] = useState('');
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [dialogType, setDialogType] = useState("");
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });
    const [errors, setErrors] = useState<{ [k: string]: string | null }>({});

    const [getCoachById, { data: coachDetails, isSuccess, isLoading: coachDetailsLoading }] = useGetCoachByIdMutation();
    const [approveReject] = useApproveRejectCoachMutation();

    useEffect(() => {
        getCoachById({ coach_id: id });
    }, [id]);

    // Call get coach by id api initially
    useEffect(() => {
        if (id && isSuccess && coachDetails?.data) {
            (coachDetails?.data?.image_url != null) ? setImageUrl(coachDetails?.data?.image_url) : setImageUrl(profileImg);
        }
    }, [id, coachDetails, isSuccess]);

    // Data modification for coaching hours
    const modifiedCoachDetails = (coachDetails?.data) ? {
        ...coachDetails.data,
        coaching_hours: coachingHours.find(h => h.value === coachDetails.data.coaching_hours)?.label || ""
    } : null;

    let coachBasicInformations = [
        { label: "First Name", value: modifiedCoachDetails?.first_name },
        { label: "Middle Name", value: modifiedCoachDetails?.middle_name },
        { label: "Last Name", value: modifiedCoachDetails?.last_name },
        { label: "Email", value: modifiedCoachDetails?.email },
        { label: "Phone Number", value: modifiedCoachDetails?.mobile },
        { label: "LinkedIn Profile", value: modifiedCoachDetails?.linked_url, link: true },
        { label: "Website / Porfolio", value: modifiedCoachDetails?.website, link: true },
        { label: "Time Zone", value: modifiedCoachDetails?.timezone }
    ]

    const certificateFiles = [
        { url: modifiedCoachDetails?.acc_upload_file, name: "ICF ACC File" },
        { url: modifiedCoachDetails?.pcc_upload_file, name: "ICF PCC File" },
        { url: modifiedCoachDetails?.mcc_upload_file, name: "ICF MCC File" },
        { url: modifiedCoachDetails?.emcc_upload_file, name: "ICF EMCC File" },
        { url: modifiedCoachDetails?.co_active_upload_file, name: "Co-Active (CTI) File" },
        { url: modifiedCoachDetails?.other_upload_file, name: "Other File" }
    ].filter(f => !!f.url);

    let coachOtherInformations: { title: string; key: CoachInfoItem[] }[] = [
        {
            title: "Credentials & Experience",
            key: [
                { label: "Coaching Credential(s)", value: modifiedCoachDetails?.coaching_credentials, other: !!modifiedCoachDetails?.other_coaching_credentials, otherValue: modifiedCoachDetails?.other_coaching_credentials },
                ...(certificateFiles.length ? [{ label: "Coaching certificates", value: certificateFiles, file: true }] : []),
                { label: "Coaching Hours", value: modifiedCoachDetails?.coaching_hours },
                { label: "Coaching Years", value: modifiedCoachDetails?.coaching_experience }
            ]
        }, {
            title: "Focus & Style",
            key: [
                { label: "Industries", value: modifiedCoachDetails?.industries, other: !!modifiedCoachDetails?.other_industries, otherValue: modifiedCoachDetails?.other_industries },
                { label: "Leadership Level(s)", value: modifiedCoachDetails?.leadership_levels },
                { label: "Areas of Coaching Expertise", value: modifiedCoachDetails?.coaching_topics },
                { label: "Coaching Style / Approaches Used", value: modifiedCoachDetails?.coaching_style, other: !!modifiedCoachDetails?.other_coaching_style, otherValue: modifiedCoachDetails?.other_coaching_style }
            ]
        }, {
            title: "Coaching Lens",
            key: [
                { label: "Coaching Philosophy", value: modifiedCoachDetails?.coaching_philosophy },
                { label: "Coaching Strengths", value: modifiedCoachDetails?.coaching_strength },
                { label: "Ideal Client", value: modifiedCoachDetails?.preferred_client },
                { label: "Clients / Situations Not a Fit", value: modifiedCoachDetails?.clients_situation, other: !!modifiedCoachDetails?.other_clients_situation, otherValue: modifiedCoachDetails?.other_clients_situation },
                { label: "Coaching boundaries", value: modifiedCoachDetails?.coaching_boundaries },
                { label: "Additional details", value: modifiedCoachDetails?.notes },
                { label: "Session Rates Accepted?", value: modifiedCoachDetails?.session_rates },
                { label: "Interest in Connecting/Collaborating with Other Coaches", value: modifiedCoachDetails?.session_rates },
                { label: "Bio", value: modifiedCoachDetails?.bio },
            ]
        }
    ]

    // validation rules for discount amount and reject reason
    const validators = {
        discount_percentage: (value: number) => {
            if (value === null || value === undefined) return "Discount percentage is required";
            if (value < 0) return "Percentage must be greater than and equal to 0";
            if (value > 100) return "Percentage cannot exceed 100";
            return "";
        },

        months: (value: number) => {
            if (value === null || value === undefined) return "Month is required";
            if (value < 0) return "Month must be greater than and equal to 0";
            if (value > 12) return "Month cannot exceed 12";
            return "";
        },

        discount_percentage_annual: (value: number) => {
            if (value === null || value === undefined) return "Discount percentage is required";
            if (value < 0) return "Percentage must be greater than and equal to 0";
            if (value > 100) return "Percentage cannot exceed 100";
            return "";
        },

        months_annual: (value: number) => {
            if (value === null || value === undefined) return "Month is required";
            if (value < 0) return "Month must be greater than and equal to 0";
            if (value > 12) return "Month cannot exceed 12";
            return "";
        },

        comments: (value: string) => {
            if (!value || value.trim() === "") return "Comment is required";
            if (value.trim().length < 10) return "Please provide at least 10 characters";
            if (value.trim().length > 150) return "Comment is too long";
            return null;
        },

        reject_reason: (value: string) => {
            if (!value || value.trim() === "") return "Reason is required";
            if (value.trim().length < 10) return "Please provide at least 10 characters";
            if (value.trim().length > 150) return "Reason is too long";
            return null;
        }
    };

    // validate a field -> reject reason, discount amount
    const validateField = (name: string, value: number) => {
        const fn = (validators as any)[name];
        if (!fn) return;
        const err = fn(value);
        setErrors((prev) => ({ ...prev, [name]: err }));
        return err;
    };

    // validate all relevant fields before approveReject API
    const validateAll = () => {
        const nextErrors: { [k: string]: string | null } = {};
        if (dialogType === "approve") {
            nextErrors.discount_percentage = validators.discount_percentage(discountPercentage);
            nextErrors.months = validators.months(months);
            nextErrors.discount_percentage_annual = validators.discount_percentage_annual(discountPercentageAnnual);
            nextErrors.months_annual = validators.months_annual(monthsAnnual);
            nextErrors.comments = validators.comments(comments);
        } else if (dialogType === "reject") {
            nextErrors.reject_reason = validators.reject_reason(rejectReason);
        }
        setErrors(nextErrors);
        return !Object.values(nextErrors).some(Boolean);
    };

    // Navigate to Form Page to update data
    const editCoach = async (index: any) => navigate("/coach/form/" + index);

    // Send Payload and call approveReject API when click approve button
    const approveCoach = async (row: any) => {
        let data = { coach_id: row.id, type: 0, discount_percentage: discountPercentage, months: months };
        approveRejectCoach(data);
    };

    // Open Approve Popup to add discount amount
    const confirmApproveCoach = async (row: any) => {
        setDialogType('approve');
        setSelectedCoach(row);
        setOpenDialog(true);
    };

    // Send Payload and call approveReject API when click reject button
    const rejectCoach = async (row: any) => {
        let data = { coach_id: row.id, type: 1, rejection_reason: rejectReason };
        approveRejectCoach(data);
    };

    // Open Reject Reason Popup
    const confirmRejectCoach = async (row: any) => {
        setDialogType('reject');
        setSelectedCoach(row);
        setOpenDialog(true);
    };

    // Call Approve / Reject API
    const approveRejectCoach = async (data: any) => {
        if (!validateAll()) return;
        try {
            const res = await approveReject(data).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
                getCoachById;
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            setOpenDialog(false);
            getCoachById;
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    }

    // Dialogue cancel button for all dialogue
    const close = () => {
        setOpenDialog(false);
        setRejectReason("");
        setDiscountPercentage(0);
        setMonths(0);
        setDiscountPercentageAnnual(0);
        setMonthsAnnual(0);
        setComments("");
        setErrors({});
    }

    return (
        <>
            {/* Profile Body */}
            {coachDetailsLoading ? <Loader /> : (
                <Box className="bodyContainer">
                    <Grid container spacing={4} className="profileContainer">
                        <Grid size={12}>
                            <Card isGreenCard className="cardPadding">
                                <Typography variant="h6" color="white" className="profileCardTitle d-flex justify-content-between">Basic Information
                                    {scope !== "Admin" &&
                                        <Button variant="text" color="white" onClick={() => editCoach(0)}>
                                            <EditIcon fontSize="small" />
                                        </Button>
                                    }
                                </Typography>
                                <Grid container>
                                    <Grid size={{ xs: 12, lg: 8 }} order={{ xs: 2, lg: 1 }} className="profileCard" >
                                        {coachBasicInformations.map((item, index) => (
                                            <Typography key={index} className="profileRow">
                                                <span className="clientLabel">{item.label}</span>
                                                <span className="colon">:</span>
                                                {item.link === true && item.value ? (
                                                    <a href={item.value} target="_blank" rel="noopener noreferrer" className="clientValue link">{item.value}</a>
                                                ) : (
                                                    <span className="clientValue">{item.value || "-"}</span>
                                                )}
                                            </Typography>
                                        ))}
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 4 }} order={{ xs: 1, lg: 2 }} className="d-flex align-items-center justify-content-center">
                                        <UserAvatar size={130} name="Profile Image" src={imageUrl} />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid size={12}>
                            {coachOtherInformations.map((section, index) => (
                                <Card isGreenCard className="cardPadding mb-4" >
                                    <Typography variant="h6" color="white" className="profileCardTitle d-flex justify-content-between">{section.title}
                                        {scope !== "Admin" &&
                                            <Button variant="text" color="white" onClick={() => editCoach(index + 1)}>
                                                <EditIcon fontSize="small" />
                                            </Button>
                                        }
                                    </Typography>
                                    <Box className="profileCard">
                                        {section.key.map((item, index) => (
                                            <Typography key={index} className="fullSizeRow">
                                                <span className="clientLabel">{item.label}</span>
                                                <span className="colon">:</span>
                                                {item.file && Array.isArray(item.value) ? (
                                                    <Box className="d-flex align-items-center flex-wrap gap-1">
                                                        {item.value.map((file: any, i: number) => (
                                                            <span key={i}>
                                                                <FileIcon fontSize="small" color="error" />
                                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="clientValue link" >
                                                                    {file.name}
                                                                </a>
                                                                {i < item.value.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </Box>
                                                ) : Array.isArray(item.value) ? (
                                                    <Box className="d-flex flex-wrap gap-2">
                                                        {item.value?.filter((v: string) => v && v.toLowerCase() !== "other")
                                                            .map((v: string, i: number) => (
                                                                <Typography className="chip" key={i}>{v}</Typography>
                                                            ))
                                                        }
                                                        {item.other && <Typography className="chip">{item.otherValue}</Typography>}
                                                    </Box>
                                                ) : (
                                                    <span className="clientValue">{item.value || "-"}</span>
                                                )}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Card>
                            ))}
                        </Grid>
                        <Grid size={12} className="d-flex justify-content-end">
                            {page === "pending" && (
                                <>
                                    <Button label="Inactive" variant="outlined" className="me-3" onClick={confirmRejectCoach} />
                                    <Button label="Approve" onClick={confirmApproveCoach} />
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Dialog Box */}
            <Dialog open={openDialog} title={dialogType === "approve" ? "Approve Coach" : (dialogType === "reject") ? "Inactive Coach" : ""}
                content={
                    dialogType === "approve" ? "Add Discount Percentage (%) and Discount Months for both Monthly and Annual Plan" :
                        dialogType === "reject" && "Are you sure you want to inactive this coach?"
                }
                component={[
                    dialogType === "approve" ? (
                        <>
                            <Box>
                                <Typography variant="body2" className="mb-2">For Monthly Plan</Typography>
                                <InputNumber name="discount_percentage" label="Discount Percentage" placeholder="Enter discount in percentage"
                                    onChange={(e) => { setDiscountPercentage(Number(e.target.value)); validateField("discount_percentage", Number(e.target.value)); }}
                                    className="mb-4" value={discountPercentage} errorMessage={errors.discount_percentage ?? ""} required />
                                <InputNumber name="months" label="Discount Months" placeholder="Enter discount months"
                                    onChange={(e) => { setMonths(Number(e.target.value)); validateField("months", Number(e.target.value)); }}
                                    value={months} errorMessage={errors.months ?? ""} required
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" className="mt-4 mb-2">For Annual Plan</Typography>
                                <InputNumber name="discount_percentage_annual" label="Discount Percentage" placeholder="Enter discount in percentage"
                                    onChange={(e) => { setDiscountPercentageAnnual(Number(e.target.value)); validateField("discount_percentage_annual", Number(e.target.value)); }}
                                    value={discountPercentageAnnual} className="mb-4" errorMessage={errors.discount_percentage_annual ?? ""} required
                                />
                                <InputNumber name="months_annual" label="Discount Months" placeholder="Enter discount months"
                                    onChange={(e) => { setMonthsAnnual(Number(e.target.value)); validateField("months_annual", Number(e.target.value)); }}
                                    value={monthsAnnual} errorMessage={errors.months_annual ?? ""} required
                                />
                            </Box>
                            <Box className="mt-4">
                                <InputTextArea name="Comments" variant="labeled" label="Comments" placeholder="Enter your comments here!"
                                    onChange={(e) => { setComments(e.target.value); validateField("comments", e.target.value); }}
                                    errorMessage={errors.comments} required />
                            </Box>
                        </>
                    ) : dialogType === "reject" && (
                        <InputTextArea name="reject_reason" label="Reason" placeholder="Enter your reason here!"
                            onChange={(e) => { setRejectReason(e.target.value); validateField("reject_reason", e.target.value); }}
                            errorMessage={errors.reject_reason} required />
                    )
                ]}
                buttons={[
                    { label: "Cancel", variant: "outlined", onClick: () => close() },
                    dialogType === "approve" ? { label: "Approve", onClick: () => approveCoach(selectedCoach) } :
                        { label: "Inactive", onClick: () => rejectCoach(selectedCoach) }
                ]}
            />

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => { setToast({ ...toast, open: false }) }} />
        </>
    )
}