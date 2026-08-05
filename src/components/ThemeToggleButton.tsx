import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const darkIconSource = require('../../assets/dark-mode-icon.png');
const lightIconSource = require('../../assets/ayd_nl_k_mod_g_ne_i.png');

interface Props {
  size?: number;
}

export const ThemeToggleButton: React.FC<Props> = ({ size = 34 }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={styles.button}
      accessibilityLabel="Tema Değiştir"
      accessibilityRole="button"
    >
      <Image
        source={isDarkMode ? lightIconSource : darkIconSource}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    backgroundColor: 'transparent',
  },
});
