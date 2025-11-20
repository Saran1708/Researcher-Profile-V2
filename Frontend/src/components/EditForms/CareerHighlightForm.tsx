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
    FormLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarsIcon from '@mui/icons-material/Stars';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/career-highlight/';
const MAX_CHAR = 500;

const CareerHighlightForm = () => {
    const [highlight, setHighlight] = useState({
        id: null,
        career_highlight_details: '',
    });
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const fetchHighlight = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(res.data) && res.data.length > 0) {
                    const item = res.data[0]; // Get first (and only) entry
                    setHighlight({
                        id: item.id,
                        career_highlight_details: item.career_highlight_details || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching career highlight:', err);
                setFetchError(true);
            }
        };

        fetchHighlight();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHAR) {
            setHighlight(prev => ({
                ...prev,
                career_highlight_details: value
            }));
        }
    };

    const handleDelete = async () => {
        if (highlight.id) {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                await axiosClient.delete(`${API_URL}${highlight.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Reset to empty state after successful deletion
                setHighlight({
                    id: null,
                    career_highlight_details: '',
                });
               
            } catch (err) {
                console.error('Error deleting career highlight:', err);
                setSnackbarMsg('Error deleting entry');
                setSnackbarOpen(true);
            }
            setLoading(false);
        } else {
            // Just clear the field if no ID (not saved yet)
            setHighlight({
                id: null,
                career_highlight_details: '',
            });
        }
    };

    const handleSubmit = async () => {
        if (!highlight.career_highlight_details.trim()) {
            setSnackbarMsg('Please enter your career highlight');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const formData = new FormData();
            formData.append('career_highlight_details', highlight.career_highlight_details);

            if (highlight.id) {
                // Update existing
                await axiosClient.put(`${API_URL}${highlight.id}/`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create new
                const response = await axiosClient.post(API_URL, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                setHighlight(prev => ({ ...prev, id: response.data.id }));
            }

            setSuccessSnackbarOpen(true);
            setExpanded(false);
        } catch (err) {
            console.error('Error saving career highlight:', err);
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
    <StarsIcon />
    <Typography fontWeight={600}>Career Highlights</Typography>
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
                                Error fetching career highlights.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {/* Show delete button only if there's a value in the field */}
                                {highlight.career_highlight_details.trim() && (
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
                                
                                <FormLabel>{requiredLabel('Briefly describe your career highlights as a paragraph')}</FormLabel>
                                
                                <TextareaAutosize
                                    minRows={5}
                                    value={highlight.career_highlight_details}
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
                                        color: highlight.career_highlight_details.length > MAX_CHAR ? 'error.main' : 'text.secondary'
                                    }}
                                >
                                    {highlight.career_highlight_details.length} / {MAX_CHAR} characters
                                </Typography>

                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    Save Career Highlight
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
                        Career highlight saved successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default CareerHighlightForm;
