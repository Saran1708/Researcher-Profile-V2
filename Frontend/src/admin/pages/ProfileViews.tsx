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

// Sample data for different time periods
const dailyTopViews = [
  { rank: 1, staffName: 'Dr. John Doe', department: 'Computer Science', views: 1245 },
  { rank: 2, staffName: 'Dr. Jane Smith', department: 'Physics', views: 987 },
  { rank: 3, staffName: 'Dr. Robert Wilson', department: 'Mathematics', views: 856 },
  { rank: 4, staffName: 'Dr. Sarah Johnson', department: 'Chemistry', views: 743 },
  { rank: 5, staffName: 'Dr. Michael Brown', department: 'Biology', views: 698 },
];

const weeklyTopViews = [
  { rank: 1, staffName: 'Dr. Jane Smith', department: 'Physics', views: 8234 },
  { rank: 2, staffName: 'Dr. John Doe', department: 'Computer Science', views: 6543 },
  { rank: 3, staffName: 'Dr. Sarah Johnson', department: 'Chemistry', views: 5876 },
  { rank: 4, staffName: 'Dr. Michael Brown', department: 'Biology', views: 4932 },
  { rank: 5, staffName: 'Dr. Robert Wilson', department: 'Mathematics', views: 4521 },
];

const monthlyTopViews = [
  { rank: 1, staffName: 'Dr. Sarah Johnson', department: 'Chemistry', views: 34567 },
  { rank: 2, staffName: 'Dr. Jane Smith', department: 'Physics', views: 28934 },
  { rank: 3, staffName: 'Dr. John Doe', department: 'Computer Science', views: 23456 },
  { rank: 4, staffName: 'Dr. Michael Brown', department: 'Biology', views: 21098 },
  { rank: 5, staffName: 'Dr. Robert Wilson', department: 'Mathematics', views: 18765 },
];

const overallTopViews = [
  { rank: 1, staffName: 'Dr. Jane Smith', department: 'Physics', views: 456789 },
  { rank: 2, staffName: 'Dr. John Doe', department: 'Computer Science', views: 345678 },
  { rank: 3, staffName: 'Dr. Sarah Johnson', department: 'Chemistry', views: 298765 },
  { rank: 4, staffName: 'Dr. Michael Brown', department: 'Biology', views: 267890 },
  { rank: 5, staffName: 'Dr. Robert Wilson', department: 'Mathematics', views: 234567 },
];

