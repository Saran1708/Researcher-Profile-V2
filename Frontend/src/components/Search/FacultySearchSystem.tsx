import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Styled Components
const SearchContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  marginTop: "120px",
  padding: theme.spacing(0, 3),
}));

const SearchCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  marginBottom: theme.spacing(3),
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: (theme.vars || theme).shadows[4],
  }
}));

// Static department list
const DEPARTMENTS = [
  "English - Aided",
  "Tamil - Aided",
  "Languages - Aided",
  "History - Aided",
  "Political Science - Aided",
  "Public Administration - Aided",
  "Economics - Aided",
  "Philosophy - Aided",
  "Commerce - Aided",
  "Social Work - Aided",
  "Mathematics - Aided",
  "Statistics - Aided",
  "Physics - Aided",
  "Chemistry - Aided",
  "Botany - Aided",
  "Zoology - Aided",
  "Physical Education - Aided",
  "English - SFS",
  "Tamil - SFS",
  "Languages - SFS",
  "Journalism - SFS",
  "Social Work - SFS",
  "Commerce - SFS",
  "Business Administration - SFS",
  "Communication - SFS",
  "Geography - SFS",
  "Tourism Studies - SFS",
  "Mathematics - SFS",
  "Physics - SFS",
  "Chemistry - SFS",
  "Microbiology - SFS",
  "Computer Application (BCA) - SFS",
  "Computer Science (B.Sc) - SFS",
  "Computer Science (MCA) - SFS",
  "Visual Communication - SFS",
  "Physical Education, Health Education and Sports - SFS",
  "Psychology - SFS",
  "Data Science - SFS",
];

export default function FacultySearchSystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  // Dynamic search - triggers on every keystroke
  useEffect(() => {
    const performSearch = async () => {
      // If both fields are empty, clear results
      if (!searchQuery.trim() && !selectedDepartment) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setHasSearched(true);
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('q', searchQuery.trim());
        if (selectedDepartment) params.append('department', selectedDepartment);

        const response = await axios.get(
          `${API_BASE_URL}/faculty/search/?${params}`
        );

        setResults(response.data.results || []);
      } catch (error) {
        console.error('Error searching faculty:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls (300ms delay)
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedDepartment]);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleViewProfile = (slug) => {
    if (slug) {
      navigate(`/profile/${slug}`);
    }
  };

  // Function to get absolute profile picture URL
  const getProfilePictureUrl = (profilePicUrl) => {
    if (!profilePicUrl) return null;

    // If already absolute URL, return as is
    if (profilePicUrl.startsWith('http')) {
      return profilePicUrl;
    }

    // Otherwise, prepend base URL
    let url = profilePicUrl;
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    return import.meta.env.VITE_BASE_URL + url;
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      <SearchContainer>
        {/* Search Card */}
        <SearchCard>
          <Typography variant="h5" fontWeight={700} mb={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon sx={{ fontSize: 25 }} />
            Faculty Search
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, research area, publications, conferences, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading && (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    )}
                    {searchQuery && !loading && (
                      <InputAdornment position="end">
                        <CloseIcon
                          fontSize="small"
                          onClick={clearSearch}
                          sx={{
                            cursor: 'pointer',
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main'
                            },
                            transition: 'color 0.2s'
                          }}
                        />
                      </InputAdornment>
                    )}
                  </>
                ),
              }}
            />
          </Box>

          <Typography sx={{ display: "block", mb: 2, fontWeight: 400 }}>
            Filter by Department
          </Typography>
          {/* Department Dropdown */}
          <FormControl sx={{ minWidth: { xs: '100%', sm: '100%' } }}>
            <Select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              displayEmpty
              size="small"
            >
              <MenuItem value="">
                <Typography fontWeight={600}>All Departments</Typography>
              </MenuItem>

              <MenuItem disabled>
                <Typography variant="subtitle2" fontWeight="bold" color="primary">
                  Aided Departments
                </Typography>
              </MenuItem>
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

              <MenuItem disabled>
                <Typography variant="subtitle2" fontWeight="bold" color="secondary">
                  Self-Financed Departments
                </Typography>
              </MenuItem>
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
            </Select>
          </FormControl>

          {/* Results Count */}
          {hasSearched && !loading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </Typography>
          )}
        </SearchCard>

        {/* Results */}
        {hasSearched ? (
          results.length > 0 ? (
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3
            }}>
              {results.map(faculty => (
                <ResultCard key={faculty.id}>
                  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar
                        src={getProfilePictureUrl(faculty.profile_picture)}
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: "50%",          // keeps it circular
                          overflow: "hidden",           // prevents square corners
                          border: "3px solid",
                          borderColor: "primary.secondary",
                          boxShadow: (theme) => `0 0 6px ${theme.palette.primary.main}55`,
                          backgroundColor: "background.paper",
                        }}
                        imgProps={{
                          style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",         // perfect crop
                          },
                          onError: (e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "";
                          },
                        }}
                      >
                        {!faculty.profile_picture && (
                          <PersonIcon sx={{ width: 35, height: 35 }} />
                        )}
                      </Avatar>


                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} mb={0.5} sx={{ fontSize: "1.1rem" }}>
                          {faculty.prefix} {faculty.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", mb: 0.5 }}>
                          {faculty.department}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {faculty.email}
                        </Typography>
                      </Box>
                    </Box>



                    {/* Matched Fields - Only show if search query exists */}
                    {searchQuery && faculty.matched_fields && faculty.matched_fields.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.5, fontWeight: 600 }}>
                          Matches found in:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {faculty.matched_fields.map((field, idx) => (
                            <Chip
                              key={idx}
                              label={field}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* View Profile Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleViewProfile(faculty.slug)}
                        sx={{ maxWidth: "150px" }}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </Box>
                </ResultCard>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <SearchIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or department selection
              </Typography>
            </Box>
          )
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <SearchIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              Start searching for faculty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter a search term or select a department to see results
            </Typography>
          </Box>
        )}
      </SearchContainer>
    </Box>
  );
}