import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import type { Character } from '../types';

interface Props {
  character: Character;
  onPress: () => void;
}

export const CharacterCard: React.FC<Props> = ({ character, onPress }) => {
  const { colors, isDarkMode } = useTheme();

  const statusMeta = (status: string) => {
    if (status === 'Alive') return { label: 'HAYATTA', color: colors.statusAlive };
    if (status === 'Dead') return { label: 'ÖLÜ', color: colors.statusDead };
    return { label: 'BİLİNMİYOR', color: colors.statusUnknown };
  };

  const status = statusMeta(character.status);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? 'rgba(10,10,11,0.75)' : 'rgba(255,255,255,0.85)' }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {character.species}{character.gender ? ` · ${character.gender}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    marginRight: 6,
  },
  statusText: {
    ...textStyles.labelCaps,
    fontSize: 10,
  },
  info: {
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  name: {
    ...textStyles.headlineMd,
    fontSize: 20,
  },
  subtitle: {
    ...textStyles.bodyMd,
    fontSize: 14,
    marginTop: 2,
  },
});
