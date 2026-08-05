export interface ThemeColors {
  background: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  outline: string;
  outlineVariant: string;

  primary: string;
  primaryDim: string;
  onPrimary: string;

  secondary: string;
  onSecondary: string;

  tertiary: string;
  onTertiary: string;

  error: string;
  errorContainer: string;

  statusAlive: string;
  statusDead: string;
  statusUnknown: string;

  cardBackground: string;
  cardBorder: string;
  divider: string;
  statusBar: 'light' | 'dark';
}

export const darkColors: ThemeColors = {
  background: '#131314',
  surfaceContainerLowest: '#0e0e0f',
  surfaceContainerLow: '#1c1b1c',
  surfaceContainer: '#201f20',
  surfaceContainerHigh: '#2a2a2b',
  surfaceContainerHighest: '#353436',

  textPrimary: '#e5e2e3',
  textSecondary: '#c0caad',
  textMuted: '#8a947a',
  outline: '#8a947a',
  outlineVariant: '#414a34',

  primary: '#9ffb00',
  primaryDim: '#8bdc00',
  onPrimary: '#1f3700',

  secondary: '#9d05ff',
  onSecondary: '#4b007e',

  tertiary: '#7df4ff',
  onTertiary: '#00363a',

  error: '#ffb4ab',
  errorContainer: '#93000a',

  statusAlive: '#9ffb00',
  statusDead: '#ffb4ab',
  statusUnknown: '#c0caad',

  cardBackground: 'rgba(10, 10, 11, 0.7)',
  cardBorder: '#414a34',
  divider: '#2a2a2b',
  statusBar: 'light',
};

export const lightColors: ThemeColors = {
  background: '#f2f6f0',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#e5ebd9',
  surfaceContainer: '#dbe4cf',
  surfaceContainerHigh: '#d0dbc3',
  surfaceContainerHighest: '#c5d2b7',

  textPrimary: '#121b06',
  textSecondary: '#354820',
  textMuted: '#586b43',
  outline: '#586b43',
  outlineVariant: '#9cb185',

  primary: '#4eb600',
  primaryDim: '#3e9600',
  onPrimary: '#ffffff',

  secondary: '#8a00eb',
  onSecondary: '#ffffff',

  tertiary: '#007d88',
  onTertiary: '#ffffff',

  error: '#ba1a1a',
  errorContainer: '#ffdad6',

  statusAlive: '#3e9600',
  statusDead: '#d32f2f',
  statusUnknown: '#586b43',

  cardBackground: 'rgba(255, 255, 255, 0.95)',
  cardBorder: '#b0c399',
  divider: '#d0dbc3',
  statusBar: 'dark',
};

export const colors = darkColors;

export const spacing = {
  base: 4,
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  gutter: 16,
  screenMargin: 20,
};

export const borderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export const typography = {
  sizes: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 },
};