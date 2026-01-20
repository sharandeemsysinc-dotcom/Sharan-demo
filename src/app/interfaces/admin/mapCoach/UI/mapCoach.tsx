// Import Packages
import { useEffect, useState } from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import Icons
import ViewIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import RejectIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';

// Import Files
import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Button from "../../../../../shared/components/button/Button";
import Dialog from '../../../../../shared/components/dialog/Dialog';
import InputText from "../../../../../shared/components/formFields/InputText";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";

import { useApproveRejectCoachRequestMutation } from "../services/mapCoach";
import InputTextArea from "../../../../../shared/components/formFields/InputTextArea";
import { useGetAllClientQuery } from "../../client/service/Client";
import theme from "../../../../../theme";
import styles from '../mapCoach.module.scss'
import { useSelector } from "react-redux";
import { selectCurrentScope } from "../../../../stores/authSlice";

export const MapCoach = () => {
    const navigate = useNavigate()
    const scope = useSelector(selectCurrentScope);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCoachRequest, setSelectedCoachRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
    const [isSearch, setIsSearch] = useState(false);


    // ----- Dynamic API Payload -----
    const payload: any = {
        page,
        itemPerPage: itemsPerPage,
        search,
    };

    const { data, isLoading, refetch } = useGetAllClientQuery(payload);

    const [approveReject] = useApproveRejectCoachRequestMutation();

    const tableData = data?.data?.items?.map((item: any) => ({
        ...item,
        assignCoach: item.assign_coach === 1 ? "Assigned" : "Not Assigned"
    })) || [];

    useEffect(() => {
        refetch();
    }, [page, itemsPerPage, search, isSearch]);

    // ----- ACTION HANDLERS -----

    const viewCoach = (row: any) => {
        navigate(`/${scope.toLowerCase()}/mapCoach/details/` + row.id)
    };

    // Reject Coach Integration and Logics
    const rejectCoachRequest = async (row: any) => {
        setSelectedCoachRequest(row);
        setOpenDialog(true)
    };

    const conformReject = async (row: any) => {
        try {
            const res = await approveReject({ coach_id: row.id, type: 2, rejection_reason: rejectReason }).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
                refetch();
            } else {
                setToast({ open: false, message: res?.message, severity: "eroor" })
            }
            setOpenDialog(false);
            setRejectReason("");
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    };


    const keys = ["first_name", "email", "assignCoach"];
    const columns = ["Name", "Email", "Status"];

    const searchTableData = () => {
        setIsSearch(true);
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
        setIsSearch(true);
    }

    return (
        <>
            {/* HEADER */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        Map Coaches
                    </Typography>
                    <Typography variant="body2">View & Manage Map Coaches</Typography>
                </Box>
            </Box>

            {/* TABLE */}
            <Paper elevation={3}>
                <Table columns={columns} rows={tableData || []} keys={keys} loading={isLoading} onRowClick={viewCoach}
                    className={styles.customTable}
                    conditionalBadges={{
                        first_name: [
                            {
                                label: "New",
                                color: "success",
                                check: (row) => row.new_assign === 0,
                                className: styles.xSmallBadge,
                            }
                        ]
                    }}
                    cellStyles={{
                        assignCoach: (row) => ({
                            color: row.assignCoach === "Assigned" ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: "bold"
                        })
                    }}
                    component={
                        <>
                            <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button size='large' onClick={searchTableData}><SearchIcon /></Button>
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
            {/* Dialog */}
            <Dialog
                open={openDialog}
                title="Reject Coach Request"
                content={"Are you sure you want to reject this coach request?"}
                component={<InputTextArea name="reject_reason" label="Reject Reason" variant="outlined" placeholder="Enter your reason here!" onChange={(e) => setRejectReason(e.target.value)} />}
                buttons={[
                    {
                        label: "Cancel",
                        variant: "outlined",
                        onClick: () => setOpenDialog(false),
                    },
                    {
                        label: "Reject",
                        color: "primary",
                        onClick: () => conformReject(selectedCoachRequest),
                    },
                ]}
            />

            {/* Toast */}
            <ToastMessage
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
};
export default MapCoach;