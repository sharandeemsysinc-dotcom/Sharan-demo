// Import Packages
import { Box, Paper, Typography } from "@mui/material";

// Import Files
import Tabs from "../../../../../shared/components/tabs/Tabs";
import AppointmentHistory from "./AppointmentHistory";

export const AppointmentHistoyTab = () => {
    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">Appointment History</Typography>
                    <Typography variant="body2">View and manage Upcoming and Past Appointments</Typography>
                </Box>
            </Box>

            {/* Body */}
            <Paper elevation={3} className="p-3">
                <Tabs
                    tabs={[
                        { label: "Upcoming", content: <AppointmentHistory type="Upcoming" /> },
                        { label: "Past", content: <AppointmentHistory type="Past" /> },
                    ]}
                />
            </Paper>
        </>
    );
}
