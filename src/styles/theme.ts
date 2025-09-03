import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#FFB5E8', // Soft pink
      light: '#FFC9E9',
      dark: '#FF9ED6',
    },
    secondary: {
      main: '#B5E8FF', // Soft blue
      light: '#C9E9FF',
      dark: '#9ED6FF',
    },
    background: {
      default: mode === 'light' ? '#FFFFFF' : '#121212',
      paper: mode === 'light' ? '#FFF9FB' : '#1E1E1E',
    },
  },
});

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
};

export const createAppTheme = (mode: PaletteMode) => {
  const themeTokens = getDesignTokens(mode);
  return createTheme({
    ...themeTokens,
    ...baseTheme,
  });
};
