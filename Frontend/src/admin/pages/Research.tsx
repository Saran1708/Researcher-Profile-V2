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
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
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

// Sample data for Research Publications
const initialResearchData = [
  {
    id: 1,
    name: 'Dr. John Doe',
    research_title: 'Deep Learning Applications in Medical Imaging',
    research_link: 'https://example.com/research1'
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    research_title: 'Quantum Computing for Cryptographic Systems',
    research_link: 'https://example.com/research2'
  },
  {
    id: 3,
    name: 'Dr. Robert Wilson',
    research_title: 'Statistical Analysis of Climate Change Data',
    research_link: 'https://example.com/research3'
  },
  {
    id: 4,
    name: 'Dr. Sarah Johnson',
    research_title: 'Green Chemistry and Sustainable Catalysis',
    research_link: 'https://example.com/research4'
  },
  {
    id: 5,
    name: 'Dr. Michael Brown',
    research_title: 'CRISPR Technology in Agricultural Biotechnology',
    research_link: 'https://example.com/research5'
  }
];

// Sample data for Research Areas
const initialResearchAreas = [
  {
    id: 1,
    name: 'Dr. John Doe',
    research_areas: 'Artificial Intelligence, Machine Learning, Computer Vision'
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    research_areas: 'Quantum Computing, Quantum Cryptography, Quantum Algorithms'
  },
  {
    id: 3,
    name: 'Dr. Robert Wilson',
    research_areas: 'Statistical Modeling, Data Science, Predictive Analytics'
  },
  {
    id: 4,
    name: 'Dr. Sarah Johnson',
    research_areas: 'Organic Chemistry, Green Chemistry, Catalysis'
  },
  {
    id: 5,
    name: 'Dr. Michael Brown',
    research_areas: 'Genetic Engineering, Biotechnology, Plant Biology'
  }
];

export default function Research(props) {
  // Research Publications State
  const [researchData] = React.useState(initialResearchData);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState('id');
  const [order, setOrder] = React.useState('asc');

  // Research Areas State
  const [researchAreas] = React.useState(initialResearchAreas);
  const [areasSearchQuery, setAreasSearchQuery] = React.useState('');
  const [areasPage, setAreasPage] = React.useState(0);
  const [areasRowsPerPage, setAreasRowsPerPage] = React.useState(10);
  const [areasOrderBy, setAreasOrderBy] = React.useState('id');
  const [areasOrder, setAreasOrder] = React.useState('asc');

  // Research Publications Handlers
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredResearch = researchData.filter(research =>
    research.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    research.research_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedResearch = [...filteredResearch].sort((a, b) => {
    if (orderBy === 'id') return order === 'asc' ? a.id - b.id : b.id - a.id;
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const paginatedResearch = sortedResearch.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Research Areas Handlers
  const handleAreasSort = (property) => {
    const isAsc = areasOrderBy === property && areasOrder === 'asc';
    setAreasOrder(isAsc ? 'desc' : 'asc');
    setAreasOrderBy(property);
  };

  const filteredAreas = researchAreas.filter(area =>
    area.name.toLowerCase().includes(areasSearchQuery.toLowerCase()) ||
    area.research_areas.toLowerCase().includes(areasSearchQuery.toLowerCase())
  );

  const sortedAreas = [...filteredAreas].sort((a, b) => {
    if (areasOrderBy === 'id') return areasOrder === 'asc' ? a.id - b.id : b.id - a.id;
    const aValue = a[areasOrderBy]?.toString().toLowerCase() || '';
    const bValue = b[areasOrderBy]?.toString().toLowerCase() || '';
    return areasOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const paginatedAreas = sortedAreas.slice(
    areasPage * areasRowsPerPage,
    areasPage * areasRowsPerPage + areasRowsPerPage
  );

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
            minWidth: 0,
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
            {/* Research Publications Table */}
            {/* --------------------- */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Research Ids
              </Typography>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<DownloadIcon />} 
                sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
              >
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
                          active={orderBy === 'research_title'} 
                          direction={orderBy === 'research_title' ? order : 'asc'} 
                          onClick={() => handleSort('research_title')}
                        >
                          Research Title
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        Research Link
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedResearch.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No entries found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedResearch.map((research) => (
                        <TableRow key={research.id} hover>
                          <TableCell>{research.id}</TableCell>
                          <TableCell>{research.name}</TableCell>
                          <TableCell>{research.research_title}</TableCell>
                          <TableCell>
                            <Link 
                              href={research.research_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ textDecoration: 'none' }}
                            >
                              View Link
                            </Link>
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
                count={filteredResearch.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Paper>

            {/* --------------------- */}
            {/* Research Areas Table */}
            {/* --------------------- */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Research Areas
              </Typography>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<DownloadIcon />} 
                sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
              >
                Export
              </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                <TextField
                  fullWidth
                  placeholder="Search..."
                  value={areasSearchQuery}
                  onChange={(e) => setAreasSearchQuery(e.target.value)}
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
                        <TableSortLabel 
                          active={areasOrderBy === 'id'} 
                          direction={areasOrderBy === 'id' ? areasOrder : 'asc'} 
                          onClick={() => handleAreasSort('id')}
                        >
                          ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={areasOrderBy === 'name'} 
                          direction={areasOrderBy === 'name' ? areasOrder : 'asc'} 
                          onClick={() => handleAreasSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={areasOrderBy === 'research_areas'} 
                          direction={areasOrderBy === 'research_areas' ? areasOrder : 'asc'} 
                          onClick={() => handleAreasSort('research_areas')}
                        >
                          Research Areas
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAreas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No entries found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAreas.map((area) => (
                        <TableRow key={area.id} hover>
                          <TableCell>{area.id}</TableCell>
                          <TableCell>{area.name}</TableCell>
                          <TableCell>{area.research_areas}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAreas.length}
                rowsPerPage={areasRowsPerPage}
                page={areasPage}
                onPageChange={(e, newPage) => setAreasPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setAreasRowsPerPage(parseInt(e.target.value, 10));
                  setAreasPage(0);
                }}
              />
            </Paper>

          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}