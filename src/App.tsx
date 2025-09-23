// src/App.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, Typography, Button, CssBaseline, AppBar, Toolbar } from "@mui/material";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import SignUp from "./components/SignUp";

const theme = createTheme();

const Navigation = () => {
  const { user, signOutUser, signIn } = useAuth();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Remind Candles
        </Typography>
        {user ? (
          <Button color="inherit" onClick={signOutUser}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={signIn}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const Home = () => (
  <Box sx={{ textAlign: "center", mt: 8 }}>
    <Typography variant="h4">Home Page</Typography>
    <Typography>Welcome to the application!</Typography>
  </Box>
);

const AnimatedRoutes = () => {
    const { user, signIn } = useAuth();
    return (
        <Routes>
            <Route path="/" element={user ? <Home /> : <Login />} />
            <Route
                path="/signup"
                element={user ? <Navigate to="/" replace /> : <SignUp signIn={signIn} />}
            />
            {/* Add other routes here */}
        </Routes>
    );
};

function AppLayout() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <Box sx={{ mt: "64px", p: 3 }}>
        <AnimatedRoutes />
      </Box>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
