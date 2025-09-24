import { Box, Button, Typography, CircularProgress, Alert, Snackbar } from "@mui/material";
import { Google as GoogleIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const { user, signIn, signOutUser, loading: authLoading, error: authError } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSignIn = async () => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      await signIn();
      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error("Login error:", error);
      setLocalError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowSuccessMessage(false);
    } catch (error: any) {
      console.error("Sign out error:", error);
      setLocalError(error.message || "Failed to sign out.");
    }
  };

  const isLoading = authLoading || localLoading;
  const currentError = localError || authError;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 3,
        px: 2,
      }}
    >
      {/* Error Alert */}
      {currentError && (
        <Alert 
          severity="error" 
          sx={{ maxWidth: 400, width: '100%' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => {
                setLocalError(null);
              }}
            >
              Dismiss
            </Button>
          }
        >
          {currentError}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccessMessage(false)} severity="success">
          Welcome, {user?.displayName || "User"}!
        </Alert>
      </Snackbar>

      {user ? (
        <>
          <Typography variant="h5" textAlign="center">
            Welcome, {user.displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            You are successfully signed in!
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleSignOut}
            disabled={isLoading}
            sx={{ minWidth: 200 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Out"}
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" textAlign="center">
            Sign in to continue
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
            Sign in with your Google account to access your birthday reminders and personalized features.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
              onClick={handleSignIn}
              disabled={isLoading}
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
            
            {currentError && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleSignIn}
                disabled={isLoading}
                size="small"
              >
                Try Again
              </Button>
            )}
          </Box>

          {/* Debug Information (only in development) */}
          {import.meta.env.DEV && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxWidth: 500 }}>
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Debug Info:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not configured'}
              </Typography>
              <Typography variant="caption" display="block">
                Current Origin: {window.location.origin}
              </Typography>
              <Typography variant="caption" display="block">
                Auth Loading: {authLoading ? 'Yes' : 'No'}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
} 
