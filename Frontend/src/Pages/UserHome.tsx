
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';



import UserAppAppBar from '../components/UserHome/UserAppAppBar.tsx';
import DashboardHero from '../components/UserHome/UserHero.tsx';
import ProfileStatsCard from '../components/UserHome/ProfileStatsCard.tsx';
import ResearcherBadges from '../components/UserHome/ResearcherBadges.tsx';


export default function UserHome(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <UserAppAppBar/>
     <DashboardHero/>
     <ProfileStatsCard/>
      <div>
     
       <ResearcherBadges/>
        


        <Footer />
      </div>
    </AppTheme>
  );
}
