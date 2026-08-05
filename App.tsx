import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function MainApp() {
  const { colors, isDarkMode } = useTheme();

  const navTheme = isDarkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surfaceContainerLowest,
          text: colors.textPrimary,
          border: colors.cardBorder,
          notification: colors.secondary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surfaceContainerLowest,
          text: colors.textPrimary,
          border: colors.cardBorder,
          notification: colors.secondary,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={colors.background} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    JetBrainsMono_500Medium,
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#131314', justifyContent: 'center' }}>
        <ActivityIndicator color="#9ffb00" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <MainApp />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
