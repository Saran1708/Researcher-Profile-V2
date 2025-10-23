import * as React from "react";
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
    :   alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
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
  const [activeTab, setActiveTab] = React.useState("research");

  // Mock Data
  const basicDetails = {
    name: "Dr. Rajesh Kumar",
    department: "Computer Science and Engineering",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@university.edu.in",
    address: "Department of CSE, Anna University, Chennai - 600025",
    website: "https://rajeshkumar.edu.in",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  };

  const educations = [
    {
      degree: "Ph.D. in Computer Science",
      college: "Indian Institute of Technology, Delhi",
      startYear: "2010",
      endYear: "2015",
    },
    {
      degree: "M.Tech in Computer Science",
      college: "National Institute of Technology, Trichy",
      startYear: "2008",
      endYear: "2010",
    },
    {
      degree: "B.E in Computer Science",
      college: "Anna University, Chennai",
      startYear: "2004",
      endYear: "2008",
    },
  ];

  const researchCareer = `Dr. Rajesh Kumar has been actively involved in research for over 15 years, focusing on artificial intelligence, machine learning, and data science. His research has been published in top-tier international journals and conferences. He has successfully completed 8 research projects funded by various government agencies including DST, AICTE, and SERB. His work in deep learning applications for healthcare has received national recognition. He is currently serving as a principal investigator for two ongoing projects in AI-driven diagnostics and natural language processing.`;

  const careerHighlights = `Distinguished researcher with 50+ publications in SCI/Scopus indexed journals. Recipient of the Best Researcher Award from Anna University in 2020. Successfully supervised 12 Ph.D. scholars and 40+ M.Tech students. Secured research grants worth over ₹2.5 crores. Invited speaker at 25+ international conferences. Developed 3 patented technologies in AI and machine learning. Collaborated with industries including TCS, Infosys, and Microsoft Research. Established the Center for AI Research at the university, which has become a hub for cutting-edge research in South India.`;

  const researchAreas = [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
  ];

  const researchIDs = [
    { name: "ORCID", url: "https://orcid.org/0000-0002-1234-5678" },
    { name: "Google Scholar", url: "https://scholar.google.com/citations?user=XXXX" },
    { name: "Scopus", url: "https://www.scopus.com/authid/detail.uri?authorId=57123456789" },
    { name: "ResearchGate", url: "https://www.researchgate.net/profile/Rajesh-Kumar" },
    { name: "Web of Science", url: "https://www.webofscience.com/wos/author/XXX-1234-2024" },
  ];

  const fundings = [
    {
      title: "AI-Driven Healthcare Diagnostics System",
      agency: "Department of Science and Technology (DST)",
      monthYear: "January 2024",
      amount: "75,00,000",
      status: "Ongoing",
    },
    {
      title: "Smart City Traffic Management using ML",
      agency: "AICTE",
      monthYear: "June 2023",
      amount: "45,00,000",
      status: "Completed",
    },
    {
      title: "Natural Language Processing for Regional Languages",
      agency: "SERB",
      monthYear: "March 2022",
      amount: "60,00,000",
      status: "Completed",
    },
  ];

  const publications = [
    {
      title: "Deep Learning Approaches for Medical Image Analysis: A Comprehensive Survey",
      link: "https://doi.org/10.1234/journal.2024",
      type: "Journal Article",
      monthYear: "September 2024",
    },
    {
      title: "Transformer-Based Models for Tamil Language Understanding",
      link: "https://doi.org/10.5678/conference.2024",
      type: "Conference Paper",
      monthYear: "July 2024",
    },
    {
      title: "Explainable AI in Healthcare: Challenges and Opportunities",
      link: "https://doi.org/10.9012/journal.2023",
      type: "Journal Article",
      monthYear: "December 2023",
    },
  ];

  const adminPositions = [
    { position: "Head of Department", fromYear: "2022", toYear: "Present" },
    { position: "Dean, Research & Development", fromYear: "2020", toYear: "2022" },
    { position: "Coordinator, AI Research Center", fromYear: "2018", toYear: "2020" },
  ];

  const honoraryPositions = [
    { position: "Member, Board of Studies in Computer Science, Anna University", year: "2023" },
    { position: "Expert Committee Member, AICTE", year: "2022" },
    { position: "Technical Advisory Board Member, IEEE Chennai Section", year: "2021" },
  ];

  const conferences = [
    {
      title: "Attention Mechanisms in Deep Learning for NLP",
      details: "International Conference on Artificial Intelligence and Machine Learning (ICAIML)",
      type: "Oral Presentation",
      isbn: "978-1-234-56789-0",
      year: "2024",
    },
    {
      title: "Federated Learning for Privacy-Preserving Healthcare",
      details: "IEEE International Conference on Data Science",
      type: "Keynote Speech",
      isbn: "978-0-987-65432-1",
      year: "2023",
    },
  ];

  const phdSupervisions = [
    {
      scholar: "Ms. Priya Sharma",
      topic: "Deep Reinforcement Learning for Autonomous Systems",
      status: "Ongoing",
      completion: "Expected 2025",
    },
    {
      scholar: "Mr. Arun Kumar",
      topic: "Transfer Learning in Medical Image Analysis",
      status: "Completed",
      completion: "2023",
    },
    {
      scholar: "Ms. Lakshmi Devi",
      topic: "Sentiment Analysis in Indian Languages",
      status: "Completed",
      completion: "2022",
    },
  ];

  const resourcePersons = [
    {
      topic: "Introduction to Deep Learning and Neural Networks",
      department: "Department of IT, SRM University",
      date: "15th August 2024",
    },
    {
      topic: "AI in Healthcare: Current Trends and Future Directions",
      department: "Department of CSE, VIT University",
      date: "22nd June 2024",
    },
  ];

  const collaborations = [
    "AI and Machine Learning Applications",
    "Healthcare Informatics",
    "Smart City Technologies",
    "IoT and Edge Computing",
  ];

  const consultancies = [
    "AI Strategy and Implementation",
    "Machine Learning Model Development",
    "Data Analytics and Business Intelligence",
    "Healthcare Technology Solutions",
  ];

  const tabs = [
    { key: "research", label: "Research & Career" },
    { key: "academic", label: "Academic Activities" },
    { key: "supervision", label: "Supervision & Training" },
    { key: "collaboration", label: "Collaboration & Consultancy" },
  ];

  const renderResearchTab = () => (
    <Box>
      {/* Research Career */}
      <Box mb={4}>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Research Career
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.7, color: "primary" }}>
          {researchCareer}
        </Typography>
      </Box>

      {/* Career Highlights */}
      <Box mb={4}>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Career Highlights
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.7, color: "primary" }}>
          {careerHighlights}
        </Typography>
      </Box>

      {/* Research Areas */}
      <Box mb={4}>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Research Areas
        </Typography>
        <Box sx={{ pl: 0 }}>
          {researchAreas.map((area, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
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
              <Typography sx={{ fontSize: "0.875rem" }}>
                {area}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Research IDs */}
      <Box mb={4}>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Research IDs
        </Typography>
        <Box sx={{ pl: 0 }}>
          {researchIDs.map((id, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
              }}
            >
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
                href={id.url}
                target="_blank"
                rel="noopener"
                sx={{
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {id.name}
                <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Publications */}
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
                textDecoration: "none",
              }}
            >
              View Publication
              <LaunchIcon sx={{ fontSize: 12, ml: 0.5 }} />
            </Link>
          </Box>
        ))}
      </Box>

      {/* Funding */}
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
              borderColor: fund.status === "Completed" ? "success.main" : "info.main",
              transition: "all 0.2s ease",
              "&:hover": {
                pl: 2.5,
                borderColor: fund.status === "Completed" ? "success.dark" : "info.dark",
              },
            }}
          >
            <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
              {fund.title}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
              {fund.agency} • {fund.monthYear}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
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
                  fontWeight: 500,
                }}
              >
                {fund.status}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderAcademicTab = () => (
    <Box>
      {/* Education */}
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
              {edu.startYear} – {edu.endYear}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Administrative Positions */}
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
              {pos.position}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {pos.fromYear} – {pos.toYear}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Honorary Positions */}
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
              {pos.position}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {pos.year}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Conferences */}
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
              {conf.title}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>
              {conf.details}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {conf.type} • ISBN: {conf.isbn} • {conf.year}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderSupervisionTab = () => (
    <Box>
      {/* PhD Supervision */}
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
              borderColor: phd.status === "Completed" ? "success.main" : "warning.main",
              transition: "all 0.2s ease",
              "&:hover": {
                pl: 2.5,
              },
            }}
          >
            <Typography fontWeight={600} sx={{ fontSize: "0.875rem", mb: 0.5 }}>
              {phd.scholar}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 0.5 }}>
              {phd.topic}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Box
                sx={{
                  fontSize: "0.7rem",
                  px: 1,
                  py: 0.25,
                  borderRadius: "12px",
                  backgroundColor: phd.status === "Completed" ? "success.main" : "warning.main",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {phd.status}
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {phd.completion}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Resource Person */}
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
              {res.topic}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>
              {res.department}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {res.date}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderCollaborationTab = () => (
    <Box>
      {/* Areas of Collaboration */}
      <Box mb={4}>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Areas of Collaboration
        </Typography>
        <Box sx={{ pl: 0 }}>
          {collaborations.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
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
              <Typography sx={{ fontSize: "0.875rem" }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Areas of Consultancy */}
      <Box>
        <Typography fontWeight={700} fontSize="1rem" mb={2} color="primary">
          Areas of Consultancy
        </Typography>
        <Box sx={{ pl: 0 }}>
          {consultancies.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
              }}
            >
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
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

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
            />
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.phone}</Typography>
              </Box>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography sx={{ fontSize: "0.875rem" }}>{basicDetails.address}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LanguageIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Link href={basicDetails.website} target="_blank" sx={{ fontSize: "0.875rem" }}>
                  {basicDetails.website}
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
      
          {/* Tabbed Content */}
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
        </ProfileCard>
      </Box>
    </Box>
  );
}