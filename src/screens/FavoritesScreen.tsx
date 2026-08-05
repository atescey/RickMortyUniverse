import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import { CharacterCard } from '../components/CharacterCard';
import { spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { favorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavorites = favorites.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.title, { color: colors.primary }]}>Favoriler</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>KAYDEDİLMİŞ KARAKTERLER</Text>
          </View>
          <ThemeToggleButton />
        </View>

        {favorites.length > 0 && (
          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.cardBorder }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Favorilerde ara..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CharacterCard
              character={item}
              onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={48} color={colors.primary} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Favori Karakter Yok</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {searchQuery.length > 0
                  ? 'Aramanıza uygun favori karakter bulunamadı.'
                  : 'Karakter kartlarındaki yıldız ikonuna dokunarak favorilerinize ekleyebilirsiniz.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.screenMargin, paddingTop: spacing.xs, paddingBottom: spacing.xs },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextGroup: { flex: 1 },
  title: { ...textStyles.headlineLg, fontSize: 26 },
  subtitle: { ...textStyles.labelCaps, fontSize: 11, marginTop: 2, marginBottom: spacing.xs },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  searchInput: { flex: 1, ...textStyles.bodyMd, fontSize: 14 },
  listContent: { padding: spacing.screenMargin },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { ...textStyles.headlineMd, fontSize: 18, marginTop: 16 },
  emptyText: { ...textStyles.bodyMd, fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
