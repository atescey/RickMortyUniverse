import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Episode } from '../types';
import { getEpisodes } from '../api/rickMortyApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const EpisodesScreen: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEpisodes = useCallback(
    async (pageNum: number, search: string, resetList = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await getEpisodes(pageNum, search);
        setTotalPages(response.info?.pages || 1);
        if (resetList || pageNum === 1) {
          setEpisodes(response.results);
        } else {
          setEpisodes((prev) => [...prev, ...response.results]);
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchEpisodes(1, searchQuery, true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchEpisodes]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchEpisodes(1, searchQuery, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEpisodes(nextPage, searchQuery, false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Episodes</Text>
        <Text style={styles.subtitle}>Broadcast Logs & Season Transmissions</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search episode title or code..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <LoadingSpinner message="Decrypting interdimensional broadcast..." />
      ) : (
        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.badgeContainer}>
                <Text style={styles.episodeCode}>{item.episode}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.episodeName} numberOfLines={1}>
                  {item.name}
                </Text>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.infoText}> {item.air_date}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.infoText}> {item.characters.length} Characters</Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <LoadingSpinner message="Loading episodes..." /> : null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="tv-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No episode broadcasts found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    ...typography.h1,
    color: colors.accent,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeCode: {
    ...typography.badge,
    color: colors.textPrimary,
  },
  cardContent: {
    flex: 1,
  },
  episodeName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
});
