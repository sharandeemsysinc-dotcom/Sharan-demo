// Import Packages
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

// Import Icons
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import DeleteIcon from "@mui/icons-material/Delete";

// Import Files
import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import { useGetAllClientQuery, useDeleteClientMutation } from "../service/Client";
import clientCss from '../Client.module.scss'
import Dialog from "../../../../../shared/components/dialog/Dialog";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import { useSelector } from "react-redux";
import { selectCurrentScope } from "../../../../stores/authSlice";
import { formatDate } from "../../../../../shared/dateFormat";

export const Client = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [clientId, setClientId] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });
    const [sortKey, setSortKey] = useState<string | null>('first_name');
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>('asc');


    // ----- Dynamic API Payload -----
    const payload = {
        page,
        itemPerPage: itemsPerPage,
        search,
        sortKey,
        sortOrder
    };

    const { data, isLoading, refetch } = useGetAllClientQuery(payload);
    const [remove] = useDeleteClientMutation();
    const scope = useSelector(selectCurrentScope);

    // View Client
    const viewClient = (row: any) => {
        navigate("/" + scope.toLowerCase() + "/client/details/" + row.id)
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
    }

    // Open Delete Confirmation Popup
    const confirmDeleteClient = async (row: any) => {
        setClientId(row.id);
        setOpenDialog(true);
    };

    // Call Delete API
    const deleteClient = async (id: any) => {
        const res = await remove(id).unwrap();
        if (res?.status) {
            setToast({ open: true, message: res?.message, severity: "success" })
        } else {
            setToast({ open: true, message: res?.message, severity: "error" })
        }
        setOpenDialog(false);
        refetch();
    }

    // ----- DYNAMIC ACTION BUTTONS -----
    const actions = [
        {
            icon: <DeleteIcon fontSize="small" />,
            tooltip: "Delete Coach",
            color: "error",
            onClick: confirmDeleteClient,
        }
    ];

    const keys = ["first_name", "email", "assignedCoachUI", "created_at"];
    const columns = ["Client Name", "Email", "Current / Suggested Coach(es)", "Registered Date"];
    const sortableKeys = ["first_name", "email", "created_at"];

    const handleSortChange = ({ key, sort }: { key: string; sort: "asc" | "desc" }) => {
        setSortKey(key);
        setSortOrder(sort);
        setPage(1);
        refetch()
    };

    // ----- FORMAT ROW DATA -----
    const formattedRows = useMemo(
        () =>
            data?.data?.items?.map((item: any) => ({
                ...item,

                assignedCoachUI:
                    item.assign_coach === 1 && item.assigned_coaches?.length ? (
                        <Box className={clientCss.coachContainer}>
                            {item.assigned_coaches.map((coach: any, index: number) => (
                                <Box key={coach.id} className={clientCss.coachItem}>
                                    <Typography
                                        variant="body2"
                                        className={clientCss.coachName}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/coach/details/${coach.id}`);
                                        }}
                                    >
                                        {coach.first_name}{" "}
                                        {coach.middle_name ? coach.middle_name + " " : ""}
                                        {coach.last_name}
                                    </Typography>

                                    {index < item.assigned_coaches.length - 1 && (
                                        <span className={clientCss.separator}>|</span>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        "-"
                    ),

                // Registered Date (dd/mm/yyyy)
                created_at: item.created_at ? formatDate(item.created_at) : "-",
            })) || [],
        [data, navigate]
    );

    return (
        <>
            {/* HEADER */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        Client Management
                    </Typography>
                    <Typography variant="body2">View and Manage Clients</Typography>
                </Box>
            </Box>

            {/* TABLE */}
            <Paper elevation={3}>
                <Table columns={columns} rows={formattedRows || []} actions={actions} onRowClick={viewClient} sortOrder={sortOrder} sortKey={sortKey} sortableKeys={sortableKeys} onSortChange={handleSortChange} keys={keys} loading={isLoading} ellipsis={false}
                    component={
                        <>
                            <InputText name="search" label="Search" placeholder="search" onChange={(e) => setSearchInput(e.target.value)} />
                            <Button size="large" onClick={() => { setSearch(searchInput); setPage(1); }}>
                                <SearchIcon />
                            </Button>
                            <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                        </>
                    }
                    pagination={
                        <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={data?.data?.totalCount || 0}
                            onPageChange={(p, size) => {
                                setPage(p);
                                if (typeof size === "number") {
                                    setItemsPerPage(size);
                                }
                            }}
                        />
                    }
                />
            </Paper>

            {/* Dialog Box */}
            <Dialog open={openDialog} title="Delete alert"
                content="Are you sure you want to delete this client?"
                buttons={[
                    { label: "No", variant: "outlined", onClick: () => { setOpenDialog(false) } },
                    { label: "Yes", onClick: () => { deleteClient(clientId) } }
                ]}
            />

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
};
