// Import Packages
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import Icons
import AddIcon from "@mui/icons-material/AddOutlined";
import EnableIcon from '@mui/icons-material/LockOpenOutlined';
import DisableIcon from '@mui/icons-material/LockOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';

// Import Files
import { useDeleteStaffMutation, useEnableDisableStaffMutation, useGetAllStaffsQuery } from "../service/staffs";
import { Table } from "../../../../../shared/components/table/Table";
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Dialog from "../../../../../shared/components/dialog/Dialog";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import { formatDate } from "../../../../../shared/dateFormat";

export const Staff = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [payload, setPayload] = useState({ page, itemPerPage: itemsPerPage, search });
    const [isSearch, setIsSearch] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [staffId, setStaffId] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

    const { data: staffData, isLoading, refetch } = useGetAllStaffsQuery(payload);
    const [remove] = useDeleteStaffMutation();
    const [enableDisable] = useEnableDisableStaffMutation();

    // Set payload if isSearch value is true
    useEffect(() => {
        setPayload(prev => ({ ...prev, search: search }));
    }, [isSearch])

    // Call for get all API intially. Also call if payload changed
    useEffect(() => {
        setIsSearch(false);
        refetch();
    }, [payload])

    // Data modification for full name
    const tableData = staffData?.data?.items?.map((item: any) => ({
        ...item,
        full_name: item.middle_name ? item.first_name + " " + item.middle_name + " " + item.last_name : item.first_name + " " + item.last_name,
        phone_number: item.country_code + " " + item.mobile,
        date_added: formatDate(item.created_at)
    }));

    // Navigate to Staff Form
    const addStaff = () => navigate("/admin/staff/form");

    // Navigate to Individual Staff Page
    const viewStaff = (row: any) => navigate("/admin/staff/details/" + row.id);

    // Send Payload and call enableDisable API when click enable button
    const enableStaff = async (row: any) => {
        let payload = { id: row.id, data: { status: 1 } };
        enableDisableStaff(payload);
    };

    // Send Payload and call enableDisable API when click disable button
    const disableStaff = async (row: any) => {
        let payload = { id: row.id, data: { status: 0 } };
        enableDisableStaff(payload);
    };

    // Call Enable / Disable API
    const enableDisableStaff = async (payload: any) => {
        const res = await enableDisable(payload).unwrap();
        if (res?.status) {
            setToast({ open: true, message: res?.message, severity: "success" })
        } else {
            setToast({ open: true, message: res?.message, severity: "error" })
        }
        refetch();
    }

    // Open Delete Confirmation Popup
    const confirmDeleteStaff = async (row: any) => {
        setStaffId(row.id);
        setOpenDialog(true);
    };

    // Call Delete API
    const deleteStaff = async (id: any) => {
        const res = await remove(id).unwrap();
        if (res?.status) {
            setToast({ open: true, message: res?.message, severity: "success" })
        } else {
            setToast({ open: true, message: res?.message, severity: "error" })
        }
        setOpenDialog(false);
        refetch();
    }

    // When click search button call this function to refetch data
    const searchTableData = () => {
        setIsSearch(true);
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
        setIsSearch(true);
    }

    // ----- DYNAMIC ACTION BUTTONS -----
    const actions = [
        {
            icon: <EnableIcon fontSize="small" />,
            tooltip: "Suspend Staff",
            color: "success",
            onClick: disableStaff,
            show: (row: any) => row.status === 1
        }, {
            icon: <DisableIcon fontSize="small" />,
            tooltip: "Active Staff",
            color: "customFirst",
            onClick: enableStaff,
            show: (row: any) => row.status === 0
        }, {
            icon: <DeleteIcon fontSize="small" />,
            tooltip: "Inactive Staff",
            color: "error",
            onClick: confirmDeleteStaff,
        }
    ];

    const keys = ["full_name", "email", "phone_number", "date_added"];
    const columns = ["Name", "Email", "Phone Number", "Date Added"];

    return (
        <>
            {/* HEADER */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">Staff Management</Typography>
                    <Typography variant="body2">View and manage staff</Typography>
                </Box>

                <Box className="action">
                    <Button onClick={addStaff}><AddIcon />Add Staff</Button>
                </Box>
            </Box>

            {/* TABLE */}
            <Paper elevation={3}>
                <Table columns={columns} rows={tableData || []} actions={actions} keys={keys} loading={isLoading} onRowClick={viewStaff} ellipsis={false}
                    component={
                        <>
                            <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button size='large' aria-label="Search Button" onClick={searchTableData}><SearchIcon /></Button>
                            <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                        </>
                    }
                    pagination={
                        <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={staffData?.data?.totalCount || 0}
                            onPageChange={(p, size) => {
                                setPage(p);
                                if (typeof size === "number") { setItemsPerPage(size); }
                            }}
                        />
                    }
                />
            </Paper>

            {/* Dialog Box */}
            <Dialog open={openDialog} title="Inactive alert"
                content="Are you sure you want to inactive this staff?"
                buttons={[
                    { label: "No", variant: "outlined", onClick: () => { setOpenDialog(false) } },
                    { label: "Yes", onClick: () => { deleteStaff(staffId) } }
                ]}
            />

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity}
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
}