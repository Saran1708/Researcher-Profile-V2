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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/honary-position/';

const emptyForm = {
    id: null,
    honary_position: '',
    honary_year: '',
};

const HonaryPositionForm = () => {
    const [honaryList, setHonaryList] = useState([emptyForm]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const fetchHonaryPositions = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setHonaryList(res.data.map(item => ({
                        id: item.id,
                        honary_position: item.honary_position || '',
                        honary_year: item.honary_year || '',
                    })));
                }
            } catch (err) {
                console.error('Error fetching honorary positions:', err);
                setFetchError(true);
            }
        };
        fetchHonaryPositions();
    }, []);

    const handleChange = (index, field, value) => {
        setHonaryList(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.honary_position.trim()) return 'Please enter the honorary position';
        if (!form.honary_year) return 'Please select the year';
        return null;
    };

    const handleSubmit = async () => {
        for (let form of honaryList) {
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

            for (let item of honaryList) {
                const formData = new FormData();
                formData.append('honary_position', item.honary_position);
                formData.append('honary_year', item.honary_year);

                if (item.id) {
                    await axiosClient.put(`${API_URL}${item.id}/`, formData, {
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
                    item.id = response.data.id;
                }
            }
            setSuccessSnackbarOpen(true);
            setExpanded(false);
        } catch (err) {
            console.error('Error saving honorary positions:', err);
            setSnackbarMsg('Error saving honorary positions');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => setHonaryList(prev => [...prev, emptyForm]);

    const handleDelete = async (index) => {
        const honaryToDelete = honaryList[index];
        if (honaryToDelete.id) {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                await axiosClient.delete(`${API_URL}${honaryToDelete.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Error deleting honorary position:', err);
                setSnackbarMsg('Error deleting honorary position');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            } finally {
                setLoading(false);
            }
        }
        setHonaryList(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyForm]);
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
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WorkspacePremiumIcon />
                            <Typography fontWeight={600}>Honorary Positions</Typography>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        {fetchError ? (
                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
                               <Typography color="error" align="center" sx={{ py: 2 }}>
                                    Error fetching honorary positions.
                                </Typography>
                            </Box>
                        ) : (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack spacing={4}>
                                    {honaryList.map((item, index) => (
                                        <Box key={index} mb={3}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Honorary {index + 1}
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
                                                <FormLabel>{requiredLabel('Honorary Position')}</FormLabel>
                                                <TextField
                                                    value={item.honary_position}
                                                    onChange={e => handleChange(index, 'honary_position', e.target.value)}
                                                    disabled={loading}
                                                    placeholder="e.g. Lifetime Achievement Award"
                                                />
                                            </FormControl>

                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Year')}</FormLabel>
                                                <DatePicker
                                                    views={['year']}
                                                    value={item.honary_year ? dayjs(item.honary_year, 'YYYY') : null}
                                                    onChange={newValue => handleChange(index, 'honary_year', newValue ? newValue.format('YYYY') : '')}
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
                                            Add Another Honorary Role
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
                                        {loading ? 'Saving...' : 'Save All Honorary Positions'}
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
                        iconMapping={{
                            success: <CheckIcon sx={{ color: '#fff !important' }} />
                        }}
                    >
                        Honorary positions saved successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default HonaryPositionForm;
