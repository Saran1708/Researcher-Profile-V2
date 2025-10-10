import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

// Wrapper styled for theme support
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "20px",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(8),
 
  maxWidth: "1150px", // keeps card narrower than screen
  margin: "0 auto",   // centers the card horizontally
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
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

// Reusable item
function StatItem({ value, label, highlight }) {
  return (
    <Box sx={{ minWidth: 120, textAlign: "center" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          mb: 0.5,
          color: highlight ? "error.main" : "text.primary",
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default function ProfileStatsCard() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 6, md: 12 } }}>
      <StatsCard>
        <StatItem value="1.2k" label="Profile Views Weekly" highlight />
        <StatItem value="15.6k" label="Total Profile Views" />
        <StatItem value="34" label="Blogs" />
        <StatItem value="820" label="Blog Likes" />
      </StatsCard>
    </Container>
  );
}
