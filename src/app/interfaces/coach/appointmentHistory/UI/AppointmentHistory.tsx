import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, useTheme, Grid, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import VideoCallIcon from '@mui/icons-material/VideoCall';

// Import Files
import { useGetAppointmentHistoryQuery, useLazyGetAppointmentHistoryByIdQuery, useCancelAppointmentMutation } from "../service/appointmentHistoryservice";
import { appointmentFilter } from "../../../../../shared/constant";
import { formatDate } from "../../../../../shared/dateFormat";
import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import InputText from "../../../../../shared/components/formFields/InputText";
import InputSelect from "../../../../../shared/components/formFields/InputSelect";
import Button from "../../../../../shared/components/button/Button";
import Dialog from "../../../../../shared/components/dialog/Dialog";
import InputTextArea from "../../../../../shared/components/formFields/InputTextArea";
// import { AppointmentForm } from "../../../client/appointment/UI/AppointmentForm";
import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import { DyteMeeting, provideDyteDesignSystem } from "@dytesdk/react-ui-kit";
// import AlefittLogo from "../../../../../assets/images/logo.webp";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";

interface appointmentTypeProps {
    type?: "Upcoming" | "Past" | "FromCoachProfile"
}

const cancelSchema = yup.object().shape({
    cancel_reason: yup.string().required("Cancellation reason is required").trim(),
});

