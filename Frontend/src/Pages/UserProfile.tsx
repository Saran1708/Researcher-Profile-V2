
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';



import UserAppAppBar from '../components/UserHome/UserAppAppBar.tsx';
import Profile from '../components/UserProfile/Profile.tsx';



export default function UserProfile(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <UserAppAppBar/>
    
      <div>

         <Profile />
        <Footer />
      </div>
    </AppTheme>
  );
}
