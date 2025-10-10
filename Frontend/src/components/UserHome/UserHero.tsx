import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinearProgress from '@mui/material/LinearProgress';

const ModernDashboard = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  marginTop: theme.spacing(2),
}));

const RightColumn = styled(Box)(({ theme }) => ({
  width: '380px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

// Enhanced StatsBox with better dark mode styling
const StatsBox = styled(Box)(({ theme }) => [
  {
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900],
    border: `1px solid ${theme.palette.grey[700]}`,
    boxShadow: `
      0 4px 20px rgba(0, 0, 0, 0.5),
      0 1px 3px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    background: `linear-gradient(145deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
  }),
]);

export default function LearningDashboard() {
  const theme = useTheme();
  const progressValue = 65;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ModernDashboard>
        {/* Left Column */}
        <LeftColumn>
          {/* Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 100%)',
                fontSize: '2rem',
                color: '#fff',
              }}
            >
              S
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Hello Saran,
              </Typography>
              <Chip
                label="Adept"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  px: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Computer Application (BCA) - SFS
              </Typography>
            </Box>
          </Box>

          {/* Progress */}
          <Box>
            <Typography
              variant="body1"
              fontWeight={500}
              textAlign="center"
              gutterBottom
            >
              351 points needed to unlock the next badge
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 4,
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)',
                },
              }}
            />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}
            >
              <Typography variant="body2" fontWeight={500}>
                Level 5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progressValue}% completed
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                Level 6
              </Typography>
            </Box>
          </Box>
        </LeftColumn>

        {/* Right Column */}
        <RightColumn>
          <StatsBox
            sx={{
              mt: { xs: 4, md: 0 }, // ✅ adds margin-top only on mobile/tablet
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fontSize: 32,
                    background:
                      'linear-gradient(45deg, #FFD166 0%, #F78C6B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{
                    background:
                      'linear-gradient(45deg, #4ECDC4 0%, #5563DE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  1150
                </Typography>
              </Box>
              <Typography variant="h6" color="text.secondary">
                Total Learning Points
              </Typography>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr', // 1 column on mobile
                  sm: 'repeat(2, 1fr)', // 2 columns on tablets
                  md: 'repeat(3, 1fr)', // 3 columns on desktops
                },
                gap: 2,
                mt: 'auto',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  71
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courses
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  19
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Competencies
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  29
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Certifications
                </Typography>
              </Box>
            </Box>
          </StatsBox>
        </RightColumn>
      </ModernDashboard>
    </Container>
  );
}
