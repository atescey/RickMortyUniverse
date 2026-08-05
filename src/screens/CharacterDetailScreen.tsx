import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Character, Episode, RootStackParamList } from '../types';
import { getCharacterById, getEpisodesByIds, extractIdsFromUrls } from '../api/rickMortyApi';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFavorites } from '../context/FavoritesContext';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

type DetailRouteProp = RouteProp<RootStackParamList, 'CharacterDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'CharacterDetail'>;

interface Props {
  route: DetailRouteProp;
  navigation: DetailNavProp;
}

export const CharacterDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { characterId } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    getCharacterById(characterId)
      .then(async (data) => {
        setCharacter(data);
        setLoading(false);

        if (data.episode.length > 0) {
          setEpisodesLoading(true);
          try {
            const ids = extractIdsFromUrls(data.episode);
            const episodeData = await getEpisodesByIds(ids);
            setEpisodes(episodeData);
          } catch (err) {
            console.error('Bölümler yüklenemedi', err);
          } finally {
            setEpisodesLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [characterId]);

  if (loading || !character) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner message="KARAKTER DETAYLARI YÜKLENİYOR..." />
      </SafeAreaView>
    );
  }

  const favorited = isFavorite(character.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {character.name}
        </Text>
        <View style={styles.rightButtonsRow}>
          <TouchableOpacity onPress={() => toggleFavorite(character)} style={styles.favButton}>
            <Ionicons
              name={favorited ? 'star' : 'star-outline'}
              size={24}
              color={favorited ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          <ThemeToggleButton size={30} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Image source={{ uri: character.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', isDarkMode ? 'rgba(19,19,20,0.5)' : 'rgba(242,246,240,0.5)', colors.background]}
            style={styles.heroGradient}
          />
          <View style={styles.heroBadgeOverlay}>
            <Badge status={character.status} />
          </View>
        </View>

        <Text style={[styles.characterName, { color: colors.textPrimary }]}>{character.name}</Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>KİMLİK BİLGİLERİ</Text>

          <View style={styles.row}>
            <Ionicons name="body-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Tür:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{character.species}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="male-female-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Cinsiyet:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{character.gender}</Text>
          </View>

          {character.type ? (
            <View style={styles.row}>
              <Ionicons name="finger-print-outline" size={18} color={colors.primary} style={styles.icon} />
              <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Tip:</Text>
              <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{character.type}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>KONUM BİLGİLERİ</Text>

          <View style={styles.row}>
            <Ionicons name="planet-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Köken:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{character.origin.name}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="navigate-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Son Konum:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{character.location.name}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.episodeHeaderRow}>
            <Ionicons name="albums-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>TESPİT KAYITLARI ({character.episode.length})</Text>
          </View>

          {episodesLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.sm }} />
          ) : (
            episodes.map((ep) => (
              <TouchableOpacity
                key={ep.id}
                style={[styles.episodeRow, { borderBottomColor: colors.divider }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EpisodeDetail', { episodeId: ep.id })}
              >
                <View style={[styles.episodeBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
                  <Text style={[styles.episodeBadgeText, { color: colors.primary }]}>{ep.episode}</Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={[styles.episodeName, { color: colors.textPrimary }]} numberOfLines={1}>{ep.name}</Text>
                  <Text style={[styles.episodeDate, { color: colors.textMuted }]}>{ep.air_date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  rightButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  favButton: {
    padding: 4,
  },
  headerTitle: {
    ...textStyles.headlineMd,
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  heroBadgeOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
  },
  characterName: {
    ...textStyles.headlineLg,
    fontSize: 28,
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.sm,
    marginHorizontal: spacing.screenMargin,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.labelCaps,
    fontSize: 12,
    marginBottom: spacing.sm,
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
    ...textStyles.bodyMd,
    fontSize: 14,
    fontWeight: '600',
    width: 90,
  },
  rowValue: {
    ...textStyles.bodyMd,
    fontSize: 14,
    flex: 1,
  },
  episodeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  episodeBadge: {
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: spacing.sm,
  },
  episodeBadgeText: {
    ...textStyles.labelCaps,
    fontSize: 10,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeName: {
    ...textStyles.headlineMd,
    fontSize: 15,
  },
  episodeDate: {
    ...textStyles.monoData,
    fontSize: 11,
    marginTop: 2,
  },
});
