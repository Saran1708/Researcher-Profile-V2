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

// Sample funding data
const initialFundings = [
  {
    id: 1,
    staffName: 'Dr. John Doe',
    projectTitle: 'Machine Learning Applications in Healthcare',
    fundingAgency: 'Department of Science and Technology',
    fundingMonthAndYear: 'January 2024',
    fundingAmount: 500000.00,
    fundingStatus: 'Approved'
  },
  {
    id: 2,
    staffName: 'Dr. Jane Smith',
    projectTitle: 'Renewable Energy Systems for Rural Development ',
    fundingAgency: 'Ministry of New and Renewable Energy',
    fundingMonthAndYear: 'March 2024',
    fundingAmount: 750000.00,
    fundingStatus: 'Ongoing'
  },
  {
    id: 3,
    staffName: 'Prof. Robert Wilson',
    projectTitle: 'Advanced Materials for Sustainable Construction',
    fundingAgency: 'Indian Council of Scientific Research',
    fundingMonthAndYear: 'February 2024',
    fundingAmount: 1200000.00,
    fundingStatus: 'Completed'
  },
  {
    id: 4,
    staffName: 'Dr. Emily Brown',
    projectTitle: 'AI-Based Traffic Management System',
    fundingAgency: 'Ministry of Road Transport',
    fundingMonthAndYear: 'April 2024',
    fundingAmount: 850000.00,
    fundingStatus: 'Approved'
  },
  {
    id: 5,
    staffName: 'Dr. Michael Chen',
    projectTitle: 'Blockchain for Supply Chain Transparency',
    fundingAgency: 'National Research Foundation',
    fundingMonthAndYear: 'May 2024',
    fundingAmount: 600000.00,
    fundingStatus: 'Pending'
  },
  {
    id: 6,
    staffName: 'Prof. Sarah Johnson',
    projectTitle: 'Water Purification Technologies',
    fundingAgency: 'Department of Water Resources',
    fundingMonthAndYear: 'June 2024',
    fundingAmount: 950000.00,
    fundingStatus: 'Ongoing'
  },
  {
    id: 7,
    staffName: 'Dr. David Lee',
    projectTitle: 'IoT Solutions for Smart Agriculture',
    fundingAgency: 'Ministry of Agriculture',
    fundingMonthAndYear: 'January 2024',
    fundingAmount: 450000.00,
    fundingStatus: 'Completed'
  },
  {
    id: 8,
    staffName: 'Dr. Maria Garcia',
    projectTitle: 'Cybersecurity Framework for Financial Systems',
    fundingAgency: 'Reserve Bank Innovation Hub',
    fundingMonthAndYear: 'July 2024',
    fundingAmount: 1100000.00,
    fundingStatus: 'Approved'
  }
];

export default function Funding(props: any) {
  const [fundings, setFundings] = React.useState(initialFundings);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('asc');

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
      case 'approved':
        return 'success';
      case 'ongoing':
        return 'primary';
      case 'completed':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />

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

            {/* --------------------- */}
            {/*     YOUR CONTENT      */}
            {/* --------------------- */}

          

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                Funding Details
              </Typography>
              <Button variant="contained" color="success" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}>
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
                    {paginatedFundings.map((funding) => (
                      <TableRow key={funding.id} hover>
                        <TableCell>{funding.id}</TableCell>
                        <TableCell>{funding.staffName}</TableCell>
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
                    ))}
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