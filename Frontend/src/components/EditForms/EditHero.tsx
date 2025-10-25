import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
}));

const List = styled('ul')(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& li': {
    marginBottom: theme.spacing(1.5),
  },
}));

export default function EditHero() {
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
          pt: { xs: 14, sm: 20 },
        }}
      >
        <Stack
          spacing={3}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              color: 'text.primary',
              fontWeight: 500,
              width: { sm: '100%', md: '80%' },
            }}
          >
            Welcome! This page allows you to add, update, and manage your research details.
          </Typography>

          

          <List>
            <li>
              <strong>Mandatory fields</strong> must be filled to activate your dashboard and complete your profile.
            </li>
            <li>
              Each section of this page is an <strong>individual form</strong>. Make sure to save each form separately; otherwise, your data may be unsaved.
            </li>
            <li>
              Regularly updating your information helps keep your profile accurate and improves visibility for collaborations and professional recognition.
            </li>
          </List>

          
        </Stack>
      </Container>
    </Box>
  );
}
