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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/conference/';

const emptyForm = {
    id: null,
    paper_title: '',
    conference_details: '',
    conference_type: '',
    conference_isbn: '',
    conference_year: '',
};

const ConferenceForm = () => {
    const [confs, setConfs] = useState([emptyForm]);
    const [expanded, setExpanded] = useState(false); // ADD THIS LINE
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setConfs(res.data.map(conf => ({
                        id: conf.id,
                        paper_title: conf.paper_title || '',
                        conference_details: conf.conference_details || '',
                        conference_type: conf.conference_type || '',
                        conference_isbn: conf.conference_isbn || '',
                        conference_year: conf.conference_year || '',
                    })));
                }
            } catch (err) {
                console.error('Error fetching conferences:', err);
                setFetchError(true);
            }
        };
        fetchConferences();
    }, []);

    const handleChange = (index, field, value) => {
        setConfs(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.paper_title.trim()) return 'Please enter the paper title';
        if (!form.conference_details.trim()) return 'Please enter the conference details';
        if (!form.conference_type) return 'Please select the conference type';
        if (!form.conference_isbn.trim()) return 'Please enter the conference ISBN';
        if (!form.conference_year) return 'Please select the year of the conference';
        return null;
    };

    const handleSubmit = async () => {
        for (let form of confs) {
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

            for (let conf of confs) {
                const formData = new FormData();
                formData.append('paper_title', conf.paper_title);
                formData.append('conference_details', conf.conference_details);
                formData.append('conference_type', conf.conference_type);
                formData.append('conference_isbn', conf.conference_isbn);
                formData.append('conference_year', conf.conference_year);

                if (conf.id) {
                    await axiosClient.put(`${API_URL}${conf.id}/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                } else {
                    const response = await axiosClient.post(API_URL, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    conf.id = response.data.id;
                }
            }
            setSuccessSnackbarOpen(true);
            setExpanded(false); // This now works correctly
        } catch (err) {
            console.error('Error saving conferences:', err);
            setSnackbarMsg('Error saving conferences');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => setConfs(prev => [...prev, emptyForm]);

    const handleDelete = async (index) => {
        const confToDelete = confs[index];
        if (confToDelete.id) {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                await axiosClient.delete(`${API_URL}${confToDelete.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Error deleting conference:', err);
                setSnackbarMsg('Error deleting conference');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            } finally {
                setLoading(false);
            }
        }
        setConfs(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyForm]);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);
    const handleSuccessSnackbarClose = () => setSuccessSnackbarOpen(false);

    const requiredLabel = (label) => (
        <span>{label} <span style={{ color: 'red' }}>*</span></span>
    );

    return (
        <Box mt="40px">
            {loading && <Loader />}
            <Container maxWidth="md">
                <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EventAvailableIcon />
                            <Typography fontWeight={600}>Conference Details</Typography>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        {fetchError ? (
                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
                                <Typography color="error" align="center" sx={{ py: 2 }}>
                                    Error fetching conference details.
                                </Typography>
                            </Box>
                        ) : (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack spacing={4}>
                                    {confs.map((conf, index) => (
                                        <Box key={index} mb={3}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Conference {index + 1}
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
                                                <FormLabel>{requiredLabel('Paper Title')}</FormLabel>
                                                <TextField
                                                    value={conf.paper_title}
                                                    onChange={e => handleChange(index, 'paper_title', e.target.value)}
                                                    disabled={loading}
                                                    placeholder="Enter paper title"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Conference Details')}</FormLabel>
                                                <TextField
                                                    value={conf.conference_details}
                                                    onChange={e => handleChange(index, 'conference_details', e.target.value)}
                                                    disabled={loading}
                                                    placeholder="Enter conference details"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Conference Type')}</FormLabel>
                                                <Select
                                                    value={conf.conference_type}
                                                    onChange={e => handleChange(index, 'conference_type', e.target.value)}
                                                    displayEmpty
                                                    disabled={loading}
                                                >
                                                    <MenuItem value="" disabled>Select Type</MenuItem>
                                                    <MenuItem value="National">National</MenuItem>
                                                    <MenuItem value="International">International</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Conference ISBN')}</FormLabel>
                                                <TextField
                                                    value={conf.conference_isbn}
                                                    onChange={e => handleChange(index, 'conference_isbn', e.target.value)}
                                                    disabled={loading}
                                                    placeholder="Enter conference ISBN"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Year')}</FormLabel>
                                                <DatePicker
                                                    views={['year']}
                                                    value={conf.conference_year ? dayjs(conf.conference_year, 'YYYY') : null}
                                                    onChange={newValue => handleChange(index, 'conference_year', newValue ? newValue.format('YYYY') : '')}
                                                    disabled={loading}
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
                                            </FormControl>
                                        </Box>
                                    ))}

                                    <Box textAlign="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAdd}
                                            sx={{ width: '250px' }}
                                            disabled={loading}
                                        >
                                            Add Another Conference
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
                                        {loading ? 'Saving...' : 'Save All Conferences'}
                                    </Button>
                                </Stack>
                            </LocalizationProvider>
                        )}
                    </AccordionDetails>
                </Accordion>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMsg}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                />
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
                        iconMapping={{ success: <CheckIcon sx={{ color: '#fff !important' }} /> }}
                    >
                        Conferences saved successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default ConferenceForm;