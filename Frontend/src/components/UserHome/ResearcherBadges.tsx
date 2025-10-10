import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

// Wrapper styled for theme support (exactly like ProfileStatsCard)
const BadgeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "20px",
  maxWidth: "1150px", // keeps card narrower than screen
  margin: "0 auto", // centers the card horizontally
  marginTop: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
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

const BadgeGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(4),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(4),
  },
}));

// Single badge item following StatItem pattern
function BadgeItem({ img, title, value, locked }) {
  return (
    <Box sx={{ minWidth: 120, textAlign: "left", position: "relative" }}>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Box
          component="img"
          src={img}
          alt={title}
          sx={{
            width: 40,
            height: 40,
            opacity: locked ? 0.3 : 1,
            filter: locked ? "grayscale(100%)" : "none",
            mb: 1,
          }}
        />
        {locked && (
          <Box
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              backgroundColor: "grey.800",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "white",
              border: "2px solid white",
              zIndex: 1,
            }}
          >
            🔒
          </Box>
        )}
      </Box>
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          mb: 0.5,
          color: locked ? "text.disabled" : "text.primary",
        }}
      >
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function ResearcherBadges() {
  const badges = [
    { title: "Scholar", value: "0", img: "https://img.icons8.com/color/96/open-book.png" },
    { title: "Researcher", value: "50", img: "https://img.icons8.com/color/96/microscope.png" },
    { title: "Author", value: "120", img: "https://img.icons8.com/color/96/document.png", locked: true },
    { title: "Innovator", value: "600", img: "https://img.icons8.com/color/96/idea.png", locked: true },
    { title: "Professor", value: "1000", img: "https://img.icons8.com/color/96/teacher.png", locked: true },
    { title: "Pioneer", value: "2000", img: "https://img.icons8.com/color/96/rocket.png", locked: true },
    { title: "Nobel", value: "5000", img: "https://img.icons8.com/color/96/medal.png", locked: true },
  ];

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6, md: 12 } }}>
      <BadgeCard>
        <Typography 
          variant="body1" 
          fontWeight={600} 
          sx={{ 
            width: "100%", 
            textAlign: "left", 
            mb: 2,
            color: "text.primary"
          }}
        >
          Research Badges
        </Typography>
        <BadgeGrid>
          {badges.map((b, i) => (
            <BadgeItem key={i} {...b} />
          ))}
        </BadgeGrid>
      </BadgeCard>
    </Container>
  );
}