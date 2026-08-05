import React, { createContext, useContext, useState, useEffect } from 'react';
import * as reactNative from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ThemeColors } from '../theme/colors';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDarkMode: true,
  colors: darkColors,
  toggleTheme: () => { },
});

const STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedTheme) => {
        if (isMounted && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    AsyncStorage.setItem(STORAGE_KEY, newTheme).catch(() => { });
  };

  const currentColors = theme === 'dark' ? darkColors : lightColors;

  if (!isLoaded) {
    return (
      <reactNative.View style={{ flex: 1, backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <reactNative.ActivityIndicator color={currentColors.primary} />
      </reactNative.View>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode: theme === 'dark',
        colors: currentColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
