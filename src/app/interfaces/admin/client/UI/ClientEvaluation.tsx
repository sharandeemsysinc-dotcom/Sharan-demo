// Import Packages
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

// Import Icons
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import StarIcon from '@mui/icons-material/StarRate';

// Import Files
import coachCss from '../../coach/Coach.module.scss';
import { coachUnderstanding, styleAndApproach, feltSupported, coachComfortLevel, likeToProceed, effectiveness, styleFitOverTime} from "../../../../../shared/constant";
import { useGetAllClientEvaluationQuery } from "../service/Client";
import { Table } from "../../../../../shared/components/table/Table";
import { formatDate } from "../../../../../shared/dateFormat";
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import Dialog from "../../../../../shared/components/dialog/Dialog";

export const ClientEvaluation = () => {
    const { id } = useParams();

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState([{ label: "", value: "" }]);
    const [payload, setPayload] = useState({});
    const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

    const { data: feedbackData, isLoading, refetch } = useGetAllClientEvaluationQuery(payload);

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
    const tableData = feedbackData?.data?.items?.map((item: any) => ({
        ...item,
        session_date: formatDate(item.appointment?.appointment_date),
        session_type: (item.is_first_appointment) ? "First Session" : "Follow-up Session", 
        coach_Understanding: coachUnderstanding.find(data => item.coach_Understanding === data?.value)?.label,
        style_and_Approach: styleAndApproach.find(data => item.style_and_Approach === data?.value)?.label,
        felt_Supported: feltSupported.find(data => item.felt_Supported === data?.value)?.label,
        coach_Comfort_Level: coachComfortLevel.find(data => item.coach_Comfort_Level === data?.value)?.label,
        like_to_proceed: likeToProceed.find(data => item.like_to_proceed === data?.value)?.label,
        effectiveness: effectiveness.find(data => item.effectiveness === data?.value)?.label,
        style_fit_over_time: styleFitOverTime.find(data => item.style_fit_over_time === data?.value)?.label,
    }));

    // Open pop-up when click row to view coach observation (Feedback)
    const viewCoachObservation = (row: any) => {
        let data = [
            { label: "Client Name", value: row.client_name },
            { label: "Session Date", value: row.session_date },
            { label: "Session Type", value: row.session_type },
            { label: "Ratings", value: row.rating },
            { label: "Coach's Understanding of Client Needs", value: row.coach_Understanding },
            { label: "Coaching Style & Approach Fit", value: row.style_and_Approach },
            { label: "Felt Supported", value: row.felt_Supported },
            { label: "Coach Comfort Level", value: row.coach_Comfort_Level },
            { label: "Likelihood to Proceed", value: row.like_to_proceed },
            { label: "Key Takeaways", value: row.positive_or_negative_about_conversation },
            { label: "Decision Factors", value: row.move_Forward_Decision_Question },
            ...(!row.is_first_appointment ? [
                { label: "Effectiveness in Gaining Clarity and Moving Forward", value: row.effectiveness },
                { label: "Ongoing Fit of Coaching Style & Approach", value: row.style_fit_over_time },
                { label: "Client Feedback for Coach", value: row.coach_feedback }
            ] : []),
        ]
        setOpenDialog(true);
        setDialogData(data);
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

    const keys = ["client_name", "session_date", "session_type", "rating"];
    const columns = ["Client Name", "Session Date", "Session Type", "Ratings"];

    return (
        <>
            {/* TABLE */}
            <Table columns={columns} rows={tableData || []} keys={keys} loading={isLoading} onRowClick={viewCoachObservation}
                renderSuffix={{ rating: (row) => row.rating ? <StarIcon fontSize="small" className="starIcon" /> : null }}
                component={
                    <>
                        {feedbackData && tableData?.length != 0 &&
                            <Typography variant="h6" className="text-nowrap mt-1 me-3">
                                Overall Ratings: {feedbackData?.data?.overall_Rating} <StarIcon fontSize="small" className="starIcon" />
                            </Typography>
                        }
                        <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button size='large' aria-label="Search Button" onClick={searchTableData}><SearchIcon /></Button>
                        <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
                    </>
                }
                pagination={
                    <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={feedbackData?.data?.totalCount || 0}
                        onPageChange={(p, size) => { setPage(p); if (typeof size === "number") { setItemsPerPage(size); } }} />
                }
            />

            {/* Dialog Box */}
            <Dialog open={openDialog} title="View Coach Observation"
                content={
                    <>
                        {dialogData.map((item, index) => (
                            <Typography key={index} className={`${coachCss.dialogRow} ${coachCss.clientEvaluation} mb-3`}>
                                <span className="clientLabel">{item.label}</span>
                                <span className="colon">:</span>
                                <span className="clientValue">{item.value || "-"}</span>
                            </Typography>
                        ))}
                    </>
                }
                buttons={[{ label: "Close", variant: "outlined", onClick: () => { setOpenDialog(false) } }]}
            />

            {/* Toast Message */}
            <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
};