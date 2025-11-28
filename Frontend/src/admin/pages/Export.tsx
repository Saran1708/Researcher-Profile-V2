import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
import axiosClient from '../../utils/axiosClient';
import * as XLSX from 'xlsx';
import {
    chartsCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
    ...chartsCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const exportFields = [
    'Basic Details',
    'Education',
    'Research Career',
    'Career Highlights',
    'Research Areas',
    'Research ID',
    'Funding',
    'Publications',
    'Administrative Positions',
    'Honorary Positions',
    'Conference Details',
    'PhD Supervision',
    'Resource Person Details',
    'Areas of Consultancy',
    'Areas of Collaboration'
];

const API_URL = import.meta.env.VITE_API_URL + '/admin/export/';

export default function Export(props) {
    const [selectedFields, setSelectedFields] = React.useState({});
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleCheckboxChange = (field) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSelectAll = () => {
        const allSelected = {};
        exportFields.forEach(field => {
            allSelected[field] = true;
        });
        setSelectedFields(allSelected);
    };

    const handleDeselectAll = () => {
        setSelectedFields({});
    };

    const createExcelFromData = (responseData) => {
        const { data, selected_fields } = responseData;

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Prepare rows for Excel
        const excelData = [];

        // Process each user
        data.forEach((user, userIndex) => {
            // Basic row structure
            const userRows = [{ Email: user.email }];

            // Helper to add multiple entries (expands rows vertically)
            const addMultipleEntries = (fieldName, dataArray, keyMapping) => {
                if (!dataArray || dataArray.length === 0) {
                    // No data, add empty columns
                    Object.keys(keyMapping).forEach((key) => {
                        userRows[0][`${fieldName} - ${keyMapping[key]}`] = '';
                    });
                    return;
                }

                // For each entry in the array
                dataArray.forEach((entry, index) => {
                    // Ensure we have enough rows
                    while (userRows.length <= index) {
                        userRows.push({ Email: '' });
                    }

                    // Add each field as a column
                    Object.keys(keyMapping).forEach((key) => {
                        const columnName = `${fieldName} - ${keyMapping[key]}`;
                        userRows[index][columnName] = entry[key] || '';
                    });
                });
            };

            // Helper to add single entry (one row)
            const addSingleEntry = (fieldName, dataObject, keyMapping) => {
                if (!dataObject) {
                    Object.keys(keyMapping).forEach((key) => {
                        userRows[0][`${fieldName} - ${keyMapping[key]}`] = '';
                    });
                    return;
                }

                Object.keys(keyMapping).forEach((key) => {
                    userRows[0][`${fieldName} - ${keyMapping[key]}`] = dataObject[key] || '';
                });
            };

            // Process selected fields
            selected_fields.forEach((field) => {
                switch (field) {
                    case 'Basic Details':
                        addSingleEntry('Basic Details', user.basic_details, {
                            prefix: 'Prefix',
                            name: 'Name',
                            department: 'Department',
                            institution: 'Institution',
                            phone: 'Phone',
                            address: 'Address',
                            website: 'Website'
                        });
                        break;

                    case 'Education':
                        addMultipleEntries('Education', user.education, {
                            degree: 'Degree',
                            college: 'College',
                            start_year: 'Start Year',
                            end_year: 'End Year'
                        });
                        break;

                    case 'Research Career':
                        addMultipleEntries('Research Career', user.research_career, {
                            research_career_details: 'Details'
                        });
                        break;

                    case 'Career Highlights':
                        addMultipleEntries('Career Highlights', user.career_highlights, {
                            career_highlight_details: 'Details'
                        });
                        break;

                    case 'Research Areas':
                        addMultipleEntries('Research Areas', user.research_areas, {
                            research_areas: 'Area'
                        });
                        break;

                    case 'Research ID':
                        addMultipleEntries('Research ID', user.research_ids, {
                            research_title: 'Title',
                            research_link: 'Link'
                        });
                        break;

                    case 'Funding':
                        addMultipleEntries('Funding', user.funding, {
                            project_title: 'Project Title',
                            funding_agency: 'Agency',
                            funding_month_and_year: 'Month & Year',
                            funding_amount: 'Amount',
                            funding_status: 'Status'
                        });
                        break;

                    case 'Publications':
                        addMultipleEntries('Publications', user.publications, {
                            publication_title: 'Title',
                            publication_link: 'Link',
                            publication_type: 'Type',
                            publication_month_and_year: 'Month & Year'
                        });
                        break;

                    case 'Administrative Positions':
                        addMultipleEntries('Administrative Positions', user.administrative_positions, {
                            administration_position: 'Position',
                            administration_year_from: 'From Year',
                            administration_year_to: 'To Year'
                        });
                        break;

                    case 'Honorary Positions':
                        addMultipleEntries('Honorary Positions', user.honorary_positions, {
                            honary_position: 'Position',
                            honary_year: 'Year'
                        });
                        break;

                    case 'Conference Details':
                        addMultipleEntries('Conference Details', user.conferences, {
                            paper_title: 'Paper Title',
                            conference_details: 'Details',
                            conference_type: 'Type',
                            conference_isbn: 'ISBN',
                            conference_year: 'Year'
                        });
                        break;

                    case 'PhD Supervision':
                        addMultipleEntries('PhD Supervision', user.phd_supervision, {
                            phd_name: 'Student Name',
                            phd_topic: 'Topic',
                            phd_status: 'Status',
                            phd_years_of_completion: 'Year of Completion'
                        });
                        break;

                    case 'Resource Person Details':
                        addMultipleEntries('Resource Person Details', user.resource_person, {
                            resource_topic: 'Topic',
                            resource_department: 'Department',
                            resource_date: 'Date'
                        });
                        break;

                    case 'Areas of Consultancy':
                        addMultipleEntries('Areas of Consultancy', user.consultancy, {
                            consultancy_details: 'Details'
                        });
                        break;

                    case 'Areas of Collaboration':
                        addMultipleEntries('Areas of Collaboration', user.collaboration, {
                            collaboration_details: 'Details'
                        });
                        break;
                }
            });

            // Add all user rows to excel data
            excelData.push(...userRows);

            // Add empty separator row between users (except for last user)
            if (userIndex < data.length - 1) {
                excelData.push({});
            }
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(worksheet['!ref']);

        // Add borders to all cells for each user block
        let currentRow = 1; // Start from row 1 (0 is header)
        data.forEach((user, userIndex) => {
            // Calculate how many rows this user takes
            let maxRows = 1;
            selected_fields.forEach((field) => {
                let dataLength = 0;
                switch (field) {
                    case 'Education':
                        dataLength = user.education?.length || 0;
                        break;
                    case 'Research Career':
                        dataLength = user.research_career?.length || 0;
                        break;
                    case 'Career Highlights':
                        dataLength = user.career_highlights?.length || 0;
                        break;
                    case 'Research Areas':
                        dataLength = user.research_areas?.length || 0;
                        break;
                    case 'Research ID':
                        dataLength = user.research_ids?.length || 0;
                        break;
                    case 'Funding':
                        dataLength = user.funding?.length || 0;
                        break;
                    case 'Publications':
                        dataLength = user.publications?.length || 0;
                        break;
                    case 'Administrative Positions':
                        dataLength = user.administrative_positions?.length || 0;
                        break;
                    case 'Honorary Positions':
                        dataLength = user.honorary_positions?.length || 0;
                        break;
                    case 'Conference Details':
                        dataLength = user.conferences?.length || 0;
                        break;
                    case 'PhD Supervision':
                        dataLength = user.phd_supervision?.length || 0;
                        break;
                    case 'Resource Person Details':
                        dataLength = user.resource_person?.length || 0;
                        break;
                    case 'Areas of Consultancy':
                        dataLength = user.consultancy?.length || 0;
                        break;
                    case 'Areas of Collaboration':
                        dataLength = user.collaboration?.length || 0;
                        break;
                }
                maxRows = Math.max(maxRows, dataLength);
            });

            // Add border style to all cells in this user's block
            for (let R = currentRow; R < currentRow + maxRows; R++) {
                for (let C = range.s.c; C <= range.e.c; C++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!worksheet[cellAddress]) {
                        worksheet[cellAddress] = { v: '', t: 's' };
                    }
                    worksheet[cellAddress].s = {
                        border: {
                            top: { style: 'thin', color: { rgb: '000000' } },
                            bottom: { style: 'thin', color: { rgb: '000000' } },
                            left: { style: 'thin', color: { rgb: '000000' } },
                            right: { style: 'thin', color: { rgb: '000000' } }
                        }
                    };
                }
            }

            // Move to next user block (including the empty separator row)
            currentRow += maxRows + 1;
        });

        // Auto-size columns
        const columnWidths = [];
        const colRange = XLSX.utils.decode_range(worksheet['!ref']);

        for (let C = colRange.s.c; C <= colRange.e.c; ++C) {
            let maxWidth = 10;
            for (let R = colRange.s.r; R <= colRange.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell && cell.v) {
                    const cellLength = cell.v.toString().length;
                    if (cellLength > maxWidth) {
                        maxWidth = cellLength;
                    }
                }
            }
            columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
        }
        worksheet['!cols'] = columnWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Export');

        // Generate filename
        const fileName = `Staff_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Download file
        XLSX.writeFile(workbook, fileName);
    };

    const handleExport = async () => {
        const selected = Object.keys(selectedFields).filter(key => selectedFields[key]);

        if (selected.length === 0) {
            setSnackbarMsg('Please select at least one field to export');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setSnackbarMsg('Authentication required');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }

            const response = await axiosClient.post(
                API_URL,
                { fields: selected },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Create Excel file from response data
                createExcelFromData(response.data);

                setSuccessMsg(`Successfully exported ${response.data.total_users} user(s) with ${selected.length} field(s)!`);
                setSuccessSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Export error:', error);
            setSnackbarMsg(error.response?.data?.error || 'Failed to export data');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />

            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />

                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                        minWidth: 0,
                    })}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            alignItems: 'stretch',
                            mx: { xs: 2, sm: 3, md: 4 },
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Export Data
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleSelectAll}
                                    sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDeselectAll}
                                    sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
                                >
                                    Deselect All
                                </Button>
                            </Box>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                p: 4
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
                                Select the fields you want to export:
                            </Typography>

                            <FormGroup>
                                <Grid container spacing={2}>
                                    {exportFields.map((field) => (
                                        <Grid item xs={12} sm={6} md={4} key={field}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedFields[field] || false}
                                                        onChange={() => handleCheckboxChange(field)}
                                                        sx={{
                                                            color: 'primary.main',

                                                            // when not checked
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 26,
                                                            },

                                                            // when checked – make tick white
                                                            '&.Mui-checked .MuiSvgIcon-root': {
                                                                color: 'white',
                                                                backgroundColor: 'primary.main',
                                                                borderRadius: '4px',
                                                            },

                                                            // checkbox background stays blue when checked
                                                            '&.Mui-checked': {
                                                                color: 'primary.main',
                                                            },
                                                        }}
                                                    />

                                                }
                                                label={field}
                                                sx={{
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '0.95rem',
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                                    onClick={handleExport}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#43a047', // lighter green
                                        }

                                    }}
                                >
                                    {loading ? 'Exporting...' : 'Export Selected Fields'}
                                </Button>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                p: 3,
                                backgroundColor: (theme) => alpha(theme.palette.info.main, 0.05)
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                <strong>Note:</strong> Selected fields will be exported to Excel format.
                                Each user's data will be in rows, and selected fields will be columns.
                                If a user has multiple entries (e.g., multiple education records), they will span multiple rows.
                            </Typography>
                        </Paper>

                    </Stack>
                </Box>
            </Box>

            {/* Snackbar Notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: '#4caf50 !important',
                        color: '#fff !important',
                        borderRadius: 2
                    }}
                    iconMapping={{ success: <CheckIcon sx={{ color: 'white' }} /> }}
                >
                    {successMsg}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
}