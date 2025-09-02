import { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { ThemeService } from '../services/ThemeService';
import type { ThemeSettings, ThemeOption } from '../services/ThemeService';
import { themeOptions } from '../services/ThemeService';

interface ThemeContextType {
  currentTheme: Theme;
  settings: ThemeSettings;
  setColorTheme: (themeId: string) => void;
  toggleMode: () => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createCustomTheme = (settings: ThemeSettings): Theme => {
  const themeService = ThemeService.getInstance();
  const themeOption = themeService.getThemeById(settings.themeId);

  return createTheme({
    palette: {
      mode: settings.mode,
      primary: {
        main: themeOption?.colors.primary || '#FFB5E8',
        light: themeOption?.colors.secondary || '#FFC9E9',
        dark: themeOption?.colors.accent || '#FF9ED6',
      },
      secondary: {
        main: settings.mode === 'light' ? '#757575' : '#9e9e9e',
        light: settings.mode === 'light' ? '#a4a4a4' : '#cfcfcf',
        dark: settings.mode === 'light' ? '#494949' : '#707070',
      },
      background: {
        default: settings.mode === 'light' ? '#ffffff' : '#121212',
        paper: settings.mode === 'light' ? '#f8f9fa' : '#1e1e1e',
      },
      text: {
        primary: settings.mode === 'light' ? '#1f1f1f' : '#ffffff',
        secondary: settings.mode === 'light' ? '#666666' : '#b3b3b3',
      },
    },
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
            boxShadow: settings.mode === 'light' 
              ? '0 4px 12px rgba(0,0,0,0.05)' 
              : '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeService = ThemeService.getInstance();
  const [settings, setSettings] = useState<ThemeSettings>(() => themeService.getStoredTheme());
  const [currentTheme, setCurrentTheme] = useState(() => createCustomTheme(settings));

  const updateTheme = (newSettings: ThemeSettings) => {
    themeService.saveTheme(newSettings);
    setSettings(newSettings);
    setCurrentTheme(createCustomTheme(newSettings));
  };

  useEffect(() => {
    // Initialize theme from local storage
    const storedTheme = themeService.getStoredTheme();
    updateTheme(storedTheme);
  }, []);

  const value = {
    currentTheme,
    settings,
    setColorTheme: (themeId: string) => {
      updateTheme({ ...settings, themeId });
    },
    toggleMode: () => {
      updateTheme({
        ...settings,
        mode: settings.mode === 'light' ? 'dark' : 'light',
      });
    },
    availableThemes: themeOptions,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
