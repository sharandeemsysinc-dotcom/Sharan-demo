import { useNavigate, useParams } from "react-router-dom";
import { Paper, Grid, Box, Typography } from "@mui/material";
import styles from "../mapCoach.module.scss";
import BackIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/StarRate';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useEffect, useState } from "react";

import UserAvatar from "../../../../../shared/components/avatar/Avatar";
import Card from "../../../../../shared/components/card/Card";
import Button from "../../../../../shared/components/button/Button";
import InputSelect from "../../../../../shared/components/formFields/InputSelect";
import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Loader from "../../../../../shared/components/loader/Loader";
import Dialog from "../../../../../shared/components/dialog/Dialog";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import { industry } from "../../../../../shared/constant";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

import { useMapcilenttoCoachMutation, useGetAssignedCoachToClientMutation, useAssignCoachToClientMutation, useUnassignCoachToClientMutation } from "../services/mapCoach";
import { useGetClientByIdMutation } from "../../client/service/Client";
import clientCss from "../../client/Client.module.scss";
import theme from "../../../../../theme";
import InputText from "../../../../../shared/components/formFields/InputText";
import { useSelector } from "react-redux";
import { selectCurrentScope } from "../../../../stores/authSlice";


export const MapCoachDetails: React.FC = () => {

    const { id } = useParams(); // <-- get id from URL
    const navigate = useNavigate()
    const scope = useSelector(selectCurrentScope);


    // Use Mutation for fetching data via POST
    const [getClientById, { data: clientData, isLoading: isClientLoading }] = useGetClientByIdMutation();

    useEffect(() => {
        if (id) {
            getClientById({ "client_id": id });
        }
    }, [id, getClientById]);

    const details = clientData?.data?.client;
    const MapRequestItems = clientData?.data?.client?.client_history;

    const goBack = () => { navigate("/" + scope.toLowerCase() + "/mapcoach") }

    const [assignCoachToClient] = useAssignCoachToClientMutation();
    const [getAssignedCoachToClient] = useGetAssignedCoachToClientMutation();
    const [mapcilenttoCoach] = useMapcilenttoCoachMutation();
    const [unassignCoachToClient] = useUnassignCoachToClientMutation();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [assignedCoaches, setAssignedCoaches] = useState<any[]>([]);
    const [suggestedCoaches, setSuggestedCoaches] = useState<any[]>([]);
    const industryOptions = industry;
    const [filterIndustry, setFilterIndustry] = useState("");
    const [filterExperience, setFilterExperience] = useState("");
    const [openUnassignDialog, setOpenUnassignDialog] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info" as "success" | "error" | "warning" | "info",
    });

    const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setToast({ open: true, message, severity });
    };

    const handleToastClose = () => {
        setToast({ ...toast, open: false });
    };

    const handleAssignCoachToClient = async (row: any) => {
        if (assignedCoaches.length >= 4) {
            showToast("Maximum of 4 coaches can be assigned.", "error");
            return;
        }
        try {
            const response = await assignCoachToClient({
                coach_ids: [row?.id],
                client_id: details?.id,
            });
            if (response?.data) {
                showToast("Coach assigned successfully!", "success");
                handleGetAssignedCoachToClient();
                handleMapcilenttoCoach();
            } else {
                showToast("Failed to assign coach.", "error");
            }
        } catch (error) {
            showToast("Something went wrong. Please try again.", "error");
        }
    };

    // to get the assigned coach
    const handleGetAssignedCoachToClient = async () => {
        try {
            const response = await getAssignedCoachToClient({
                client_id: details?.id,
            });
            if (response?.data?.status) {
                const data = response.data.data.coaches;
                const mappedRows = Array.isArray(data) ? data?.map((item: any) => ({
                    ...item,
                    first_name: item?.first_name,
                    email_id: item?.email,
                    industries: Array.isArray(item?.industries) ? item?.industries.join(' | ') : item?.industries || '-',
                    experience: item?.coaching_experience ? `${item?.coaching_experience}+ years ` : "—",
                    ratings: item?.rating,
                    coaching_credentials: Array.isArray(item?.coaching_credentials) ? item?.coaching_credentials.join(' | ') : item?.coaching_credentials || '-',
                    time_zone: item?.time_zone,
                    status: 'Assigned',
                    coaching_hours: item?.coaching_hours ? `${item?.coaching_hours}+ hours/seasoned ` : "—",
                    id: item?.id,
                })) : [];
                setAssignedCoaches(mappedRows);
            }
        } catch (error) {
        }
    };

    // to get the suggested coaches
    const handleMapcilenttoCoach = async () => {
        try {
            const response = await mapcilenttoCoach({
                client_id: details?.id,
                time_zone: MapRequestItems?.time_zone,
                range_per_session: MapRequestItems?.range_per_session,
                industries: MapRequestItems?.industries,
                industries_filter: filterIndustry ? [filterIndustry] : [],
                search: filterExperience
            });
            if (response?.data?.data) {
                const data = response.data.data;
                const mappedRows = Array.isArray(data) ? data?.map((item: any) => ({
                    ...item,
                    first_name: item?.first_name,
                    email_id: item?.email,
                    industries: Array.isArray(item?.industries) ? item?.industries.join(' | ') : item?.industries || '-',
                    experience: item?.coaching_experience ? `${item?.coaching_experience}+ years ` : "—",
                    ratings: item?.ratings,
                    status: item?.already_assign === 1 ? 'Assigned' : item?.rejection_reason === null ? 'Suggested' : 'Rejected',
                    id: item?.id,
                })) : [];
                setSuggestedCoaches(mappedRows);
            }
        } catch (error) {
        }
    };

    const unassignCoach = async (row: any) => {
        try {
            const response = await unassignCoachToClient({
                client_id: details?.id,
                coach_id: row?.id
            });
            if (response?.data?.data) {
                handleGetAssignedCoachToClient()
                handleMapcilenttoCoach();
                showToast("Coach unassigned successfully!", "success");
            } else {
                showToast("Failed to unassign coach.", "error");
            }
        } catch (error) {
            showToast("Something went wrong. Please try again.", "error");
        }
    }

    useEffect(() => {
        if (details?.id) {
            handleGetAssignedCoachToClient();
        }
    }, [details?.id]);

    useEffect(() => {
        if (details?.id && MapRequestItems) {
            handleMapcilenttoCoach();
        }
    }, [details?.id, MapRequestItems, filterIndustry, filterExperience]);

    // useEffect(() => {
    //     if (details?.id && details?.coach_id) {
    //         handleAssignCoachToClient();
    //     }
    // }, [details?.id, details?.coach_id]);


    // ----- DYNAMIC ACTION BUTTONS -----

    const assignCoachActions = [
        {
            icon: <DeleteIcon fontSize="small" />,
            tooltip: "Remove Coach",
            color: "error", // Green color for invoice
            onClick: (row: any) => {
                setSelectedCoach(row);
                setOpenUnassignDialog(true);
            },
        }
    ];
    const viewClient = () => {
        navigate(`/${scope.toLowerCase()}/client/profile/${details?.client_id || details?.id}`, { state: { from: 'map-coach', requestId: id } });
    };
    const suggestedCoachAction = [
        {
            icon: <InfoIcon fontSize="small" />,
            tooltip: "Reject Reason",
            color: "error",
            onClick: goBack,
            show: (row: any) => row.rejection_reason !== null
        },
        {
            icon: <PersonAddAltIcon fontSize="small" />,
            tooltip: "Assign Coach",
            color: "success", // Green color for invoice
            onClick: handleAssignCoachToClient,
            show: (row: any) => row.already_assign === 0 && assignedCoaches.length < 4
        },
        {
            icon: <PersonAddAlt1Icon fontSize="small" />,
            tooltip: "Unassign Coach",
            color: "success", // Green color for invoice
            onClick: (row: any) => {
                setSelectedCoach(row);
                setOpenUnassignDialog(true);
            },
            show: (row: any) => row.already_assign === 1
        },

    ]

    const viewCoach = (row: any) => {
        navigate(`/${scope.toLowerCase()}/coach/details/fromMapCoach/` + row.id, { state: { requestId: id } })
    };

    const assignedCoachesKeys = ["first_name", "industries", "experience", "coaching_credentials", "coaching_hours", "timezone", "ratings", "status"];
    const assignedCoachesColumns = ["Coach Name", "Industries", "Experience", "Coaching Credientials", "Coaching Hours", "Time Zone", "Ratings", "Status"];

    const SuggestedCoachKeys = ["first_name", "email_id", "industries", "experience", "ratings", "status"];
    const SuggestedCoachColumns = ["Coach Name", "Email Id", "Industries", "Experience", "Ratings", "Status"];

    return (
        <Box>
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Map Coaches
                    </Typography>
                    <Typography >
                        View and manage Map coaches
                    </Typography>
                </Box>
            </Box>
            {isClientLoading ? (
                <Loader />
            ) : (
                <Paper elevation={10} className={styles.coach_request}>

                    {/* PROFILE SECTION */}
                    <Grid container justifyContent="center" sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Card isGreenCard className={`${clientCss.cardPadding}`}>
                                <Grid container>
                                    <Grid size={{ xs: 12, lg: 4 }} order={1} className="d-flex flex-column align-items-center justify-content-center">
                                        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>Client Details</Typography>
                                        <UserAvatar size={130} name={details?.first_name || ""} src={details?.profile_image} />
                                    </Grid>

                                    <Grid size={{ xs: 12, lg: 8 }} order={2} className="profileCard" sx={{ alignItems: 'flex-start !important' }}>
                                        <Typography className="profileRow">
                                            <span className="clientLabel">Full Name</span>
                                            <span className="colon">:</span>
                                            <span className="clientValue">{details?.first_name || "—"}</span>
                                        </Typography>



                                        {MapRequestItems?.current_role && MapRequestItems?.current_role?.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Role</span>
                                                <span className="colon">:</span>
                                                <span className="clientValue">{MapRequestItems?.current_role || "—"}</span>

                                            </Typography>
                                        )}
                                        {MapRequestItems?.coaching_credentials && MapRequestItems?.coaching_credentials?.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Preferred Coaching Credentials</span>
                                                <span className="colon">:</span>
                                                <Box component="span" display="inline-flex" flexWrap="wrap" gap={1} ml={1}>
                                                    {MapRequestItems?.coaching_credentials.map((goal: string, idx: number) => (
                                                        <Typography className="chip" key={idx}>{goal}</Typography>
                                                    ))}
                                                </Box>
                                            </Typography>
                                        )}
                                        {MapRequestItems?.time_zone && MapRequestItems?.time_zone.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Time Zone</span>
                                                <span className="colon">:</span>
                                                <span className="clientValue">{MapRequestItems?.time_zone || "—"}</span>
                                            </Typography>
                                        )}

                                        {MapRequestItems?.industries && MapRequestItems?.industries?.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Primary Coaching Goals</span>
                                                <span className="colon">:</span>
                                                <Box component="span" display="inline-flex" flexWrap="wrap" gap={1} ml={1}>
                                                    {MapRequestItems?.industries.map((goal: string, idx: number) => (
                                                        <Typography className="chip" key={idx}>{goal}</Typography>
                                                    ))}
                                                </Box>
                                            </Typography>
                                        )}

                                        {MapRequestItems?.range_per_session && MapRequestItems?.range_per_session?.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Per Session Budget</span>
                                                <span className="colon">:</span>
                                                <Box component="span" display="inline-flex" flexWrap="wrap" gap={1} ml={1}>
                                                    {MapRequestItems?.range_per_session.map((budgetItem: string, idx: number) => (
                                                        <Typography className="chip" key={idx}>{budgetItem}</Typography>
                                                    ))}
                                                </Box>
                                            </Typography>
                                        )}

                                        {details?.reason && details?.reason.length > 0 && (
                                            <Typography className="profileRow">
                                                <span className="clientLabel">Reason</span>
                                                <span className="colon">:</span>
                                                <span className="clientValue">{details?.reason}</span>
                                            </Typography>
                                        )}

                                        <Button
                                            label="View Profile"
                                            variant="contained"
                                            size="small"
                                            style={{ marginTop: '20px', borderRadius: '8px', padding: '4px 12px', textTransform: 'none' }}
                                            onClick={viewClient}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Assigned Coach */}
                    <Typography variant="body2" className="title pb-3" color="primary">
                        Assigned Coach
                    </Typography>

                    <Table columns={assignedCoachesColumns} rows={assignedCoaches || []} actions={assignCoachActions} keys={assignedCoachesKeys} loading={isClientLoading}
                        onRowClick={viewCoach}
                        renderPrefix={{
                            ratings: (row) => row.ratings ? <StarIcon className='starIcon' /> : null
                        }}
                        cellStyles={{
                            status: (row) => ({
                                color: row.status === "Assigned" ? theme.palette.success.main : theme.palette.error.main,
                                fontWeight: "bold"
                            })
                        }}
                        pagination={
                            <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={assignedCoaches.length} onPageChange={(p, size) => {
                                setPage(p);
                                if (typeof size === "number") {
                                    setItemsPerPage(size);
                                }
                            }}
                            />
                        }
                    />

                    {/* Suggested Coach Section */}

                    <Typography variant="body2" className="title pb-3 pt-3" color="primary">
                        Suggested Coach
                    </Typography>

                    <Table columns={SuggestedCoachColumns} rows={suggestedCoaches || []} actions={suggestedCoachAction} keys={SuggestedCoachKeys} loading={isClientLoading}
                        onRowClick={viewCoach}
                        renderPrefix={{
                            ratings: (row) => row.ratings ? <StarIcon className='starIcon' /> : null
                        }}
                        cellStyles={{
                            status: (row) => ({
                                color: row.status === "Suggested" ? theme.palette.success.main : theme.palette.error.main,
                                fontWeight: "bold"
                            })
                        }}
                        component={
                            <>
                                <InputSelect name="Industry" label="Industry" placeholder="Select Industry" options={industryOptions} value={filterIndustry} onChange={(e) => setFilterIndustry(e)} />
                                <InputText name="Experience" label="Experience" placeholder="Select Experience" value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} />
                            </>
                        }
                        pagination={
                            <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={suggestedCoaches.length} onPageChange={(p, size) => {
                                setPage(p);
                                if (typeof size === "number") {
                                    setItemsPerPage(size);
                                }
                            }}
                            />
                        }
                    />
                </Paper>
            )}

            <Dialog
                open={openUnassignDialog}
                title="Confirm Unassign"
                content="Are you sure you want to unassign this coach from the client?"
                onClose={() => setOpenUnassignDialog(false)}
                buttons={[
                    {
                        label: "Cancel",
                        variant: "outlined",
                        onClick: () => setOpenUnassignDialog(false)
                    },
                    {
                        label: "Unassign",
                        color: "error",
                        onClick: () => {
                            unassignCoach(selectedCoach);
                            setOpenUnassignDialog(false);
                        }
                    }
                ]}
            />

            <ToastMessage
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleToastClose}
            />
        </Box>
    );
};

export default MapCoachDetails;
