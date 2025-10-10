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

const HeaderButton = ({ children, active, onClick, ...props }) => {
  return (
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
};

export default function CareerResearchHighlights() {
  const [activeTab, setActiveTab] = React.useState("experience");

  const contentMap = {
    experience: {
      content: `dfddgdGandhi of "demeaning" constitutional bodies under the "pressure of foreign and anti-India forces". cGandhi of "demeaning" constitutional bodies under the "pressure of foreign and anti-India forces". Launching a no-holds barred attack on the Congress leader, BJP national spokesperson and MP Sudhanshu Trivedi said  today that he is trying to "vent his frustration over losing power by making unnecessary, baseless, and false allegations against the Election Commission."fdfnd ommission."fdfnddf`,
    },
    competencies: {
      content: `List your core competencies, technical skills, soft skills, and areas of expertise that make you valuable in your field.`,
    },
  };

  const tabs = [
    { key: "experience", label: "Career Highlights" },
    { key: "competencies", label: "Research Career" },
  ];

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
        
        <Box
          sx={{
            position: "relative",
            pl: 2.5,
            py: 1.5,
           pr : 2.5,
            borderColor: activeTab === "experience" ? "primary.main" : "secondary.main",
            backgroundColor: activeTab === "experience" 
              ? "rgba(162, 149, 255, 0.04)" 
              : "rgba(162, 149, 255, 0.04)",
            borderRadius: "0 4px 4px 0",
            transition: "all 0.3s ease",
            "&:hover": {
              borderLeftWidth: "4px",
              pl: 2.8,
            }
          }}
        >
          <Typography 
            sx={{ 
              fontSize: "0.8rem",
              lineHeight: 1.8,
              color: "text.primary",
              textAlign: "justify",
              letterSpacing: "0.01em"
            }}
          >
            {contentMap[activeTab].content}
          </Typography>
        </Box>
      </SectionCard>

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
          Research ID
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
                color: "text.primary",
              }}
            >
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  
                  mr: 1.5,
                  flexShrink: 0,
                }}
              />
              <Link
                href={item.url}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                }}
              >
                {item.name}
                <LaunchIcon sx={{ fontSize: 14, ml: 0.5 }} />
              </Link>
            </Box>
          ))}
        </Box>
      </ResearchIDCard>
    </Box>
  );
} 