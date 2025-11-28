import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      © 2021 MCC. All Rights Reserved.
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 6 },
        py: { xs: 4, sm: 6 },   // reduced vertical padding
        textAlign: { xs: 'center', md: 'left' },
      }}
    >

      {/* Footer bottom section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 3, sm: 4 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Developed by MCC MRF Innovation Park
          </Typography>
          <Copyright />
        </div>

        <Stack
          direction="row"
          spacing={1}
          sx={{ color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://www.youtube.com/@Madras_Christian_College"
            aria-label="YouTube"
          >
            <YouTubeIcon />
          </IconButton>

          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/school/madras-christian-college/"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
