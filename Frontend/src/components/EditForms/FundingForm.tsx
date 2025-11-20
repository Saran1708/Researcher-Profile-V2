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
    MenuItem,
    Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/funding/';

const FundingForm = () => {
    const emptyForm = {
        id: null,
        project_title: '',
        funding_agency: '',
        funding_month_and_year: '',
        funding_amount: '',
        funding_status: '',
    };

    const [expanded, setExpanded] = useState(false);
    const [fundingList, setFundingList] = useState([emptyForm]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    // fetch funding details on mount
    useEffect(() => {
        const fetchFundingDetails = async () => {
            try {
                const token = localStorage.getItem('access_token');

                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.length > 0) {
                    // If we get an array of funding records
                    const formattedFunding = res.data.map(funding => ({
                        id: funding.id,
                        project_title: funding.project_title || '',
                        funding_agency: funding.funding_agency || '',
                        funding_month_and_year: funding.funding_month_and_year || '',
                        funding_amount: funding.funding_amount || '',
                        funding_status: funding.funding_status || '',
                    }));
                    setFundingList(formattedFunding);
                } else if (res.data && !Array.isArray(res.data)) {
                    // If we get a single funding object
                    setFundingList([{
                        id: res.data.id,
                        project_title: res.data.project_title || '',
                        funding_agency: res.data.funding_agency || '',
                        funding_month_and_year: res.data.funding_month_and_year || '',
                        funding_amount: res.data.funding_amount || '',
                        funding_status: res.data.funding_status || '',
                    }]);
                }
            } catch (err) {
                console.error('Error fetching funding details:', err);
                setFetchError(true);
            }
        };

        fetchFundingDetails();
    }, []);

    const handleChange = (index, field, value) => {
        setFundingList((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.project_title.trim()) {
            return 'Please enter the project title';
        }

        if (!form.funding_agency.trim()) {
            return 'Please enter the funding agency';
        }

        if (!form.funding_month_and_year.trim()) {
            return 'Please enter funding month and year';
        }

        if (!form.funding_amount.toString().trim()) {
            return 'Please enter the funding amount';
        }

        if (isNaN(Number(form.funding_amount))) {
            return 'Funding amount must be a valid number';
        }

        if (Number(form.funding_amount) < 0) {
            return 'Funding amount cannot be negative';
        }

        if (!form.funding_status) {
            return 'Please select funding status';
        }

        return null;
    };

    const handleSubmit = async () => {
        // Validate all forms
        for (let form of fundingList) {
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

            // Handle each funding record properly
            for (let funding of fundingList) {
                const formData = new FormData();
                formData.append('project_title', funding.project_title);
                formData.append('funding_agency', funding.funding_agency);
                formData.append('funding_month_and_year', funding.funding_month_and_year);
                formData.append('funding_amount', funding.funding_amount);
                formData.append('funding_status', funding.funding_status);

                if (funding.id) {
                    // UPDATE existing funding
                    await axiosClient.put(`${API_URL}${funding.id}/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    // CREATE new funding (only for records without ID)
                    const response = await axiosClient.post(API_URL, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    // Update the funding with the returned ID
                    funding.id = response.data.id;
                }
            }

            setSnackbarOpen(false);
            setSuccessSnackbarOpen(true);
            setExpanded(false);

        } catch (err) {
            console.error('Error saving funding details:', err);
            setSnackbarMsg('Error saving funding details');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunding = () => {
        setFundingList((prev) => [...prev, emptyForm]);
    };

    const handleDeleteFunding = async (index) => {
        const fundingToDelete = fundingList[index];
        
        // If the funding has an ID, delete it from the database
        if (fundingToDelete.id) {
            setLoading(true); // Add loading state for delete
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    await axiosClient.delete(`${API_URL}${fundingToDelete.id}/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            } catch (err) {
                console.error('Error deleting funding:', err);
                setSnackbarMsg('Error deleting funding');
                setSnackbarOpen(true);
                setLoading(false); // Stop loading on error
                return;
            } finally {
                setLoading(false); // Stop loading after delete
            }
        }

        // Remove from UI
        setFundingList((prev) => {
            const newList = prev.filter((_, i) => i !== index);
            // If no funding left, add one empty form
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
                            <MonetizationOnIcon />
                            <Typography fontWeight={600}>Funding Details</Typography>
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
                                    Error fetching funding details.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={4}>
                                {fundingList.map((funding, index) => (
                                    <Box key={index} mb={3}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Funding {index + 1}
                                            </Typography>

                                            {/* Show delete button if: has value OR not the first funding */}
                                            {(funding.project_title.trim() || index > 0) && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteFunding(index)}
                                                    startIcon={<DeleteIcon />}
                                                    disabled={loading}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Stack>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Project Title')}</FormLabel>
                                            <TextField
                                                value={funding.project_title}
                                                onChange={(e) => handleChange(index, 'project_title', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. AI in Healthcare Research"
                                            />
                                        </FormControl>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Funding Agency')}</FormLabel>
                                            <TextField
                                                value={funding.funding_agency}
                                                onChange={(e) => handleChange(index, 'funding_agency', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. National Science Foundation"
                                            />
                                        </FormControl>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Funding Month and Year')}</FormLabel>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    views={['year', 'month']}
                                                    value={funding.funding_month_and_year ? dayjs(funding.funding_month_and_year, 'MMMM YYYY') : null}
                                                    onChange={(newValue) => {
                                                        const formatted = newValue ? newValue.format('MMMM YYYY') : '';
                                                        handleChange(index, 'funding_month_and_year', formatted);
                                                    }}
                                                    disabled={loading}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            placeholder: "Select month and year"
                                                        }
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Funding Amount')}</FormLabel>
                                            <TextField
                                                type="number"
                                                value={funding.funding_amount}
                                                onChange={(e) => handleChange(index, 'funding_amount', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. 50000"
                                                inputProps={{ min: 0 }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Funding Status')}</FormLabel>
                                            <Select
                                                value={funding.funding_status}
                                                onChange={(e) => handleChange(index, 'funding_status', e.target.value)}
                                                fullWidth
                                                displayEmpty
                                                disabled={loading}
                                            >
                                                <MenuItem value="" disabled>Select Status</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                ))}

                                <Box textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddFunding}
                                        sx={{ width: '250px' }}
                                        disabled={loading}
                                    >
                                        Add Another Funding
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
                                    {loading ? 'Saving...' : 'Save All Funding Details'}
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
                        Funding details saved successfully!
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default FundingForm;
