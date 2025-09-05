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
import { requestForToken } from './firebase';
import TokenService from './services/TokenService';
import { getMessaging, getToken } from "firebase/messaging";

const softChime = new Audio("/sounds/soft-chime.mp3");
const loudAlert = new Audio("/sounds/loud-alert.mp3");

const messaging = getMessaging();

export const requestPermission = async () => {
  console.log("Requesting permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    
    try {
      // Get FCM token using the VAPID key from the .env file
      const token = await getToken(messaging, {
        vapidKey: process.env.VITE_FIREBASE_VAPID_KEY, // Access VAPID key from .env
      });
      console.log("FCM Token:", token);

      // TODO: Save this token to Firestore under the logged-in user
      softChime.play(); // Play soft chime on success
    } catch (error) {
      console.error("Error getting FCM token:", error);
      loudAlert.play(); // Play loud alert on error
    }
  } else {
    console.log("Notification permission denied.");
    loudAlert.play(); // Play loud alert if permission is denied
  }
};

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
          {/* Add a button to request notification permission */}
          <Button
            variant="contained"
            color="primary"
            onClick={requestPermission}
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
            softChime.play(); // Play soft chime when token is successfully saved
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        loudAlert.play(); // Play loud alert if an error occurs
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
            softChime.play(); // Play soft chime when token is successfully saved
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        loudAlert.play(); // Play loud alert if an error occurs
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
