import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import logo from './public/images/logo.png'; // adjust path if needed

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 38, width: 100, mr: 2 }}>
      <image href={logo} height="100%" width="100%" />
    </SvgIcon>
  );
}
