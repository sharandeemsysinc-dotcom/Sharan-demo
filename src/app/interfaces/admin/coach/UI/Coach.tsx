// Import Packages
import { Box, Paper, Typography } from "@mui/material";

// Import Files
import Tabs from "../../../../../shared/components/tabs/Tabs";
import { CoachTypes } from "./CoachTypes";

export const Coach = () => {
    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">Coach Management</Typography>
                    <Typography variant="body2">View and manage approved, pending and rejected coaches</Typography>
                </Box>
            </Box>

            {/* Body */}
            <Paper elevation={3} className="p-3">
                <Tabs
                    tabs={[
                        { label: "Approved", content: <CoachTypes type="Approved" /> },
                        { label: "Pending", content: <CoachTypes type="Pending" /> },
                        { label: "Inactive", content: <CoachTypes type="Inactive" /> }
                    ]}
                />
            </Paper>
        </>
    );
}
