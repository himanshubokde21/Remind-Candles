import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const { user, signIn, signOutUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with your real Firebase sign-up logic
      console.log("Sign Up with", signUpEmail, signUpPassword);
      alert(`Signed up with ${signUpEmail}`);
      setSignUpEmail("");
      setSignUpPassword("");
    } catch (err) {
      console.error(err);
      alert("Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ position: "absolute", top: 32, textAlign: "center", width: "100%" }}>
        <Typography variant="h2" component="h1" color="primary.main">
          Remind Candles
        </Typography>
      </Box>

      <Grid container spacing={4} maxWidth="lg" sx={{ width: "100%", mt: 8 }}>
        {/* Sign In Panel */}
        <Grid container>
          <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            {user ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Welcome, {user.displayName || "User"}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Sign in to continue
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSignIn}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
              </>
            )}
          </Grid>
        </Grid>
        </Grid>

        {/* Sign Up Panel */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              Create an Account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignUp}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
