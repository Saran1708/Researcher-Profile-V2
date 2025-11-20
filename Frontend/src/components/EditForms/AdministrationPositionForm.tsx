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
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/administration-position/';

const emptyForm = {
    id: null,
    administration_position: '',
    administration_year_from: '',
    administration_year_to: '',
    is_current: false,
};

const AdministrationPositionForm = () => {
    const [expanded, setExpanded] = useState(false);
    const [positions, setPositions] = useState([emptyForm]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    // Fetch positions on mount
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setPositions(res.data.map(pos => ({
                        id: pos.id,
                        administration_position: pos.administration_position || '',
                        administration_year_from: pos.administration_year_from || '',
                        administration_year_to: pos.administration_year_to || '',
                        is_current: pos.administration_year_to === 'Present' ? true : false,
                    })));
                }
            } catch (err) {
                console.error('Error fetching positions:', err);
                setFetchError(true);
            }
        };

        fetchPositions();
    }, []);

    const handleChange = (index, field, value) => {
        setPositions((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            // If checkbox is checked, set year_to as 'Present'
            if (field === 'is_current') {
                updated[index].administration_year_to = value ? 'Present' : '';
            }
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.administration_position.trim()) {
            return 'Please fill the position name';
        }
        if (!form.administration_year_from) {
            return 'Please select the From year';
        }
        if (!form.is_current && !form.administration_year_to) {
            return 'Please select the To year or check "Still in this role"';
        }
        if (
            !form.is_current &&
            form.administration_year_from &&
            form.administration_year_to &&
            parseInt(form.administration_year_from) > parseInt(form.administration_year_to)
        ) {
            return '"From Year" cannot be after "To Year"';
        }
        return null;
    };

    const handleSubmit = async () => {
        for (let form of positions) {
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

            for (let pos of positions) {
                const formData = new FormData();
                formData.append('administration_position', pos.administration_position);
                formData.append('administration_year_from', pos.administration_year_from);
                formData.append('administration_year_to', pos.is_current ? 'Present' : pos.administration_year_to);

                if (pos.id) {
                    await axiosClient.put(`${API_URL}${pos.id}/`, formData, {
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
                    pos.id = response.data.id;
                }
            }

            setSuccessSnackbarOpen(true);
            setExpanded(false);
        } catch (err) {
            console.error('Error saving administrative positions:', err);
            setSnackbarMsg('Error saving administrative positions');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => setPositions((prev) => [...prev, emptyForm]);

    const handleDelete = async (index) => {
        const posToDelete = positions[index];
        if (posToDelete.id) {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                await axiosClient.delete(`${API_URL}${posToDelete.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Error deleting position:', err);
                setSnackbarMsg('Error deleting administrative position');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            } finally { setLoading(false); }
        }
        setPositions(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyForm]);
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
                            <AdminPanelSettingsIcon />
                            <Typography fontWeight={600}>Administrative Positions</Typography>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        {fetchError ? (
                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
                                <Typography color="error" align="center" sx={{ py: 2 }}>
                                    Error fetching administrative positions.
                                </Typography>
                            </Box>
                        ) : (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack spacing={4}>
                                    {positions.map((pos, index) => (
                                        <Box key={index} mb={3}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Position {index + 1}
                                                </Typography>

                                                {(pos.administration_position.trim() || index > 0) && (
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
                                                )}
                                            </Stack>
                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Position')}</FormLabel>
                                                <TextField
                                                    value={pos.administration_position}
                                                    onChange={(e) =>
                                                        handleChange(index, 'administration_position', e.target.value)
                                                    }
                                                    disabled={loading}
                                                    placeholder="e.g. Dean, Head of Department"
                                                />
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('From Year')}</FormLabel>
                                                <DatePicker
                                                    views={['year']}
                                                    value={pos.administration_year_from ? dayjs(pos.administration_year_from, 'YYYY') : null}
                                                    onChange={(newValue) =>
                                                        handleChange(index, 'administration_year_from', newValue ? newValue.format('YYYY') : '')
                                                    }
                                                    disabled={loading}
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth margin="normal">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={pos.is_current}
                                                            onChange={(e) =>
                                                                handleChange(index, 'is_current', e.target.checked)
                                                            }
                                                            disabled={loading}
                                                        />
                                                    }
                                                    label="Still in this role"
                                                />
                                            </FormControl>
                                            {!pos.is_current && (
                                                <FormControl fullWidth margin="normal">
                                                    <FormLabel>{requiredLabel('To Year')}</FormLabel>
                                                    <DatePicker
                                                        views={['year']}
                                                        value={pos.administration_year_to ? dayjs(pos.administration_year_to, 'YYYY') : null}
                                                        onChange={(newValue) =>
                                                            handleChange(index, 'administration_year_to', newValue ? newValue.format('YYYY') : '')
                                                        }
                                                        disabled={loading}
                                                        slotProps={{ textField: { fullWidth: true } }}
                                                    />
                                                </FormControl>
                                            )}
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
                                            Add Another Position
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
                                        {loading ? 'Saving...' : 'Save All Positions'}
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
                        Administrative positions saved successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default AdministrationPositionForm;
