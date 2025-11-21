import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import EditDetails from './Pages/EditDetails';
import SignIn from './Pages/Login';
import ResetPassword from './Pages/ResetPassword';
import PrivateRoute from "./components/Routing/PrivateRoute";
import UserHome from './Pages/UserHome';
import Loader from './components/MainComponents/Loader';
import UserProfile from './Pages/UserProfile';
import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './admin'; // ✅ import admin app
import AdminRoute from './components/Routing/AdminRoute';
import ManageUsers from './admin/pages/ManageUsers';
import PhdDetails from './admin/pages/PhdDetails';
import ProfileViews from './admin/pages/ProfileViews';
import Funding from './admin/pages/Funding';
import Publications from './admin/pages/Publications';
import Research from './admin/pages/Research';
import Export from './admin/pages/Export';
import PublicProfile from './Pages/PublicProfile';




const App = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = React.useState(true);

  React.useEffect(() => {
    // If route state says skip loader, hide immediately
    if (location.state?.skipLoader) {
      setShowLoader(false);
      return;
    }

    setShowLoader(true);
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, [location]);

  // Disable/enable scrolling based on loader state
  React.useEffect(() => {
    if (showLoader) {
      // Disable scrolling when loader is shown
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when loader is hidden
      document.body.style.overflow = 'auto';
    }

    // Cleanup: ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoader]);

  return (
    <>
      {/* ✅ Add global resets here */}
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { width: '100%', height: '100%', overflowX: 'hidden', overscrollBehavior: 'none' },
          body: { margin: 0, width: '100%', overflowX: 'hidden' },
          '#root': { maxWidth: '100%', overflowX: 'hidden' },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/edit"
          element={
            <PrivateRoute>
              <EditDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <UserHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        {/* ✅ Admin dashboard */}

        <Route path="/admin/home" element={
          <AdminRoute>
            <Dashboard />
            </AdminRoute>


        } />


        <Route path="/admin/users" element={
          <AdminRoute>
            <ManageUsers />
            </AdminRoute>


        } />


        <Route path="/admin/phd" element={
          <AdminRoute>
            <PhdDetails />
            </AdminRoute>


        } />


        <Route path="/admin/views" element={
          <AdminRoute>
            <ProfileViews />
            </AdminRoute>


        } />

         <Route path="/admin/funding" element={
          <AdminRoute>
            <Funding />
            </AdminRoute>


        } />


        <Route path="/admin/publications" element={
          <AdminRoute>
            <Publications />
            </AdminRoute>


        } />


        <Route path="/admin/research" element={
          <AdminRoute>
            <Research />
            </AdminRoute>


        } />


        <Route path="/admin/export" element={
          <AdminRoute>
            <Export />
            </AdminRoute>


        } />

        <Route path="/profile/:slug" element={<PublicProfile />} />



        <Route path="*" element={<div>Page not found</div>} />
      </Routes>

      {showLoader && <Loader transparent />}
    </>
  );
};

export default App;
