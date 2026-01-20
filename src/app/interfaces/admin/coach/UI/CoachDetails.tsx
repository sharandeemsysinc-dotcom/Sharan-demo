// Import Packages
import { Box, Paper, Typography } from "@mui/material"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

// Import Icons
import BackIcon from '@mui/icons-material/Reply'

// Import Files
import Tabs from "../../../../../shared/components/tabs/Tabs"
import { selectCurrentScope } from "../../../../stores/authSlice"
import { CoachProfile } from "./CoachProfile"
import { AppointmentHistory } from "../../../coach/appointmentHistory"
import { ClientEvaluation, PaymentHistory } from "../../client"
import { SubscriptionHistory } from "../../subscriptionHistory"
import { CoachEvaluation } from "./CoachEvaluation"
// import { CoachClient } from "./CoachClient"

export const CoachDetails = () => {
    const navigate = useNavigate();
    const { page } = useParams();
    const location = useLocation();
    const scope = useSelector(selectCurrentScope);

    // Navigate Back to Table
    const goBack = () => {
        if (page === "fromMapCoach") {
            navigate(`/${scope.toLowerCase()}/mapCoach/details/${location.state.requestId}`);
        } else if (page === "pending" || page === "rejected") {
            navigate("/" + scope.toLowerCase() + "/approveCoach");
        } else {
            navigate("/" + scope.toLowerCase() + "/coach");
        }
    }

    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Coach Management
                    </Typography>
                    <Typography variant="body2">View Coach Details</Typography>
                </Box>
            </Box>

            {/* Body */}
            <Paper elevation={3} className="p-3">
                <Tabs
                    tabs={[
                        { label: "Profile", content: <CoachProfile /> },
                        { label: "Appointment History", content: <AppointmentHistory type="FromCoachProfile" /> },
                        { label: "Payment History", content: <PaymentHistory type="FromCoachProfile" /> },
                        { label: "Subscription History", content: <SubscriptionHistory type="FromCoachProfile" /> },
                        { label: "Coach Evaluation", content: <CoachEvaluation /> },
                        { label: "Client Evaluation", content: <ClientEvaluation /> },
                        // { label: "Client", content: <CoachClient /> }
                    ].filter((tab) => (page === "fromMapCoach") ? tab.label === "Profile" :
                        (page === "fromProfile") ? tab.label !== "Client Evaluation" : true)}
                />
            </Paper>
        </>
    )
}