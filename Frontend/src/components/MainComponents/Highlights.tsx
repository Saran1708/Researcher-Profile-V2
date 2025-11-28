import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

const items = [
  {
    icon: <SchoolRoundedIcon />,
    title: 'Expert Faculty',
    description:
      'Our faculty members are renowned for their expertise across various disciplines, bringing years of academic excellence and research experience.',
  },
  {
    icon: <GroupsRoundedIcon />,
    title: 'Collaborative Environment',
    description:
      'Foster meaningful connections within the academic community through interdisciplinary collaboration and knowledge sharing initiatives.',
  },
  {
    icon: <ArticleRoundedIcon />,
    title: 'Comprehensive Profiles',
    description:
      'Access detailed information on research interests, publications, ongoing projects, and academic contributions of each faculty member.',
  },
  {
    icon: <EmojiObjectsRoundedIcon />,
    title: 'Innovation & Patents',
    description:
      'Explore groundbreaking research leading to patent generation and innovative solutions addressing real-world challenges.',
  },
  {
    icon: <PublicRoundedIcon />,
    title: 'Global Visibility',
    description:
      'Enhance research visibility on a global scale, enabling external researchers to discover and connect with our faculty expertise.',
  },
  {
    icon: <VerifiedRoundedIcon />,
    title: 'Research Infrastructure',
    description:
      'Benefit from robust support systems and infrastructure designed to facilitate high-quality research and scholarly development.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Discover what makes our research ecosystem exceptional: expert faculty, collaborative opportunities, comprehensive research profiles, and commitment to innovation. Experience global visibility and robust research infrastructure support.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}