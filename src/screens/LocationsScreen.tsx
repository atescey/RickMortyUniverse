import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Location } from '../types';
import { getLocations } from '../api/rickMortyApi';
import { colors, spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';

export const LocationsScreen: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Lokasyonlar</Text>
        <Text style={styles.subtitle}>EVRENLER VE GEZEGENLER</Text>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="planet" size={20} color={colors.primary} />
              <Text style={styles.locationName} numberOfLines={1}>{item.name}</Text>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.type || 'BİLİNMİYOR'}</Text>
              </View>
              <View style={[styles.tag, styles.tagPurple]}>
                <Text style={[styles.tagText, styles.tagTextPurple]}>{item.dimension || 'BİLİNMEYEN BOYUT'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={14} color={colors.textMuted} />
              <Text style={styles.infoText}> {item.residents.length} SAKİN</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.screenMargin, paddingTop: spacing.xs, paddingBottom: spacing.xs },
  title: { ...textStyles.headlineLg, fontSize: 26, color: colors.primary },
  subtitle: { ...textStyles.labelCaps, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  listContent: { padding: spacing.screenMargin, paddingBottom: 24 },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  locationName: { ...textStyles.headlineMd, fontSize: 18, color: colors.textPrimary, marginLeft: spacing.base + 4, flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.base, marginBottom: spacing.xs },
  tag: {
    backgroundColor: 'rgba(159,251,0,0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagPurple: {
    backgroundColor: 'rgba(157,5,255,0.12)',
    borderColor: colors.secondary,
  },
  tagText: { ...textStyles.labelCaps, fontSize: 10, color: colors.primary },
  tagTextPurple: { color: colors.secondary },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { ...textStyles.monoData, fontSize: 11, color: colors.textMuted },
});
