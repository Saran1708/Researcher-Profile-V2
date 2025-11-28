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
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/consultancy/';

const emptyConsultancy = {
  id: null,
  consultancy_details: '',
};

const ConsultancyForm = () => {
  const [expanded, setExpanded] = useState(false);
  const [consultancies, setConsultancies] = useState([emptyConsultancy]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchConsultancies = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setConsultancies(res.data.map(item => ({
            id: item.id,
            consultancy_details: item.consultancy_details || '',
          })));
        }
      } catch (err) {
        console.error('Error fetching consultancies:', err);
        setFetchError(true);
      }
    };

    fetchConsultancies();
  }, []);

  const handleChange = (index, value) => {
    setConsultancies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], consultancy_details: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setConsultancies(prev => [...prev, emptyConsultancy]);
  };

  const handleDelete = async (index) => {
    const consultancy = consultancies[index];
    if (consultancy.id) {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        await axiosClient.delete(`${API_URL}${consultancy.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error deleting consultancy:', err);
        setSnackbarMsg('Error deleting entry');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    setConsultancies(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyConsultancy]));
  };

  const validateForm = () => {
    for (const consultancy of consultancies) {
      if (!consultancy.consultancy_details.trim()) return 'Please enter the area of consultancy';
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

      for (const consultancy of consultancies) {
        const formData = new FormData();
        formData.append('consultancy_details', consultancy.consultancy_details);

        if (consultancy.id) {
          await axiosClient.put(`${API_URL}${consultancy.id}/`, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const response = await axiosClient.post(API_URL, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          consultancy.id = response.data.id;
        }
      }

      setSuccessSnackbarOpen(true);
      setExpanded(false);
    } catch (err) {
      console.error('Error saving consultancies:', err);
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
       <Accordion expanded={expanded} onChange={(event, isExpanded) => setExpanded(isExpanded)}>

          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BusinessCenterIcon />
              <Typography fontWeight={600}>Areas of Consultancy</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {fetchError ? (
              <Typography color="error" align="center" sx={{ py: 2 }}>
                Error fetching consultancies.
              </Typography>
            ) : (
              <Stack spacing={4}>
                {consultancies.map((consultancy, index) => (
                  <Box key={index} mb={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Consultancy {index + 1}
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
                      <FormLabel>{requiredLabel('Areas of Consultancy')}</FormLabel>
                      <TextField
                        value={consultancy.consultancy_details}
                        onChange={e => handleChange(index, e.target.value)}
                        disabled={loading}
                      />
                    </FormControl>
                  </Box>
                ))}
                <Box textAlign="center">
                  <Button variant="contained" color="primary" onClick={handleAdd} disabled={loading}>
                    Add Another Consultancy
                  </Button>
                </Box>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                  Save All Consultancies
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
            Consultancy details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ConsultancyForm;
