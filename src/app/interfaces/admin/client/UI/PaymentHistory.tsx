// Import Packages
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

// Import Icons
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';

// Import Files
import { useGetClientPaymentHistoryQuery } from "../service/Client";
import { Table } from "../../../../../shared/components/table/Table";
import { formatDate } from "../../../../../shared/dateFormat";
import theme from "../../../../../theme";
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";

interface PaymentTypeProps {
    type?: "FromCoachProfile"
}

export const PaymentHistory = ({ type }: PaymentTypeProps) => {
    const { id } = useParams();

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [payload, setPayload] = useState({});
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

    const { data: clientPaymentData, isLoading, refetch } = useGetClientPaymentHistoryQuery(payload);

    // Set payload if isSearch value is true
    useEffect(() => {
        setPayload({ page: page, itemPerPage: itemsPerPage, search: search, coach_id: id });
    }, [isSearch])

    // Call for get all API intially. Also call if payload changed
    useEffect(() => {
        setIsSearch(false);
        refetch();
    }, [payload])

    // Data modification for full name
    const tableData = clientPaymentData?.data?.map((item: any) => ({
        ...item,
        is_paid: (item.is_paid === 0) ? "Due" : (item.is_paid === 1) ? "Paid" : "Scheduled",
        amount: "$" + item.amount,
        payment_date: formatDate(item.payment_date),
        description: item.client_name + ": " + formatDate(item.appointment_start_date)
    }));

    // When click search button call this function to refetch data
    const searchTableData = () => {
        setIsSearch(true);
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
        setIsSearch(true);
    }

    const baseKeys = ["description", "amount", "is_paid", "payment_date"];
    const baseColumns = ["Description", "Amount", "Status", "Date"];

    const paymentKeys = ["coach_name"];
    const paymentColumns = ["Coach Name"];

    const keys = [...(type !== "FromCoachProfile" ? paymentKeys : ""), ...baseKeys]
    const columns = [...(type !== "FromCoachProfile" ? paymentColumns : ""), ...baseColumns]

    return (
        <>
            {/* HEADER */}
            {type !== "FromCoachProfile" && <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">Payment History</Typography>
                    <Typography variant="body2">View payment details</Typography>
                </Box>
            </Box>}

            {/* TABLE */}
            <Paper elevation={type === "FromCoachProfile" ? 0 : 3}>
                <Table columns={columns} rows={tableData || []} keys={keys} loading={isLoading}
                    cellStyles={{
                        is_paid: (row) => ({
                            color: (row.is_paid === "Paid") ? theme.palette.success.main : (row.is_paid === "Scheduled") ?
                                theme.palette.warning.main : theme.palette.error.main,
                            fontWeight: "bold"
                        })
                    }}
                    component={
                        <>
                            <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button size='large' aria-label="Search Button" onClick={searchTableData}><SearchIcon /></Button>
                            <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                        </>
                    }
                    pagination={
                        <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={clientPaymentData?.data?.totalCount || 0}
                            onPageChange={(p, size) => { setPage(p); if (typeof size === "number") { setItemsPerPage(size); } }} />
                    }
                />
            </Paper>

            {/* Toast Message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
};