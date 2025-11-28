import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import SitemarkIcon from '../components/MainComponents/SitemarkIcon';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/MainComponents/AppAppBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/MainComponents/Loader';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const ResetContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function ResetPassword(props: { disableCustomTheme?: boolean }) {
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateInputs()) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                `${baseUrl}/api/reset-password/`,
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Optionally update localStorage so user doesn't get blocked again
            localStorage.setItem('password_changed', 'true');

            // Navigate to home  page - loading will continue until new page loads
            navigate('/staff/home');
        } catch (err) {
            setPasswordError(true);
            setPasswordErrorMessage('Failed to reset password.');
            // Only stop loading on error, not on success
            setLoading(false);
        }
    };

    const validateInputs = () => {
        let isValid = true;

        if (!newPassword || newPassword.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters.');
            isValid = false;
        } else if (newPassword.length > 15) {
            setPasswordError(true);
            setPasswordErrorMessage('Password cannot exceed 15 characters.');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setPasswordError(true);
            setPasswordErrorMessage("Passwords don't match.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />

            {loading && <Loader />}

            <ResetContainer direction="column" justifyContent="space-between">
                <AppAppBar />
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Reset Password
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="new-password">New Password</FormLabel>
                            <TextField
                                error={passwordError}

                                name="new-password"
                                placeholder="••••••"
                                type="password"
                                id="new-password"
                                required
                                fullWidth
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordError ? passwordErrorMessage : ''}
                                name="confirm-password"
                                placeholder="••••••"
                                type="password"
                                id="confirm-password"
                                required
                                fullWidth
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <br />

                        <Button type="submit" fullWidth variant="contained">
                            Reset Password
                        </Button>
                    </Box>
                </Card>
            </ResetContainer>
        </AppTheme>
    );
}