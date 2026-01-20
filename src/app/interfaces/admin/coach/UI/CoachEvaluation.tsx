// Import Packages
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

// Import Icons
import SearchIcon from "@mui/icons-material/ManageSearch";
import ResetIcon from '@mui/icons-material/LoopOutlined';
import StarIcon from '@mui/icons-material/StarRate';

// Import Files
import coachCss from '../Coach.module.scss';
import { useGetReasonFromClientForCoachQuery } from "../../mapCoach/services/mapCoach";
import { Table } from "../../../../../shared/components/table/Table";
import { formatDate } from "../../../../../shared/dateFormat";
import Button from "../../../../../shared/components/button/Button";
import InputText from "../../../../../shared/components/formFields/InputText";
import Pagination from "../../../../../shared/components/pagination/Pagination";
import ToastMessage from "../../../../../shared/components/toastMessage/ToastMessage";
import Dialog from "../../../../../shared/components/dialog/Dialog";

export const CoachEvaluation = () => {
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState([{ label: "", value: "" }]);
  const [payload, setPayload] = useState({});
  const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

  const { data: reasonData, isLoading, refetch } = useGetReasonFromClientForCoachQuery(payload);

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
  const tableData = reasonData?.data?.items?.map((item: any) => ({
    ...item,
    ...item?.appointment,
    appointment_date: formatDate(item.appointment?.start_date),
    client_name: (item?.clientDetails?.middle_name) ? item?.clientDetails?.first_name + " " + item?.clientDetails?.middle_name + " " + item?.clientDetails?.last_name :
      item?.clientDetails?.first_name + " " + item?.clientDetails?.last_name
  }));

  // Open pop-up when click row to view coach evaluation (Reasons) 
  const viewCoachEvaluation = (row: any) => {
    let data = [
      { label: "Client Name", value: row.client_name },
      { label: "Appointment Date", value: row.appointment_date },
      { label: "Coach Evaluation", value: row.rejected_reason }
    ]
    setOpenDialog(true);
    setDialogData(data);
  };

  // When click search button call this function to refetch data
  const searchTableData = () => {
    setIsSearch(true);
  }

  // When click reset button call this function to reset search and status value
  const resetTableData = () => {
    setSearch("");
    setIsSearch(true);
  }

  const keys = ["client_name", "appointment_date", "rejected_reason"];
  const columns = ["Client Name", "Appointment Date", "Coach Evaluation"];

  return (
    <>
      {/* TABLE */}
      <Table columns={columns} rows={tableData || []} keys={keys} loading={isLoading} onRowClick={viewCoachEvaluation} ellipsis={false}
        renderSuffix={{ rating: (row) => row.rating ? <StarIcon fontSize="small" className="starIcon" /> : null }}
        component={
          <>
            <InputText name="search" label="Search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button size='large' aria-label="Search Button" onClick={searchTableData}><SearchIcon /></Button>
            <Button size='large' variant="outlined" onClick={resetTableData}><ResetIcon /></Button>
          </>
        }
        pagination={
          <Pagination page={page} itemsPerPage={itemsPerPage} totalItems={reasonData?.data?.totalCount || 0}
            onPageChange={(p, size) => { setPage(p); if (typeof size === "number") { setItemsPerPage(size); } }} />
        }
      />

      {/* Dialog Box */}
      <Dialog open={openDialog} title="View Coach Evaluation"
        content={
          <>
            {dialogData.map((item, index) => (
              <Typography key={index} className={`${coachCss.dialogRow} ${coachCss.coachEvaluation} mb-3`}>
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