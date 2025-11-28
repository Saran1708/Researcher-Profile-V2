import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
}));

const ContentOverlay = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  textAlign: 'center',
  padding: '2rem',
});

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 20, sm: 20 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Researcher&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Profile
            </Typography>
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '1.1rem',
            }}
          >
            Deanery of Research & Development
          </Typography>

          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '100%' },
            }}
          >
            This platform is structured to enhance the visibility of our faculty members by providing an overview of their research interests, areas of expertise, publications, and projects.
            It also serves as a centralized space for students, collaborators, and industry partners to discover ongoing academic work, explore potential research opportunities, and connect with faculty whose expertise aligns with their interests.
          </Typography>


          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 5, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => window.location.href = '/search'}
              sx={{ minWidth: 'fit-content', px: 4, py: 1.5 }}
            >
              Find Researchers
            </Button>
          </Stack>
        </Stack>


      </Container>
    </Box>
  );
}