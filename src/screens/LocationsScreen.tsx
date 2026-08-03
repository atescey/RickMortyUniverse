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
import { Location } from '../types';
import { getLocations } from '../api/rickMortyApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const LocationsScreen: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = useCallback(
    async (pageNum: number, search: string, resetList = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await getLocations(pageNum, search);
        setTotalPages(response.info?.pages || 1);
        if (resetList || pageNum === 1) {
          setLocations(response.results);
        } else {
          setLocations((prev) => [...prev, ...response.results]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
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
      fetchLocations(1, searchQuery, true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchLocations]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchLocations(1, searchQuery, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLocations(nextPage, searchQuery, false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Locations</Text>
        <Text style={styles.subtitle}>Dimensions & Planets Across Reality</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location or planet..."
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
        <LoadingSpinner message="Scanning dimensional coords..." />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="planet" size={22} color={colors.secondary} />
                <Text style={styles.locationName}>{item.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Type: </Text>
                <Text style={styles.value}>{item.type || 'Unknown'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Dimension: </Text>
                <Text style={styles.value}>{item.dimension}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Residents: </Text>
                <Text style={styles.value}>{item.residents.length} recorded</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.secondary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <LoadingSpinner message="Loading dimensions..." /> : null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="globe-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No locations found in this search sector.</Text>
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
    color: colors.secondary,
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
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginLeft: 10,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textMuted,
    width: 90,
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
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
