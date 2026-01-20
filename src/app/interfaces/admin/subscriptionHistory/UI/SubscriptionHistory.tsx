import { useState, useEffect, useRef } from "react";
import { Box, Typography, Dialog, DialogContent, DialogActions, useTheme, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";

import SearchIcon from "@mui/icons-material/ManageSearch";
import DownloadIcon from '@mui/icons-material/Download';
import ResetIcon from '@mui/icons-material/LoopOutlined';
import InvoiceIcon from '@mui/icons-material/DescriptionOutlined';

import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Button from "../../../../../shared/components/button/Button";
import { formatDate } from "../../../../../shared/dateFormat";
import InputText from "../../../../../shared/components/formFields/InputText";
import InputSelect from "../../../../../shared/components/formFields/InputSelect";
import InputNumber from "../../../../../shared/components/formFields/InputNumber";
import { month } from "../../../../../shared/constant";

import { useGetAllSubscriptionHistoryQuery } from "../service/subscbriptionHistoryservice";
import InvoiceTemplate, { type InvoiceTemplateProps } from "./InvoicTemplate";
import { selectCurrentScope, selectUserId } from "../../../../stores/authSlice";

interface subscriptionTypeProps {
    type?: "FromCoachProfile"
}

export const SubscriptionHistory = ({ type }: subscriptionTypeProps) => {
    const theme = useTheme();

    // Current Date Defaults
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentMonthLabel = month[currentMonthIndex].label;
    const currentYear = currentDate.getFullYear().toString();

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState<any>(currentMonthLabel);
    const [year, setYear] = useState(currentYear);

    // Applied states for API trigger & Pagination reset
    const [appliedFilters, setAppliedFilters] = useState<{ search: string, month: string | number, year: string | number }>({
        search: "",
        month: currentMonthLabel,
        year: currentYear
    });

    const schema = yup.object().shape({
        month: yup.string().nullable(),
        year: yup.string().nullable().test('len', 'Enter a valid year', val => !val || val.length === 4),
        search: yup.string(),
    }).test('month-year-dependency', 'Month and Year match', function (value) {
        const { month, year } = value;
        if (year && !month) return this.createError({ path: 'month', message: 'Month is mandatory' })
        if (month && !year) return this.createError({ path: 'year', message: 'Year is mandatory' })
        return true;
    });

    const currencyMap: Record<string, string> = {
        'inr': "₹",
        'usd': "$",
    };

    const { handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            search: "",
            month: currentMonthLabel,
            year: currentYear
        }
    });

    // Invoice Dialog State
    const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTemplateProps | null>(null);
    const isRole = useSelector(selectCurrentScope);
    const userId = useSelector(selectUserId);

    // ----- Dynamic API Payload -----
    const payload = {
        page,
        itemPerPage: itemsPerPage,
        search: appliedFilters.search,
        coach_id: isRole === 'Coach' ? userId : '',
        month: appliedFilters.month, // Send as Label (String)
        year: appliedFilters.year ? Number(appliedFilters.year) : ""
    };

    const { data, isLoading, refetch } = useGetAllSubscriptionHistoryQuery(payload);

    const rows = data?.data?.map((row: any) => ({
        ...row,
        current_period_start: row.current_period_start ? formatDate(row.current_period_start) : '-',
        created_at: row.created_at ? formatDate(row.created_at) : '-',
        status: row.status ? (row.status === 1 ? 'Active' : 'Expired') : '-',
        plan_amount: `${currencyMap[row?.currency] || ''} ${row?.amount}`
    }));

    const totalItems = data?.totalCount;

    useEffect(() => {
        refetch();
    }, [page, itemsPerPage, appliedFilters]);

    const invoiceRef = useRef<HTMLDivElement>(null);

    // ----- ACTION HANDLERS -----

    const handleInvoicePreview = (row: any) => {
        // Map row data to the new ELTAI Invoice Props
        const invoiceData: InvoiceTemplateProps = {
            date: row.current_period_start || '',
            name: row.coach_name || '',
            memberId: row.member_id || row.id || '',
            email: row.email || '-',
            mobileNumber: row.phone || '-',
            address: row.address || '-',
            city: row.city || '',
            district: row.district || '',
            state: row.state || '',
            country: row.country || '',
            plantype: row.subscription_type_name || 'Subscription',
            planname: row.subscription_plan_name || '',
            startdate: row.current_period_start || '',
            enddate: formatDate(row.current_period_end) || '',
            orginamt: row.amount || 0,
            offer: row.discount || 0,
            amount: row.amount || 0,
            currency: row.currency || '',
        };
        setSelectedInvoice(invoiceData);
        setOpenInvoiceDialog(true);
    };

    const DownloadInvoice = () => {
        const element = invoiceRef.current;
        if (!element) return;
        const opt = {
            margin: 1,
            filename: `invoice_${selectedInvoice?.memberId || 'download'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
        };
        html2pdf().set(opt).from(element).save();
    };

    // ----- DYNAMIC ACTION BUTTONS -----

    const actions = [
        {
            icon: <InvoiceIcon fontSize="small" />,
            tooltip: "View Invoice",
            color: "warning",
            onClick: handleInvoicePreview,
        }
    ];

    // Validation State
    const searchTableData = (data: any) => {
        setPage(1); // Reset to first page on new search
        setAppliedFilters({ search: data.search, month: data.month, year: data.year });
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
        setSelectedMonth(currentMonthLabel);
        setYear(currentYear);
        reset({
            search: "",
            month: currentMonthLabel,
            year: currentYear
        })
        setPage(1);
        setAppliedFilters({ search: "", month: currentMonthLabel, year: currentYear });
    }

    // Transform month options to use Label as Value
    const monthOptions = month.map(m => ({ label: m.label, value: m.label }));

    const baseKeys = ["subscription_plan_name", "subscription_type_name", "plan_amount", "current_period_start", "created_at", 'status'];
    const baseColumns = ["Subscription Plan", "Plan Type", "Amount", "Payment Date", "Registration Date", "Status"];

    const subscriptionKeys = ["coach_name"];
    const subscriptionColumns = ["Coach Name"];

    const keys = [...(type !== "FromCoachProfile" ? subscriptionKeys : ""), ...baseKeys]
    const columns = [...(type !== "FromCoachProfile" ? subscriptionColumns : ""), ...baseColumns]


    return (
        <>
            {/* HEADER */}
            {type !== "FromCoachProfile" && (
                <Box className="headContainer">
                    <Box className="text">
                        <Typography variant="h4">Subscription History Management</Typography>
                        <Typography variant="body2">View and manage subscriptions history</Typography>
                    </Box>
                </Box>
            )}

            {/* TABLE */}
            <Paper elevation={type === "FromCoachProfile" ? 0 : 3}>
                <Table columns={columns} rows={rows || []} actions={actions} keys={keys} loading={isLoading}
                    cellStyles={{
                        status: (row) => ({
                            color: row.status === "Active" ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: "bold"
                        })
                    }}
                    component={
                        <>
                            <form onSubmit={handleSubmit(searchTableData)} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                <InputSelect name="month" label="Month" placeholder="Select Month" control={control} value={selectedMonth}
                                    options={monthOptions} errors={errors}
                                    onChange={(value: any) => setSelectedMonth(value)}
                                />
                                <InputNumber name="year" label="Year" placeholder="Enter Year" control={control} value={year}
                                    errors={errors}
                                    onChange={(e: any) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setYear(val);
                                    }}
                                />
                                <InputText name="search" label="Search" placeholder="search" control={control} value={search} onChange={(e) => setSearch(e.target.value)} />
                                <Button size='large' type="submit"><SearchIcon /></Button>
                                <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                            </form>
                        </>
                    }
                    pagination={
                        <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={totalItems} onPageChange={(p, size) => {
                            setPage(p);
                            if (typeof size === "number") {
                                setItemsPerPage(size);
                            }
                        }}
                        />
                    }
                />
            </Paper>

            {/* INVOICE PREVIEW DIALOG */}
            <Dialog open={openInvoiceDialog} onClose={() => setOpenInvoiceDialog(false)} maxWidth="md" fullWidth >
                <DialogContent>
                    {selectedInvoice && <InvoiceTemplate ref={invoiceRef} {...selectedInvoice} />}
                </DialogContent>
                <DialogActions>
                    <Button label="Close" variant="outlined" onClick={() => setOpenInvoiceDialog(false)} />
                    <Button label="Download" onClick={DownloadInvoice} startIcon={<DownloadIcon />} />
                </DialogActions>
            </Dialog>
        </>
    );
};