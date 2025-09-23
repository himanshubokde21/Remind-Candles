import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";


type Props = {
    signIn: () => Promise<void>;
};

export default function SignUp({ signIn }: Props) {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Create your account
            </Typography>
            <Typography>Use Google to get started.</Typography>
            <Button variant="contained" onClick={signIn} sx={{ mt: 2 }}>
                Sign up with Google
            </Button>
            <Typography sx={{ mt: 2 }}>
                Already have an account? <RouterLink to="/">Log in</RouterLink>
            </Typography>
        </Box>
    );
}