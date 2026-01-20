// Import Packages
import { Box, Grid, Paper, Typography } from "@mui/material"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

// Import Images
import profileImg from '../../../../../assets/images/defaultImages/profileImg.webp'

// Import Icons
import BackIcon from '@mui/icons-material/Reply';
import EditIcon from "@mui/icons-material/Edit"

// Import Files
import { defaultRadio, urgency, workingSpectrum, motivation, engagement, preferredCoach } from "../../../../../shared/constant";
import { useGetClientByIdMutation } from "../service/Client"
import { AppointmentHistory } from "../../../coach/appointmentHistory";
import { selectCurrentScope } from "../../../../stores/authSlice";
import Card from "../../../../../shared/components/card/Card"
import UserAvatar from "../../../../../shared/components/avatar/Avatar"
import Loader from "../../../../../shared/components/loader/Loader"
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage"
import Tabs from "../../../../../shared/components/tabs/Tabs"
import Button from "../../../../../shared/components/button/Button";

export const ClientDetails = () => {
    const navigate = useNavigate();
    const location: any = useLocation();
    const { id } = useParams();
    const scope = useSelector(selectCurrentScope);
    const [imageUrl, setImageUrl] = useState('');
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });
    const [getClientById, { data: clientDetails, isSuccess, isLoading: clientDetailsLoading }] = useGetClientByIdMutation();

    useEffect(() => {
        if (id) {
            getClientById({ 'client_id': id });
        }
    }, [id]);

    // Call get client by id api initially
    useEffect(() => {
        if (id && isSuccess && clientDetails?.data) {
            (clientDetails?.data?.client?.profile_image != null) ? setImageUrl(clientDetails?.data?.client?.profile_image) : setImageUrl(profileImg);
        }
    }, [id, clientDetails, isSuccess]);

    // Data modification for clienting hours
    const modifiedCoachDetails = (clientDetails?.data) ? {
        ...clientDetails?.data?.client,
        ...clientDetails?.data?.client?.client_history,
        is_worked_with_coach: defaultRadio.find(h => Number(h.value) === clientDetails?.data?.client?.client_history?.is_worked_with_coach)?.label || "",
        urgency: urgency.find(h => h.value === clientDetails?.data?.client?.client_history?.urgency)?.label || "",
        working_style: workingSpectrum.find(h => h.value === clientDetails?.data?.client?.client_history?.working_style)?.label || "",
        motivation_history: motivation.find(h => h.value === clientDetails?.data?.client?.client_history?.motivation_history)?.label || "",
        engagement_type: engagement.find(h => h.value === clientDetails?.data?.client?.client_history?.engagement_type)?.label || "",
        coach_experience: preferredCoach.find(h => h.value === clientDetails?.data?.client?.client_history?.coach_experience)?.label || ""
    } : null;

    let clientBasicInformations = [
        { label: "First Name", Value: modifiedCoachDetails?.first_name },
        { label: "Middle  Name", Value: modifiedCoachDetails?.middle_name },
        { label: "Last Name", Value: modifiedCoachDetails?.last_name },
        { label: "Email", Value: modifiedCoachDetails?.email },
        { label: "Phone Number", Value: modifiedCoachDetails?.mobile },
        { label: "LinkedIn Profile", Value: modifiedCoachDetails?.linked_in_url, link: true },
        { label: "Website / Portfolio", Value: modifiedCoachDetails?.website_url, link: true },
        { label: "Time Zone", Value: modifiedCoachDetails?.time_zone }
    ]

    let clientOtherInformations = [
        {
            title: 'Role & Coaching Goals',
            key: [
                { label: "Current Role", Value: modifiedCoachDetails?.current_role },
                { label: "Leadership Level", Value: modifiedCoachDetails?.industries, other: !!modifiedCoachDetails?.other_industries, otherValue: modifiedCoachDetails?.other_industries },
                { label: "Industries", Value: modifiedCoachDetails?.industries, other: !!modifiedCoachDetails?.other_industries, otherValue: modifiedCoachDetails?.other_industries },
                { label: "Have Worked with Coach", Value: modifiedCoachDetails?.is_worked_with_coach },
                // CONDITIONALLY INCLUDE
                ...(modifiedCoachDetails?.is_worked_with_coach === 'Yes'
                    ? [
                        {
                            label: "What Worked Well and What Didn't",
                            Value: modifiedCoachDetails?.work_reason
                        }
                    ]
                    : []),
                { label: "Reason for Seeking Coaching", Value: modifiedCoachDetails?.coach_reason },
                { label: "Coaching Goals", Value: modifiedCoachDetails?.coach_area, other: !!modifiedCoachDetails?.other_area, otherValue: modifiedCoachDetails?.other_area },
                { label: "Preferred Coaching Start Date", Value: modifiedCoachDetails?.urgency }
            ]
        }, {
            title: 'Style & Preferences',
            key: [
                { label: "Coaching Style / Approach that Works", Value: modifiedCoachDetails?.working_style },
                { label: "Coaching Style / Approaches that Don't Works", Value: modifiedCoachDetails?.working_style },
                { label: "Preferred Coach Experience Level", Value: modifiedCoachDetails?.coach_experience },
                { label: "Coaching Credentials Preference", Value: modifiedCoachDetails?.coaching_credentials },
                { label: "Coaching Credentials", Value: modifiedCoachDetails?.coaching_credentials, other: !!modifiedCoachDetails?.other_area, otherValue: modifiedCoachDetails?.other_area },
                { label: "Type of Engagement", Value: modifiedCoachDetails?.engagement_type, other: !!modifiedCoachDetails?.other_area, otherValue: modifiedCoachDetails?.other_area },
            ]
        }, {
            title: 'Referral & Notes',
            key: [
                { label: "Prefered Budget", Value: modifiedCoachDetails?.range_per_session },
                { label: "Referral Source", Value: modifiedCoachDetails?.ref_source, other: !!modifiedCoachDetails?.other_area, otherValue: modifiedCoachDetails?.other_area },
                { label: "Additional Comments", Value: clientDetails?.data?.client?.notes },
            ]
        }
    ]

    // Navigate Back to Table
    const goBack = () => {
        if (location.state?.from === 'map-coach' && location.state?.requestId) {
            navigate(`/${scope.toLowerCase()}/mapCoach/details/${location.state.requestId}`);
        } else {
            navigate("/" + scope.toLowerCase() + "/client");
        }
    }

    // Navigate to Form Page to update data
    const editClient = (index: any) => navigate("/admin/client/form/" + index);

    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Client Management
                    </Typography>
                    <Typography variant="body2" >View Client Details</Typography>
                </Box>
            </Box>

            {/* Profile Body */}
            <Paper elevation={3} className="p-3">
                <Tabs
                    tabs={[
                        {
                            label: "Profile", content: <Box>{clientDetailsLoading ? <Loader /> : (
                                <Box className="bodyContainer">
                                    <Grid container spacing={4} className="profileContainer">
                                        <Grid size={12}>
                                            <Card isGreenCard className="cardPadding" >
                                                <Typography variant="h6" color="white" className="profileCardTitle d-flex justify-content-between">Basic Information
                                                    {scope !== "Admin" &&
                                                        <Button variant="text" color="white" onClick={() => editClient(0)}>
                                                            <EditIcon fontSize="small" />
                                                        </Button>
                                                    }
                                                </Typography>

                                                <Grid container>
                                                    <Grid size={{ xs: 12, lg: 8 }} order={{ xs: 2, lg: 1 }} className="profileCard" >
                                                        {clientBasicInformations.map((item, index) => (
                                                            <Typography key={index} className="profileRow">
                                                                <span className="clientLabel">{item.label}</span>
                                                                <span className="colon">:</span>
                                                                {item.link === true && item.Value ? (
                                                                    <a href={item.Value} target="_blank" rel="noopener noreferrer" className="clientValue link">{item.Value}</a>
                                                                ) : (
                                                                    <span className="clientValue">{item.Value || "-"}</span>
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
                                            {clientOtherInformations.map((section, index) => (
                                                <Card isGreenCard className="cardPadding mb-4" >
                                                    <Typography variant="h6" color="white" className="profileCardTitle d-flex justify-content-between">{section.title}
                                                        {scope === "Client" &&
                                                            <Button variant="text" color="white" onClick={() => editClient(index + 1)}>
                                                                <EditIcon fontSize="small" />
                                                            </Button>
                                                        }
                                                    </Typography>

                                                    <Box className="profileCard">
                                                        {section.key.map((item, index) => (
                                                            <Typography key={index} className="fullSizeRow">
                                                                <span className="clientLabel">{item.label}</span>
                                                                <span className="colon">:</span>
                                                                {Array.isArray(item.Value) ? (
                                                                    <Box className="d-flex flex-wrap gap-2">
                                                                        {item.Value.map((v: string, i: number) => (
                                                                            <Typography className="chip" key={i} >{v || "-"}</Typography>
                                                                        ))}
                                                                        {item.other && <Typography className="chip">{item.otherValue}</Typography>}
                                                                    </Box>
                                                                ) : (
                                                                    <span className="clientValue">{item.Value || "-"}</span>
                                                                )}
                                                            </Typography>
                                                        ))}
                                                    </Box>

                                                </Card>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                            </Box>
                        },
                        { label: "Appointment History", content: <AppointmentHistory /> },
                    ]}
                />
            </Paper>

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity}
                onClose={() => { setToast({ ...toast, open: false }) }}
            />
        </>
    )
}