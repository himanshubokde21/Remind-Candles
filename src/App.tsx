import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { theme } from './styles/theme';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { BirthdayProvider } from './contexts/BirthdayContext';
import { WishingProvider } from './contexts/WishingContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AnimatedRoutes } from './components/AnimatedRoutes';

function App() {
  const DRAWER_WIDTH = 240;

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <NotificationProvider>
            <BirthdayProvider>
              <WishingProvider>
                <CssBaseline />
                <Box sx={{ display: 'flex' }}>
                  <Navigation />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                      ml: { sm: `${DRAWER_WIDTH}px` },
                      mt: '64px', // Height of AppBar
                    }}
                  >
                    <AnimatedRoutes />
                  </Box>
                </Box>
              <Footer />
              </WishingProvider>
            </BirthdayProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
