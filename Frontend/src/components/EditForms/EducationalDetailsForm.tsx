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
import SchoolIcon from '@mui/icons-material/School';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/education/';

const EducationDetailsForm = () => {
  const emptyForm = {
    id: null,
    degree: '',
    college: '',
    start_year: '',
    end_year: '',
  };

  const [expanded, setExpanded] = useState(false);
  const [educations, setEducations] = useState([emptyForm]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // fetch education details on mount
  useEffect(() => {
    const fetchEducationDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.length > 0) {
          // If we get an array of educations
          const formattedEducations = res.data.map(edu => ({
            id: edu.id,
            degree: edu.degree || '',
            college: edu.college || '',
            start_year: edu.start_year || '',
            end_year: edu.end_year || '',
          }));
          setEducations(formattedEducations);
        } else if (res.data && !Array.isArray(res.data)) {
          // If we get a single education object
          setEducations([{
            id: res.data.id,
            degree: res.data.degree || '',
            college: res.data.college || '',
            start_year: res.data.start_year || '',
            end_year: res.data.end_year || '',
          }]);
        }
      } catch (err) {
        console.error('Error fetching education details:', err);
        setFetchError(true);
      }
    };

    fetchEducationDetails();
  }, []);

  const handleChange = (index, field, value) => {
    setEducations((prev) => {
      const newEducations = [...prev];
      newEducations[index] = { ...newEducations[index], [field]: value };
      return newEducations;
    });
  };

  const validateForm = (form) => {
    if (!form.degree) return 'Please fill the degree field';
    if (!form.college) return 'Please fill the college field';
    if (!form.start_year) return 'Please fill the start year field';
    if (!form.end_year) return 'Please fill the end year field';

    // Year validation
    const startYear = parseInt(form.start_year);
    const endYear = parseInt(form.end_year);
    const currentYear = new Date().getFullYear();

    if (isNaN(startYear) || startYear < 1900 || startYear > currentYear + 10) {
      return 'Please enter a valid start year';
    }

    if (isNaN(endYear) || endYear < 1900 || endYear > currentYear + 10) {
      return 'Please enter a valid end year';
    }

    if (endYear < startYear) {
      return 'End year cannot be before start year';
    }

    return null;
  };

  const handleSubmit = async () => {
    // Validate all forms
    for (let form of educations) {
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

      // Handle each education record properly
      for (let edu of educations) {
        const formData = new FormData();
        formData.append('degree', edu.degree);
        formData.append('college', edu.college);
        formData.append('start_year', edu.start_year);
        formData.append('end_year', edu.end_year);

        if (edu.id) {
          // UPDATE existing education
          await axiosClient.put(`${API_URL}${edu.id}/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // CREATE new education (only for records without ID)
          const response = await axiosClient.post(API_URL, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Update the education with the returned ID
          edu.id = response.data.id;
        }
      }

      setSnackbarOpen(false);
      setSuccessSnackbarOpen(true);

    } catch (err) {
      console.error('Error saving education details:', err);
      setSnackbarMsg('Error saving education details');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = () => {
    setEducations((prev) => [...prev, emptyForm]);
  };

  const handleDeleteEducation = async (index) => {
    if (educations.length === 1) return; // Prevent removing last

    const eduToDelete = educations[index];
    
    // If the education has an ID, delete it from the database
    if (eduToDelete.id) {
      setLoading(true); // Add loading state for delete
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          await axiosClient.delete(`${API_URL}${eduToDelete.id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (err) {
        console.error('Error deleting education:', err);
        setSnackbarMsg('Error deleting education');
        setSnackbarOpen(true);
        setLoading(false); // Stop loading on error
        return;
      } finally {
        setLoading(false); // Stop loading after delete
      }
    }

    // Remove from UI
    setEducations((prev) => prev.filter((_, i) => i !== index));
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
              <SchoolIcon />
              <Typography fontWeight={600}>Education Details</Typography>
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
                  Error fetching ducation details.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={4}>
                {educations.map((edu, index) => (
                  <Box key={index} mb={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Education {index + 1}
                      </Typography>

                      {educations.length > 1 && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteEducation(index)}
                          startIcon={<DeleteIcon />}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      )}
                    </Stack>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>{requiredLabel('Degree')}</FormLabel>
                      <TextField
                        value={edu.degree}
                        onChange={(e) => handleChange(index, 'degree', e.target.value)}
                        disabled={loading}
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>{requiredLabel('College/University')}</FormLabel>
                      <TextField
                        value={edu.college}
                        onChange={(e) => handleChange(index, 'college', e.target.value)}
                        disabled={loading}
                        placeholder="e.g. XYZ University"
                      />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>{requiredLabel('Start Year')}</FormLabel>
                      <TextField
                        type="number"
                        value={edu.start_year}
                        onChange={(e) => handleChange(index, 'start_year', e.target.value)}
                        disabled={loading}
                        placeholder="e.g. 2020"
                      />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>{requiredLabel('End Year')}</FormLabel>
                      <TextField
                        type="number"
                        value={edu.end_year}
                        onChange={(e) => handleChange(index, 'end_year', e.target.value)}
                        disabled={loading}
                        placeholder="e.g. 2024"
                      />
                    </FormControl>
                  </Box>
                ))}

                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddEducation}
                    sx={{ width: '250px' }}
                    disabled={loading}
                  >
                    Add Another Education
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
                  {loading ? 'Saving...' : 'Save All Education Details'}
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
            Education details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EducationDetailsForm;