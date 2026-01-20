// Import Packages
import React, { useState } from "react";
import { Table as MuiTable, TableHead, TableRow, TableCell, TableBody, TableContainer, IconButton, Tooltip, Checkbox, Box, Typography, Chip } from "@mui/material";

// Icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Import Files
import table from "./Table.module.scss";
import Loader from "../loader/Loader";

type Action = {
  icon: React.ReactNode;
  tooltip?: string;
  color?: any;
  show?: (row: any) => boolean;
  onClick: (row: any) => void;
};

type TableProps = {
  title?: string;
  columns: string[];
  keys: string[];
  multiple?: boolean;
  rows: Array<any>;
  actions?: Action[];
  component?: React.ReactNode;
  pagination?: React.ReactNode;
  loading?: boolean;
  className?: any;
  cellStyles?: { [key: string]: (row: any) => React.CSSProperties | undefined };
  ellipsis?: boolean;
  renderPrefix?: { [key: string]: (row: any) => React.ReactNode };
  renderSuffix?: { [key: string]: (row: any) => React.ReactNode };
  conditionalBadges?: any;
  onRowClick?: (row: any) => void;
  sortableKeys?: string[];
  onSortChange?: (payload: { key: string; sort: "asc" | "desc" }) => void;
  sortKey?: string | null;
  sortOrder?: "asc" | "desc" | null;
};

export function Table({
  title,
  multiple = false,
  columns,
  keys,
  rows,
  actions = [],
  component,
  pagination,
  loading = false,
  ellipsis = true,
  className,
  cellStyles = {},
  renderPrefix = {},
  renderSuffix = {},
  conditionalBadges = {},
  onRowClick,
  sortableKeys = [],
  onSortChange,
  sortKey,
  sortOrder
}: TableProps) {
  const [selected, setSelected] = useState<Array<any>>([]);
  const isAllChecked = rows.length > 0 && selected.length === rows.length;

  const handleSelectAll = (event: any) => {
    setSelected(event.target.checked ? rows.map((r) => r.id) : []);
  };

  const handleSelectRow = (rowId: any) => {
    setSelected((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleSort = (key: string) => {
    const nextSort: "asc" | "desc" =
      sortKey === key && sortOrder === "asc" ? "desc" : "asc";

    onSortChange?.({ key, sort: nextSort });
  };



  return (
    <Box className={table.tableResponsive}>
      {loading ? (
        <Loader />
      ) : (
        <TableContainer className={`${table.table} ${className}`}>
          <Box className={title ? "d-flex justify-content-between mt-3 mb-3" : "d-flex justify-content-end mt-3 mb-3"}>
            {title && (
              <Typography variant="h6" fontWeight={600}>
                {title} : {rows.length}
              </Typography>
            )}
            <Box className="d-flex gap-2">{component}</Box>
          </Box>

          <MuiTable>
            <TableHead>
              <TableRow>
                {multiple && (
                  <TableCell className={table.header} padding="checkbox">
                    <Checkbox
                      checked={isAllChecked}
                      indeterminate={selected.length > 0 && selected.length < rows.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}

                {columns.map((col, index) => {
                  const keyName = keys[index];
                  const isSortable = sortableKeys.includes(keyName);

                  return (
                    <TableCell key={col} className={table.header}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <strong className={table.column}>{col}</strong>

                        {isSortable && (
                          <IconButton size="small" onClick={() => handleSort(keyName)}>
                            {sortKey === keyName && sortOrder === "asc" ? (
                              <ArrowUpwardIcon className={table.sort} fontSize="inherit" />
                            ) : (
                              <ArrowDownwardIcon className={table.sort} fontSize="inherit" />
                            )}

                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}

                {actions.length > 0 && (
                  <TableCell className={table.header}>
                    <strong className={table.column}>Actions</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {rows.length ? (
                rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id ?? rowIndex}
                    hover={!!onRowClick}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    className={table.row}
                  >
                    {multiple && (
                      <TableCell className={table.cell} padding="checkbox">
                        <Checkbox
                          checked={selected.includes(row.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                        />
                      </TableCell>
                    )}

                    {keys.map((key) => (
                      <TableCell key={key + rowIndex} className={table.cell} style={cellStyles[key] ? cellStyles[key](row) : {}}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {renderPrefix[key]?.(row)}
                          <Typography variant="inherit" color="inherit"
                            sx={
                              ellipsis
                                ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 170 }
                                : { display: "inline-flex", alignItems: "center", }
                            }
                          >
                            {row[key] ?? "-"}
                          </Typography>
                          {renderSuffix[key] && (
                            <Box display="inline-flex">
                              {renderSuffix[key](row)}
                            </Box>
                          )}
                          {conditionalBadges[key]?.map((badge: any, idx: any) => (
                            badge.check(row) && (
                              <Chip
                                key={idx}
                                label={typeof badge.label === 'function' ? badge.label(row) : badge.label}
                                color={badge.color}
                                size={badge.size || "small"}
                                className={badge.className}
                                sx={{ fontWeight: 'bold', fontSize: badge.fontSize || 'inherit', ...badge.sx }}
                              />
                            )
                          ))}
                        </Box>
                      </TableCell>
                    ))}

                    {actions.length > 0 && (
                      <TableCell className={table.cell} sx={{ maxWidth: "200px" }}>
                        {actions.map((action, i) => {

                          // If no show function, default = true
                          const shouldShow = typeof action?.show === "function" ? action?.show(row) : true;
                          if (!shouldShow) return null;

                          return (
                            <Tooltip key={i} title={action.tooltip || ""}>
                              <IconButton
                                color={action.color}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          );
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} align="center" className={table.cell}>
                    No records found
                  </TableCell>
                </TableRow>
              )}

              {rows.length > 0 && (
                <TableRow >
                  <TableCell
                    sx={{ borderBottom: 'none' }}
                    colSpan={columns.length + 2}
                    className={table.cell}>
                    {pagination && (
                      pagination
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
      )}
    </Box>
  );
}