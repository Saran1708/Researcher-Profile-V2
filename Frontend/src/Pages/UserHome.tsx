
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';



import UserAppAppBar from '../components/UserHome/UserAppAppBar.tsx';
import FacultyDashboard from '../components/UserHome/FacultyDashboard.tsx';



export default function UserHome(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <UserAppAppBar/>
     
      <div>
     
       
        
<FacultyDashboard />

        <Footer />
      </div>
    </AppTheme>
  );
}
