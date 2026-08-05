import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const { colors, isDarkMode } = useTheme();

  const statusMeta = (st: string) => {
    if (st === 'Alive') return { label: 'HAYATTA', color: colors.statusAlive };
    if (st === 'Dead') return { label: 'ÖLÜ', color: colors.statusDead };
    return { label: 'BİLİNMİYOR', color: colors.statusUnknown };
  };

  const meta = statusMeta(status);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? 'rgba(10,10,11,0.85)' : 'rgba(255,255,255,0.9)',
          borderColor: meta.color,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: 6,
  },
  text: {
    ...textStyles.labelCaps,
    fontSize: 10,
  },
});
