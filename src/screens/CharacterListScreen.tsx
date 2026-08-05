import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CharacterCard } from '../components/CharacterCard';
import { getCharacters } from '../api/rickMortyApi';
import type { Character, RootStackParamList } from '../types';
import { colors, spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { Dropdown } from '../components/Dropdown';

const STATUS_FILTERS = ['Tümü', 'Alive', 'Dead', 'unknown'];
const SPECIES_FILTERS = ['Tümü', 'Human', 'Alien', 'Humanoid', 'Robot', 'Animal'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CharacterListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [speciesFilter, setSpeciesFilter] = useState('Tümü');

  const fetchCharacters = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading && !reset) return;
      setLoading(true);
      try {
        const data = await getCharacters(pageNum, {
          name: search.trim() || undefined,
          status: statusFilter === 'Tümü' ? undefined : statusFilter,
          species: speciesFilter === 'Tümü' ? undefined : speciesFilter,
        });
        setCharacters(prev => (reset ? data.results : [...prev, ...data.results]));
        setHasMore(!!data.info.next);
        setPage(pageNum);
      } catch (e) {
        if (reset) setCharacters([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, speciesFilter, loading]
  );

  React.useEffect(() => {
    fetchCharacters(1, true);
  }, [search, statusFilter, speciesFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rick & Morty{'\n'}Universe</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Multiverse varlıklarını ara..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        <Dropdown
          label="DURUM"
          options={STATUS_FILTERS}
          selected={statusFilter}
          onSelect={setStatusFilter}
          accentColor={colors.primary}
        />
        <Dropdown
          label="TÜR"
          options={SPECIES_FILTERS}
          selected={speciesFilter}
          onSelect={setSpeciesFilter}
          accentColor={colors.secondary}
        />
      </View>

      <FlatList
        data={characters}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
          />
        )}
        onEndReached={() => {
          if (hasMore && !loading) fetchCharacters(page + 1);
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.sm }} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Karakter Bulunamadı</Text>
              <Text style={styles.emptySub}>Arama veya filtreleme kriterlerinize uygun sonuç bulunamadı.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...textStyles.headlineLg,
    fontSize: 26,
    color: colors.primary,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.xs,
  },
  searchWrapper: {
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...textStyles.bodyMd,
    fontSize: 14,
    lineHeight: 17,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenMargin,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  listContent: {
    padding: spacing.screenMargin,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    ...textStyles.headlineMd,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySub: {
    ...textStyles.bodyMd,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
