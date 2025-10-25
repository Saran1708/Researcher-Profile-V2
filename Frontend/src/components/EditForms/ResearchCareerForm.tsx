import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import  Chip  from "@mui/material/Chip";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Container,
  Stack,
  Typography,
  Box,
  Snackbar,
  Alert,
  FormLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScienceIcon from '@mui/icons-material/Science';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/research-career/';
const MAX_CHAR = 500;

const ResearchCareerForm = () => {
  const [research, setResearch] = useState({
    id: null,
    research_career_details: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchResearchCareer = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          const item = res.data[0]; // Get first (and only) entry
          setResearch({
            id: item.id,
            research_career_details: item.research_career_details || '',
          });
        }
      } catch (err) {
        console.error('Error fetching research career:', err);
        setFetchError(true);
      }
    };

    fetchResearchCareer();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR) {
      setResearch(prev => ({
        ...prev,
        research_career_details: value
      }));
    }
  };

  const handleDelete = async () => {
    if (research.id) {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        await axiosClient.delete(`${API_URL}${research.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Reset to empty state after successful deletion
        setResearch({
          id: null,
          research_career_details: '',
        });
        
      } catch (err) {
        console.error('Error deleting research career:', err);
        setSnackbarMsg('Error deleting entry');
        setSnackbarOpen(true);
      }
      setLoading(false);
    } else {
      // Just clear the field if no ID (not saved yet)
      setResearch({
        id: null,
        research_career_details: '',
      });
    }
  };

  const handleSubmit = async () => {
    if (!research.research_career_details.trim()) {
      setSnackbarMsg('Please enter your research career');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const formData = new FormData();
      formData.append('research_career_details', research.research_career_details);

      if (research.id) {
        // Update existing
        await axiosClient.put(`${API_URL}${research.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new
        const response = await axiosClient.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setResearch(prev => ({ ...prev, id: response.data.id }));
      }

      setSuccessSnackbarOpen(true);
    } catch (err) {
      console.error('Error saving research career:', err);
      setSnackbarMsg('Error saving data');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const requiredLabel = label => (
    <span>{label} <span style={{ color: 'red' }}>*</span></span>
  );

  return (
    <Box mt={5}>
      {loading && <Loader />}
      <Container maxWidth="md">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Stack direction="row" alignItems="center" spacing={1}>
    <ScienceIcon />
    <Typography fontWeight={600}>Research Career</Typography>
    <Chip
      label="Mandatory"
      size="small"
      color="warning"
      sx={{
        ml: 1,
        height: 22,
        fontWeight: 600,
        fontSize: 12,
        bgcolor: "warning.light",
        color: "warning.dark",
      }}
    />
  </Stack>
</AccordionSummary>

          <AccordionDetails>
            {fetchError ? (
              <Typography color="error" align="center" sx={{ py: 2 }}>
                Error fetching research career.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {/* Show delete button only if there's a value in the field */}
                {research.research_career_details.trim() && (
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={handleDelete}
                      startIcon={<DeleteIcon />}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
                
                <FormLabel>{requiredLabel('Briefly describe your research career as a paragraph')}</FormLabel>
                
                <TextareaAutosize
                  minRows={5}
                  value={research.research_career_details}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    borderColor: '#ccc',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    resize: 'vertical',
                    lineHeight: 1.5,
                    backgroundColor: 'inherit',
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{ 
                    color: research.research_career_details.length > MAX_CHAR ? 'error.main' : 'text.secondary'
                  }}
                >
                  {research.research_career_details.length} / {MAX_CHAR} characters
                </Typography>

                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Save Research Career
                </Button>
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSuccessSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%', backgroundColor: '#4caf50 !important', color: '#fff !important' }} iconMapping={{ success: <CheckIcon sx={{ color: 'white' }} /> }}>
            Research career saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ResearchCareerForm;
