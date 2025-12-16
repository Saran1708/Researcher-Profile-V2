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
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../MainComponents/Loader';

const API_URL = import.meta.env.VITE_API_URL + '/publication/';

const PublicationForm = () => {
    const emptyForm = {
        id: null,
        publication_title: '',
        publication_link: '',
        publication_type: '',
        custom_type: '',
        publication_month_and_year: '',
    };

    const [expanded, setExpanded] = useState(false);
    const [publicationList, setPublicationList] = useState([emptyForm]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        const fetchPublicationDetails = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const res = await axiosClient.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setPublicationList(res.data.map(pub => {
                        const savedType = pub.publication_type || '';
                        const standardTypes = ['Journal', 'Article'];
                        const isCustomType = savedType && !standardTypes.includes(savedType);

                        return {
                            id: pub.id,
                            publication_title: pub.publication_title || '',
                            publication_link: pub.publication_link || '',
                            publication_type: isCustomType ? 'Custom' : savedType,
                            custom_type: isCustomType ? savedType : '',
                            publication_month_and_year: pub.publication_month_and_year || '',
                        };
                    }));
                }
            } catch (err) {
                console.error('Error fetching publication details:', err);
                setFetchError(true);
            }
        };

        fetchPublicationDetails();
    }, []);

    const isValidURL = (url) => {
        try { new URL(url); return true; } catch { return false; }
    };

    const handleChange = (index, field, value) => {
        setPublicationList((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validateForm = (form) => {
        if (!form.publication_title.trim()) return 'Please enter the publication title';
        if (!form.publication_link.trim()) return 'Please enter the publication link';
        if (!isValidURL(form.publication_link)) return 'Please enter a valid publication link (URL)';
        const typeValue = form.publication_type === 'Custom' ? form.custom_type : form.publication_type;
        if (!typeValue.trim()) return 'Please select or enter a publication type';
        if (!form.publication_month_and_year.trim()) return 'Please enter publication month and year';
        return null;
    };

    const handleSubmit = async () => {
        for (let form of publicationList) {
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

            for (let publication of publicationList) {
                const formData = new FormData();
                formData.append('publication_title', publication.publication_title);
                formData.append('publication_link', publication.publication_link);
                formData.append('publication_type',
                    publication.publication_type === 'Custom'
                        ? publication.custom_type
                        : publication.publication_type
                );
                formData.append('publication_month_and_year', publication.publication_month_and_year);

                if (publication.id) {
                    await axiosClient.put(`${API_URL}${publication.id}/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    const response = await axiosClient.post(API_URL, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    publication.id = response.data.id;
                }
            }

            setSuccessSnackbarOpen(true);
            setExpanded(false);
        } catch (err) {
            console.error('Error saving publication details:', err);
            setSnackbarMsg('Error saving publication details');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPublication = () => setPublicationList((prev) => [...prev, emptyForm]);
    const handleDeletePublication = async (index) => {
        const publicationToDelete = publicationList[index];
        if (publicationToDelete.id) {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                await axiosClient.delete(`${API_URL}${publicationToDelete.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error('Error deleting publication:', err);
                setSnackbarMsg('Error deleting publication');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            } finally { setLoading(false); }
        }
        setPublicationList(prev =>
            prev.length > 1 ? prev.filter((_, i) => i !== index) : [emptyForm]
        );
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
                            <LibraryBooksIcon />
                            <Typography fontWeight={600}>Publication Details</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        {fetchError ? (
                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2, textAlign: 'center' }}>
                                <Typography color="error" align="center" sx={{ py: 2 }}>
                                    Error fetching publication details.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={4}>
                                {publicationList.map((pub, index) => (
                                    <Box key={index} mb={3}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Publication {index + 1}
                                            </Typography>
                                            {(pub.publication_title.trim() || index > 0) && (
                                                <Button
                                                    size="small" variant="outlined" color="error"
                                                    onClick={() => handleDeletePublication(index)}
                                                    startIcon={<DeleteIcon />} disabled={loading}
                                                >Delete</Button>
                                            )}
                                        </Stack>
                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Publication Title')}</FormLabel>
                                            <TextField
                                                value={pub.publication_title}
                                                onChange={(e) => handleChange(index, 'publication_title', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. Machine Learning for Medicine"
                                            />
                                        </FormControl>
                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Publication Link')}</FormLabel>
                                            <TextField
                                                value={pub.publication_link}
                                                onChange={(e) => handleChange(index, 'publication_link', e.target.value)}
                                                disabled={loading}
                                                placeholder="e.g. https://doi.org/10.1234"
                                            />
                                        </FormControl>
                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Publication Type')}</FormLabel>
                                            <Select
                                                value={pub.publication_type}
                                                onChange={(e) => handleChange(index, 'publication_type', e.target.value)}
                                                fullWidth displayEmpty disabled={loading}
                                            >
                                                <MenuItem value="" disabled>Select Type</MenuItem>
                                                <MenuItem value="Journal">Journal</MenuItem>
                                                <MenuItem value="Article">Article</MenuItem>
                                                <MenuItem value="Custom">Custom</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {pub.publication_type === 'Custom' && (
                                            <FormControl fullWidth margin="normal">
                                                <FormLabel>{requiredLabel('Custom Type')}</FormLabel>
                                                <TextField
                                                    value={pub.custom_type}
                                                    onChange={(e) => handleChange(index, 'custom_type', e.target.value)}
                                                    disabled={loading}
                                                    placeholder="e.g. Book Chapter, Conference Paper"
                                                />
                                            </FormControl>
                                        )}
                                        <FormControl fullWidth margin="normal">
                                            <FormLabel>{requiredLabel('Publication Month and Year')}</FormLabel>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    views={['year', 'month']}
                                                    value={pub.publication_month_and_year ? dayjs(pub.publication_month_and_year, 'MMMM YYYY') : null}
                                                    onChange={(newValue) => {
                                                        const formatted = newValue ? newValue.format('MMMM YYYY') : '';
                                                        handleChange(index, 'publication_month_and_year', formatted);
                                                    }}
                                                    disabled={loading}
                                                    slotProps={{ textField: { fullWidth: true, placeholder: "Select month and year" } }}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Box>
                                ))}
                                <Box textAlign="center">
                                    <Button
                                        variant="contained" color="primary"
                                        onClick={handleAddPublication}
                                        sx={{ width: '250px' }} disabled={loading}
                                    >Add Another Publication</Button>
                                </Box>
                                <Button
                                    variant="contained" color="primary"
                                    fullWidth onClick={handleSubmit} disabled={loading}
                                    size="medium"
                                >{loading ? 'Saving...' : 'Save All Publication Details'}</Button>
                            </Stack>
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
                        severity="success" variant="filled"
                        sx={{
                            width: '100%',
                            backgroundColor: '#4caf50 !important',
                            color: '#fff !important',
                            '& .MuiAlert-icon': { color: '#fff !important' },
                        }}
                        iconMapping={{ success: <CheckIcon sx={{ color: '#fff !important' }} /> }}
                    >Publication details saved successfully!</Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};
export default PublicationForm;
