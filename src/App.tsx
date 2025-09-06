import { Box, CssBaseline, Button } from '@mui/material';
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
import { getOrRequestPermissionAndToken, requestForToken } from './firebase'; // Correct import
import TokenService from './services/TokenService';

const softChime = new Audio("/sounds/soft-chime.mp3");
const loudAlert = new Audio("/sounds/loud-alert.mp3");

const AppContent = () => {
  const DRAWER_WIDTH = 240;
  const { user } = useAuth();

  const handleEnableNotifications = async () => {
    if (!user) {
      console.log("User must be logged in to enable notifications.");
      alert("Please log in to enable notifications.");
      return;
    }
    
    try {
      const token = await getOrRequestPermissionAndToken();
      if (token) {
        await TokenService.getInstance().saveToken(user.uid, token);
        console.log("Notification token saved successfully.");
        softChime.play();
        alert("Notifications have been enabled!");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      loudAlert.play();
    }
  };
  
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
            mt: '64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
            <AnimatedRoutes />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnableNotifications}
            sx={{ mt: 2 }}
          >
            Enable Notifications
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

function App() {
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
    FirebaseService.getInstance();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      if (user && Notification.permission === 'granted') {
        try {
          const token = await requestForToken();
          if (typeof token === 'string' && token) {
            await TokenService.getInstance().saveToken(user.uid, token);
            console.log("Existing notification token refreshed and saved.");
          }
        } catch (error) {
          console.error('Error refreshing notification token:', error);
        }
      }
    };
    
    initializeNotifications();
  }, [user]);
  
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
