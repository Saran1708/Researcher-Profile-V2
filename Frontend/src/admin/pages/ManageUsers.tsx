import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';
import LockResetIcon from '@mui/icons-material/LockReset';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import {
  chartsCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import Loader from '../../components/MainComponents/Loader';
import axiosClient from '../../utils/axiosClient';

const xThemeComponents = {
  ...chartsCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const API_URL = import.meta.env.VITE_API_URL + '/admin/users/';

export default function ManageUsers(props) {
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [openResetConfirm, setOpenResetConfirm] = React.useState(false);
  const [deleteUserId, setDeleteUserId] = React.useState(null);
  const [resetUserId, setResetUserId] = React.useState(null);
  const [emailsText, setEmailsText] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('Staff');
  const [users, setUsers] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('asc');
  const [loading, setLoading] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await axiosClient.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setSnackbarMsg('Error fetching users');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddUser = () => setOpenAddUser(true);
  const handleCloseAddUser = () => {
    setOpenAddUser(false);
    setEmailsText('');
    setSelectedRole('Staff');
  };

  const handleAddUsers = async () => {
    const emails = emailsText.split('\n').filter(e => e.trim() !== '');

    if (emails.length === 0) {
      setSnackbarMsg('Please enter at least one valid email address');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await axiosClient.post(
        API_URL,
        {
          emails: emailsText,
          role: selectedRole
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await fetchUsers();

      setSuccessMsg(res.data.message);
      setSuccessSnackbarOpen(true);
      handleCloseAddUser();

      if (res.data.warning) {
        setTimeout(() => {
          setSnackbarMsg(res.data.warning);
          setSnackbarOpen(true);
        }, 1000);
      }

    } catch (err) {
      console.error('Error adding users:', err);
      const errorMsg = err.response?.data?.error || 'Error adding users';
      setSnackbarMsg(errorMsg);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await axiosClient.delete(`${API_URL}${deleteUserId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchUsers();

      setSuccessMsg('User deleted successfully');
      setSuccessSnackbarOpen(true);
      setOpenDeleteConfirm(false);
      setDeleteUserId(null);

    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbarMsg('Error deleting user');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordClick = (id) => {
    setResetUserId(id);
    setOpenResetConfirm(true);
  };

  const handleConfirmReset = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await axiosClient.post(
        `${API_URL}${resetUserId}/reset-password/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await fetchUsers();

      setSuccessMsg('Password reset successfully to default (Mcc@123)');
      setSuccessSnackbarOpen(true);
      setOpenResetConfirm(false);
      setResetUserId(null);

    } catch (err) {
      console.error('Error resetting password:', err);
      const errorMsg = err.response?.data?.error || 'Error resetting password';
      setSnackbarMsg(errorMsg);
      setSnackbarOpen(true);
      setOpenResetConfirm(false);
      setResetUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (orderBy === 'id') {
      return order === 'asc' ? a.id - b.id : b.id - a.id;
    }
    if (orderBy === 'passwordChanged') {
      return order === 'asc'
        ? (a.passwordChanged === b.passwordChanged ? 0 : a.passwordChanged ? 1 : -1)
        : (a.passwordChanged === b.passwordChanged ? 0 : a.passwordChanged ? -1 : 1);
    }
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {loading && <Loader />}

      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
            width: 0,
          })}
        >
          <Stack
            spacing={3}
            sx={{
              alignItems: 'stretch',
              mx: { xs: 2, sm: 3, md: 4 },
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <h2 style={{ margin: 0 }}>Manage Users</h2>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddUser}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  boxShadow: 2,
                }}
              >
                Add User
              </Button>
            </Box>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                <TextField
                  fullWidth
                  placeholder="Search by email or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'id'}
                          direction={orderBy === 'id' ? order : 'asc'}
                          onClick={() => handleSort('id')}
                        >
                          ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'email'}
                          direction={orderBy === 'email' ? order : 'asc'}
                          onClick={() => handleSort('email')}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'passwordChanged'}
                          direction={orderBy === 'passwordChanged' ? order : 'asc'}
                          onClick={() => handleSort('passwordChanged')}
                        >
                          Password Changed
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'role'}
                          direction={orderBy === 'role' ? order : 'asc'}
                          onClick={() => handleSort('role')}
                        >
                          Role
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'lastLogin'}
                          direction={orderBy === 'lastLogin' ? order : 'asc'}
                          onClick={() => handleSort('lastLogin')}
                        >
                          Last Login
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.passwordChanged ? 'Yes' : 'No'}
                            size="small"
                            color={user.passwordChanged ? 'success' : 'warning'}
                            sx={{ borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === 'Admin' ? 'primary' : 'default'}
                            sx={{ borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            {user.passwordChanged && user.role !== 'Admin' && (
                              <Tooltip title="Reset Password">
                                <IconButton
                                  color="warning"
                                  onClick={() => handleResetPasswordClick(user.id)}
                                  size="small"
                                >
                                  <LockResetIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {user.email !== "admin@mcc.edu.in" && (
                              <Tooltip title="Delete User">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(user.id)}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Paper>

            {/* Add User Dialog */}
            <Dialog
              open={openAddUser}
              onClose={handleCloseAddUser}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>Add New Users</DialogTitle>
              <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                  <TextareaAutosize
                    minRows={6}
                    value={emailsText}
                    onChange={(e) => setEmailsText(e.target.value)}
                    placeholder="Enter one email per line\nexample:\njohn@mcc.edu.in\nsarah@mcc.edu.in"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                    }}
                  />

                  <FormControl fullWidth margin="normal">
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Role
                      </MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={handleCloseAddUser}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUsers}
                  variant="contained"
                  sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                  disabled={loading}
                >
                  Add Users
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={openDeleteConfirm}
              onClose={() => setOpenDeleteConfirm(false)}
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={() => setOpenDeleteConfirm(false)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  color="error"
                  variant="contained"
                  sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                  disabled={loading}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Reset Password Confirmation Dialog */}
            <Dialog
              open={openResetConfirm}
              onClose={() => setOpenResetConfirm(false)}
              PaperProps={{
                sx: { borderRadius: 3 }
              }}
            >
              <DialogTitle>Confirm Password Reset</DialogTitle>
              <DialogContent>
                Are you sure you want to reset this user's password? The password will be reset to the default password (Mcc@123) and the user will need to change it on their next login.
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={() => setOpenResetConfirm(false)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReset}
                  color="warning"
                  variant="contained"
                  sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                  disabled={loading}
                >
                  Reset Password
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbars */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMsg}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
            <Snackbar
              open={successSnackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSuccessSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                severity="success"
                variant="filled"
                sx={{
                  width: '100%',
                  backgroundColor: '#4caf50 !important',
                  color: '#fff !important',
                  borderRadius: 2
                }}
                iconMapping={{ success: <CheckIcon sx={{ color: 'white' }} /> }}
              >
                {successMsg}
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}