import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';

const items = [
  {
    icon: <MenuBookRoundedIcon />,
    title: 'Publications',
    description:
      'Access comprehensive records of scholarly publications, including journal articles, conference papers, and book chapters authored by our faculty members.',
  },
  {
    icon: <PeopleAltRoundedIcon />,
    title: 'Faculty Expertise',
    description:
      'Explore detailed profiles of faculty members highlighting their research specializations, academic qualifications, and areas of scholarly interest.',
  },
  {
    icon: <ScienceRoundedIcon />,
    title: 'Research Projects',
    description:
      'Discover ongoing and completed research projects, grants received, patents filed, and collaborative initiatives undertaken by our research community.',
  },
];

interface ChipProps {
  selected?: boolean;
}

const Chip = styled(MuiChip)<ChipProps>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background:
          'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

interface MobileLayoutProps {
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
  selectedFeature: (typeof items)[0];
}

export function MobileLayout({
  selectedItemIndex,
  handleItemClick,
  selectedFeature,
}: MobileLayoutProps) {
  if (!items[selectedItemIndex]) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>

      <Card variant="outlined">
        <Box sx={{ px: 2, py: 3 }}>
          <Typography
            gutterBottom
            sx={{ color: 'text.primary', fontWeight: 'medium' }}
          >
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Research Ecosystem
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Our platform provides a comprehensive view of the research activities at Madras Christian College, facilitating knowledge discovery and fostering academic collaboration across disciplines.
        </Typography>
      </Box>

      {/* --- FIXED SECTION STARTS HERE --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
        }}
      >
        {/* LEFT SIDE ITEMS LIST */}
        <Box>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    textAlign: 'left',
                    '&:hover': {
                      backgroundColor:
                        (theme.vars || theme).palette.action.hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: 'action.selected',
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textTransform: 'none',
                      color: 'text.secondary',
                    },
                    selectedItemIndex === index && {
                      color: 'text.primary',
                    },
                  ]}
                >
                  {icon}
                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* MOBILE LAYOUT */}
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </Box>

        {/* RIGHT SIDE VISUAL CARD */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '70%' },
            height: 'var(--items-image-height)',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
              }}
            >
              <Box
                sx={{
                  color: 'primary.main',
                  mb: 3,
                  fontSize: '80px',
                }}
              >
                {items[selectedItemIndex]?.icon &&
                  React.cloneElement(items[selectedItemIndex].icon, {
                    sx: { fontSize: '80px' },
                  })}
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                {selectedFeature.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  maxWidth: '80%',
                }}
              >
                {selectedFeature.description}
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>
      {/* --- FIXED SECTION ENDS HERE --- */}

    </Container>
  );
}
