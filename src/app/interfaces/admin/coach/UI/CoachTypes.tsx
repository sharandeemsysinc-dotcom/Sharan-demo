// Import Packages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

// Import Icons
import ApproveIcon from '@mui/icons-material/DoneOutlined';
import RejectIcon from '@mui/icons-material/CloseOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EnableIcon from '@mui/icons-material/LockOpenOutlined';
import DisableIcon from '@mui/icons-material/LockOutlined';
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import AssignIcon from '@mui/icons-material/AssignmentIndOutlined';
import ActiveIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import CommentsIcon from '@mui/icons-material/CommentOutlined';
import ReasonIcon from '@mui/icons-material/TextsmsOutlined';

// Import Files
import {
    useGetAllCoachQuery, useApproveRejectCoachMutation, useDeleteCoachMutation, useEnableDisableCoachMutation, useActivateCoachMutation,
    useAssignUnassignCoachMutation
} from "../service/Coach";
import { coachingHours, coachPaidStatus } from "../../../../../shared/constant";
import { selectCurrentScope } from "../../../../stores/authSlice";
import coachCss from '../Coach.module.scss'
import theme from "../../../../../theme";
import { Table } from "../../../../../shared/components/table/Table";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import Button from "../../../../../shared/components/button/Button";
import Dialog from '../../../../../shared/components/dialog/Dialog';
import InputTextArea from '../../../../../shared/components/formFields/InputTextArea';
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import InputText from "../../../../../shared/components/formFields/InputText";
import InputSelect from "../../../../../shared/components/formFields/InputSelect";
import InputNumber from "../../../../../shared/components/formFields/InputNumber";

interface CoachTypesProps {
    type: "Approved" | "Pending" | "Inactive";
}

