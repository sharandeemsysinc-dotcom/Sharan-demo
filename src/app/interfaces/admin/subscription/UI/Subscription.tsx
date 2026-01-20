import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EnableIcon from '@mui/icons-material/LockOpenOutlined';
import DisableIcon from '@mui/icons-material/LockOutlined';
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import AddIcon from '@mui/icons-material/Add';

import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Button from "../../../../../shared/components/button/Button";
import Dialog from '../../../../../shared/components/dialog/Dialog';

import { useGetAllSubscriptionQuery, useDeleteSubscriptionMutation, useEnableDisableSubscriptionMutation, type Subscription as ISubscription } from "../service/subscriptionservice";
import InputText from "../../../../../shared/components/formFields/InputText";

export const Subscription = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<ISubscription | null>(null);

    // ----- Dynamic API Payload -----
    const payload = {
        page,
        itemPerPage: itemsPerPage,
        search,
    };

    const currencyMap: Record<number, string> = {
        0: "₹",
        1: "$",
    };

    const { data, isLoading, refetch } = useGetAllSubscriptionQuery(payload);
    const rawRows = data?.items ?? [];

    // Map rows to match table structure and flatten plan_type for display
    const rows = rawRows.map((item: any) => {
        // Fix: Ensure plan_type is an array before mapping
        const plan_type = Array.isArray(item?.plan_type) ? item?.plan_type : [];

        const planTypeNames = plan_type?.map((p: any) => p?.plan_type_name).join(" | ");
        const planAmounts = plan_type?.map((p: any) =>
            `${currencyMap[p?.currency] || ''} ${p?.amount}`
        ).join(" | ");

        return {
            ...item,
            plan_name: item?.plan_name,
            plan_type_names: planTypeNames || "-",
            plan_amounts: planAmounts || "-",
        };
    });

    const totalItems = data?.totalCount ?? 0;

    const [deleteSubscription] = useDeleteSubscriptionMutation();
    const [enableDisableSubscription] = useEnableDisableSubscriptionMutation();
    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        refetch();
    }, [page, itemsPerPage, search, isSearch]);

    // ----- ACTION HANDLERS -----
    const handleEdit = (row: ISubscription) => {
        navigate(`/admin/subscription/form/${row.id}`);
    };

    const handleDeleteClick = (row: ISubscription) => {
        setSelectedSubscription(row);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedSubscription) {
            await deleteSubscription({ id: selectedSubscription.id, data: { status: 2 } });
            setOpenDeleteDialog(false);
            setSelectedSubscription(null);
            refetch();
        }
    };

    const enableDisableSubscriptions = async (row: any) => {
        await enableDisableSubscription({
            id: row.id,
            data: { status: row.status === 1 ? 0 : 1 },
        });
        refetch();
    };

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
            icon: <EditIcon fontSize="small" />,
            tooltip: "Edit subscription",
            color: "primary",
            onClick: handleEdit,
        }, {
            icon: <EnableIcon fontSize="small" />,
            tooltip: "Disable subscription",
            color: "success",
            onClick: enableDisableSubscriptions,
            show: (row: any) => row.status === 1
        }, {
            icon: <DisableIcon fontSize="small" />,
            tooltip: "Enable subscription",
            color: "customFirst",
            onClick: enableDisableSubscriptions,
            show: (row: any) => row.status === 0
        }, {
            icon: <DeleteIcon fontSize="small" />,
            tooltip: "Delete subscription",
            color: "error",
            onClick: handleDeleteClick,
        },
    ];

    const keys = ["plan_name", "plan_type_names", "plan_amounts"];
    const columns = ["Plan Name", "Plan Type", "Amount"];

    return (
        <>
            {/* HEADER */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">Subscription Management</Typography>
                    <Typography variant="body2">View and Manage Subscription</Typography>
                </Box>

                <Box className="action">
                    <Button className="btn" onClick={() => navigate("/admin/subscription/form")}><AddIcon />Add Subscription</Button>
                </Box>
            </Box>

            {/* TABLE */}
            <Paper elevation={3}>
                <Table columns={columns} rows={rows || []} actions={actions} keys={keys} loading={isLoading}
                    component={
                        <>
                            <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button size='large' onClick={searchTableData}><SearchIcon /></Button>
                            <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                        </>
                    }
                    pagination={
                        <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={totalItems}
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
            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                title="Delete Subscription"
                content={`Are you sure you want to delete subscription "${selectedSubscription?.plan_name}"?`}
                buttons={[
                    { label: "Cancel", onClick: () => setOpenDeleteDialog(false) },
                    { label: "Delete", onClick: confirmDelete, color: 'error' },
                ]}
            />
        </>
    );
};

// export default Subscription;
