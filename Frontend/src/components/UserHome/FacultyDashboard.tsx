import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
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

const MainCard = styled(Paper)(({ theme }) => ({
  maxWidth: "1150px",
  margin: "0 auto",
  marginTop: theme.spacing(18),

  padding: theme.spacing(4),
  position: "relative",
  
borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
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

const RankingCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "8px",
  border: "1px solid",
  borderColor: theme.palette.divider,
  height: "100%",
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

export default function Dashboard() {
  const userData = {
    name: "Dr. Rajesh Kumar",
    department: "Computer Science and Engineering",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  };

  const profileViews = {
    total: 2458,
    weekly: 187,
    monthly: 654,
    weeklyGrowth: 12.5,
    monthlyGrowth: 8.3,
  };

  const profileStats = {
    publications: 45,
    fundings: 8,
    phdSupervisions: 12,
    conferences: 28,
    adminPositions: 5,
    honoraryPositions: 7,
    resourcePerson: 15,
    collaborations: 6,
  };

  const totalPoints = 1655;

  const rankings = {
    department: {
      rank: 3,
      total: 45,
      department: "Computer Science and Engineering",
    },
    stream: {
      rank: 8,
      total: 120,
      stream: "Aided",
    },
    overall: {
      rank: 15,
      total: 450,
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <MainCard>
          {/* Welcome Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
              <Avatar
                src={userData.profilePic}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid",
                  borderColor: "primary.main",
                  boxShadow: 3,
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  Welcome back, {userData.name.split(' ').slice(1).join(' ')}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.department}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 4 }} />

          {/* Profile Views Section */}
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
                    +{profileViews.weeklyGrowth}%
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
                    +{profileViews.monthlyGrowth}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    from last month
                  </Typography>
                </Box>
              </StatsCard>
            </Box>
          </Box>

          {/* Main Stats Grid */}
          <Box mb={5}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Overview
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ArticleIcon sx={{ fontSize: 20, color: "primary.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Publications
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {profileStats.publications}
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
                  {profileStats.fundings}
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
                  {profileStats.phdSupervisions}
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
                  {profileStats.conferences}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WorkIcon sx={{ fontSize: 20, color: "error.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Admin Positions
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {profileStats.adminPositions}
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
                  {profileStats.honoraryPositions}
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
                  {profileStats.resourcePerson}
                </Typography>
              </StatsCard>

              <StatsCard>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 20, color: "success.main", mr: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Collaborations
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {profileStats.collaborations}
                </Typography>
              </StatsCard>
            </Box>
          </Box>

          {/* Points and Rankings Section */}
         <Box>
  <Typography variant="h6" fontWeight={700} mb={3}>
    Performance & Rankings
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, // slightly smaller left card
      gap: 3,
      alignItems: "stretch",
    }}
  >
    {/* Total Points Card */}
    <StatsCard
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderColor: "transparent",
        "&:hover": { borderColor: "transparent" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        textAlign: "center",  
        p: 3,
        borderRadius: 3,
        height: "100%",
        minHeight: 180, // reduces tall empty space
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <EmojiEventsIcon sx={{ fontSize: 30, color: "white", mr: 1.2 }} />
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "white" }}>
          Total Points
        </Typography>
      </Box>

      <Typography
        variant="h3"
        fontWeight={800}
        sx={{ color: "white", lineHeight: 1.1, mb: 0.5 }}
      >
        {totalPoints.toLocaleString()}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,0.85)", mt: 0.5 }}
      >
        Based on your academic contributions
      </Typography>
    </StatsCard>

    {/* Rankings Column */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {[
        {
          label: "Department Rank",
          color: "primary.main",
          value: `#${rankings.department.rank}`,
          total: rankings.department.total,
        },
        {
          label: `${rankings.stream.stream} Stream Rank`,
          color: "info.main",
          value: `#${rankings.stream.rank}`,
          total: rankings.stream.total,
        },
        {
          label: "Overall University Rank",
          color: "success.main",
          value: `#${rankings.overall.rank}`,
          total: rankings.overall.total,
        },
      ].map((rank, i) => (
        <RankingCard key={i} sx={{ p: 2, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ textTransform: "uppercase" }}
              >
                {rank.label}
              </Typography>
              <Typography variant="h5" fontWeight={700} color={rank.color}>
                {rank.value}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              of {rank.total}
            </Typography>
          </Box>
        </RankingCard>
      ))}
    </Box>
  </Box>
</Box>

        </MainCard>
      </Box>
    </Box>
  );
}