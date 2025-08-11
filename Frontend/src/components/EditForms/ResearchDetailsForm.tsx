import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  FormControl,
  FormLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScienceIcon from '@mui/icons-material/Science';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/research/';

const ResearchDetailsForm = () => {
  const emptyForm = {
    id: null,
    research_areas: '',
  };

  const [expanded, setExpanded] = useState(false);
  const [researchList, setResearchList] = useState([emptyForm]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // fetch research details on mount
  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.length > 0) {
          // If we get an array of research records
          const formattedResearch = res.data.map(research => ({
            id: research.id,
            research_areas: research.research_areas || '',
          }));
          setResearchList(formattedResearch);
        } else if (res.data && !Array.isArray(res.data)) {
          // If we get a single research object
          setResearchList([{
            id: res.data.id,
            research_areas: res.data.research_areas || '',
          }]);
        }
      } catch (err) {
        console.error('Error fetching research details:', err);
        setFetchError(true);
      }
    };

    fetchResearchDetails();
  }, []);

  const handleChange = (index, value) => {
    setResearchList((prev) => {
      const newList = [...prev];
      newList[index] = { ...newList[index], research_areas: value };
      return newList;
    });
  };

  const validateForm = (form) => {
    if (!form.research_areas.trim()) {
      return 'Please fill the research areas field';
    }
    return null;
  };

  const handleSubmit = async () => {
    // Validate all forms
    for (let form of researchList) {
      const error = validateForm(form);
      if (error) {
        setSnackbarMsg(error);
        setSnackbarOpen(true);
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Handle each research record properly
      for (let research of researchList) {
        const formData = new FormData();
        formData.append('research_areas', research.research_areas);

        if (research.id) {
          // UPDATE existing research
          await axiosClient.put(`${API_URL}${research.id}/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // CREATE new research (only for records without ID)
          const response = await axiosClient.post(API_URL, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Update the research with the returned ID
          research.id = response.data.id;
        }
      }

      setSnackbarOpen(false);
      setSuccessSnackbarOpen(true);

    } catch (err) {
      console.error('Error saving research details:', err);
      setSnackbarMsg('Error saving research details');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResearch = () => {
    setResearchList((prev) => [...prev, emptyForm]);
  };

  const handleDeleteResearch = async (index) => {
    const researchToDelete = researchList[index];
    
    // If the research has an ID, delete it from the database
    if (researchToDelete.id) {
      setLoading(true); // Add loading state for delete
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          await axiosClient.delete(`${API_URL}${researchToDelete.id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error('Error deleting research:', err);
        setSnackbarMsg('Error deleting research');
        setSnackbarOpen(true);
        setLoading(false); // Stop loading on error
        return;
      } finally {
        setLoading(false); // Stop loading after delete
      }
    }

    // Remove from UI
    setResearchList((prev) => {
      const newList = prev.filter((_, i) => i !== index);
      // If no research left, add one empty form
      return newList.length === 0 ? [emptyForm] : newList;
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const requiredLabel = (label) => (
    <span>
      {label} <span style={{ color: 'red' }}>*</span>
    </span>
  );

  return (
    <Box mt="40px">
      {loading && <Loader />}
      <Container maxWidth="md">
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ScienceIcon />
              <Typography fontWeight={600}>Research Details</Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            {fetchError ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ py: 2, textAlign: 'center' }}
              >
                <Typography color="error" align="center" sx={{ py: 2 }}>
                  Error fetching research details.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={4}>
                {researchList.map((research, index) => (
                  <Box key={index} mb={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Research Area {index + 1}
                      </Typography>

                      {/* Show delete button if: has value OR not the first research */}
                      {(research.research_areas.trim() || index > 0) && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteResearch(index)}
                          startIcon={<DeleteIcon />}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      )}
                    </Stack>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>{requiredLabel('Research Area')}</FormLabel>
                      <TextField
                        value={research.research_areas}
                        onChange={(e) => handleChange(index, e.target.value)}
                        disabled={loading}
                        placeholder="e.g. Machine Learning, Artificial Intelligence"
                      />
                    </FormControl>
                  </Box>
                ))}

                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddResearch}
                    sx={{ width: '250px' }}
                    disabled={loading}
                  >
                    Add Another Research
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                  size="medium"
                >
                  {loading ? 'Saving...' : 'Save All Research Details'}
                </Button>
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Validation Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />

        {/* Success Snackbar */}
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={3000}
          onClose={handleSuccessSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              width: '100%',
              backgroundColor: '#4caf50 !important',
              color: '#fff !important',
              '& .MuiAlert-icon': {
                color: '#fff !important',
              }
            }}
            iconMapping={{
              success: <CheckIcon sx={{ color: '#fff !important' }} />
            }}
          >
            Research details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ResearchDetailsForm;