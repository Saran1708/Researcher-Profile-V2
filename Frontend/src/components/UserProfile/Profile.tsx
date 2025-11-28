import React, { useState, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import LaunchIcon from "@mui/icons-material/Launch";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from '../../utils/axiosClient';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: "1150px",
  margin: "0 auto",
  marginTop: theme.spacing(18),
  padding: theme.spacing(4),
  position: "relative",
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
}));

const IncompleteProfileCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "32px 24px",
  maxWidth: 500,
  width: "100%",
  textAlign: "center",

  // Responsive adjustments
  [theme.breakpoints.down("sm")]: {
    padding: "24px 16px", // smaller padding on mobile
    margin: "0 12px", // ensure card doesn't touch screen edges
  },
}));


const HeaderButton = ({ children, active, onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      padding: (theme) => theme.spacing(1, 2),
      cursor: "pointer",
      fontWeight: active ? 700 : 550,
      position: "relative",
      transition: "color 0.2s ease",
      borderBottom: "2px solid transparent",
      border: "none",
      background: "transparent",
      color: active ? "text.primary" : "text.secondary",
      fontSize: "0.875rem",
      "&:hover": {
        color: "text.primary",
      },
      ...(active && {
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "text.primary",
          borderRadius: "1px",
        },
      }),
    }}
  >
    {children}
  </Box>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState("research");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for all data
  const [basicDetails, setBasicDetails] = useState(null);
  const [educations, setEducations] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchIDs, setResearchIDs] = useState([]);
  const [fundings, setFundings] = useState([]);
  const [publications, setPublications] = useState([]);
  const [adminPositions, setAdminPositions] = useState([]);
  const [honoraryPositions, setHonoraryPositions] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [phdSupervisions, setPhdSupervisions] = useState([]);
  const [resourcePersons, setResourcePersons] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [consultancies, setConsultancies] = useState([]);
  const [careerHighlights, setCareerHighlights] = useState([]);
  const [researchCareer, setResearchCareer] = useState([]);
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [serverError, setServerError] = useState(false);


  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const statusRes = await axiosClient.get(`${API_BASE_URL}/profile/status/`, { headers });

      setProfileStatus(statusRes.data);

      // If profile incomplete, show message instead of loading all data
      if (!statusRes.data.is_profile_complete) {
        setProfileIncomplete(true);
        setLoading(false);
        return;
      }

      // Otherwise fetch everything
      fetchAllData();
    } catch (err) {
      console.error("Error checking profile status:", err);
      setServerError(true);

      setLoading(false);
    }
  };


  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [
        staffRes,
        educationRes,
        researchRes,
        researchIdRes,
        fundingRes,
        publicationRes,
        adminRes,
        honoraryRes,
        conferenceRes,
        phdRes,
        resourceRes,
        collaborationRes,
        consultancyRes,
        careerHighlightRes,
        researchCareerRes
      ] = await Promise.all([
        axiosClient.get(`${API_BASE_URL}/staff-details/`, { headers }).catch(() => ({ data: null })),
        axiosClient.get(`${API_BASE_URL}/education/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research-id/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/funding/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/publication/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/administration-position/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/honary-position/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/conference/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/phd/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/resource-person/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/collaboration/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/consultancy/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/career-highlight/`, { headers }).catch(() => ({ data: [] })),
        axiosClient.get(`${API_BASE_URL}/research-career/`, { headers }).catch(() => ({ data: [] }))
      ]);

      // Set staff details
      if (staffRes.data) {
        // Handle profile picture URL
        let profilePicUrl = staffRes.data.profile_picture || '';

        // Ensure the URL is absolute, prepend backend URL if needed
        if (profilePicUrl && !profilePicUrl.startsWith('http')) {
          if (!profilePicUrl.startsWith('/')) {
            profilePicUrl = '/' + profilePicUrl;
          }
          profilePicUrl = import.meta.env.VITE_BASE_URL + profilePicUrl;
        }

        setBasicDetails({
          name: `${staffRes.data.prefix || ''} ${staffRes.data.name || ''}`.trim(),
          department: staffRes.data.department || '',
          phone: staffRes.data.phone || '',
          email: staffRes.data.email_value || '',
          address: staffRes.data.address || '',
          website: staffRes.data.website || '',
          profilePic: profilePicUrl,
          institution: staffRes.data.institution || ''
        });
      }

      setEducations(educationRes.data || []);
      setResearchAreas(researchRes.data || []);
      setResearchIDs(researchIdRes.data || []);
      setFundings(fundingRes.data || []);
      setPublications(publicationRes.data || []);
      setAdminPositions(adminRes.data || []);
      setHonoraryPositions(honoraryRes.data || []);
      setConferences(conferenceRes.data || []);
      setPhdSupervisions(phdRes.data || []);
      setResourcePersons(resourceRes.data || []);
      setCollaborations(collaborationRes.data || []);
      setConsultancies(consultancyRes.data || []);
      setCareerHighlights(careerHighlightRes.data || []);
      setResearchCareer(researchCareerRes.data || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  // Check if research tab has any data
  const hasResearchData = () => {
    return researchCareer.length > 0 ||
      careerHighlights.length > 0 ||
      researchAreas.length > 0 ||
      researchIDs.length > 0 ||
      publications.length > 0 ||
      fundings.length > 0;
  };

  // Check if academic tab has any data
  const hasAcademicData = () => {
    return educations.length > 0 ||
      adminPositions.length > 0 ||
      honoraryPositions.length > 0 ||
      conferences.length > 0;
  };

  // Check if supervision tab has any data
  const hasSupervisionData = () => {
    return phdSupervisions.length > 0 || resourcePersons.length > 0;
  };

  // Check if collaboration tab has any data
  const hasCollaborationData = () => {
    return collaborations.length > 0 || consultancies.length > 0;
  };

  // Get available tabs based on data
  const getAvailableTabs = () => {
    const tabs = [];
    if (hasResearchData()) tabs.push({ key: "research", label: "Research & Career" });
    if (hasAcademicData()) tabs.push({ key: "academic", label: "Academic Activities" });
    if (hasSupervisionData()) tabs.push({ key: "supervision", label: "Supervision & Training" });
    if (hasCollaborationData()) tabs.push({ key: "collaboration", label: "Collaboration & Consultancy" });
    return tabs;
  };

  const tabs = getAvailableTabs();

  // Set active tab to first available tab
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.key === activeTab)) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs]);

  const renderResearchTab = () => (
    <Box>
      {/* Research Career */}
      {researchCareer.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Research Career
          </Typography>
          {researchCareer.map((career, idx) => (
            <Typography key={idx} sx={{ fontSize: "0.875rem", lineHeight: 1.7, color: "primary", mb: 2 }}>
              {career.research_career_details}
            </Typography>
          ))}
        </Box>
      )}

      {/* Career Highlights */}
      {careerHighlights.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Career Highlights
          </Typography>
          {careerHighlights.map((highlight, idx) => (
            <Typography key={idx} sx={{ fontSize: "0.875rem", lineHeight: 1.7, color: "primary", mb: 2 }}>
              {highlight.career_highlight_details}
            </Typography>
          ))}
        </Box>
      )}

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Research Areas
          </Typography>
          <Box sx={{ pl: 0 }}>
            {researchAreas.map((area, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: "primary.main",
                    mr: 1.5,
                    flexShrink: 0,
                    transform: "rotate(45deg)",
                  }}
                />
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {area.research_areas}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Research IDs */}
      {researchIDs.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Research IDs
          </Typography>
          <Box sx={{ pl: 0 }}>
            {researchIDs.map((id, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: "secondary.main",
                    mr: 1.5,
                    flexShrink: 0,
                    transform: "rotate(45deg)",
                  }}
                />
                <Link
                  href={id.research_link}
                  target="_blank"
                  rel="noopener"
                  sx={{
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {id.research_title}
                  <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Recent Publications
          </Typography>
          {publications.map((pub, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "primary.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {pub.publication_title}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
                {pub.publication_type} • {pub.publication_month_and_year}
              </Typography>
              <Link
                href={pub.publication_link}
                target="_blank"
                rel="noopener"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                }}
              >
                View Publication
                <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
              </Link>
            </Box>
          ))}
        </Box>
      )}

      {/* Funding */}
      {fundings.length > 0 && (
        <Box>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Research Funding
          </Typography>
          {fundings.map((fund, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: fund.funding_status === "Completed" ? "success.main" : "info.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  pl: 2.5,
                  borderColor: fund.funding_status === "Completed" ? "success.dark" : "info.dark",
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {fund.project_title}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
                {fund.funding_agency} • {fund.funding_month_and_year}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                  ₹{fund.funding_amount}
                </Typography>
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    px: 1,
                    py: 0.25,
                    borderRadius: "12px",
                    backgroundColor: fund.funding_status === "Completed" ? "success.main" : "info.main",
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  {fund.funding_status}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderAcademicTab = () => (
    <Box>
      {/* Education */}
      {educations.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Education
          </Typography>
          {educations.map((edu, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "secondary.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "secondary.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {edu.degree}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 0.5 }}>
                {edu.college}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {edu.start_year} – {edu.end_year}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Administrative Positions */}
      {adminPositions.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Administrative Positions
          </Typography>
          {adminPositions.map((pos, i) => (
            <Box
              key={i}
              mb={2.5}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "warning.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "warning.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {pos.administration_position}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {pos.administration_year_from} – {pos.administration_year_to}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Honorary Positions */}
      {honoraryPositions.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Honorary Positions
          </Typography>
          {honoraryPositions.map((pos, i) => (
            <Box
              key={i}
              mb={2.5}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "error.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "error.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {pos.honary_position}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {pos.honary_year}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Conferences */}
      {conferences.length > 0 && (
        <Box>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Conference Participation
          </Typography>
          {conferences.map((conf, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "info.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "info.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {conf.paper_title}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>
                {conf.conference_details}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {conf.conference_type} • ISBN: {conf.conference_isbn} • {conf.conference_year}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderSupervisionTab = () => (
    <Box>
      {/* PhD Supervision */}
      {phdSupervisions.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Ph.D. Supervision
          </Typography>
          {phdSupervisions.map((phd, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: phd.phd_status === "Completed" ? "success.main" : "warning.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {phd.phd_name}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 0.5 }}>
                {phd.phd_topic}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    px: 1,
                    py: 0.25,
                    borderRadius: "12px",
                    backgroundColor: phd.phd_status === "Completed" ? "success.main" : "warning.main",
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  {phd.phd_status}
                </Box>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {phd.phd_years_of_completion}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Resource Person */}
      {resourcePersons.length > 0 && (
        <Box>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Resource Person Activities
          </Typography>
          {resourcePersons.map((res, i) => (
            <Box
              key={i}
              mb={3}
              sx={{
                pl: 2,
                borderLeft: "2px solid",
                borderColor: "secondary.main",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "secondary.dark",
                  pl: 2.5,
                },
              }}
            >
              <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
                {res.resource_topic}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>
                {res.resource_department}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {res.resource_date}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderCollaborationTab = () => (
    <Box>
      {/* Areas of Collaboration */}
      {collaborations.length > 0 && (
        <Box mb={4}>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Areas of Collaboration
          </Typography>
          <Box sx={{ pl: 0 }}>
            {collaborations.map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: "primary.main",
                    mr: 1.5,
                    flexShrink: 0,
                    transform: "rotate(45deg)",
                  }}
                />
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {item.collaboration_details}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Areas of Consultancy */}
      {consultancies.length > 0 && (
        <Box>
          <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
            Areas of Consultancy
          </Typography>
          <Box sx={{ pl: 0 }}>
            {consultancies.map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: "secondary.main",
                    mr: 1.5,
                    flexShrink: 0,
                    transform: "rotate(45deg)",
                  }}
                />
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {item.consultancy_details}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>

      </Box>
    );
  }

  if (serverError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <IncompleteProfileCard sx={{ maxWidth: 520, textAlign: "center", p: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 50, color: "error.main", mb: 2 }} />

          <Typography variant="h5" fontWeight={700} mb={1}>
            Error Fetching Details
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Unable to connect to the server. Please try again later.
          </Typography>

          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </IncompleteProfileCard>
      </Box>
    );
  }


  if (profileIncomplete) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          px: 2,
        }}
      >
        <IncompleteProfileCard>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight={700} mb={2}>
            Oops! Your profile is incomplete
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={4}
            sx={{ lineHeight: 1.6 }}
          >
            Complete the mandatory sections below to unlock your full profile:
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 4,
            }}
          >
            {!profileStatus?.profile_details_completed && (
              <Chip label="Profile Details" color="primary" variant="outlined" />
            )}
            {!profileStatus?.educational_details_completed && (
              <Chip label="Educational Details" color="primary" variant="outlined" />
            )}
            {!profileStatus?.research_career_completed && (
              <Chip label="Research Career" color="primary" variant="outlined" />
            )}
            {!profileStatus?.career_highlights_completed && (
              <Chip label="Career Highlights" color="primary" variant="outlined" />
            )}
          </Box>

          <Button
            startIcon={<EditIcon />}
            onClick={() => (window.location.href = "/staff/edit")}
            color="primary"
            variant="contained"
            fullWidth
          >
            Complete Profile
          </Button>
        </IncompleteProfileCard>
      </Box>
    );
  }


  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 6 }}>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <ProfileCard>
          {/* Profile Info */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              src={basicDetails.profilePic}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                mb: 2,
                border: "4px solid",
                borderColor: "background.paper",
                boxShadow: 3,
              }}
              imgProps={{
                onError: (e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = ''; // fallback to default avatar icon
                },
              }}
            >
              {!basicDetails.profilePic && <PersonIcon sx={{ width: 60, height: 60 }} />}
            </Avatar>
            <Typography variant="h4" fontWeight={700} mb={1}>
              {basicDetails.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500} mb={3}>
              {basicDetails.department}
            </Typography>

            {/* Contact Info */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 3,
                mb: 2,
              }}
            >
              {basicDetails.email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.email}</Typography>
                </Box>
              )}
              {basicDetails.phone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.phone}</Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 3,
              }}
            >
              {basicDetails.address && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.address}</Typography>
                </Box>
              )}
              {basicDetails.website && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Link href={basicDetails.website} target="_blank" sx={{ fontSize: "0.875rem" }}>
                    {basicDetails.website}
                  </Link>
                </Box>
              )}
            </Box>
          </Box>

          {/* Tabbed Content - Only show if there are tabs */}
          {tabs.length > 0 && (
            <Box>
              <Box
                display="flex"
                gap={2}
                mb={3}
                flexWrap="wrap"
                marginTop={10}
                sx={{ borderBottom: "1px solid", borderColor: "divider" }}
              >
                {tabs.map((tab) => (
                  <HeaderButton
                    key={tab.key}
                    active={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </HeaderButton>
                ))}
              </Box>

              <Box sx={{ mt: 3 }}>
                {activeTab === "research" && renderResearchTab()}
                {activeTab === "academic" && renderAcademicTab()}
                {activeTab === "supervision" && renderSupervisionTab()}
                {activeTab === "collaboration" && renderCollaborationTab()}
              </Box>
            </Box>
          )}
        </ProfileCard>
      </Box>
    </Box>
  );
}