
import React, { useState, useCallback, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Slider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utility/cropImage';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';
import Loader from '../MainComponents/Loader';


const API_URL = import.meta.env.VITE_API_URL + '/staff-details/';
// change if different

const UserDetailsForm = () => {
  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [formValues, setFormValues] = useState({
    prefix: '',
    name: '',
    department: '',
    department_order: '',
    phone: '',
    address: '',
    website: '',
    profile_picture: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState<React.ReactNode>('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // fetch staff details on mount
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');



        if (!token) return;

        const res = await axiosClient.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          setFormValues({
            prefix: res.data.prefix || '',
            name: res.data.name || '',
            department: res.data.department || '',
            department_order: res.data.department_order || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            website: res.data.website || '',
            profile_picture: null
          });
          if (res.data.profile_picture) {
            let profilePicUrl = res.data.profile_picture;

            // Ensure the URL is absolute, prepend backend URL if needed
            if (!profilePicUrl.startsWith('http')) {
              if (!profilePicUrl.startsWith('/')) {
                profilePicUrl = '/' + profilePicUrl;
              }
              profilePicUrl = import.meta.env.VITE_BASE_URL + profilePicUrl;
            }

            setPreview(profilePicUrl);
          }

        }
      } catch (err) {
        console.error('Error fetching staff details:', err);
        setFetchError(true);
      }
    };

    fetchStaffDetails();
  }, []);

  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const readFile = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result as string), false);
      reader.readAsDataURL(file);
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageDataUrl = await readFile(file);
      setCropImageSrc(imageDataUrl);
      setOpenCrop(true);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    const croppedImageUrl = await getCroppedImg(cropImageSrc, croppedAreaPixels);
    setPreview(croppedImageUrl);

    // Fetch the cropped image URL as blob
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = blob.type.split('/')[1] || 'png';
    const filename = `profile_picture_${timestamp}.${extension}`;
    const file = new File([blob], filename, { type: blob.type });

    setFormValues((prev) => ({
      ...prev,
      profile_picture: file,
    }));

    setOpenCrop(false);
  };



  const validateForm = () => {
    const requiredFields = ['prefix', 'name', 'department', 'department_order', 'phone', 'address'];

    for (const field of requiredFields) {
      if (!formValues[field]) {
        setSnackbarMsg(
          <>Please fill the <b>{field.replace('_', ' ')}</b> field</>
        );
        setSnackbarOpen(true);
        return false;
      }
    }

    // Phone number validation: exactly 10 digits, numbers only
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formValues.phone)) {
      setSnackbarMsg('Phone number must be exactly 10 digits.');
      setSnackbarOpen(true);
      return false;
    }

    // Website URL validation (optional) - must start with http:// or https://
    if (formValues.website) {
      const urlRegex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+([\/\w\-\.\?\=\&\#]*)*$/i;

      if (!urlRegex.test(formValues.website)) {
        setSnackbarMsg('Website URL is invalid. It must start with http:// or https://');
        setSnackbarOpen(true);
        return false;
      }
    }

    // Mandatory profile picture check:
    if (!formValues.profile_picture && !preview) {
      setSnackbarMsg('Profile picture is required.');
      setSnackbarOpen(true);
      return false;
    }

    return true;
  };





  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;



      const formData = new FormData();

      const formattedName = toSentenceCase(formValues.name);

      for (const [key, value] of Object.entries(formValues)) {
        if (value === null || value === undefined) continue;

        if (key === 'name') {
          formData.append(key, formattedName);  // send formatted name
        } else if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      }


      await axiosClient.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbarOpen(false);
      setSuccessSnackbarOpen(true);
    } catch (err) {
      console.error('Error saving staff details:', err);
      setSnackbarMsg('Error saving profile');
      setSnackbarOpen(true);
    } finally {
      // ✅ ADD THIS LINE
      setLoading(false);
    };
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const requiredLabel = (label: string) => (
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
              <PersonIcon />
              <Typography fontWeight={600}>Profile Details</Typography>
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
                  Error fetching your details.
                </Typography>
                
              </Box>
            ) : (
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl sx={{ minWidth: 140 }}>
                    <FormLabel>{requiredLabel('Prefix')}</FormLabel>
                    <Select
                      name="prefix"
                      value={formValues.prefix}
                      onChange={handleChange}
                      fullWidth
                      displayEmpty
                      disabled={loading}
                    >
                      <MenuItem value="" disabled>Select Prefix</MenuItem>
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                      <MenuItem value="Ms">Ms</MenuItem>
                      <MenuItem value="Dr">Dr</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel>{requiredLabel('Full Name')}</FormLabel>
                    <TextField name="name" fullWidth value={formValues.name} onChange={handleChange} disabled={loading} />
                  </FormControl>
                </Stack>

                <FormControl>
                  <FormLabel>{requiredLabel('Department')}</FormLabel>
                  <Select
                    name="department"
                    value={formValues.department}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    disabled={loading}
                  >



                    <MenuItem value="" disabled>Select Department</MenuItem>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      Aided Stream
                    </Typography>
                    <MenuItem value="English - Aided">English</MenuItem>
                    <MenuItem value="Tamil - Aided">Tamil</MenuItem>
                    <MenuItem value="Languages - Aided">Languages</MenuItem>
                    <MenuItem value="History - Aided">History</MenuItem>
                    <MenuItem value="Political Science - Aided">Political Science</MenuItem>
                    <MenuItem value="Public Administration - Aided">Public Administration</MenuItem>
                    <MenuItem value="Economics - Aided">Economics</MenuItem>
                    <MenuItem value="Philosophy - Aided">Philosophy</MenuItem>
                    <MenuItem value="Commerce - Aided">Commerce</MenuItem>
                    <MenuItem value="Social Work - Aided">Social Work</MenuItem>
                    <MenuItem value="Mathematics - Aided">Mathematics</MenuItem>
                    <MenuItem value="Statistics - Aided">Statistics</MenuItem>
                    <MenuItem value="Physics - Aided">Physics</MenuItem>
                    <MenuItem value="Chemistry - Aided">Chemistry</MenuItem>
                    <MenuItem value="Botany - Aided">Botany</MenuItem>
                    <MenuItem value="Zoology - Aided">Zoology</MenuItem>
                    <MenuItem value="Physical Education - Aided">Physical Education</MenuItem>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      Self-Financed Stream
                    </Typography>


                    <MenuItem value="English - SFS">English</MenuItem>
                    <MenuItem value="Tamil - SFS">Tamil</MenuItem>
                    <MenuItem value="Languages - SFS">Languages</MenuItem>
                    <MenuItem value="Journalism - SFS">Journalism</MenuItem>
                    <MenuItem value="Social Work - SFS">Social Work</MenuItem>
                    <MenuItem value="Commerce - SFS">Commerce</MenuItem>
                    <MenuItem value="Business Administration - SFS">Business Administration</MenuItem>
                    <MenuItem value="Communication - SFS">Communication</MenuItem>
                    <MenuItem value="Geography - SFS">Geography</MenuItem>
                    <MenuItem value="Tourism Studies - SFS">Tourism Studies</MenuItem>
                    <MenuItem value="Mathematics - SFS">Mathematics</MenuItem>
                    <MenuItem value="Physics - SFS">Physics</MenuItem>
                    <MenuItem value="Chemistry - SFS">Chemistry</MenuItem>
                    <MenuItem value="Microbiology - SFS">Microbiology</MenuItem>
                    <MenuItem value="Computer Application (BCA) - SFS">Computer Application (BCA)</MenuItem>
                    <MenuItem value="Computer Science (B.Sc) - SFS">Computer Science (B.Sc)</MenuItem>
                    <MenuItem value="Computer Science (MCA) - SFS">Computer Science (MCA)</MenuItem>
                    <MenuItem value="Visual Communication - SFS">Visual Communication</MenuItem>
                    <MenuItem value="Physical Education, Health Education and Sports - SFS">Physical Education, Health Education and Sports</MenuItem>
                    <MenuItem value="Psychology - SFS">Psychology</MenuItem>
                    <MenuItem value="Data Science - SFS">Data Science</MenuItem>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      Units
                    </Typography>
                    <MenuItem value="MCC - MRF Innovation Park">MCC - MRF Innovation Park</MenuItem>
                  </Select>
                </FormControl>


                <FormControl>
                  <FormLabel>{requiredLabel('Department Order')}</FormLabel>
                  <Select
                    name="department_order"
                    value={formValues.department_order}
                    onChange={handleChange}
                    fullWidth
                    displayEmpty
                    disabled={loading}
                  >

                    <MenuItem value="" disabled>Select Order</MenuItem>
                    {[...Array(20)].map((_, idx) => (
                      <MenuItem key={idx + 1} value={idx + 1}>{idx + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>{requiredLabel('Phone Number')}</FormLabel>
                  <TextField name="phone" fullWidth value={formValues.phone} onChange={handleChange} disabled={loading} />
                </FormControl>

                <FormControl>
                  <FormLabel>{requiredLabel('Address')}</FormLabel>
                  <TextField name="address" fullWidth value={formValues.address} onChange={handleChange} disabled={loading} />
                </FormControl>

                <FormControl>
                  <FormLabel>Website (optional)</FormLabel>
                  <TextField name="website" type="url" fullWidth value={formValues.website} onChange={handleChange} disabled={loading} />
                </FormControl>

                <FormControl>
                  <FormLabel>{requiredLabel('Profile Picture')}</FormLabel>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button variant="outlined" component="label" size="small" disabled={loading}>
                      Upload
                      <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    </Button>
                    {preview ? (
                      <Avatar
                        src={preview}
                        sx={{ width: 48, height: 48 }}
                        imgProps={{
                          onError: (e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = ''; // fallback to default avatar icon
                          },
                        }}
                      />
                    ) : (
                      <PersonIcon sx={{ width: 48, height: 48 }} />
                    )}

                  </Stack>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} size="medium">

                  {loading ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </Stack>
               )}
          </AccordionDetails>
        </Accordion>

        {/* Crop Dialog */}
        <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
          <DialogContent>
            {cropImageSrc && (
              <Box position="relative" width="100%" height="400px">
                <Cropper
                  image={cropImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </Box>
            )}
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom as number)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
            <Button onClick={handleCropSave}>Save</Button>
          </DialogActions>
        </Dialog>

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
              '& .MuiAlert-icon': {
                color: '#fff !important',
              }
            }}
            iconMapping={{
              success: <CheckIcon sx={{ color: '#fff !important' }} />
            }}
          >
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserDetailsForm;