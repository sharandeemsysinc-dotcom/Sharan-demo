import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Table } from "../../../../shared/components/table/Table";
import { useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import InputAutoComplete from "../../../../shared/components/formFields/InputAutoComplete";
import InputDatePicker from "../../../../shared/components/formFields/InputDatePicker";
import Button from "../../../../shared/components/button/Button";

const schema = yup.object().shape({
  dob: yup.date().required('Date is required'),
  time: yup.date().required('Time is required'),

});

export function About() {
  const [rows] = useState([
    { id: 1, name: "Ashok", email: "ashok@email.com", role: "Admin", active: true },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
  ]);
  const keys = ["name", "email_address", "role"]
  const columns = ["Name", "Email Address", "Role"];
  const handleEdit = (row: any) => alert(`Editing ${row.name}`);
  const handleDelete = (row: any) => alert(`Deleting ${row.name}`);
  const handleView = (row: any) => alert(`Viewing ${row.name}`);
  const handleToggle = (row: any) =>
    alert(`${row.name} is now ${row.active ? "Inactive" : "Active"}`);
  const actions = [
    {
      icon: <VisibilityIcon fontSize="small" />,
      tooltip: "View Details",
      color: "warning",
      onClick: handleView,
    },
    {
      icon: <EditIcon fontSize="small" />,
      tooltip: "Edit",
      color: "primary",
      onClick: handleEdit,
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      tooltip: "Delete",
      color: "error",
      onClick: handleDelete,
    },
    {
      icon: rows[0].active ? (
        <ToggleOnIcon fontSize="small" />
      ) : (
        <ToggleOffIcon fontSize="small" />
      ),
      tooltip: "Toggle Active",
      color: "customSecond",
      onClick: handleToggle,
    },

  ];
  const language = [
    { label: "Tamil", value: "Tamil" },
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
    { label: "Malayalam", value: "Malayalam" },
  ];
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  return (
    <>
      <Box className="d-flex justify-content-between mb-3">
        <Box>
          <Typography variant="h4" className="text-light mb-1">Coach Management</Typography>
          <Typography className="text-light">View and Manage Coach</Typography>
        </Box>
        <Box className="d-flex align-items-center">
          <Button label="+ Add Coach" color="white" />
        </Box>
      </Box>
      <Table
        columns={columns}
        rows={rows}
        actions={actions}
        keys={keys}
        title="Total Staffs"
        multiple
        component={
          <Box display="flex" alignItems="center" gap={1}>
            <InputAutoComplete name="primaryLanguage" label="Language" placeholder="Choose language" control={control} errors={errors} options={language} />
            <InputDatePicker name="dob" label="Date" placeholder="Date" control={control} errors={errors} />
            <Button size="large">
              <ManageSearchIcon />
            </Button>
          </Box>
        }
      />
    </>



  );
}