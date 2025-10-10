import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import LaunchIcon from "@mui/icons-material/Launch";

const SectionCard = styled(Paper)(({ theme }) => ({
  width: "52%",
  borderRadius: "4px",
  marginTop: theme.spacing(6),
  marginLeft: theme.spacing(25),
  boxShadow: theme.shadows[3],
  padding: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    width: "70%",
    marginLeft: theme.spacing(10),
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
    border: `1px solid ${theme.palette.grey[700]}`,
    boxShadow: `
      0 4px 20px rgba(0, 0, 0, 0.6),
      0 1px 3px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  }),
}));

const ResearchIDCard = styled(Paper)(({ theme }) => ({
  width: "20%",
  borderRadius: "4px",
  marginTop: theme.spacing(6),
  marginLeft: theme.spacing(4),
  boxShadow: theme.shadows[3],
  padding: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    width: "25%",
    marginLeft: theme.spacing(2),
  },

  [theme.breakpoints.down("sm")]: {
    width: "90%",
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(3),
  },

  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.grey[900],
    border: `1px solid ${theme.palette.grey[700]}`,
    boxShadow: `
      0 4px 20px rgba(0, 0, 0, 0.6),
      0 1px 3px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  }),
}));

// HeaderButton for tabs
const HeaderButton = ({ children, active, onClick, ...props }) => (
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
    {...props}
  >
    {children}
  </Box>
);

export default function EducationPublicationFunding() {
  const [activeTab, setActiveTab] = React.useState("publications");

  // Dummy datasets (you can later map from API)
  const publications = [
    {
      title: "New Research on AI Systems",
      link: "http://localhost:5173/edit",
      type: "Article",
      monthYear: "August 2025",
    },
    {
      title: "Deep Learning in Modern Computing Deep Learning in Modern Computing Deep Learning in Modern Computing Deep Learning in Modern Computing",
      link: "http://localhost:5173/edit",
      type: "Conference Paper",
      monthYear: "July 2024",
    },
  ];

  const fundings = [
    {
      title: "Sample",
      agency: "NSE",
      monthYear: "August 2025",
      amount: "50,000.00",
      status: "Completed",
    },
    {
      title: "AI in Education",
      agency: "DST",
      monthYear: "December 2024",
      amount: "1,20,000.00",
      status: "Ongoing",
    },
  ];

  const educations = [
    {
      degree: "BCA",
      college: "MCC",
      startYear: "2021",
      endYear: "2024",
    },
    {
      degree: "MSc Computer Science",
      college: "IIT Delhi",
      startYear: "2024",
      endYear: "2026",
    },
  ];

  const tabs = [
    { key: "publications", label: "Publications" },
    { key: "funding", label: "Funding" },
    { key: "education", label: "Education" },
  ];

  const renderPublications = () =>
    publications.map((pub, i) => (
      <Box 
        key={i} 
        mb={4.5} 
        sx={{ 
          position: "relative",
          pl: 2,
          pr : 1.5,
          borderLeft: "2px solid",
          borderColor: "primary.main",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.dark",
            pl: 2.5,
          }
        }}
      >
        <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.75 }}>
          {pub.title}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
          {pub.type} • {pub.monthYear}
        </Typography>
        <Link 
          href={pub.link} 
          target="_blank" 
          rel="noopener"
          sx={{ 
            display: "inline-flex", 
            alignItems: "center",
            fontSize: "0.75rem",
            textDecoration: "none"
          }}
        >
          View Publication
          <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
        </Link>
      </Box>
    ));

  const renderFundings = () =>
    fundings.map((fund, i) => (
      <Box 
        key={i} 
        mb={4} 
        sx={{ 
          position: "relative",
          pl: 2,
          borderLeft: "2px solid",
          borderColor: fund.status === "Completed" ? "success.main" : "info.main",
          transition: "all 0.2s ease",
          "&:hover": {
            pl: 2.5,
            borderColor: fund.status === "Completed" ? "success.dark" : "info.dark",
          }
        }}
      >
        <Typography fontWeight={600} sx={{ fontSize: "0.8rem", mb: 0.75 }}>
          {fund.title}
        </Typography>
        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", mb: 0.75 }}>
          {fund.agency} • {fund.monthYear}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
            ₹{fund.amount}
          </Typography>
          <Box 
            sx={{ 
              fontSize: "0.7rem",
              px: 1,
              py: 0.25,
              borderRadius: "12px",
              backgroundColor: fund.status === "Completed" ? "success.main" : "info.main",
              color: "white",
              fontWeight: 500
            }}
          >
            {fund.status}
          </Box>
        </Box>
      </Box>
    ));

  const renderEducation = () =>
    educations.map((edu, i) => (
      <Box 
        key={i} 
        mb={4} 
        sx={{ 
          position: "relative",
          pl: 2,
          borderLeft: "2px solid",
          borderColor: "secondary.main",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "secondary.dark",
            pl: 2.5,
          }
        }}
      >
        <Typography fontWeight={600} sx={{ fontSize: "0.8rem", mb: 0.75 }}>
          {edu.degree}
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mb: 0.6 }}>
          {edu.college}
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
          {edu.startYear} – {edu.endYear}
        </Typography>
      </Box>
    ));

  // Research ID Links (keep as is)
  const researchIDs = [
    { name: "ORCID", url: "https://orcid.org/0000-0000-0000-0000" },
    { name: "Google Scholar", url: "https://scholar.google.com/citations?user=XXXX" },
    { name: "Scopus", url: "https://www.scopus.com/authid/detail.uri?authorId=XXXX" },
    { name: "ResearchGate", url: "https://www.researchgate.net/profile/XXXX" },
    { name: "Web of Science", url: "https://www.webofscience.com/wos/author/XXXX" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: { xs: "center", md: "flex-start" },
        gap: 3,
      }}
    >
      {/* Left card with tabs */}
      <SectionCard>
        <Box
          display="flex"
          gap={3}
          mb={3}
          flexWrap="wrap"
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

        <Box>
          {activeTab === "publications" && renderPublications()}
          {activeTab === "funding" && renderFundings()}
          {activeTab === "education" && renderEducation()}
        </Box>
      </SectionCard>

      {/* Right card - Research ID */}
     {/* Right card - Research Areas */}
      <ResearchIDCard>
        <Box
          sx={{
            display: "inline-block",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "text.primary",
            mb: 2,
            borderBottom: "2px solid",
            borderColor: "text.primary",
            pb: 0.5,
          }}
        >
          Research Areas
        </Box>

        <Box sx={{ pl: 0 }}>
          {researchIDs.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                fontSize: "0.875rem",
              }}
            >
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
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </ResearchIDCard>
    </Box>
  );
}