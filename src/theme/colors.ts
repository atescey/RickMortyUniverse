export const colors = {
  background: '#0a0c16',
  cardBackground: '#141829',
  cardBorder: '#222842',
  cardHeader: '#1a1f36',
  
  primary: '#00ff97',       // Portal Green
  primaryDark: '#00b36b',
  primaryGlow: 'rgba(0, 255, 151, 0.2)',
  
  secondary: '#00d2ff',     // Electric Cyan
  accent: '#9d4edd',        // Portal Purple
  warning: '#f0e14a',       // Portal Yellow
  favorite: '#ff4757',      // Heart Red
  
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  
  statusAlive: '#2ecc71',
  statusAliveBg: 'rgba(46, 204, 113, 0.15)',
  statusDead: '#e74c3c',
  statusDeadBg: 'rgba(231, 76, 60, 0.15)',
  statusUnknown: '#95a5a6',
  statusUnknownBg: 'rgba(149, 165, 166, 0.15)',
  
  tabBar: '#0e1120',
  tabBarBorder: '#1c223a',
  inputBackground: '#161b30',
  inputBorder: '#2a3254',
} as const;

export type Colors = typeof colors;
