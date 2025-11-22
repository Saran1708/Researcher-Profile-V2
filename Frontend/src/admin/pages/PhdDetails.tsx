import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Loader from '../../components/MainComponents/Loader';
import axiosClient from '../../utils/axiosClient';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';


import {
    chartsCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
    ...chartsCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const API_URL = import.meta.env.VITE_API_URL + '/admin/phd/';

export default function PhdDetails(props) {
    const [scholars, setScholars] = React.useState([]);
    const [staffData, setStaffData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [orderBy, setOrderBy] = React.useState('id');
    const [order, setOrder] = React.useState('asc');

    const [staffSearchQuery, setStaffSearchQuery] = React.useState('');
    const [staffPage, setStaffPage] = React.useState(0);
    const [staffRowsPerPage, setStaffRowsPerPage] = React.useState(10);
    const [staffOrderBy, setStaffOrderBy] = React.useState('id');
    const [staffOrder, setStaffOrder] = React.useState('asc');

    // Fetch data on component mount
    React.useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            // Fetch scholars count
            const countRes = await axiosClient.get(`${API_URL}scholars-count/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaffData(countRes.data);

            // Fetch scholars details
            const detailsRes = await axiosClient.get(`${API_URL}scholars-details/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScholars(detailsRes.data);

        } catch (err) {
            console.error('Error fetching PhD data:', err);
        } finally {
            setLoading(false);
        }
    };

    const totalRegistered = scholars.length;
    const totalProduced = scholars.filter(s => s.status === 'Completed').length;

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleStaffSort = (property) => {
        const isAsc = staffOrderBy === property && staffOrder === 'asc';
        setStaffOrder(isAsc ? 'desc' : 'asc');
        setStaffOrderBy(property);
    };

    const filteredScholars = scholars.filter(scholar =>
        scholar.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.scholarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedScholars = [...filteredScholars].sort((a, b) => {
        if (orderBy === 'id') return order === 'asc' ? a.id - b.id : b.id - a.id;
        const aValue = a[orderBy]?.toString().toLowerCase() || '';
        const bValue = b[orderBy]?.toString().toLowerCase() || '';
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    const paginatedScholars = sortedScholars.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const filteredStaff = staffData.filter(staff =>
        staff.staffName.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(staffSearchQuery.toLowerCase())
    );

    const sortedStaff = [...filteredStaff].sort((a, b) => {
        if (["id", "phdScholarsRegistered", "phdScholarsProduced"].includes(staffOrderBy))
            return staffOrder === 'asc' ? a[staffOrderBy] - b[staffOrderBy] : b[staffOrderBy] - a[staffOrderBy];
        const aValue = a[staffOrderBy]?.toString().toLowerCase() || '';
        const bValue = b[staffOrderBy]?.toString().toLowerCase() || '';
        return staffOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    const paginatedStaff = sortedStaff.slice(
        staffPage * staffRowsPerPage,
        staffPage * staffRowsPerPage + staffRowsPerPage
    );

    const totalStaffRegistered = staffData.reduce(
        (sum, item) => sum + item.phdScholarsRegistered,
        0
    );
    const totalStaffProduced = staffData.reduce(
        (sum, item) => sum + item.phdScholarsProduced,
        0
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
                        minWidth: 0,
                    })}
                >
                    <Stack spacing={3} sx={{ alignItems: 'stretch', mx: { xs: 2, sm: 3, md: 4 }, pb: 5, mt: { xs: 8, md: 0 } }}>
                        <Header />

                        {/* PhD Scholars Count Table */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                PhD Scholars Count
                            </Typography>
                            <Button variant="contained" color="success" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}>
                                Export
                            </Button>
                        </Box>

                        <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search..."
                                    value={staffSearchQuery}
                                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel active={staffOrderBy === 'id'} direction={staffOrderBy === 'id' ? staffOrder : 'asc'} onClick={() => handleStaffSort('id')}>
                                                    S.No
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={staffOrderBy === 'staffName'} direction={staffOrderBy === 'staffName' ? staffOrder : 'asc'} onClick={() => handleStaffSort('staffName')}>
                                                    Staff Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={staffOrderBy === 'department'} direction={staffOrderBy === 'department' ? staffOrder : 'asc'} onClick={() => handleStaffSort('department')}>
                                                    Department
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={staffOrderBy === 'phdScholarsRegistered'} direction={staffOrderBy === 'phdScholarsRegistered' ? staffOrder : 'asc'} onClick={() => handleStaffSort('phdScholarsRegistered')}>
                                                    PhD Scholars Registered
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={staffOrderBy === 'phdScholarsProduced'} direction={staffOrderBy === 'phdScholarsProduced' ? staffOrder : 'asc'} onClick={() => handleStaffSort('phdScholarsProduced')}>
                                                    PhD Scholars Produced
                                                </TableSortLabel>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {paginatedStaff.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">No entries found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedStaff.map((staff) => (
                                                <TableRow key={staff.id} hover>
                                                    <TableCell>{staff.id}</TableCell>
                                                    <TableCell>

                                                        <Link
                                                            href={`/profile/${staff.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            underline="hover"
                                                            sx={{ color: '#1976d2', fontWeight: 600 }}
                                                        >
                                                            {staff.staffName}
                                                        </Link>

                                                    </TableCell>

                                                    <TableCell>{staff.department}</TableCell>
                                                    <TableCell>{staff.phdScholarsRegistered}</TableCell>
                                                    <TableCell>{staff.phdScholarsProduced}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        <TableRow>
                                            <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{totalStaffRegistered}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{totalStaffProduced}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredStaff.length}
                                rowsPerPage={staffRowsPerPage}
                                page={staffPage}
                                onPageChange={(e, newPage) => setStaffPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setStaffRowsPerPage(parseInt(e.target.value, 10));
                                    setStaffPage(0);
                                }}
                            />
                        </Paper>

                        {/* PhD Scholars Details Table */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                PhD Scholars Details
                            </Typography>
                            <Button variant="contained" color="success" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}>
                                Export
                            </Button>
                        </Box>

                        <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>
                                                    S.No
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'staffName'} direction={orderBy === 'staffName' ? order : 'asc'} onClick={() => handleSort('staffName')}>
                                                    Staff Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'department'} direction={orderBy === 'department' ? order : 'asc'} onClick={() => handleSort('department')}>
                                                    Department
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'scholarName'} direction={orderBy === 'scholarName' ? order : 'asc'} onClick={() => handleSort('scholarName')}>
                                                    Scholar Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'topic'} direction={orderBy === 'topic' ? order : 'asc'} onClick={() => handleSort('topic')}>
                                                    Topic (Title)
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'status'} direction={orderBy === 'status' ? order : 'asc'} onClick={() => handleSort('status')}>
                                                    Status
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === 'yearOfCompletion'} direction={orderBy === 'yearOfCompletion' ? order : 'asc'} onClick={() => handleSort('yearOfCompletion')}>
                                                    Year of Completion
                                                </TableSortLabel>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedScholars.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">No entries found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedScholars.map((scholar) => (
                                                <TableRow key={scholar.id} hover>
                                                    <TableCell>{scholar.id}</TableCell>
                                                    <TableCell>
                                                        
                                                        <Link
                                                            href={`/profile/${scholar.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            underline="hover"
                                                            sx={{ color: '#1976d2', fontWeight: 600 }}
                                                        >
                                                            {scholar.staffName}
                                                        </Link>

                                                    </TableCell>

                                                    <TableCell>{scholar.department}</TableCell>
                                                    <TableCell>{scholar.scholarName}</TableCell>
                                                    <TableCell>{scholar.topic}</TableCell>
                                                    <TableCell>
                                                        <Chip label={scholar.status} size="small" color={scholar.status === 'Completed' ? 'success' : 'warning'} sx={{ borderRadius: 1.5 }} />
                                                    </TableCell>
                                                    <TableCell>{scholar.yearOfCompletion}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredScholars.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </Paper>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}