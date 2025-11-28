import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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

import { 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  Paper
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EventIcon from "@mui/icons-material/Event";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';


const xThemeComponents = {
  ...chartsCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const API_URL = import.meta.env.VITE_API_URL + '/admin/dashboard/';

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [selectedDepartment, setSelectedDepartment] = React.useState('Overall');
  const [loading, setLoading] = React.useState(false);
  
  // Stats state
  const [stats, setStats] = React.useState({
    researchAreas: 0,
    researchIDs: 0,
    publications: 0,
    fundings: 0,
    conferences: 0,
    phdSupervisions: 0,
    adminPositions: 0,
    honoraryPositions: 0,
    resourcePerson: 0,
    collaborations: 0,
    consultancies: 0,
  });

  // Charts data state
  const [publicationsYearlyData, setPublicationsYearlyData] = React.useState<Array<{year: string, count: number}>>([]);
  const [researchDistribution, setResearchDistribution] = React.useState<Array<{label: string, value: number}>>([]);
  const [fundingTrend, setFundingTrend] = React.useState<Array<{year: string, amount: number}>>([]);
  const [supervisionData, setSupervisionData] = React.useState<Array<{category: string, count: number}>>([]);

  const handleDepartmentChange = (event: any) => {
    setSelectedDepartment(event.target.value);
  };

  // Fetch all dashboard data
  const fetchDashboardData = async (department: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { department }
      };

      // Fetch all data in parallel
      const [statsRes, publicationsRes, distributionRes, fundingRes, phdRes] = await Promise.all([
        axiosClient.get(`${API_URL}stats/`, config),
        axiosClient.get(`${API_URL}publications-trend/`, config),
        axiosClient.get(`${API_URL}research-distribution/`, config),
        axiosClient.get(`${API_URL}funding-trend/`, config),
        axiosClient.get(`${API_URL}phd-status/`, config),
      ]);

      setStats(statsRes.data);
      setPublicationsYearlyData(publicationsRes.data);
      setResearchDistribution(distributionRes.data);
      setFundingTrend(fundingRes.data);
      setSupervisionData(phdRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when department changes
  React.useEffect(() => {
    fetchDashboardData(selectedDepartment);
  }, [selectedDepartment]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {loading && <Loader />}
      
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        {/* Main content */}
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

            {/* Department Filter Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                Research Analytics Dashboard
              </Typography>
              
              <FormControl sx={{ minWidth: { xs: '100%', sm: 300 } }}>
                <Select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="Overall">
                    <Typography fontWeight={600}>Overall</Typography>
                  </MenuItem>
                  
                  <MenuItem disabled>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      Aided Departments
                    </Typography>
                  </MenuItem>
                  <MenuItem value="English - Aided">English</MenuItem>
                  <MenuItem value="Tamil - Aided">Tamil</MenuItem>
                  <MenuItem value="Languages - Aided">Languages</MenuItem>
                  <MenuItem value="History - Aided">History</MenuItem>
                  <MenuItem value="Political Science - Aided">Political Science</MenuItem>
                  <MenuItem value="Public Administration - Aided">Public Administration</MenuItem>
                  <MenuItem value="Economics - Aided">Economics</MenuItem>
                  <MenuItem value="Philosophy - Aided">Philosophy</MenuItem>
                  <MenuItem value="Commerce - Aided">Commerce</MenuItem>
                  <MenuItem value="Social Work - Aided">Social Work</MenuItem>
                  <MenuItem value="Mathematics - Aided">Mathematics</MenuItem>
                  <MenuItem value="Statistics - Aided">Statistics</MenuItem>
                  <MenuItem value="Physics - Aided">Physics</MenuItem>
                  <MenuItem value="Chemistry - Aided">Chemistry</MenuItem>
                  <MenuItem value="Botany - Aided">Botany</MenuItem>
                  <MenuItem value="Zoology - Aided">Zoology</MenuItem>
                  <MenuItem value="Physical Education - Aided">Physical Education</MenuItem>
                  
                  <MenuItem disabled>
                    <Typography variant="subtitle2" fontWeight="bold" color="secondary">
                      Self-Financed Departments
                    </Typography>
                  </MenuItem>
                  <MenuItem value="English - SFS">English</MenuItem>
                  <MenuItem value="Tamil - SFS">Tamil</MenuItem>
                  <MenuItem value="Languages - SFS">Languages</MenuItem>
                  <MenuItem value="Journalism - SFS">Journalism</MenuItem>
                  <MenuItem value="Social Work - SFS">Social Work</MenuItem>
                  <MenuItem value="Commerce - SFS">Commerce</MenuItem>
                  <MenuItem value="Business Administration - SFS">Business Administration</MenuItem>
                  <MenuItem value="Communication - SFS">Communication</MenuItem>
                  <MenuItem value="Geography - SFS">Geography</MenuItem>
                  <MenuItem value="Tourism Studies - SFS">Tourism Studies</MenuItem>
                  <MenuItem value="Mathematics - SFS">Mathematics</MenuItem>
                  <MenuItem value="Physics - SFS">Physics</MenuItem>
                  <MenuItem value="Chemistry - SFS">Chemistry</MenuItem>
                  <MenuItem value="Microbiology - SFS">Microbiology</MenuItem>
                  <MenuItem value="Computer Application (BCA) - SFS">Computer Application (BCA)</MenuItem>
                  <MenuItem value="Computer Science (B.Sc) - SFS">Computer Science (B.Sc)</MenuItem>
                  <MenuItem value="Computer Science (MCA) - SFS">Computer Science (MCA)</MenuItem>
                  <MenuItem value="Visual Communication - SFS">Visual Communication</MenuItem>
                  <MenuItem value="Physical Education, Health Education and Sports - SFS">Physical Education, Health Education and Sports</MenuItem>
                  <MenuItem value="Psychology - SFS">Psychology</MenuItem>
                  <MenuItem value="Data Science - SFS">Data Science</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* DASHBOARD CARDS */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                mt: 2,
              }}
            >
              {/* Research Areas */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    RESEARCH AREAS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.researchAreas}
                  </Typography>
                </CardContent>
                <SchoolIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Research IDs */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'success.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    RESEARCH IDs
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.researchIDs}
                  </Typography>
                </CardContent>
                <FingerprintIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Publications */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'info.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    PUBLICATIONS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.publications}
                  </Typography>
                </CardContent>
                <MenuBookIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Fundings */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'warning.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    FUNDINGS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.fundings}
                  </Typography>
                </CardContent>
                <AccountBalanceIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Conferences */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'error.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    CONFERENCES
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.conferences}
                  </Typography>
                </CardContent>
                <EventIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* PhD Supervisions */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'secondary.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    PhD SUPERVISIONS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.phdSupervisions}
                  </Typography>
                </CardContent>
                <SupervisorAccountIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Admin Positions */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    ADMIN POSITIONS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.adminPositions}
                  </Typography>
                </CardContent>
                <AdminPanelSettingsIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Honorary Positions */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'success.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    HONORARY POSITIONS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.honoraryPositions}
                  </Typography>
                </CardContent>
                <EmojiEventsIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Resource Person */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'info.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    RESOURCE PERSON
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.resourcePerson}
                  </Typography>
                </CardContent>
                <PersonIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Collaborations */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'warning.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    COLLABORATIONS
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.collaborations}
                  </Typography>
                </CardContent>
                <HandshakeIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>

              {/* Consultancies */}
              <Card
                sx={{
                  mt: 2,
                  borderLeft: 4,
                  borderColor: 'error.main',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
                    CONSULTANCIES
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mt: 0.5 }}>
                    {stats.consultancies}
                  </Typography>
                </CardContent>
                <BusinessCenterIcon sx={{ fontSize: { xs: 25, sm: 30 }, color: 'text.disabled', ml: 1 }} />
              </Card>
            </Box>

            {/* CHARTS SECTION */}
            <Box
              sx={{
                mt: 4,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: { xs: 2, sm: 2.5, md: 3 },

              }}
            >
              {/* Publications Trend */}
              <Paper sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2} sx={{ fontSize: { xs: '0.9rem', sm: '1.10rem' } }}>
                  Publications Trend (Last 5 Years)
                </Typography>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: publicationsYearlyData.map(d => d.year) }]}
                    series={[{ data: publicationsYearlyData.map(d => d.count), label: 'Publications', color: '#1976d2' }]}
                    height={300}
                    margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
                  />
                </Box>
              </Paper>

              {/* Research Distribution */}
              <Paper sx={{mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2} sx={{ fontSize: { xs: '0.9rem', sm: '1.10rem' } }}>
                  Research Activities Distribution
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <PieChart
                    series={[
                      {
                        data: researchDistribution.map((item, index) => ({
                          id: index,
                          value: item.value,
                          label: item.label,
                        })),
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 5,
                      },
                    ]}
                    height={300}
                    slotProps={{
                      legend: {
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'right' },
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              </Paper>

              {/* Funding Trend */}
              <Paper sx={{mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2} sx={{ fontSize: { xs: '0.9rem', sm: '1.10rem' } }}>
                  Funding Trend (Last 5 Years)
                </Typography>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <LineChart
                    xAxis={[{ scaleType: 'point', data: fundingTrend.map(d => d.year) }]}
                    series={[
                      {
                        data: fundingTrend.map(d => d.amount),
                        label: 'Funding Amount (₹)',
                        color: '#2e7d25',
                        curve: 'catmullRom',
                      },
                    ]}
                    height={300}
                    margin={{ top: 10, bottom: 30, left: 70, right: 10 }}
                  />
                </Box>
              </Paper>

              {/* PhD Supervision Status */}
              <Paper sx={{ mt: 3,p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2} sx={{ fontSize: { xs: '0.9rem', sm: '1.10rem' } }}>
                  PhD Supervision Status
                </Typography>
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: supervisionData.map(d => d.category) }]}
                    series={[
                      {
                        data: supervisionData.map(d => d.count),
                        label: 'Count',
                        color: '#9c27b0',
                      },
                    ]}
                    height={300}
                    margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
                  />
                </Box>
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}