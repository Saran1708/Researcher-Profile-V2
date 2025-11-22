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
import Loader from '../../components/MainComponents/Loader';
import axiosClient from '../../utils/axiosClient';
import { Link as RouterLink } from 'react-router-dom';
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

const API_URL = import.meta.env.VITE_API_URL + '/admin/publications/';

export default function Publications(props: any) {
  const [publications, setPublications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('asc');

  // Fetch publications data from backend
  React.useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await axiosClient.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPublications(res.data);
    } catch (err) {
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

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
        return 'success';   // Green for Journal
      case 'book':
        return 'primary';   // Blue for Book
      case 'article':
        return 'warning';      // Light blue for Article

      default:
        return 'default';   // Grey fallback
    }
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
                    {/* 👉 Show "No data found" if empty */}
                    {filteredPublications.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.7 }}>
                            No entries found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {paginatedPublications.map((publication) => (
                      <TableRow key={publication.id} hover>
                        <TableCell>{publication.id}</TableCell>
                        <TableCell>
                          
                          <Link
                            href={`/profile/${publication.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ color: '#1976d2', fontWeight: 600 }}
                          >
                            {publication.name}
                          </Link>

                        </TableCell>
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
