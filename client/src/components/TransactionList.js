import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Chip,
  TablePagination,
  useTheme,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export default function TransactionList({
  data = [],
  fetchTransactions,
  setEditTransaction,
}) {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const token = Cookies.get("token");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  console.log('Transactions to render:', data);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Paper 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Transactions
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No transactions found. Add your first transaction above.
        </Typography>
      </Paper>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function categoryName(id) {
    if (!user?.categories) return "Loading";
    const category = user.categories.find((category) => category._id === id);
    return category ? category.label : "N/A";
  }

  function categoryIcon(id) {
    if (!user?.categories) return "";
    const category = user.categories.find((category) => category._id === id);
    return category ? category.icon : "";
  }

  async function remove(_id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      fetchTransactions();
    }
  }

  function formatDate(date) {
    return dayjs(date).format("DD.MM.YYYY");
  }

  return (
    <Paper 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Transactions ({data.length})
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data || [])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                console.log('Rendering row:', row);
                return (
                  <TableRow
                    key={row._id}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'action.hover',
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: 'success.main',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        ${Number(row.amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.primary' }}>
                        {row.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={categoryName(row.category_id)}
                        size="small"
                        sx={{ 
                          bgcolor: 'success.light',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {formatDate(row.date)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => setEditTransaction(row)}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { 
                                bgcolor: 'primary.light',
                                color: 'primary.dark',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => remove(row._id)}
                            size="small"
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { 
                                bgcolor: 'error.light',
                                color: 'error.dark',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      />
    </Paper>
  );
}
