import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from "js-cookie";
import {
  InputAdornment,
  Stack,
} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const InitialForm = {
  amount: 0,
  description: "",
  date: new Date(),
  category_id: "",
};

export default function TransactionForm({
  fetchTransactions,
  editTransaction,
  setEditTransaction,
}) {
  const user = useSelector((state) => state.auth.user);
  const categories = user?.categories || [];
  const token = Cookies.get("token");
  const [form, setForm] = useState(InitialForm);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (editTransaction.amount !== undefined) {
      setForm(editTransaction);
      setEditMode(true);
    } else {
      setForm(InitialForm);
      setEditMode(false);
    }
  }, [editTransaction]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    editMode ? update() : create();
  }

  function handleCancel() {
    setForm(InitialForm);
    setEditMode(false);
    setEditTransaction({});
  }

  function reload(res) {
    if (res.ok) {
      setForm(InitialForm);
      setEditMode(false);
      setEditTransaction({});
      fetchTransactions();
    }
  }

  async function create() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    reload(res);
  }

  async function update() {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${editTransaction._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    reload(res);
  }

  function getCategoryNameById(params) {
    return (
      categories.find((category) => category._id === form.category_id) ?? ""
    );
  }

  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        background: 'white',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {editMode ? "Update Transaction" : "Add New Transaction"}
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
            >
              <TextField
                fullWidth
                type="number"
                label="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: 'success.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Stack>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
            >
              <Autocomplete
                fullWidth
                value={getCategoryNameById()}
                onChange={(event, newValue) => {
                  setForm({ ...form, category_id: newValue?._id });
                }}
                options={categories}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Category"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                )}
              />

              <DatePicker
                label="Date"
                value={form.date}
                onChange={(newValue) => {
                  setForm({ ...form, date: newValue });
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                )}
              />
            </Stack>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {editMode ? (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={<EditIcon />}
                  >
                    Update
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Add Transaction
                </Button>
              )}
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
