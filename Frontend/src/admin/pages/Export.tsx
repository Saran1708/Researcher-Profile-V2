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
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../theme/AppTheme';
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

export default function Export(props) {
    const [selectedFields, setSelectedFields] = React.useState({});
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');

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

    const handleExport = () => {
        const selected = Object.keys(selectedFields).filter(key => selectedFields[key]);

        if (selected.length === 0) {
            setSnackbarMsg('Please select at least one field to export');
            setSnackbarOpen(true);
            return;
        }

        // Mock export functionality
        setSuccessMsg(`Successfully exported ${selected.length} field(s)!`);
        setSuccessSnackbarOpen(true);
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

                        {/* --------------------- */}
                        {/* Export Selection */}
                        {/* --------------------- */}

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
                                                            '&.Mui-checked': {
                                                                color: 'primary.main',
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                fill: 'white', // ← makes tick WHITE
                                                            },
                                                            '&.Mui-checked .MuiSvgIcon-root': {
                                                                fill: 'white', // ← ensures checked icon is white
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
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExport}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Export Selected Fields
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
                                <strong>Note:</strong> Selected fields will be exported in the format you choose.
                                The export will include all available data for the selected categories.
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
                message={snackbarMsg}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />

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