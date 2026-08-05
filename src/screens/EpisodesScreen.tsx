import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Episode, RootStackParamList } from '../types';
import { getEpisodes, getCharactersByIds, extractIdsFromUrls } from '../api/rickMortyApi';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EpisodesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const seasonColor = (episodeCode: string) => {
    const season = episodeCode.match(/S(\d+)/)?.[1];
    const map: Record<string, string> = {
      '01': colors.primary,
      '02': colors.secondary,
      '03': colors.tertiary,
      '04': colors.secondary,
    };
    return map[season ?? '01'] ?? colors.primary;
  };

  const loadThumbnails = async (eps: Episode[]) => {
    const firstCharIds = eps
      .map(ep => extractIdsFromUrls(ep.characters.slice(0, 1))[0])
      .filter(Boolean);
    if (firstCharIds.length === 0) return;
    try {
      const uniqueIds = Array.from(new Set(firstCharIds));
      const chars = await getCharactersByIds(uniqueIds);
      const idToImage: Record<number, string> = {};
      chars.forEach(c => { idToImage[c.id] = c.image; });

      const map: Record<number, string> = {};
      eps.forEach(ep => {
        const firstId = extractIdsFromUrls(ep.characters.slice(0, 1))[0];
        if (firstId && idToImage[firstId]) map[ep.id] = idToImage[firstId];
      });
      setThumbnails(prev => ({ ...prev, ...map }));
    } catch (err) {
      console.error('Kapak görselleri yüklenemedi', err);
    }
  };

  const fetchEpisodes = useCallback(async (pageNum: number, reset = false) => {
    if (loading && !reset) return;
    if (pageNum === 1) setLoading(true);
    try {
      const response = await getEpisodes(pageNum);
      setEpisodes((prev) => (reset ? response.results : [...prev, ...response.results]));
      setHasMore(!!response.info.next);
      setPage(pageNum);
      loadThumbnails(response.results);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => { fetchEpisodes(1, true); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchEpisodes(1, true); };
  const handleLoadMore = () => { if (hasMore && !loading) fetchEpisodes(page + 1); };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.primary }]}>Multiverse{'\n'}Kayıtları</Text>
        <ThemeToggleButton />
      </View>

      <FlatList
        data={episodes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const accent = seasonColor(item.episode);
          const thumb = thumbnails[item.id];
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  borderLeftColor: accent,
                  borderLeftWidth: 3,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('EpisodeDetail', { episodeId: item.id })}
            >
              <View style={styles.thumbWrapper}>
                {thumb ? (
                  <Image source={{ uri: thumb }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: colors.surfaceContainerHigh }]}>
                    <ActivityIndicator size="small" color={colors.textMuted} />
                  </View>
                )}
                <View style={[styles.episodeBadge, { backgroundColor: accent }]}>
                  <Text style={[styles.episodeCode, { color: colors.onPrimary }]}>{item.episode}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.episodeName, { color: colors.textPrimary }]} numberOfLines={2}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}> {item.air_date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={12} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}> {item.characters.length} KARAKTER</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.sm }} /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  title: { ...textStyles.headlineLg, fontSize: 26 },
  listContent: { padding: spacing.screenMargin, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  thumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  episodeCode: { ...textStyles.labelCaps, fontSize: 8 },
  cardContent: { flex: 1 },
  episodeName: { ...textStyles.headlineMd, fontSize: 14, marginBottom: 3 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  infoText: { ...textStyles.monoData, fontSize: 10 },
});
