import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Episode, Character, RootStackParamList } from '../types';
import { getEpisodeById, getCharactersByIds, extractIdsFromUrls } from '../api/rickMortyApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

type DetailRouteProp = RouteProp<RootStackParamList, 'EpisodeDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: DetailRouteProp;
}

export const EpisodeDetailScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDarkMode } = useTheme();
  const { episodeId } = route.params;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEpisodeById(episodeId)
      .then(async (data) => {
        setEpisode(data);
        const ids = extractIdsFromUrls(data.characters);
        const chars = await getCharactersByIds(ids);
        setCharacters(chars);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [episodeId]);

  if (loading || !episode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner message="BÖLÜM KAYDI AÇILIYOR..." />
      </SafeAreaView>
    );
  }

  const heroImage = characters[0]?.image;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>{episode.episode}</Text>
        <ThemeToggleButton size={30} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          {heroImage ? (
            <Image source={{ uri: heroImage }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder, { backgroundColor: colors.surfaceContainerHigh }]} />
          )}
          <LinearGradient
            colors={['transparent', isDarkMode ? 'rgba(19,19,20,0.5)' : 'rgba(242,246,240,0.5)', colors.background]}
            style={styles.heroGradient}
          />
          <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.heroBadgeText, { color: colors.onPrimary }]}>{episode.episode}</Text>
          </View>
        </View>

        <Text style={[styles.episodeName, { color: colors.textPrimary }]}>{episode.name}</Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Yayın Tarihi:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{episode.air_date}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="albums-outline" size={18} color={colors.primary} style={styles.icon} />
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Bölüm Kodu:</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{episode.episode}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>BU BÖLÜMDEKİ KARAKTERLER ({characters.length})</Text>
          <View style={styles.characterGrid}>
            {characters.map((char) => (
              <TouchableOpacity
                key={char.id}
                style={styles.characterItem}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CharacterDetail', { characterId: char.id })}
              >
                <Image source={{ uri: char.image }} style={[styles.characterAvatar, { borderColor: colors.cardBorder }]} />
                <Text style={[styles.characterName, { color: colors.textSecondary }]} numberOfLines={1}>{char.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin, paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { ...textStyles.headlineMd, fontSize: 16 },
  scrollContent: { paddingBottom: 40 },
  heroSection: { width: '100%', height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {},
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
  heroBadge: {
    position: 'absolute', bottom: spacing.sm, left: spacing.sm,
    borderRadius: borderRadius.md,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  heroBadgeText: { ...textStyles.labelCaps, fontSize: 11 },
  episodeName: {
    ...textStyles.headlineLg, fontSize: 24,
    paddingHorizontal: spacing.screenMargin, marginTop: spacing.sm, marginBottom: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1, padding: spacing.sm,
    marginHorizontal: spacing.screenMargin, marginBottom: spacing.sm,
  },
  sectionTitle: { ...textStyles.labelCaps, fontSize: 12, marginBottom: spacing.sm, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  icon: { marginRight: 10 },
  rowLabel: { ...textStyles.bodyMd, fontSize: 14, fontWeight: '600', width: 110 },
  rowValue: { ...textStyles.bodyMd, fontSize: 14, flex: 1 },
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  characterItem: { width: 72, alignItems: 'center' },
  characterAvatar: {
    width: 60, height: 60, borderRadius: borderRadius.full,
    borderWidth: 1.5, marginBottom: 4,
  },
  characterName: { ...textStyles.bodyMd, fontSize: 10, textAlign: 'center' },
});