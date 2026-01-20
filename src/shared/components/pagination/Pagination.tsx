// // Import Packages
// import React, { useState } from "react";
// import { Box, Select, MenuItem, FormControl, InputLabel, Pagination as MuiPagination, TextField } from "@mui/material";

// // Import Files
// import Button from "../button/Button";
// import pagination from "./Pagination.module.scss";

// type Props = {
//   page: number;
//   itemsPerPage: number;
//   totalItems: number;
//   onPageChange: (page: number, itemsPerPage?: number) => void;
// };

// const Pagination: React.FC<Props> = ({
//   page,
//   itemsPerPage,
//   totalItems,
//   onPageChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

//   // Local state to track user input for "Go to page"
//   const [gotoPage, setGotoPage] = useState<number | string>("");

//   // Function to handle "Go" button click
//   const handleGoToPage = () => {
//     const num = Number(gotoPage);
//     if (!isNaN(num) && num >= 1 && num <= totalPages) {
//       onPageChange(num);
//       setGotoPage(""); // Clear input after navigation
//     } else {
//       alert(`Please enter a valid page between 1 and ${totalPages}`);
//     }
//   };

//   return (
//     <Box className={`${pagination["customPagination"]} d-flex justify-content-between align-items-center gap-3 flex-wrap`}>      {/* Input field for direct page navigation */}
//       <Box className="d-flex align-items-center gap-2">
//         <TextField label="Go to page" size="small" type="number" value={gotoPage} onChange={(e) => setGotoPage(e.target.value)}
//           inputProps={{ min: 1, max: totalPages }} style={{ width: 120 }}
//         />
//         <Button label="Go" variant="contained" color="primary" size="medium" onClick={handleGoToPage} />
//       </Box>

//       {/* Main pagination control */}
//       <MuiPagination count={totalPages} page={page} onChange={(_, value) => onPageChange(value)} />

//       {/* Dropdown to select number of items per page */}
//       <FormControl size="small" variant="outlined">
//         <InputLabel id="items-per-page-label">Per page</InputLabel>
//         <Select labelId="items-per-page-label" label="Per page" value={itemsPerPage}style={{ minWidth: 100 }} 
//           onChange={(e) => onPageChange(1, Number(e.target.value))}>
//           {[5, 10, 20, 50].map((n) => (
//             <MenuItem key={n} value={n}>{n}</MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Box>
//   );
// };

// export default Pagination;

// Import Packages
import React from "react";
import {
  Box,
  Pagination,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

type Props = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number, itemsPerPage?: number) => void;
};

const CustomPagination: React.FC<Props> = ({
  page,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalItems);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      sx={{ width: "100%", mt: 2 }}
    >
      {/* LEFT SIDE — Showing X to Y of Z entries */}
      <Typography variant="body2" color="text.secondary">
        Showing {start} to {end} of {totalItems} entries
      </Typography>

      {/* CENTER — Pagination numbers */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
      />

      {/* RIGHT SIDE — Dropdown for itemsPerPage */}
      <FormControl size="small">
        <Select
          value={itemsPerPage}
          onChange={(e) => onPageChange(1, Number(e.target.value))}
        >
          {[10, 20, 50, 100].map((num) => (
            <MenuItem key={num} value={num}>
              {num} / page
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomPagination;
