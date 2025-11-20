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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/resource-person/';

const emptyResource = {
  id: null,
  resource_topic: '',
  resource_department: '',
  resource_date: '',
};

const ResourcePersonForm = () => {
  const [resources, setResources] = useState([emptyResource]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setResources(res.data.map(item => ({
            id: item.id,
            resource_topic: item.resource_topic || '',
            resource_department: item.resource_department || '',
            resource_date: item.resource_date || '',
          })));
        }
      } catch (err) {
        console.error('Error fetching resource persons:', err);
        setFetchError(true);
      }
    };

    fetchResources();
  }, []);

  const handleChange = (index, field, value) => {
    setResources(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setResources(prev => [...prev, emptyResource]);
  };

  const handleDelete = async (index) => {
    const resource = resources[index];
    if (resource.id) {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        await axiosClient.delete(`${API_URL}${resource.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error deleting resource person:', err);
        setSnackbarMsg('Error deleting entry');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    setResources(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyResource]));
  };

  const validateForm = () => {
    for (const res of resources) {
      if (!res.resource_topic.trim()) return 'Please enter topic';
      if (!res.resource_department.trim()) return 'Please enter department';
      if (!res.resource_date.trim()) return 'Please select date';
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

      for (const res of resources) {
        const formData = new FormData();
        formData.append('resource_topic', res.resource_topic);
        formData.append('resource_department', res.resource_department);
        formData.append('resource_date', res.resource_date);

        if (res.id) {
          await axiosClient.put(`${API_URL}${res.id}/`, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const response = await axiosClient.post(API_URL, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          res.id = response.data.id;
        }
      }

      setSuccessSnackbarOpen(true);
      setExpanded(false);
    } catch (err) {
      console.error('Error saving resource persons:', err);
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
              <EventIcon />
              <Typography fontWeight={600}>Resource Person Details</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {fetchError ? (
              <Typography color="error" align="center" sx={{ py: 2 }}>
                Error fetching resource persons.
              </Typography>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={4}>
                  {resources.map((res, index) => (
                    <Box key={index} mb={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Entry {index + 1}
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
                        <FormLabel>{requiredLabel('Topic')}</FormLabel>
                        <TextField
                          value={res.resource_topic}
                          onChange={e => handleChange(index, 'resource_topic', e.target.value)}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('Department')}</FormLabel>
                        <TextField
                          value={res.resource_department}
                          onChange={e => handleChange(index, 'resource_department', e.target.value)}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        <FormLabel>{requiredLabel('Date')}</FormLabel>
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={res.resource_date ? dayjs(res.resource_date, 'DD-MM-YYYY') : null}
                          onChange={val => handleChange(index, 'resource_date', val ? val.format('DD-MM-YYYY') : '')}
                          disabled={loading}
                          renderInput={params => <TextField {...params} fullWidth />}
                        />
                      </FormControl>
                    </Box>
                  ))}
                  <Box textAlign="center">
                    <Button variant="contained" color="primary" onClick={handleAdd} disabled={loading}>
                      Add Another Entry
                    </Button>
                  </Box>
                  <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                    Save All Details
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
          <Alert severity="success" variant="filled" sx={{ width: '100%', backgroundColor: '#4caf50 !important', color: '#fff !important' }} iconMapping={{ success: <CheckIcon sx={{ color: 'white' }} /> }}>
            Resource Person details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ResourcePersonForm;
