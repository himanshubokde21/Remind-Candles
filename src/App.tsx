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
  return (
    <ThemeProvider>
      <AppThemedContent />
    </ThemeProvider>
  );
}

function AppThemedContent() {
  const { currentTheme } = useTheme();

  return (
    <MuiThemeProvider theme={currentTheme}>
      <Router>
        <NotificationProvider>
          <BirthdayProvider>
            <WishingProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AppContent />
              </LocalizationProvider>
            </WishingProvider>
          </BirthdayProvider>
        </NotificationProvider>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
