import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const { user, signIn, signOutUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      alert(`Welcome, ${user?.displayName || "User"}!`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      alert("Logged out successfully.");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      {user ? (
        <>
          <Typography variant="h5">Welcome, {user.displayName}</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5">Sign in to continue</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in with Google"}
          </Button>
        </>
      )}
    </Box>
  );
} 
