import * as React from "react";
import { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BiotechIcon from "@mui/icons-material/Biotech";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import axiosClient from '../../utils/axiosClient';
import ResearchLoader from "../MainComponents/Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const IncompleteCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "32px 24px",
  maxWidth: 480,
  width: "100%",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 16px",
    margin: "0 12px",
  },
}));

const MainCard = styled(Paper)(({ theme }) => ({
  maxWidth: "1150px",
  margin: "0 auto",
  marginTop: theme.spacing(18),
  padding: theme.spacing(4),
  position: "relative",
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  border: "1px solid",
  borderColor: theme.palette.divider,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

export default function Dashboard() {
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [serverError, setServerError] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    educations: 0,
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
    careerHighlights: 0,
    researchCareer: 0,
  });

  // Mock data for profile views (as you mentioned)
  const [profileViews, setProfileViews] = useState({
    total: 0,
    weekly: 0,
    monthly: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch profile status and all data in parallel
      const [
        statusRes,
        staffRes,
        educationRes,
        researchRes,
        researchIdRes,
        publicationRes,
        fundingRes,
        conferenceRes,
        phdRes,
        adminRes,
        honoraryRes,
        resourceRes,
        collaborationRes,
        consultancyRes,
        careerHighlightRes,
        researchCareerRes,
        analyticsRes
      ] = await Promise.all([
        axiosClient.get(`${API_BASE_URL}/profile/status/`, { headers }),
        axiosClient.get(`${API_BASE_URL}/staff-details/`, { headers }).catch(() => ({ data: null })),
        axiosClient.get(`${API_BASE_URL}/education/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research-id/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/publication/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/funding/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/conference/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/phd/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/administration-position/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/honary-position/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/resource-person/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/collaboration/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/consultancy/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/career-highlight/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research-career/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/profile/analytics/`, { headers }).catch(() => ({ data: null })),
      ]);

      setProfileStatus(statusRes.data);

      // If profile is incomplete, stop here
      if (!statusRes.data.is_profile_complete) {
        setLoading(false);
        return;
      }

      if (analyticsRes?.data) {
        setProfileViews(analyticsRes.data);
      }


      // Set user data
      if (staffRes.data) {
        let profilePicUrl = staffRes.data.profile_picture || '';
        if (profilePicUrl && !profilePicUrl.startsWith('http')) {
          if (!profilePicUrl.startsWith('/')) {
            profilePicUrl = '/' + profilePicUrl;
          }
          profilePicUrl = import.meta.env.VITE_BASE_URL + profilePicUrl;
        }

        setUserData({
          name: `${staffRes.data.prefix || ''} ${staffRes.data.name || ''}`.trim(),
          department: staffRes.data.department || '',
          profilePic: profilePicUrl,
        });
      }

      // Set statistics
      setDashboardStats({
        educations: educationRes.data?.length || 0,
        researchAreas: researchRes.data?.length || 0,
        researchIDs: researchIdRes.data?.length || 0,
        publications: publicationRes.data?.length || 0,
        fundings: fundingRes.data?.length || 0,
        conferences: conferenceRes.data?.length || 0,
        phdSupervisions: phdRes.data?.length || 0,
        adminPositions: adminRes.data?.length || 0,
        honoraryPositions: honoraryRes.data?.length || 0,
        resourcePerson: resourceRes.data?.length || 0,
        collaborations: collaborationRes.data?.length || 0,
        consultancies: consultancyRes.data?.length || 0,
        careerHighlights: careerHighlightRes.data?.length || 0,
        researchCareer: researchCareerRes.data?.length || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setServerError(true);
      setLoading(false);
    }
  };

  if (serverError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <IncompleteCard sx={{ maxWidth: 520, textAlign: "center", p: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 50, color: "error.main", mb: 2 }} />

          <Typography variant="h5" fontWeight={700} mb={1}>
            Error Fetching Details
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Unable to connect to the server. Please try again later.
          </Typography>

          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </IncompleteCard>
      </Box>
    );
  }


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResearchLoader />
      </Box>
    );
  }

  if (!profileStatus?.is_profile_complete) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <IncompleteCard sx={{ maxWidth: 520, textAlign: "left", p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mr: 2 }} />
            <Typography variant="h5" fontWeight={700}>
              Your Profile Setup is Incomplete
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            To access your personalized dashboard and analytics, please complete
            the following sections:
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
            {[
              "Staff Details",
              "Education Details",
              "Career Highlights",
              "Research Career",
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AssignmentIcon sx={{ fontSize: 18 }} />
                {item}
              </Box>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Once all required sections are filled, your profile will be reviewed
            and unlocked for dashboard access.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontWeight: 600, py: 1.2, borderRadius: 2 }}
            onClick={() => (window.location.href = "/staff/edit")}
          >
            Go to Edit Profile
          </Button>
        </IncompleteCard>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <MainCard>
          {/* Welcome Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
              <Avatar
                src={userData?.profilePic}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid",
                  borderColor: "primary.main",
                  boxShadow: 3,
                }}
              >
                {!userData?.profilePic && <PersonIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  Welcome back, {userData?.name?.split(' ').slice(1).join(' ')}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData?.department}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 4 }} />

          {/* Profile Views Section (Mock Data) */}
          <Box mb={5}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Profile Analytics
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <VisibilityIcon sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Total Views
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  {profileViews.total.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All time profile visits
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 20, color: "success.main", mr: 1.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Weekly Views
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  {profileViews.weekly}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
                    {profileViews.weeklyGrowth}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    from last week
                  </Typography>
                </Box>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 20, color: "info.main", mr: 1.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Monthly Views
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  {profileViews.monthly}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "info.main", fontWeight: 600 }}>
                    {profileViews.monthlyGrowth}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    from last month
                  </Typography>
                </Box>
              </StatsCard>
            </Box>
          </Box>

          {/* Academic & Research Stats (Real Data) */}
          <Box mb={5}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Academic & Research Overview
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <MenuBookIcon sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Education
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.educations}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BiotechIcon sx={{ fontSize: 20, color: "secondary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Research Areas
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.researchAreas}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 20, color: "info.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Research IDs
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.researchIDs}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ArticleIcon sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Publications
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.publications}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 20, color: "success.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Funding Projects
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.fundings}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <GroupIcon sx={{ fontSize: 20, color: "warning.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Conferences
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.conferences}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 20, color: "info.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    PhD Supervisions
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.phdSupervisions}
                </Typography>
              </StatsCard>

            </Box>
          </Box>

          {/* Professional Activities (Real Data) */}
          <Box mb={5}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Professional Activities
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WorkIcon sx={{ fontSize: 20, color: "error.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Admin Positions
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.adminPositions}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmojiEventsIcon sx={{ fontSize: 20, color: "secondary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Honorary Positions
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.honoraryPositions}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Resource Person
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.resourcePerson}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <HandshakeIcon sx={{ fontSize: 20, color: "success.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Collaborations
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.collaborations}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BusinessCenterIcon sx={{ fontSize: 20, color: "info.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Consultancies
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {dashboardStats.consultancies}
                </Typography>
              </StatsCard>
            </Box>
          </Box>

          {/* Visual Progress Bars */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Activity Distribution
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              {/* Research Contributions */}
              <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={3}>
                  Research Contributions
                </Typography>
                {[
                  { label: "Publications", value: dashboardStats.publications, color: "primary.main", max: 50 },
                  { label: "Research Areas", value: dashboardStats.researchAreas, color: "secondary.main", max: 20 },
                  { label: "Funding Projects", value: dashboardStats.fundings, color: "success.main", max: 15 },
                  { label: "Conferences", value: dashboardStats.conferences, color: "warning.main", max: 30 },
                ].map((item, i) => (
                  <Box key={i} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={item.color}>
                        {item.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                          height: "100%",
                          bgcolor: item.color,
                          borderRadius: 1,
                          transition: "width 1s ease",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Academic Leadership */}
              <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={3}>
                  Academic Leadership
                </Typography>
                {[
                  { label: "PhD Supervisions", value: dashboardStats.phdSupervisions, color: "info.main", max: 20 },
                  { label: "Admin Positions", value: dashboardStats.adminPositions, color: "error.main", max: 10 },
                  { label: "Honorary Positions", value: dashboardStats.honoraryPositions, color: "secondary.main", max: 10 },
                  { label: "Resource Person", value: dashboardStats.resourcePerson, color: "primary.main", max: 25 },
                ].map((item, i) => (
                  <Box key={i} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={item.color}>
                        {item.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min((item.value / item.max) * 100, 100)}%`,
                          height: "100%",
                          bgcolor: item.color,
                          borderRadius: 1,
                          transition: "width 1s ease",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </MainCard>
      </Box>
    </Box>
  );
}