import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, CssBaseline, Button, Typography, AppBar, Toolbar, CircularProgress, Paper, Link } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

// --- Mock Firebase & Services ---
// This simulates the behavior of Firebase auth for demonstration
const mockAuth = {
  onAuthStateChanged: (callback: (user: { uid: string; displayName: string } | null) => void) => {
    const timer = setTimeout(() => callback(null), 1200); // Simulate network delay
    return () => clearTimeout(timer);
  },
  signInWithGoogle: async () => {
    console.log("signInWithGoogle called");
    // Simulate a successful sign-in
    return { user: { uid: 'mock-user-123', displayName: 'Demo User' } };
  },
  signOut: async () => {
    console.log("signOut called");
  },
};

// --- App Theme ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});

// --- Authentication Context ---
// This context manages the user's login state and provides it to the app.
interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Removed duplicate import of ReactNode

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  uid: string;
  displayName: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const response = await mockAuth.signInWithGoogle();
    if (response.user) {
      setUser(response.user);
    }
  };

  const signOutUser = async () => {
    await mockAuth.signOut();
    setUser(null);
  };

  // While checking auth, show a full-screen loader.
  // This is crucial to prevent the "black screen" or content flashing.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: darkTheme.palette.background.default }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- Reusable Authentication Form Component ---
// To ensure Login and SignUp pages look identical
interface AuthFormProps {
  title: string;
  buttonText: string;
  alternateText: string;
  alternateLink: string;
  alternateLinkText: string;
  handleSubmit: () => Promise<void>;
}

const AuthForm = ({ title, buttonText, alternateText, alternateLink, alternateLinkText, handleSubmit }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async () => {
    setLoading(true);
    try {
      await handleSubmit();
    } catch(err) {
      console.error("Auth error:", err);
      // In a real app, show a snackbar or toast notification
      alert("Authentication failed. Please try again.");
    }
    // No finally block to set loading false, because the component will unmount on success
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom component="h1">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use Google to get started.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button fullWidth variant="contained" onClick={onSubmit} disabled={loading}>
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


// --- Page Components ---

const LoginPage = () => {
  const { signIn } = useAuth();
  return (
    <AuthForm 
      title="Welcome Back!"
      buttonText="Sign In with Google"
      handleSubmit={signIn}
      alternateText="Don't have an account?"
      alternateLink="/signup"
      alternateLinkText="Sign Up"
    />
  );
};

const SignUpPage = () => {
  const { user, signOutUser, signIn: contextSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await contextSignIn();
    } catch (err: any) {
      console.error('Sign up error:', err);
      const code = err?.code as string | undefined;
      if (code === 'auth/unauthorized-domain') {
        alert('Firebase auth blocked this domain. Add 127.0.0.1 and localhost to Firebase Auth > Settings > Authorized domains, and enable Google sign-in.');
      } else {
        alert('Failed to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {user ? (
          <>
            <Typography variant="h5" gutterBottom>Welcome, {user.displayName || 'User'}</Typography>
            <Button fullWidth variant="contained" color="secondary" onClick={signOutUser}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>Create Your Account</Typography>
            <Typography variant="body1" color="text.secondary">Use Google to get started.</Typography>
            <Box sx={{ mt: 4 }}>
              <Button fullWidth variant="contained" onClick={handleSignUp} disabled={loading}>
                {loading ? 'Signing up…' : 'Sign Up with Google'}
              </Button>
            </Box>
            <Typography sx={{ mt: 3 }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">Log In</Link>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

const HomePage = () => (
  <Box sx={{textAlign: 'center'}}>
    <Typography variant="h4">Home Page</Typography>
    <Typography>You are successfully logged in!</Typography>
  </Box>
);

// --- Layout Components ---

const Navigation = () => {
  const { user, signOutUser } = useAuth();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Remind Candles
        </Typography>
        {user && (
          <Button color="inherit" onClick={signOutUser}>Sign Out</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

import type { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {children}
        </Box>
    </Box>
);


// --- Routing ---

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// --- Root App Component ---

function App() {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />
            {/* Add other private routes here inside their own <PrivateRoute> wrappers */}
          </Routes>
        </AuthProvider>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;

