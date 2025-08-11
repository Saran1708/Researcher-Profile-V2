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
import BiotechIcon from '@mui/icons-material/Biotech';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/research-id/';

const ResearchIdForm = () => {
    const emptyForm = {
        id: null,
        research_title: '',
        research_link: '',
    };

    const [expanded, setExpanded] = useState(false);
    const [researchList, setResearchList] = useState([emptyForm]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    // fetch research ID details on mount
    useEffect(() => {
        const fetchResearchIdDetails = async () => {
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
                        research_title: research.research_title || '',
                        research_link: research.research_link || '',
                    }));
                    setResearchList(formattedResearch);
                } else if (res.data && !Array.isArray(res.data)) {
                    // If we get a single research object
                    setResearchList([{
                        id: res.data.id,
                        research_title: res.data.research_title || '',
                        research_link: res.data.research_link || '',
                    }]);
                }
            } catch (err) {
                console.error('Error fetching research ID details:', err);
                setFetchError(true);
            }
        };

        fetchResearchIdDetails();
    }, []);

    const handleChange = (index, field, value) => {
        setResearchList((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.research_title.trim()) {
            return 'Please enter the research title';
        }

        if (form.research_link.trim()) {
            try {
                new URL(form.research_link); // Validates format
            } catch (error) {
                return 'Please enter a valid research link (URL)';
            }
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
                formData.append('research_title', research.research_title);
                formData.append('research_link', research.research_link);

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
            console.error('Error saving research ID details:', err);
            setSnackbarMsg('Error saving research ID details');
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
                            <BiotechIcon />
                            <Typography fontWeight={600}>Research Ids</Typography>
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
                                    Error fetching research id details.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={4}>
                                {researchList.map((research, index) => (
                                    <Box key={index} mb={3}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Research Id {index + 1}
                                            </Typography>

                                            {/* Show delete button if: has value OR not the first research */}
                                            {(research.research_title.trim() || index > 0) && (
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
                                            <FormLabel>{requiredLabel('Research Title')}</FormLabel>
                                            <TextField
                                                value={research.research_title}
                                                onChange={(e) => handleChange(index, 'research_title', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. AI in Healthcare"
                                            />
                                        </FormControl>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>Research Link</FormLabel>
                                            <TextField
                                                value={research.research_link}
                                                onChange={(e) => handleChange(index, 'research_link', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. https://researchgate.net/publication/..."
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
                            '& .MuiAlert-icon': { color: '#fff !important' },
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

export default ResearchIdForm;