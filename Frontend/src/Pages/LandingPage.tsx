import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../theme/AppTheme';
import AppAppBar from '../components/MainComponents/AppAppBar';
import Hero from '../components/MainComponents/Hero';
import Features from '../components/MainComponents/Features';
import FAQ from '../components/MainComponents/FAQ';
import Footer from '../components/MainComponents/Footer';


export default function LandingPage(props: { disableCustomTheme?: boolean }) {
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      {/* Page content */}
      <AppAppBar />
      <Hero />
      <div>
        <Features />
        <FAQ />
        <Footer />
      </div>

     
    </AppTheme>
  );
}
