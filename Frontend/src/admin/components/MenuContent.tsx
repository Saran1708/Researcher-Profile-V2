import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { Link, useLocation } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';

import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/admin/home' },
  { text: 'Manage Users', icon: <PeopleRoundedIcon />, path: '/admin/users' },

  { text: 'Profile Views', icon: <VisibilityRoundedIcon />, path: '/admin/views' },
  { text: 'PhD Details', icon: <SchoolRoundedIcon />, path: '/admin/phd' },

  { text: 'Funding Details', icon: <MonetizationOnRoundedIcon />, path: '/admin/funding' },
  { text: 'Publications', icon: <MenuBookRoundedIcon />, path: '/admin/publications' },
  { text: 'Research', icon: <ScienceRoundedIcon />, path: '/admin/research' },

  // ❌ No path = no navigation
  { text: 'Export', icon: <FileDownloadRoundedIcon />, path: '/admin/export' },
  { text: 'AI Chat', icon: <ChatRoundedIcon />, path: null },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 2 }}>
      <List dense>
        {mainListItems.map((item, index) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: 'block', mb: 1.5 }}
            >
              <ListItemButton
                component={item.path ? Link : 'button'}
                to={item.path || undefined}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