export const CoachTypes = ({ type }: CoachTypesProps) => {
    const navigate = useNavigate();
    const scope = useSelector(selectCurrentScope);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilerStatus] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [months, setMonths] = useState(0);
    const [discountPercentageAnnual, setDiscountPercentageAnnual] = useState(0);
    const [monthsAnnual, setMonthsAnnual] = useState(0);
    const [comments, setComments] = useState("");
    const [commentsDetails, setCommentsDetails] = useState("");
    const [rejectReasonDetails, setRejectReasonDetails] = useState("");
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [dialogType, setDialogType] = useState("");
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });
    const [activeTab, setActiveTab] = useState<"Approved" | "Pending" | "Inactive">("Approved");
    const [payload, setPayload] = useState({});
    const [errors, setErrors] = useState<{ [k: string]: string | null }>({});

    const { data: coachDatas, isLoading, refetch } = useGetAllCoachQuery(payload);
    const [approveReject] = useApproveRejectCoachMutation();
    const [remove] = useDeleteCoachMutation();
    const [enableDisable] = useEnableDisableCoachMutation();
    const [assignUnassign] = useAssignUnassignCoachMutation();
    const [activate] = useActivateCoachMutation();

    // validation rules for discount amount and reject reason
    const validators = {
        discount_percentage: (value: number) => {
            if (value === null || value === undefined) return "Discount percentage is required";
            if (value < 0) return "Percentage must be greater than and equal to 0";
            if (value > 100) return "Percentage cannot exceed 100";
            return "";
        },

        months: (value: number) => {
            if (value === null || value === undefined) return "Month is required";
            if (value < 0) return "Month must be greater than and equal to 0";
            if (value > 12) return "Month cannot exceed 12";
            return "";
        },

        discount_percentage_annual: (value: number) => {
            if (value === null || value === undefined) return "Discount percentage is required";
            if (value < 0) return "Percentage must be greater than and equal to 0";
            if (value > 100) return "Percentage cannot exceed 100";
            return "";
        },

        months_annual: (value: number) => {
            if (value === null || value === undefined) return "Month is required";
            if (value < 0) return "Month must be greater than and equal to 0";
            if (value > 12) return "Month cannot exceed 12";
            return "";
        },

        comments: (value: string) => {
            if (!value || value.trim() === "") return "Comment is required";
            if (value.trim().length < 10) return "Please provide at least 10 characters";
            if (value.trim().length > 150) return "Comment is too long";
            return null;
        },

        reject_reason: (value: string) => {
            if (!value || value.trim() === "") return "Reason is required";
            if (value.trim().length < 10) return "Please provide at least 10 characters";
            if (value.trim().length > 150) return "Reason is too long";
            return null;
        }
    };

    // Set Active tab value from params
    useEffect(() => {
        setActiveTab(type);
    }, [type]);

    // Change Payload when menu or tab change
    useEffect(() => {
        if (activeTab === "Approved") {
            setPayload({ page: page, itemPerPage: itemsPerPage, search: search, is_approve: 1, is_paid: filterStatus });
        } else if (activeTab === "Pending") {
            setPayload({ page: page, itemPerPage: itemsPerPage, search: search, is_approve: 0 });
        } else {
            setPayload({ page: page, itemPerPage: itemsPerPage, search: search, inactive: true });
        }
    }, [activeTab, isSearch]);

    // Refetch data when changes in payload
    useEffect(() => {
        refetch();
        setIsSearch(false);
    }, [payload]);

    // Data modification for coaching hours
    const tableData = coachDatas?.data?.items?.map((item: any) => ({
        ...item,
        full_name: item.middle_name ? item.first_name + " " + item.middle_name + " " + item.last_name : item.first_name + " " + item.last_name,
        coaching_hours_label: coachingHours.find(data => item.coaching_hours === data?.value)?.label,
        joinCoachCredentials: (item.other_coaching_credentials) ? item.coaching_credentials.join(" | ") + " - " + item.other_coaching_credentials : item.coaching_credentials.join(" | "),
        joinIndustries: (item.other_industries) ? item.industries.join(" | ") + " - " + item.other_industries : item.industries.join(" | "),
        is_paid: (item.is_paid === 0) ? "Due" : "Paid"
    }));

    // validate a field -> reject reason, discount amount
    const validateField = (name: string, value: number) => {
        const fn = (validators as any)[name];
        if (!fn) return;
        const err = fn(value);
        setErrors((prev) => ({ ...prev, [name]: err }));
        return err;
    };

    // validate all relevant fields before approveReject API
    const validateAll = () => {
        const nextErrors: { [k: string]: string | null } = {};
        if (dialogType === "approve") {
            nextErrors.discount_percentage = validators.discount_percentage(discountPercentage);
            nextErrors.months = validators.months(months);
            nextErrors.discount_percentage_annual = validators.discount_percentage_annual(discountPercentageAnnual);
            nextErrors.months_annual = validators.months_annual(monthsAnnual);
            nextErrors.comments = validators.comments(comments);
        } else if (dialogType === "reject") {
            nextErrors.reject_reason = validators.reject_reason(rejectReason);
        }
        setErrors(nextErrors);
        return !Object.values(nextErrors).some(Boolean);
    };

    // Navigate to Individual Coach Page
    const viewCoach = (row: any) => {
        if (activeTab === "Approved" || activeTab === "Inactive") navigate("/" + scope.toLowerCase() + "/coach/details/" + row.id);
        else if (activeTab === "Pending") navigate("/" + scope.toLowerCase() + "/coach/details/pending/" + row.id);
    }

    // Send Payload and call enableDisable API when click enable button
    const enableCoach = async (row: any) => {
        let payload = { id: row.id, data: { status: 1 } };
        enableDisableCoach(payload);
    };

    // Send Payload and call enableDisable API when click disable button
    const disableCoach = async (row: any) => {
        let payload = { id: row.id, data: { status: 0 } };
        enableDisableCoach(payload);
    };

    // Call Enable / Disable API
    const enableDisableCoach = async (payload: any) => {
        try {
            const res = await enableDisable(payload).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    }

    // Open Delete Confirmation Popup
    const confirmDeleteCoach = async (row: any) => {
        setDialogType('delete');
        setSelectedCoach(row.id);
        setOpenDialog(true)
    };

    // Call Delete API
    const deleteCoach = async (id: any) => {
        try {
            const res = await remove(id).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            setOpenDialog(false);
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    };

    // Send Payload and call approveReject API when click approve button
    const approveCoach = async (row: any) => {
        let data = {
            coach_id: row.id, type: 0, discount_percentage: discountPercentage, months: months,
            discount_percentage_annual: discountPercentageAnnual, months_annual: monthsAnnual
        };
        approveRejectCoach(data);
    };

    // Open Approve Popup to add discount amount
    const confirmApproveCoach = async (row: any) => {
        setDialogType('approve');
        setSelectedCoach(row);
        setOpenDialog(true);
    };

    // Send Payload and call approveReject API when click reject button
    const rejectCoach = async (row: any) => {
        let data = { coach_id: row.id, type: 1, rejection_reason: rejectReason };
        approveRejectCoach(data);
    };

    // Open Reject Reason Popup
    const confirmRejectCoach = async (row: any) => {
        setDialogType('reject');
        setSelectedCoach(row);
        setOpenDialog(true);
    };

    // Call Approve / Reject API
    const approveRejectCoach = async (data: any) => {
        if (!validateAll()) return;
        try {
            const res = await approveReject(data).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
                refetch();
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            setOpenDialog(false);
            setRejectReason("");
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    }

    // Send Payload and call assignUnassign Coach to static site API when click assign button
    const assignCoach = async (row: any) => {
        let payload = { coach_id: row.id, is_static: 0 };
        assignUnassignCoach(payload);
    };

    // Send Payload and call assignUnassign Coach to static site API when click unassign button
    const unassignCoach = async (row: any) => {
        let payload = { coach_id: row.id, is_static: 1 };
        assignUnassignCoach(payload);
    };

    // Call Assign / Unassign Coach to static site API
    const assignUnassignCoach = async (payload: any) => {
        try {
            const res = await assignUnassign(payload).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    }

    // Call Activate or Approve function based on condition
    const callActivateCoach = async (row: any) => {
        if (row.status == 2) activateCoach(row);
        else confirmApproveCoach(row);
    }

    // Call Activate Coach API
    const activateCoach = async (row: any) => {
        let payload = { coach_id: row.id, status: 1 };
        try {
            const res = await activate(payload).unwrap();
            if (res?.status) {
                setToast({ open: true, message: res?.message, severity: "success" })
            } else {
                setToast({ open: true, message: res?.message, severity: "error" })
            }
            refetch();
        } catch (error: any) {
            console.error("Error Fetching Data:", error);
        }
    }

    // When click comments icon open dialogue box to show comments
    const commentCoach = (row: any) => {
        setDialogType('comments');
        setCommentsDetails(row.comments);
        setOpenDialog(true);
    }

    // When click reason icon open dialogue box to show reject reason
    const reasonCoach = (row: any) => {
        setDialogType('reason');
        setRejectReasonDetails(row.rejection_reason);
        setOpenDialog(true);
    }

    // When click search button call this function to refetch data
    const searchTableData = () => {
        setIsSearch(true);
    }

    // When click reset button call this function to reset search and status value
    const resetTableData = () => {
        setSearch("");
        setFilerStatus("");
        setIsSearch(true);
    }

    // Dialogue cancel button for all dialogue
    const close = () => {
        setOpenDialog(false);
        setRejectReason("");
        setDiscountPercentage(0);
        setMonths(0);
        setDiscountPercentageAnnual(0);
        setMonthsAnnual(0);
        setComments("");
        setErrors({});
    }

    // ----- DYNAMIC ACTION BUTTONS -----
    const approvedActions = [
        {
            icon: <EnableIcon fontSize="small" />,
            tooltip: "Disable Coach",
            color: "success",
            onClick: disableCoach,
            show: (row: any) => row.status === 1
        }, {
            icon: <DisableIcon fontSize="small" />,
            tooltip: "Enable Coach",
            color: "customFirst",
            onClick: enableCoach,
            show: (row: any) => row.status === 0
        }, {
            icon: <AssignIcon fontSize="small" />,
            tooltip: "Unassign Coach to static site",
            color: "success",
            onClick: assignCoach,
            show: (row: any) => row.is_static === 1
        }, {
            icon: <AssignIcon fontSize="small" />,
            tooltip: "Assign Coach to static site",
            color: "error",
            onClick: unassignCoach,
            show: (row: any) => row.is_static === 0
        }, {
            icon: <CommentsIcon fontSize="small" />,
            tooltip: "View Comments",
            color: "secondary",
            onClick: commentCoach
        }, {
            icon: <DeleteIcon fontSize="small" />,
            tooltip: "Delete Coach",
            color: "error",
            onClick: confirmDeleteCoach,
        }
    ];

    const pendingActions = [
        {
            icon: <ApproveIcon fontSize="small" />,
            tooltip: "Approve Coach",
            color: "success",
            onClick: confirmApproveCoach,
        }, {
            icon: <RejectIcon fontSize="small" />,
            tooltip: "Inactive Coach",
            color: "error",
            onClick: confirmRejectCoach,
        }
    ];

    const inactiveActions = [
        {
            icon: <ActiveIcon fontSize="small" />,
            tooltip: "Activate Coach",
            color: "success",
            onClick: callActivateCoach,
        }, {
            icon: <ReasonIcon fontSize="small" />,
            tooltip: "View Reason",
            color: "error",
            onClick: reasonCoach,
            show: (row: any) => row.is_approved === 2
        }
    ];

    const actions = [
        ...(activeTab == "Approved" ? approvedActions : (activeTab === "Pending") ? pendingActions : inactiveActions)
    ];

    const baseKeys = ["full_name", "email", "joinCoachCredentials", "joinIndustries", "coaching_hours_label"];
    const baseColumns = ["Name", "Email", "Coaching Crendials", "Industries", "Coaching Hours"];

    const coachKeys = ["is_paid"];
    const coachColumns = ["Paid Status"];

    const keys = [...baseKeys, ...(activeTab === "Approved" ? coachKeys : "")]
    const columns = [...baseColumns, ...(activeTab === "Approved" ? coachColumns : "")]

    return (
        <>
            {/* Table */}
            <Table columns={columns} rows={tableData || []} actions={actions} keys={keys} loading={isLoading}
                className={coachCss.tableBorderRadius} onRowClick={viewCoach}
                cellStyles={{
                    is_paid: (row) => ({
                        color: row.is_paid === "Paid" ? theme.palette.success.main : theme.palette.error.main,
                        fontWeight: "bold"
                    })
                }}
                component={
                    <>
                        {activeTab === "Approved" && (
                            <InputSelect name="status" label="Status" placeholder="Select Status" options={coachPaidStatus} value={filterStatus} onChange={(e) => setFilerStatus(e)} />
                        )}
                        <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button size='large' onClick={searchTableData}><SearchIcon /></Button>
                        <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                    </>
                }
                pagination={
                    <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={coachDatas?.data?.totalCount || 0}
                        onPageChange={(p, size) => {
                            setPage(p);
                            if (typeof size === "number") { setItemsPerPage(size); }
                        }}
                    />
                }
            />

            {/* Dialog Box */}
            <Dialog open={openDialog} title={dialogType === "approve" ? "Approve Coach" : (dialogType === "reject") ? "Inactive Coach" :
                (dialogType === "delete") ? "Delete Coach" : (dialogType === "comments") ? "View Comments" : "View Reason"}
                content={
                    dialogType === "approve" ? "Add Discount Percentage (%) and Discount Months for both Monthly and Annual Plan" :
                        dialogType === "reject" ? "Are you sure you want to inactive this coach?" : dialogType === "delete" ?
                            "Are you sure you want to delete this coach?" : ""
                }
                component={[
                    dialogType === "approve" ? (
                        <>
                            <Box>
                                <Typography variant="body2" className="mb-2">For Monthly Plan</Typography>
                                <InputNumber name="discount_percentage" label="Discount Percentage" placeholder="Enter discount in percentage"
                                    onChange={(e) => { setDiscountPercentage(Number(e.target.value)); validateField("discount_percentage", Number(e.target.value)); }}
                                    className="mb-4" value={discountPercentage} errorMessage={errors.discount_percentage ?? ""} required />
                                <InputNumber name="months" label="Discount Months" placeholder="Enter discount months"
                                    onChange={(e) => { setMonths(Number(e.target.value)); validateField("months", Number(e.target.value)); }}
                                    value={months} errorMessage={errors.months ?? ""} required
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" className="mt-4 mb-2">For Annual Plan</Typography>
                                <InputNumber name="discount_percentage_annual" label="Discount Percentage" placeholder="Enter discount in percentage"
                                    onChange={(e) => { setDiscountPercentageAnnual(Number(e.target.value)); validateField("discount_percentage_annual", Number(e.target.value)); }}
                                    value={discountPercentageAnnual} className="mb-4" errorMessage={errors.discount_percentage_annual ?? ""} required
                                />
                                <InputNumber name="months_annual" label="Discount Months" placeholder="Enter discount months"
                                    onChange={(e) => { setMonthsAnnual(Number(e.target.value)); validateField("months_annual", Number(e.target.value)); }}
                                    value={monthsAnnual} errorMessage={errors.months_annual ?? ""} required
                                />
                            </Box>
                            <Box className="mt-4">
                                <InputTextArea name="Comments" variant="labeled" label="Comments" placeholder="Enter your comments here!"
                                    onChange={(e) => { setComments(e.target.value); validateField("comments", e.target.value); }}
                                    errorMessage={errors.comments} required />
                            </Box>
                        </>
                    ) : dialogType === "reject" ? (
                        <InputTextArea name="reject_reason" label="Reason" placeholder="Enter your reason here!"
                            onChange={(e) => { setRejectReason(e.target.value); validateField("reject_reason", e.target.value); }}
                            errorMessage={errors.reject_reason} required />
                    ) : dialogType === "comments" ? (<Typography>{commentsDetails}</Typography>) : (<Typography>{rejectReasonDetails}</Typography>)
                ]}
                buttons={
                    (dialogType === "comments" || dialogType === "reason") ? [{ label: "Close", variant: "outlined", onClick: close }] :
                        [{ label: "Cancel", variant: "outlined", onClick: close }, dialogType === "approve" ?
                            { label: "Approve", onClick: () => approveCoach(selectedCoach) } : dialogType === "reject" ?
                                { label: "Inactive", onClick: () => rejectCoach(selectedCoach) } :
                                { label: "Delete", onClick: () => deleteCoach(selectedCoach) }
                        ]
                }
            />

            {/* Toast message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => { setToast({ ...toast, open: false }) }} />
        </>
    );
}