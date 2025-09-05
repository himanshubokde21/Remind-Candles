import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import { WishingProvider } from './contexts/WishingContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useEffect } from 'react';
import FirebaseService from './services/FirebaseService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { requestForToken } from './firebase';
import TokenService from './services/TokenService';

const AppContent = () => {
  const DRAWER_WIDTH = 240;
  
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Navigation />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { sm: `${DRAWER_WIDTH}px` },
            mt: '64px', // Height of AppBar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
            <AnimatedRoutes />
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize Firebase when the app starts
    FirebaseService.getInstance();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Only request token if user is authenticated
        if (user) {
          const token = await requestForToken();
          if (typeof token === 'string' && token) {
            // Store token in Firestore under user's document
            await TokenService.getInstance().saveToken(user.uid, token);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
  }, [user]); // Re-run when user auth state changes
  
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppThemedContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

function AppThemedContent() {
  const { currentTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize Firebase when the app starts
    FirebaseService.getInstance();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Only request token if user is authenticated
        if (user) {
          const token = await requestForToken();
          if (typeof token === 'string' && token) {
            // Store token in Firestore under user's document
            await TokenService.getInstance().saveToken(user.uid, token);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
  }, [user]); // Re-run when user auth state changes
  
  return (
    <MuiThemeProvider theme={currentTheme}>
      <NotificationProvider>
        <BirthdayProvider>
          <WishingProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AppContent />
            </LocalizationProvider>
          </WishingProvider>
        </BirthdayProvider>
      </NotificationProvider>
    </MuiThemeProvider>
  );
}

export default App;
