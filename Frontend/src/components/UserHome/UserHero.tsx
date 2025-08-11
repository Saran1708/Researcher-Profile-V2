import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';
import axiosClient from '../../utils/axiosClient';

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

export default function DashboardHero() {
  const [staffData, setStaffData] = useState({ name: '', department: '' });
  const [researchCareer, setResearchCareer] = useState({ research_career_details: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Default research career text
  const defaultResearchText = "";

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch both staff details and research career in parallel
      const [staffRes, researchRes] = await Promise.all([
        axiosClient.get('/staff-details/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosClient.get('/research-career/', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (staffRes.data) {
        setStaffData({
          name: staffRes.data.name || '',
          department: staffRes.data.department || ''
        });
      }

      // Handle both array and object responses
      if (researchRes.data) {
        let researchData;
        
        // Check if response is an array or object
        if (Array.isArray(researchRes.data)) {
          // If it's an array, get the first item
          researchData = researchRes.data.length > 0 ? researchRes.data[0] : null;
        } else {
          // If it's an object, use it directly
          researchData = researchRes.data;
        }
        
        if (researchData) {
          const researchText = researchData.research_career_details && 
                               researchData.research_career_details.trim() !== '' 
                               ? researchData.research_career_details 
                               : defaultResearchText;
          
          setResearchCareer({
            research_career_details: researchText
          });
        } else {
          setResearchCareer({
            research_career_details: defaultResearchText
          });
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
      // Set default text on error
      setResearchCareer({
        research_career_details: defaultResearchText
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
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
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {loading ? "Loading..." : error ? "" : `Welcome back, ${staffData.name}! 👋`}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, width: '100%' }}>
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' , mb: 6}}>
                {loading ? "Loading..." : error ? "Error Fetching" : staffData.department}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                {loading ? "Loading research details..." : researchCareer.research_career_details}
              </Typography>
            </Box>
          </Box>
          
        </Stack>
      </Container>
    </Box>
  );
}
