import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import { CharacterCard } from '../components/CharacterCard';
import { colors, spacing, borderRadius } from '../theme/colors';
import { textStyles } from '../theme/textStyles';

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { favorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavorites = favorites.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Favoriler</Text>
        <Text style={styles.subtitle}>KAYDEDİLMİŞ KARAKTERLER</Text>

        {favorites.length > 0 && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
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
              <Text style={styles.emptyTitle}>Favori Karakter Yok</Text>
              <Text style={styles.emptyText}>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.screenMargin, paddingTop: spacing.xs, paddingBottom: spacing.xs },
  title: { ...textStyles.headlineLg, fontSize: 26, color: colors.primary },
  subtitle: { ...textStyles.labelCaps, fontSize: 11, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.xs },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  searchInput: { flex: 1, color: colors.textPrimary, ...textStyles.bodyMd, fontSize: 14 },
  listContent: { padding: spacing.screenMargin },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { ...textStyles.headlineMd, fontSize: 18, color: colors.textPrimary, marginTop: 16 },
  emptyText: { ...textStyles.bodyMd, fontSize: 13, color: colors.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
