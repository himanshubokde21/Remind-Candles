import { createContext, useContext, useEffect, useState, type ReactNode, type PropsWithChildren } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Imports
import {
  Box,
  CssBaseline,
  Button,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress,
  Paper,
  Link,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useTheme as useMuiTheme,
} from '@mui/material/styles';

// Icon Imports
import {
  Menu as MenuIcon,
  FormatListBulleted as ListIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
  Cake as CakeIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

// --- 1. FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: 'AIzaSyBR0JX9p8q_0eCNFNIu3dhx6lsKancfXI',
  authDomain: 'remind-candles.firebaseapp.com',
  projectId: 'remind-candles',
  storageBucket: 'remind-candles.appspot.com',
  messagingSenderId: '860899862354',
  appId: '1:860899862354:web:6180680aa8f3acc907bc8b',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const signOutUser = () => signOut(auth);

// --- 2. AUTHENTICATION CONTEXT ---
type AuthContextValue =
  | {
      user: User | null;
      loading: boolean;
      signIn: () => Promise<void>;
      signOutUser: () => Promise<void>;
    }
  | null;

const AuthContext = createContext<AuthContextValue>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const value: NonNullable<AuthContextValue> = { user, loading, signIn, signOutUser };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#121212',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- 3. THEME & STYLING ---
const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
      background: { default: '#121212', paper: '#1e1e1e' },
    },
  });
  return <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>;
};

// --- 4. REUSABLE & PAGE COMPONENTS ---
type AuthFormProps = {
  title: string;
  buttonText: string;
  alternateText: string;
  alternateLink: string;
  alternateLinkText: string;
};

const AuthForm = ({
  title,
  buttonText,
  alternateText,
  alternateLink,
  alternateLinkText,
}: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      await signIn();
      navigate('/');
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        alert(
          'Firebase blocked the domain. Add 127.0.0.1 and localhost in Firebase Console > Authentication > Settings > Authorized domains, and enable Google sign-in.',
        );
      } else {
        alert('Failed to sign in. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom component="h1">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use Google to get started.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button fullWidth variant="contained" onClick={handleAuthAction} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : buttonText}
          </Button>
        </Box>
        <Typography sx={{ mt: 3 }}>
          {alternateText}{' '}
          <Link component={RouterLink} to={alternateLink}>
            {alternateLinkText}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

const LoginPage = () => (
  <AuthForm
    title="Welcome Back!"
    buttonText="Sign In with Google"
    alternateText="Don't have an account?"
    alternateLink="/signup"
    alternateLinkText="Sign Up"
  />
);

const SignUpPage = () => (
  <AuthForm
    title="Create Your Account"
    buttonText="Sign Up with Google"
    alternateText="Already have an account?"
    alternateLink="/login"
    alternateLinkText="Log In"
  />
);

const HomePage = () => (
  <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom>
      🎂 Welcome to Remind Candles 🎉
    </Typography>
    <Typography variant="body1">You are successfully logged in! Navigate using the sidebar.</Typography>
  </Paper>
);

const ListPage = () => <Typography variant="h4">Birthday List Page</Typography>;
const CalendarPage = () => <Typography variant="h4">Calendar Page</Typography>;
const SettingsPage = () => <Typography variant="h4">Settings Page</Typography>;
const AboutPage = () => <Typography variant="h4">About Page</Typography>;

// --- 5. LAYOUT & NAVIGATION ---
const DRAWER_WIDTH = 240;

const Navigation = ({ onDrawerToggle }: { onDrawerToggle: () => void }) => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { signOutUser } = useAuth();
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: 'background.paper', color: 'text.primary' }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <CakeIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Remind Candles
        </Typography>
        <Button color="inherit" onClick={signOutUser}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const AppDrawer = ({
  mobileOpen,
  onDrawerToggle,
}: {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}) => {
  const theme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'List', icon: <ListIcon />, path: '/list' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ] as const;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) onDrawerToggle();
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)} selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((v) => !v);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation onDrawerToggle={handleDrawerToggle} />
      <AppDrawer mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

// --- 6. ROUTING LOGIC ---
const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// --- 7. ROOT APP COMPONENT ---
function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/*" element={<PrivateRoute><MainLayout /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