export default function AppointmentHistory({ type }: appointmentTypeProps) {
    const theme: any = useTheme();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [appliedFilters, setAppliedFilters] = useState<any>({ search: "", filter: 0 });
    const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
    const [meetingToken, setMeetingToken] = useState<string | null>(null);
    const [meeting, initMeeting] = useDyteClient();
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
        open: false,
        message: "",
        severity: "info"
    });
    const goto = useNavigate();

    useEffect(() => {
        provideDyteDesignSystem(document.body, {
            theme: "light",
            colors: {
                brand: {
                    300: "#2ccfc4",
                    500: "#0e9f87",
                    700: "#08671e",
                },
                danger: "#dc3636",
                success: "#08671e",
                warning: "#ff9800",
            },
        });
    }, []);

    const [cancelAppointmentMutation] = useCancelAppointmentMutation();
    const [getAppointmentDetails, { data: appointmentDetail }] = useLazyGetAppointmentHistoryByIdQuery();
    const { data, isLoading, refetch } = useGetAppointmentHistoryQuery({
        page, limit: itemsPerPage, search: appliedFilters.search, appointment_filter: appliedFilters.filter !== 0 ? appliedFilters.filter : type === "Upcoming" ? 1 : 2,
    });

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            search: "",
            filter: 0
        }
    });

    const {
        handleSubmit: handleCancelSubmit,
        control: cancelControl,
        reset: resetCancelForm,
        formState: { errors: cancelErrors }
    } = useForm({
        resolver: yupResolver(cancelSchema),
        defaultValues: {
            cancel_reason: ""
        }
    });

    //to view the appoint detail
    const viewappointmentDetails = (row: any) => {
        setOpenDialog(true);
        if (row?.id) {
            getAppointmentDetails(row.id);
        }
    };

    //Handle change page
    const handlePageChange = (newPage: number, newItemsPerPage?: number) => {
        setPage(newPage);
        if (newItemsPerPage) {
            setItemsPerPage(newItemsPerPage);
            setPage(1);
        }
    };

    //to search the data
    const searchTableData = (data: any) => {
        setPage(1);
        setSearch(data.search);
        setFilter(data.filter);
        setAppliedFilters({
            search: data.search,
            filter: data.filter
        });
    };

    // to reset the table
    const resetTableData = () => {
        setPage(1);
        setSearch("");
        setFilter(0);
        reset({ search: "", filter: 0 });
        setAppliedFilters({
            search: "",
            filter: 0
        });
    };

    useEffect(() => {
        if (meeting) {
            console.warn("Dyte Meeting object updated:", meeting);
        }
    }, [meeting]);

    useEffect(() => {
        if (meeting) {
            console.warn("Dyte Meeting Status:", meeting.self?.roomState);
            // Automatically close the meeting overlay when the user leaves or the meeting ends
            if (meeting.self?.roomState === 'left' || meeting.self?.roomState === 'ended') {
                setMeetingToken(null);
            }
        }
    }, [meeting, meeting?.self?.roomState]);

    const rescheduleAppointment = (row: any) => {
        setSelectedAppointment(row);
        setOpenRescheduleDialog(true);
    }

    const cancelAppointment = (row: any) => {
        setSelectedAppointment(row);
        resetCancelForm({ cancel_reason: "" });
        setOpenCancelDialog(true);
    }
    const handleJoinMeeting = (row: any) => {
        let token = row.meeting_token || row.authToken || (row.meetingData && row.meetingData.authToken);

        // If token is missing but meeting_link is present, extract from URL
        if (!token && row.meeting_link) {
            try {
                const url = new URL(row.meeting_link);
                token = url.searchParams.get("authToken");
            } catch (e) {
                console.error("Invalid meeting_link URL:", row.meeting_link);
            }
        }

        // If the token itself is a URL (e.g. pasted into the test prompt), extract authToken from it
        if (token && (token.startsWith("http") || token.includes("?authToken="))) {
            try {
                const url = new URL(token.startsWith("http") ? token : `http://dummy.com/${token}`);
                const extracted = url.searchParams.get("authToken");
                if (extracted) token = extracted;
            } catch (e) {
                // Not a valid URL, keep as is
            }
        }

        if (token) {
            setMeetingToken(token);
            try {
                initMeeting({
                    authToken: token,
                    defaults: {
                        audio: false,
                        video: false,
                    },
                });
            } catch (err) {
                console.error("Failed to init meeting:", err);
                setToast({ open: true, message: "Could not initialize meeting. Check your token.", severity: "error" });
            }
        } else {
            setToast({ open: true, message: "Meeting link or token not available for this appointment.", severity: "error" });
        }
    };

    const confirmCancel = async (formData: any) => {
        if (selectedAppointment?.id) {
            const data = {
                cancel_reason: formData.cancel_reason
            }
            const cancelAppointmentResponse = await cancelAppointmentMutation({ id: selectedAppointment.id, data });
            if (cancelAppointmentResponse?.data) {
                setOpenCancelDialog(false);
                resetCancelForm();
                refetch();
            }
        }
    }

    const actions = [
        {
            icon: <CalendarMonthIcon fontSize="small" />,
            tooltip: "Reschedule Appointment",
            color: "warning",
            onClick: rescheduleAppointment,
        },
        {
            icon: <ClearIcon fontSize="small" />,
            tooltip: "Cancel Appointment",
            color: "error",
            onClick: cancelAppointment,
        },
        {
            icon: <VideoCallIcon fontSize="small" />,
            tooltip: "Join Meeting",
            color: "primary",
            onClick: handleJoinMeeting,
        }
    ];

    const tableData = data?.items?.map((row: any) => ({
        ...row,
        startDate: row.start_date ? formatDate(row.start_date) : "-",
        endDate: row.end_date ? formatDate(row.end_date) : "-",
        client: row.client?.first_name + " " + row.client?.last_name,
        startTime: row.start_time,
        endTime: row.end_time,
        status: row.status === 1 ? "Schedule" : row.status === 2 ? "Completed" : row.status == 3 ? "Cancelled" : row.status == 4 ? "Rescheduled" : row.status == 5 ? "Pending" : "Rejected",
    })) || [];

    const columns = ["Client Name", "Date", "Start Time", "End Time", "Status"];
    const keys = ["client", "startDate", "startTime", "endTime", "status"];

    //to get the table status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Schedule":
                return theme.palette.statusSchedule.main;
            case "Completed":
                return theme.palette.success.main;
            case "Cancelled":
                return theme.palette.error.main;
            case "Rescheduled":
                return theme.palette.statusRescheduled.main;
            case "Pending":
                return theme.palette.statusPending.main;
            case "Rejected":
                return theme.palette.error.main;
            default:
                return theme.palette.statusRequested.main;
        }
    };

    // to show the status in the  view dialog
    const getStatus = (status: number) => {
        switch (status) {
            case 1:
                return "Schedule";
            case 2:
                return "Completed";
            case 3:
                return "Cancelled";
            case 4:
                return "Rescheduled";
            case 5:
                return "Pending";
            case 6:
                return "Rejected";
            default:
                return "Requested";
        }
    };

    const cellStyles = {
        status: (row: any) => ({
            color: getStatusColor(row.status),
            fontWeight: "bold"
        })
    };

    if (meetingToken && meeting) {
        console.log("DEBUG: Rendering overlay. Status:", meeting.self?.roomState);
        return (
            <Box sx={{
                height: '100vh',
                width: '100vw',
                bgcolor: '#fff',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                border: '5px solid red', // VISUAL DEBUG
            }}>
                <Typography variant="h6" sx={{ bgcolor: 'red', color: 'white', textAlign: 'center' }}>
                    Dyte Meeting (Status: {meeting.self?.roomState || 'initializing'})
                </Typography>
                <DyteProvider value={meeting}>
                    <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                        <DyteMeeting
                            meeting={meeting}
                        />
                    </Box>
                    {meeting.self?.roomState !== 'joined' && (
                        <Box sx={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderTop: '1px solid #ddd' }}>
                            <Button variant="contained" color="error" onClick={() => setMeetingToken(null)}>
                                Close / Leave
                            </Button>
                        </Box>
                    )}
                </DyteProvider>
            </Box>
        );
    }

    return (
        <>

            {/* Table */}
            <Table columns={columns} actions={actions} keys={keys} rows={tableData} loading={isLoading} cellStyles={cellStyles} onRowClick={viewappointmentDetails}
                component={
                    <form onSubmit={handleSubmit(searchTableData)} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        {(type === "FromCoachProfile") && (<InputSelect name="filter" label="Filter" control={control} options={appointmentFilter}
                            value={filter} onChange={(val: any) => setFilter(val)} placeholder={""} />)}
                        <InputText name="search" label="Search" placeholder="Search by client" control={control} value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                        <Button size='large' type="submit"><SearchIcon /></Button>
                        <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                    </form>
                }
                pagination={
                    <Pagination totalItems={data?.totalCount || 0} itemsPerPage={itemsPerPage} page={page} onPageChange={handlePageChange} />
                }
            />

            {/* view appointment details  */}
            <Dialog open={openDialog} title="View Appointment"
                content={
                    <Grid size={{ xs: 12, lg: 8 }} order={2} className="profileCard" sx={{ alignItems: 'flex-start !important' }}>
                        <Typography className="profileRow">
                            <span className="clientLabel">Coach Name</span>
                            <span className="colon">:</span>
                            <span className="clientValue">{appointmentDetail?.coach?.first_name + " " + appointmentDetail?.coach?.last_name || "—"}</span>
                        </Typography>
                        <Typography className="profileRow">
                            <span className="clientLabel">Status</span>
                            <span className="colon">:</span>
                            <span className="clientValue chip">{getStatus(appointmentDetail?.status) || "—"}</span>
                        </Typography>
                        <Typography className="profileRow">
                            <span className="clientLabel">Date</span>
                            <span className="colon">:</span>
                            <span className="clientValue">{formatDate(appointmentDetail?.start_date) || "—"}</span>
                        </Typography>
                        <Typography className="profileRow">
                            <span className="clientLabel">Slot</span>
                            <span className="colon">:</span>
                            <span className="clientValue">{appointmentDetail?.start_time || "—"}</span>
                        </Typography>
                        <Typography className="profileRow">
                            <span className="clientLabel">Note</span>
                            <span className="colon">:</span>
                            <span className="clientValue">{appointmentDetail?.client_notes || "—"}</span>
                        </Typography>
                    </Grid>
                }
                buttons={[
                    { label: "Close", variant: "outlined", onClick: () => setOpenDialog(false) },
                ]}
            />

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={openCancelDialog}
                title="Cancel Appointment"
                content={
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body1"> Are You sure you want to cancel the appointment?</Typography>
                            {selectedAppointment?.meeting_type === "recurring" && (
                                <Typography variant="body1"> Are you want to cancel this appointment only or all recurring appointments?</Typography>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                            <InputTextArea
                                name="cancel_reason"
                                label="Cancellation Reason"
                                placeholder="Enter reason for cancellation"
                                control={cancelControl}
                                errors={cancelErrors}
                            />
                        </Grid>
                    </Grid>
                }
                buttons={[
                    { label: "No, Keep it", variant: "outlined", onClick: () => { setOpenCancelDialog(false); resetCancelForm(); } },
                    { label: "Yes", variant: "contained", color: "error", onClick: handleCancelSubmit(confirmCancel) }
                ]}
            />

            {/* Reschedule Dialog */}
            <Dialog
                open={openRescheduleDialog}
            // title="Reschedule Appointment"
            // onClose={() => setOpenRescheduleDialog(false)}
            // component={
            //     // <AppointmentForm
            //     //     appointmentId={selectedAppointment?.id}
            //     //     mode="reschedule"
            //     //     onSuccess={() => {
            //     //         setOpenRescheduleDialog(false);
            //     //         refetch();
            //     //     }}
            //     // />
            // }
            />

            <ToastMessage
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
            />
        </>
    );
}