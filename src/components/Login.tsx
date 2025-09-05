import { Button, Box, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Remind Candles
      </Typography>
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleSignIn}
        sx={{ mt: 2 }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}