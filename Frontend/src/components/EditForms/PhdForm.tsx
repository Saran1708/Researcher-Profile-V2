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
  FormLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/phd/';

const emptyScholar = {
  id: null,
  phd_name: '',
  phd_topic: '',
  phd_status: '',
  phd_years_of_completion: '',
};

const PhdForm = () => {
  const [phdScholars, setPhdScholars] = useState([emptyScholar]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchPhdScholars = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setPhdScholars(
            res.data.map((scholar) => ({
              id: scholar.id,
              phd_name: scholar.phd_name || '',
              phd_topic: scholar.phd_topic || '',
              phd_status: scholar.phd_status || '',
              phd_years_of_completion: scholar.phd_years_of_completion || '',
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching PhD scholars:', err);
        setFetchError(true);
      }
    };
    fetchPhdScholars();
  }, []);

  const handleScholarChange = (index, field, value) => {
    setPhdScholars((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setPhdScholars((prev) => [...prev, emptyScholar]);
  };

  const handleDelete = async (index) => {
  const scholarToDelete = phdScholars[index];
  if (scholarToDelete.id) {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axiosClient.delete(`${API_URL}${scholarToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error deleting PhD scholar:', err);
      setSnackbarMsg('Error deleting scholar');
      setSnackbarOpen(true);
      setLoading(false);
      return; // Stop deletion from UI on backend failure
    } finally {
      setLoading(false);
    }
  }
  // Remove from UI regardless of backend response (or immediately if no id)
  setPhdScholars((prev) => {
    const newList = prev.filter((_, i) => i !== index);
    return newList.length === 0 ? [emptyScholar] : newList;
  });
};


  const validateForm = () => {
    for (let scholar of phdScholars) {
      if (!scholar.phd_name.trim()) return 'Please enter scholar name';
      if (!scholar.phd_topic.trim()) return 'Please enter PhD topic';
      if (!scholar.phd_status) return 'Please select the PhD status';
      if (!scholar.phd_years_of_completion) return 'Please select year of completion';
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setSnackbarMsg(error);
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      for (let scholar of phdScholars) {
        const formData = new FormData();
        formData.append('phd_name', scholar.phd_name);
        formData.append('phd_topic', scholar.phd_topic);
        formData.append('phd_status', scholar.phd_status);
        formData.append('phd_years_of_completion', scholar.phd_years_of_completion);

        if (scholar.id) {
          await axiosClient.put(`${API_URL}${scholar.id}/`, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          });
        } else {
          const response = await axiosClient.post(API_URL, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          });
          scholar.id = response.data.id;
        }
      }

      setSuccessSnackbarOpen(true);
      setExpanded(false);
    } catch (err) {
      console.error('Error saving PhD data:', err);
      setSnackbarMsg('Error saving PhD data');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolIcon />
              <Typography fontWeight={600}>PhD Supervision</Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            {fetchError ? (
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
                <Typography color="error" align="center" sx={{ py: 2 }}>
                  Error fetching PhD scholars.
                </Typography>
              </Box>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={4}>
                  {phdScholars.map((scholar, index) => (
                    <Box key={index} mb={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Scholar {index + 1}
                        </Typography>
                        
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(index)}
                            startIcon={<DeleteIcon />}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                  
                      </Stack>

                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('Scholar Name')}</FormLabel>
                        <TextField
                          value={scholar.phd_name}
                          onChange={(e) => handleScholarChange(index, 'phd_name', e.target.value)}
                          disabled={loading}
                        />
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('PhD Topic')}</FormLabel>
                        <TextField
                          value={scholar.phd_topic}
                          onChange={(e) => handleScholarChange(index, 'phd_topic', e.target.value)}
                          disabled={loading}
                        />
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('Status')}</FormLabel>
                        <Select
                          value={scholar.phd_status}
                          onChange={(e) => handleScholarChange(index, 'phd_status', e.target.value)}
                          displayEmpty
                          disabled={loading}
                        >
                          <MenuItem value="" disabled>
                            Select Status
                          </MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Ongoing">Ongoing</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('Year of Completion')}</FormLabel>
                        <DatePicker
                          views={['year']}
                          value={scholar.phd_years_of_completion ? dayjs(scholar.phd_years_of_completion, 'YYYY') : null}
                          onChange={(newValue) =>
                            handleScholarChange(index, 'phd_years_of_completion', newValue ? newValue.format('YYYY') : '')
                          }
                          disabled={loading}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </FormControl>
                    </Box>
                  ))}

                  <Box textAlign="center">
                    <Button variant="contained" color="primary" onClick={handleAdd} sx={{ width: 250 }} disabled={loading}>
                      Add Another Scholar
                    </Button>
                  </Box>

                  <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save All PhD Details'}
                  </Button>
                </Stack>
              </LocalizationProvider>
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
          <Alert severity="success" variant="filled" sx={{ width: '100%', backgroundColor: '#4caf50 !important', color: '#fff !important', '& .MuiAlert-icon': { color: '#fff !important' } }} iconMapping={{ success: <CheckIcon sx={{ color: '#fff !important' }} /> }}>
            PhD details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PhdForm;
