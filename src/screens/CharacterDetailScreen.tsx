import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Character, RootStackParamList } from '../types';
import { getCharacterById } from '../api/rickMortyApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type DetailRouteProp = RouteProp<RootStackParamList, 'CharacterDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'CharacterDetail'>;

interface Props {
  route: DetailRouteProp;
  navigation: DetailNavProp;
}

export const CharacterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { characterId, character: initialCharacter } = route.params;
  const [character, setCharacter] = useState<Character | undefined>(initialCharacter);
  const [loading, setLoading] = useState(!initialCharacter);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!initialCharacter) {
      getCharacterById(characterId)
        .then((data) => setCharacter(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [characterId, initialCharacter]);

  if (loading || !character) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Retrieving subject data..." />
      </SafeAreaView>
    );
  }

  const favorited = isFavorite(character.id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {character.name}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(character)} style={styles.favButton}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={26}
            color={favorited ? colors.favorite : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Image source={{ uri: character.image }} style={styles.heroImage} />
          <Text style={styles.characterName}>{character.name}</Text>
          <View style={styles.badgeWrapper}>
            <Badge status={character.status} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity Info</Text>
          
          <View style={styles.row}>
            <Ionicons name="body-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.rowLabel}>Species:</Text>
            <Text style={styles.rowValue}>{character.species}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="male-female-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.rowLabel}>Gender:</Text>
            <Text style={styles.rowValue}>{character.gender}</Text>
          </View>

          {character.type ? (
            <View style={styles.row}>
              <Ionicons name="finger-print-outline" size={18} color={colors.primary} style={styles.icon} />
              <Text style={styles.rowLabel}>Type:</Text>
              <Text style={styles.rowValue}>{character.type}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location Data</Text>

          <View style={styles.row}>
            <Ionicons name="planet-outline" size={18} color={colors.secondary} style={styles.icon} />
            <Text style={styles.rowLabel}>Origin:</Text>
            <Text style={styles.rowValue}>{character.origin.name}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="navigate-outline" size={18} color={colors.secondary} style={styles.icon} />
            <Text style={styles.rowLabel}>Last Known:</Text>
            <Text style={styles.rowValue}>{character.location.name}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Appeared in {character.episode.length} Episode(s)
          </Text>
          <Text style={styles.episodeNotice}>
            Subject featured across {character.episode.length} recorded dimension broadcasts.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    padding: 4,
  },
  favButton: {
    padding: 4,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  characterName: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: 14,
    textAlign: 'center',
  },
  badgeWrapper: {
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 10,
  },
  rowLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    width: 90,
  },
  rowValue: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  episodeNotice: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
