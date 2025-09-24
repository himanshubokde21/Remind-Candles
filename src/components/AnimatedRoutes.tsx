import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from '../pages/HomePage';
import { ListPage } from '../pages/ListPage';
import { CalendarPage } from '../pages/CalendarPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AboutPage } from '../pages/AboutPage';
import { Login } from './Login';
import { PageTransition } from './PageTransition';
import { Container } from '@mui/material';

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
        pb: 8, // Add padding bottom to prevent content from being hidden by footer
      }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          } />
          <Route path="/list" element={
            <PageTransition>
              <ListPage />
            </PageTransition>
          } />
          <Route path="/calendar" element={
            <PageTransition>
              <CalendarPage />
            </PageTransition>
          } />
          <Route path="/settings" element={
            <PageTransition>
              <SettingsPage />
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />

          {/* ✅ Fallback route */}
          <Route path="*" element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    </Container>
  );
};
