import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Location } from '../types';
import { getLocations } from '../api/rickMortyApi';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export const LocationsScreen: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = useCallback(async (pageNum: number, reset = false) => {
    if (loading && !reset) return;
    if (pageNum === 1) setLoading(true);
    try {
      const response = await getLocations(pageNum);
      setLocations((prev) => (reset ? response.results : [...prev, ...response.results]));
      setHasMore(!!response.info.next);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => { fetchLocations(1, true); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchLocations(1, true); };
  const handleLoadMore = () => { if (hasMore && !loading) fetchLocations(page + 1); };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextGroup}>
          <Text style={[styles.title, { color: colors.primary }]}>Lokasyonlar</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>EVRENLER VE GEZEGENLER</Text>
        </View>
        <ThemeToggleButton />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="planet" size={20} color={colors.primary} />
              <Text style={[styles.locationName, { color: colors.textPrimary }]} numberOfLines={1}>{item.name}</Text>
            </View>

            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: isDarkMode ? 'rgba(159,251,0,0.1)' : 'rgba(78,182,0,0.15)', borderColor: colors.primary }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{item.type || 'BİLİNMİYOR'}</Text>
              </View>
              <View style={[styles.tag, styles.tagPurple, { backgroundColor: isDarkMode ? 'rgba(157,5,255,0.12)' : 'rgba(138,0,235,0.15)', borderColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.secondary }]}>{item.dimension || 'BİLİNMEYEN BOYUT'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.infoText, { color: colors.textMuted }]}> {item.residents.length} SAKİN</Text>
            </View>
          </View>
        )}
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
  headerTextGroup: { flex: 1 },
  title: { ...textStyles.headlineLg, fontSize: 26 },
  subtitle: { ...textStyles.labelCaps, fontSize: 11, marginTop: 2 },
  listContent: { padding: spacing.screenMargin, paddingBottom: 24 },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  locationName: { ...textStyles.headlineMd, fontSize: 18, marginLeft: spacing.base + 4, flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.base, marginBottom: spacing.xs },
  tag: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagPurple: {},
  tagText: { ...textStyles.labelCaps, fontSize: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { ...textStyles.monoData, fontSize: 11 },
});
