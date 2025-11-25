
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '../theme/AppTheme.tsx';
import Footer from '../components/MainComponents/Footer.tsx';




import AppAppBar from '../components/MainComponents/AppAppBar.tsx';
import FacultySearchSystem from '../components/Search/FacultySearchSystem.tsx';




export default function SearchPage(props: { disableCustomTheme?: boolean }) {

    
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar/>
    
      <div>

        <FacultySearchSystem />
        <Footer />
      </div>
    </AppTheme>
  );
}
