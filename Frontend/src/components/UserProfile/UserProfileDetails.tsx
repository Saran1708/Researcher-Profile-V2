import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";

// ✅ Material Icons
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";

const ProfileWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(3),
  marginTop: theme.spacing(18),
  marginLeft: theme.spacing(25), // desktop

  [theme.breakpoints.down("md")]: {
    marginLeft: theme.spacing(8), // tablet
    marginRight: theme.spacing(8),
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));


const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ContactRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  fontSize: "0.9rem",
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export default function UserProfileHeader() {
  return (
    <Box sx={{ width: "100%" }}>
      <ProfileWrapper>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 90,
            height: 90,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "2rem",
          }}
        >
          S
        </Avatar>

        {/* Info Section */}
        <InfoBox>
          {/* Name */}
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Mr Saran
          </Typography>

          {/* Department */}
          <Typography variant="body1" color="text.primary">
            Computer Application (BCA) - SFS
          </Typography>

          {/* Contact Row */}
          <ContactRow  sx={{ color: "text.primary" }}>
            <ContactItem>
              <EmailIcon fontSize="small" /> saran@example.com
            </ContactItem>
            <ContactItem>
              <PhoneIcon fontSize="small" /> 9499954810
            </ContactItem>
            <ContactItem>
              <LocationOnIcon fontSize="small" /> Medavakkam, Chennai
            </ContactItem>
            <ContactItem>
              <LanguageIcon fontSize="small" />
              <Link
                href="https://breakoutzone.in/"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ color: "text.primary" }}
              >
                breakoutzone.in
              </Link>
            </ContactItem>
          </ContactRow>
        </InfoBox>
      </ProfileWrapper>
    </Box>
  );
}