export default function ProfileViews(props) {
  const [dailyOrder, setDailyOrder] = React.useState('asc');
  const [dailyOrderBy, setDailyOrderBy] = React.useState('rank');
  
  const [weeklyOrder, setWeeklyOrder] = React.useState('asc');
  const [weeklyOrderBy, setWeeklyOrderBy] = React.useState('rank');
  
  const [monthlyOrder, setMonthlyOrder] = React.useState('asc');
  const [monthlyOrderBy, setMonthlyOrderBy] = React.useState('rank');
  
  const [overallOrder, setOverallOrder] = React.useState('asc');
  const [overallOrderBy, setOverallOrderBy] = React.useState('rank');

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

            {/* Top 5 Daily Views */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top 5 Daily Views
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel 
                          active={dailyOrderBy === 'rank'} 
                          direction={dailyOrderBy === 'rank' ? dailyOrder : 'asc'} 
                          onClick={() => handleSort('rank', dailyOrderBy, dailyOrder, setDailyOrder, setDailyOrderBy)}
                        >
                          Rank
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={dailyOrderBy === 'staffName'} 
                          direction={dailyOrderBy === 'staffName' ? dailyOrder : 'asc'} 
                          onClick={() => handleSort('staffName', dailyOrderBy, dailyOrder, setDailyOrder, setDailyOrderBy)}
                        >
                          Staff Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={dailyOrderBy === 'department'} 
                          direction={dailyOrderBy === 'department' ? dailyOrder : 'asc'} 
                          onClick={() => handleSort('department', dailyOrderBy, dailyOrder, setDailyOrder, setDailyOrderBy)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={dailyOrderBy === 'views'} 
                          direction={dailyOrderBy === 'views' ? dailyOrder : 'asc'} 
                          onClick={() => handleSort('views', dailyOrderBy, dailyOrder, setDailyOrder, setDailyOrderBy)}
                        >
                          Views Count
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedDaily.map((row) => (
                      <TableRow key={row.rank} hover>
                        <TableCell>{row.rank}</TableCell>
                        <TableCell>{row.staffName}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Top 5 Weekly Views */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top 5 Weekly Views
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel 
                          active={weeklyOrderBy === 'rank'} 
                          direction={weeklyOrderBy === 'rank' ? weeklyOrder : 'asc'} 
                          onClick={() => handleSort('rank', weeklyOrderBy, weeklyOrder, setWeeklyOrder, setWeeklyOrderBy)}
                        >
                          Rank
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={weeklyOrderBy === 'staffName'} 
                          direction={weeklyOrderBy === 'staffName' ? weeklyOrder : 'asc'} 
                          onClick={() => handleSort('staffName', weeklyOrderBy, weeklyOrder, setWeeklyOrder, setWeeklyOrderBy)}
                        >
                          Staff Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={weeklyOrderBy === 'department'} 
                          direction={weeklyOrderBy === 'department' ? weeklyOrder : 'asc'} 
                          onClick={() => handleSort('department', weeklyOrderBy, weeklyOrder, setWeeklyOrder, setWeeklyOrderBy)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={weeklyOrderBy === 'views'} 
                          direction={weeklyOrderBy === 'views' ? weeklyOrder : 'asc'} 
                          onClick={() => handleSort('views', weeklyOrderBy, weeklyOrder, setWeeklyOrder, setWeeklyOrderBy)}
                        >
                          Views Count
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedWeekly.map((row) => (
                      <TableRow key={row.rank} hover>
                        <TableCell>{row.rank}</TableCell>
                        <TableCell>{row.staffName}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Top 5 Monthly Views */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top 5 Monthly Views
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel 
                          active={monthlyOrderBy === 'rank'} 
                          direction={monthlyOrderBy === 'rank' ? monthlyOrder : 'asc'} 
                          onClick={() => handleSort('rank', monthlyOrderBy, monthlyOrder, setMonthlyOrder, setMonthlyOrderBy)}
                        >
                          Rank
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={monthlyOrderBy === 'staffName'} 
                          direction={monthlyOrderBy === 'staffName' ? monthlyOrder : 'asc'} 
                          onClick={() => handleSort('staffName', monthlyOrderBy, monthlyOrder, setMonthlyOrder, setMonthlyOrderBy)}
                        >
                          Staff Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={monthlyOrderBy === 'department'} 
                          direction={monthlyOrderBy === 'department' ? monthlyOrder : 'asc'} 
                          onClick={() => handleSort('department', monthlyOrderBy, monthlyOrder, setMonthlyOrder, setMonthlyOrderBy)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={monthlyOrderBy === 'views'} 
                          direction={monthlyOrderBy === 'views' ? monthlyOrder : 'asc'} 
                          onClick={() => handleSort('views', monthlyOrderBy, monthlyOrder, setMonthlyOrder, setMonthlyOrderBy)}
                        >
                          Views Count
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedMonthly.map((row) => (
                      <TableRow key={row.rank} hover>
                        <TableCell>{row.rank}</TableCell>
                        <TableCell>{row.staffName}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Top 5 Overall Views */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top 5 Overall Views
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel 
                          active={overallOrderBy === 'rank'} 
                          direction={overallOrderBy === 'rank' ? overallOrder : 'asc'} 
                          onClick={() => handleSort('rank', overallOrderBy, overallOrder, setOverallOrder, setOverallOrderBy)}
                        >
                          Rank
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={overallOrderBy === 'staffName'} 
                          direction={overallOrderBy === 'staffName' ? overallOrder : 'asc'} 
                          onClick={() => handleSort('staffName', overallOrderBy, overallOrder, setOverallOrder, setOverallOrderBy)}
                        >
                          Staff Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={overallOrderBy === 'department'} 
                          direction={overallOrderBy === 'department' ? overallOrder : 'asc'} 
                          onClick={() => handleSort('department', overallOrderBy, overallOrder, setOverallOrder, setOverallOrderBy)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel 
                          active={overallOrderBy === 'views'} 
                          direction={overallOrderBy === 'views' ? overallOrder : 'asc'} 
                          onClick={() => handleSort('views', overallOrderBy, overallOrder, setOverallOrder, setOverallOrderBy)}
                        >
                          Views Count
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedOverall.map((row) => (
                      <TableRow key={row.rank} hover>
                        <TableCell>{row.rank}</TableCell>
                        <TableCell>{row.staffName}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}