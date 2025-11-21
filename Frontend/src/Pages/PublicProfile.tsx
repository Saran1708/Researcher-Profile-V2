
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';




import FetchPublicProfile from '../components/UserProfile/FetchPublicProfile.tsx';
import AppAppBar from '../components/MainComponents/AppAppBar.tsx';




export default function PublicProfile(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      
      <AppAppBar />
    
      <div>

         <FetchPublicProfile/>
        <Footer />
      </div>
    </AppTheme>
  );
}
