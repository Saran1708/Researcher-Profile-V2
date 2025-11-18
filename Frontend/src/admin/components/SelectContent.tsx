import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Sitemark from '../../components/MainComponents/SitemarkIcon';

const ProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2), // padding inside the container
  width: 220,                 // adjust width as needed
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 8,
  cursor: 'pointer',
}));

const ProfileText = styled(Typography)({
  fontWeight: 500,
  fontSize: '0.95rem',
  lineHeight: 1.2,
  marginLeft: 8,  // spacing between logo and text
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const LogoWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  margin: 0,
  padding: 0,
});

export default function ResearcherProfile() {
  return (
    <ProfileContainer>
      <LogoWrapper>
        <Sitemark />
      </LogoWrapper>
      <ProfileText>Researcher Profile</ProfileText>
    </ProfileContainer>
  );
}
