
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';



import UserAppAppBar from '../components/UserHome/UserAppAppBar.tsx';
import UserProfileHeader from '../components/UserProfile/UserProfileDetails.tsx';
import CareerResearchHighlights from '../components/UserProfile/CareerResearchHighlightsID.tsx';
import EducationPublicationFunding from '../components/UserProfile/EducationPublicationFunding.tsx';



export default function UserProfile(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <UserAppAppBar/>
    
      <div>
       
      <UserProfileHeader/>
      <CareerResearchHighlights/>
      <EducationPublicationFunding/>
        <Footer />
      </div>
    </AppTheme>
  );
}
