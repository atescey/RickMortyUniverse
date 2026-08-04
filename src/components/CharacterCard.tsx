import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import type { Character } from '../types';

interface Props {
  character: Character;
  onPress: () => void;
}

const statusMeta = (status: string) => {
  if (status === 'Alive') return { label: 'HAYATTA', color: colors.statusAlive };
  if (status === 'Dead') return { label: 'ÖLÜ', color: colors.statusDead };
  return { label: 'BİLİNMİYOR', color: colors.statusUnknown };
};

export const CharacterCard: React.FC<Props> = ({ character, onPress }) => {
  const status = statusMeta(character.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
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
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: 'rgba(10,10,11,0.75)',
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
    color: colors.textPrimary,
  },
  subtitle: {
    ...textStyles.bodyMd,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
