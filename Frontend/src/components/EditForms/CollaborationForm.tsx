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
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/collaboration/';

const emptyCollaboration = {
  id: null,
  collaboration_details: '',
};

const CollaborationForm = () => {
  const [collaborations, setCollaborations] = useState([emptyCollaboration]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setCollaborations(res.data.map(item => ({
            id: item.id,
            collaboration_details: item.collaboration_details || '',
          })));
        }
      } catch (err) {
        console.error('Error fetching collaborations:', err);
        setFetchError(true);
      }
    };

    fetchCollaborations();
  }, []);

  const handleChange = (index, value) => {
    setCollaborations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], collaboration_details: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setCollaborations(prev => [...prev, emptyCollaboration]);
  };

  const handleDelete = async (index) => {
    const collaboration = collaborations[index];
    if (collaboration.id) {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        await axiosClient.delete(`${API_URL}${collaboration.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error deleting collaboration:', err);
        setSnackbarMsg('Error deleting entry');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    setCollaborations(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyCollaboration]));
  };

  const validateForm = () => {
    for (const collab of collaborations) {
      if (!collab.collaboration_details.trim()) return 'Please enter the area of collaboration';
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

      for (const collab of collaborations) {
        const formData = new FormData();
        formData.append('collaboration_details', collab.collaboration_details);

        if (collab.id) {
          await axiosClient.put(`${API_URL}${collab.id}/`, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const response = await axiosClient.post(API_URL, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          collab.id = response.data.id;
        }
      }

      setSuccessSnackbarOpen(true);
      setExpanded(false);
    } catch (err) {
      console.error('Error saving collaborations:', err);
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
              <Diversity3Icon />
              <Typography fontWeight={600}>Areas of Collaboration</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {fetchError ? (
              <Typography color="error" align="center" sx={{ py: 2 }}>
                Error fetching collaborations.
              </Typography>
            ) : (
              <Stack spacing={4}>
                {collaborations.map((collab, index) => (
                  <Box key={index} mb={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Collaboration {index + 1}
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
                      <FormLabel>{requiredLabel('Areas of Collaboration')}</FormLabel>
                      <TextField
                        value={collab.collaboration_details}
                        onChange={e => handleChange(index, e.target.value)}
                        disabled={loading}
                      />
                    </FormControl>
                  </Box>
                ))}
                <Box textAlign="center">
                  <Button variant="contained" color="primary" onClick={handleAdd} disabled={loading}>
                    Add Another Collaboration
                  </Button>
                </Box>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                  Save All Collaborations
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
            Collaboration details saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CollaborationForm;
