import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';
import UserDetailsForm from '../components/EditForms/UserDetailsForm.tsx';
import EditHero from '../components/EditForms/EditHero.tsx';
import EducationalDetailsForm from '../components/EditForms/EducationalDetailsForm.tsx';
import ResearchDetailsForm from '../components/EditForms/ResearchDetailsForm.tsx';
import ResearchIdForm from '../components/EditForms/ResearchIdForm.tsx';
import FundingForm from '../components/EditForms/FundingForm.tsx';
import PublicationForm from '../components/EditForms/PublicationForm.tsx';
import AdministrationPositionForm from '../components/EditForms/AdministrationPositionForm.tsx';
import HonaryPositionForm from '../components/EditForms/HonaryPositionForm.tsx';
import ConferenceForm from '../components/EditForms/ConferenceForm.tsx';
import PhdForm from '../components/EditForms/PhdForm.tsx';
import ResourcePersonForm from '../components/EditForms/ResourcePersonForm.tsx';
import CollaborationForm from '../components/EditForms/CollaborationForm.tsx';
import ConsultancyForm from '../components/EditForms/ConsultancyForm.tsx';
import CareerHighlightForm from '../components/EditForms/CareerHighlightForm.tsx';
import ResearchCareerForm from '../components/EditForms/ResearchCareerForm.tsx';
import UserAppAppBar from '../components/UserHome/UserAppAppBar.tsx';
import Loader from '../components/MainComponents/Loader';

export default function EditDetails(props: { disableCustomTheme?: boolean }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Loader visible immediately, then hide after delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Disable/enable scrolling based on loading state
  React.useEffect(() => {
    if (loading) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup: ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      {/* Always show the header & hero */}
      <UserAppAppBar />
      <EditHero />

      {/* Loader or content */}
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <Loader />
        ) : (
          <div>
            <UserDetailsForm />
            <EducationalDetailsForm />
            <ResearchDetailsForm />
            <ResearchIdForm />
            <FundingForm />
            <PublicationForm />
            <AdministrationPositionForm />
            <HonaryPositionForm />
            <ConferenceForm />
            <PhdForm />
            <ResourcePersonForm />
            <CollaborationForm />
            <ConsultancyForm />
            <CareerHighlightForm />
            <ResearchCareerForm />
          </div>
        )}
      </div>

      {/* Always show the footer */}
      <Footer />
    </AppTheme>
  );
}
