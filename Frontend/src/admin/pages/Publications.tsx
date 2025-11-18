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
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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

// Sample publications data
const initialPublications = [
  {
    id: 1,
    name: 'Dr. John Doe',
    publicationTitle: 'Deep Learning Approaches for Medical Image Analysis',
    publicationLink: 'https://doi.org/10.1234/example1',
    publicationType: 'Journal',
    publicationMonthAndYear: 'January 2024'
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    publicationTitle: 'Solar Energy Optimization in Smart Grid Systems',
    publicationLink: 'https://doi.org/10.1234/example2',
    publicationType: 'Conference',
    publicationMonthAndYear: 'March 2024'
  },
  {
    id: 3,
    name: 'Prof. Robert Wilson',
    publicationTitle: 'Sustainable Building Materials: A Comprehensive Review',
    publicationLink: 'https://doi.org/10.1234/example3',
    publicationType: 'Journal',
    publicationMonthAndYear: 'February 2024'
  },
  {
    id: 4,
    name: 'Dr. Emily Brown',
    publicationTitle: 'Machine Learning for Traffic Flow Prediction',
    publicationLink: 'https://doi.org/10.1234/example4',
    publicationType: 'Conference',
    publicationMonthAndYear: 'April 2024'
  },
  {
    id: 5,
    name: 'Dr. Michael Chen',
    publicationTitle: 'Blockchain Technology in Supply Chain Management',
    publicationLink: 'https://doi.org/10.1234/example5',
    publicationType: 'Journal',
    publicationMonthAndYear: 'May 2024'
  },
  {
    id: 6,
    name: 'Prof. Sarah Johnson',
    publicationTitle: 'Advanced Filtration Systems for Water Treatment',
    publicationLink: 'https://doi.org/10.1234/example6',
    publicationType: 'Book Chapter',
    publicationMonthAndYear: 'June 2024'
  },
  {
    id: 7,
    name: 'Dr. David Lee',
    publicationTitle: 'IoT Applications in Precision Agriculture',
    publicationLink: 'https://doi.org/10.1234/example7',
    publicationType: 'Conference',
    publicationMonthAndYear: 'January 2024'
  },
  {
    id: 8,
    name: 'Dr. Maria Garcia',
    publicationTitle: 'Cybersecurity Frameworks for Banking Systems',
    publicationLink: 'https://doi.org/10.1234/example8',
    publicationType: 'Journal',
    publicationMonthAndYear: 'July 2024'
  },
  {
    id: 9,
    name: 'Dr. John Doe',
    publicationTitle: 'Neural Networks in Healthcare Diagnostics',
    publicationLink: 'https://doi.org/10.1234/example9',
    publicationType: 'Journal',
    publicationMonthAndYear: 'August 2024'
  },
  {
    id: 10,
    name: 'Prof. Sarah Johnson',
    publicationTitle: 'Environmental Impact of Water Purification Technologies',
    publicationLink: 'https://doi.org/10.1234/example10',
    publicationType: 'Conference',
    publicationMonthAndYear: 'September 2024'
  }
];

export default function Publications(props: any) {
  const [publications, setPublications] = React.useState(initialPublications);
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

  const filteredPublications = publications.filter(publication =>
    publication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.publicationTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.publicationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.publicationMonthAndYear.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (orderBy === 'id') {
      return order === 'asc' ? a.id - b.id : b.id - a.id;
    }
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginatedPublications = sortedPublications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'journal':
        return 'primary';
      case 'conference':
        return 'success';
      case 'book chapter':
        return 'info';
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
                Publications Details
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
                  placeholder="Search by name, title, type, or date..."
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
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'publicationTitle'}
                          direction={orderBy === 'publicationTitle' ? order : 'asc'}
                          onClick={() => handleSort('publicationTitle')}
                        >
                          Publication Title
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        Publication Link
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'publicationType'}
                          direction={orderBy === 'publicationType' ? order : 'asc'}
                          onClick={() => handleSort('publicationType')}
                        >
                          Type
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'publicationMonthAndYear'}
                          direction={orderBy === 'publicationMonthAndYear' ? order : 'asc'}
                          onClick={() => handleSort('publicationMonthAndYear')}
                        >
                          Month & Year
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPublications.map((publication) => (
                      <TableRow key={publication.id} hover>
                        <TableCell>{publication.id}</TableCell>
                        <TableCell>{publication.name}</TableCell>
                        <TableCell>{publication.publicationTitle}</TableCell>
                        <TableCell>
                          <Link
                            href={publication.publicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            View
                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={publication.publicationType}
                            size="small"
                            color={getTypeColor(publication.publicationType)}
                            sx={{ borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>{publication.publicationMonthAndYear}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPublications.length}
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