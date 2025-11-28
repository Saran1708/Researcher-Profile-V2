import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from '../../components/MainComponents/Loader';
import axiosClient from '../../utils/axiosClient';
import * as XLSX from 'xlsx';
import {
  chartsCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const xThemeComponents = {
  ...chartsCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const API_URL = import.meta.env.VITE_API_URL + '/admin/funding/';

export default function Funding(props: any) {
  const [fundings, setFundings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('asc');

  // Fetch funding data on component mount
  React.useEffect(() => {
    fetchFundingData();
  }, []);

  const fetchFundingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await axiosClient.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFundings(res.data);
    } catch (err) {
      console.error('Error fetching funding data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredFundings = fundings.filter(funding =>
    funding.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    funding.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    funding.fundingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    funding.fundingStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFundings = [...filteredFundings].sort((a, b) => {
    if (orderBy === 'id' || orderBy === 'fundingAmount') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginatedFundings = sortedFundings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';   // ✅ same as PhD completed
      case 'ongoing':
        return 'warning';   // ✅ same as PhD ongoing
      default:
        return 'default';   // for anything else
    }
  };

  // Export Funding Details to Excel
  const exportFundingToExcel = () => {
    // Prepare data for export
    const exportData = sortedFundings.map((funding) => ({
      'ID': funding.id,
      'Staff Name': funding.staffName,
      'Project Title': funding.projectTitle,
      'Funding Agency': funding.fundingAgency,
      'Month & Year': funding.fundingMonthAndYear,
      'Amount (₹)': funding.fundingAmount,
      'Status': funding.fundingStatus,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 8 },  // ID
      { wch: 30 }, // Staff Name
      { wch: 50 }, // Project Title
      { wch: 35 }, // Funding Agency
      { wch: 15 }, // Month & Year
      { wch: 15 }, // Amount
      { wch: 15 }, // Status
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Funding Details');

    // Generate file name with current date
    const fileName = `Funding_Details_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);
  };

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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                Funding Details
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={exportFundingToExcel}
                sx={{
                  borderRadius: 2, textTransform: 'none', px: 3, py: 1,
                  '&:hover': {
                    backgroundColor: '#43a047', // lighter green
                  }

                }}
              >
                Export
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
                  placeholder="Search by staff name, project title, agency, or status..."
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
                          active={orderBy === 'staffName'}
                          direction={orderBy === 'staffName' ? order : 'asc'}
                          onClick={() => handleSort('staffName')}
                        >
                          Staff Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'projectTitle'}
                          direction={orderBy === 'projectTitle' ? order : 'asc'}
                          onClick={() => handleSort('projectTitle')}
                        >
                          Project Title
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'fundingAgency'}
                          direction={orderBy === 'fundingAgency' ? order : 'asc'}
                          onClick={() => handleSort('fundingAgency')}
                        >
                          Funding Agency
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'fundingMonthAndYear'}
                          direction={orderBy === 'fundingMonthAndYear' ? order : 'asc'}
                          onClick={() => handleSort('fundingMonthAndYear')}
                        >
                          Month & Year
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'fundingAmount'}
                          direction={orderBy === 'fundingAmount' ? order : 'asc'}
                          onClick={() => handleSort('fundingAmount')}
                        >
                          Amount (₹)
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'fundingStatus'}
                          direction={orderBy === 'fundingStatus' ? order : 'asc'}
                          onClick={() => handleSort('fundingStatus')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedFundings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No funding records found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedFundings.map((funding) => (
                        <TableRow key={funding.id} hover>
                          <TableCell>{funding.id}</TableCell>
                          <TableCell>

                            <Link
                              href={`/profile/${funding.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{ color: '#1976d2', fontWeight: 600 }}
                            >
                              {funding.staffName}
                            </Link>

                          </TableCell>

                          <TableCell>{funding.projectTitle}</TableCell>
                          <TableCell>{funding.fundingAgency}</TableCell>
                          <TableCell>{funding.fundingMonthAndYear}</TableCell>
                          <TableCell>₹{funding.fundingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Chip
                              label={funding.fundingStatus}
                              size="small"
                              color={getStatusColor(funding.fundingStatus)}
                              sx={{ borderRadius: 1.5 }}
                            />

                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredFundings.length}
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