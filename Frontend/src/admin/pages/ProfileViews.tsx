import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import Loader from '../../components/MainComponents/Loader';
import axiosClient from '../../utils/axiosClient';
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

const API_URL = import.meta.env.VITE_API_URL + '/admin/';

export default function ProfileViews(props) {
  const [loading, setLoading] = React.useState(false);
  const [dailyTopViews, setDailyTopViews] = React.useState([]);
  const [weeklyTopViews, setWeeklyTopViews] = React.useState([]);
  const [monthlyTopViews, setMonthlyTopViews] = React.useState([]);
  const [overallTopViews, setOverallTopViews] = React.useState([]);

  const [dailyOrder, setDailyOrder] = React.useState('asc');
  const [dailyOrderBy, setDailyOrderBy] = React.useState('rank');
  
  const [weeklyOrder, setWeeklyOrder] = React.useState('asc');
  const [weeklyOrderBy, setWeeklyOrderBy] = React.useState('rank');
  
  const [monthlyOrder, setMonthlyOrder] = React.useState('asc');
  const [monthlyOrderBy, setMonthlyOrderBy] = React.useState('rank');
  
  const [overallOrder, setOverallOrder] = React.useState('asc');
  const [overallOrderBy, setOverallOrderBy] = React.useState('rank');

  // Fetch data on component mount
  React.useEffect(() => {
    fetchProfileViewsData();
  }, []);

  const fetchProfileViewsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await axiosClient.get(`${API_URL}profile-views-analytics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDailyTopViews(response.data.daily || []);
      setWeeklyTopViews(response.data.weekly || []);
      setMonthlyTopViews(response.data.monthly || []);
      setOverallTopViews(response.data.overall || []);

    } catch (err) {
      console.error('Error fetching profile views data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property, orderBy, order, setOrder, setOrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data, orderBy, order) => {
    return [...data].sort((a, b) => {
      if (orderBy === 'rank' || orderBy === 'views') {
        return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      }
      const aValue = a[orderBy]?.toString().toLowerCase() || '';
      const bValue = b[orderBy]?.toString().toLowerCase() || '';
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  };

  const sortedDaily = sortData(dailyTopViews, dailyOrderBy, dailyOrder);
  const sortedWeekly = sortData(weeklyTopViews, weeklyOrderBy, weeklyOrder);
  const sortedMonthly = sortData(monthlyTopViews, monthlyOrderBy, monthlyOrder);
  const sortedOverall = sortData(overallTopViews, overallOrderBy, overallOrder);

  const renderTable = (data, title, orderBy, order, setOrder, setOrderBy, handleSortFunc) => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel 
                    active={orderBy === 'rank'} 
                    direction={orderBy === 'rank' ? order : 'asc'} 
                    onClick={() => handleSortFunc('rank', orderBy, order, setOrder, setOrderBy)}
                  >
                    Rank
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel 
                    active={orderBy === 'staffName'} 
                    direction={orderBy === 'staffName' ? order : 'asc'} 
                    onClick={() => handleSortFunc('staffName', orderBy, order, setOrder, setOrderBy)}
                  >
                    Staff Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel 
                    active={orderBy === 'department'} 
                    direction={orderBy === 'department' ? order : 'asc'} 
                    onClick={() => handleSortFunc('department', orderBy, order, setOrder, setOrderBy)}
                  >
                    Department
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel 
                    active={orderBy === 'views'} 
                    direction={orderBy === 'views' ? order : 'asc'} 
                    onClick={() => handleSortFunc('views', orderBy, order, setOrder, setOrderBy)}
                  >
                    Views Count
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No entries found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.rank} hover>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>
                      {row.slug ? (
                        <Link
                          href={`/profile/${row.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ color: '#1976d2', fontWeight: 600 }}
                        >
                          {row.staffName}
                        </Link>
                      ) : (
                        row.staffName
                      )}
                    </TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.views.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
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

            {/* Top 5 Daily Views */}
            {renderTable(
              sortedDaily, 
              'Top 5 Daily Views',
              dailyOrderBy,
              dailyOrder,
              setDailyOrder,
              setDailyOrderBy,
              handleSort
            )}

            {/* Top 5 Weekly Views */}
            {renderTable(
              sortedWeekly,
              'Top 5 Weekly Views',
              weeklyOrderBy,
              weeklyOrder,
              setWeeklyOrder,
              setWeeklyOrderBy,
              handleSort
            )}

            {/* Top 5 Monthly Views */}
            {renderTable(
              sortedMonthly,
              'Top 5 Monthly Views',
              monthlyOrderBy,
              monthlyOrder,
              setMonthlyOrder,
              setMonthlyOrderBy,
              handleSort
            )}

            {/* Top 5 Overall Views */}
            {renderTable(
              sortedOverall,
              'Top 5 Overall Views',
              overallOrderBy,
              overallOrder,
              setOverallOrder,
              setOverallOrderBy,
              handleSort
            )}

          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}