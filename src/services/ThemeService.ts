export interface ThemeOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themeOptions: ThemeOption[] = [
  {
    id: 'pastel-pink',
    name: 'Pastel Pink',
    colors: {
      primary: '#FFB5E8',
      secondary: '#FFC9E9',
      accent: '#FF9ED6',
    },
  },
  {
    id: 'mint-green',
    name: 'Mint Green',
    colors: {
      primary: '#B5EDD4',
      secondary: '#C9F2E4',
      accent: '#93E5BE',
    },
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    colors: {
      primary: '#B5E8FF',
      secondary: '#C9E9FF',
      accent: '#9ED6FF',
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower Yellow',
    colors: {
      primary: '#FFE8B5',
      secondary: '#FFF2C9',
      accent: '#FFD69E',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: {
      primary: '#E8B5FF',
      secondary: '#F2C9FF',
      accent: '#D69EFF',
    },
  },
];

const THEME_STORAGE_KEY = 'remind-candles-theme';

export interface ThemeSettings {
  mode: 'light' | 'dark';
  themeId: string;
}

export class ThemeService {
  private static instance: ThemeService;

  private constructor() {}

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  public getStoredTheme(): ThemeSettings {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    return {
      mode: 'light',
      themeId: 'pastel-pink',
    };
  }

  public saveTheme(settings: ThemeSettings): void {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  }

  public getThemeById(themeId: string): ThemeOption | undefined {
    return themeOptions.find(theme => theme.id === themeId);
  }
}
