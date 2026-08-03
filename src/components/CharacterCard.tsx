import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Character } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Badge } from './Badge';
import { useFavorites } from '../context/FavoritesContext';

interface CharacterCardProps {
  character: Character;
  onPress: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(character.id);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {character.name}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(character)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? colors.favorite : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Badge status={character.status} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Species: </Text>
          <Text style={styles.value} numberOfLines={1}>
            {character.species} ({character.gender})
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Last location: </Text>
          <Text style={styles.value} numberOfLines={1}>
            {character.location.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  value: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
