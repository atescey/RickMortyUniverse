import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character } from '../types';

const FAVORITES_STORAGE_KEY = '@rick_morty_favorites_v1';

interface FavoritesContextType {
  favorites: Character[];
  toggleFavorite: (character: Character) => Promise<void>;
  isFavorite: (characterId: number) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites from AsyncStorage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (updated: Character[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites to AsyncStorage', e);
    }
  };

  const toggleFavorite = async (character: Character) => {
    let updated: Character[];
    const exists = favorites.some((item) => item.id === character.id);
    if (exists) {
      updated = favorites.filter((item) => item.id !== character.id);
    } else {
      updated = [character, ...favorites];
    }
    setFavorites(updated);
    await saveFavorites(updated);
  };

  const isFavorite = (characterId: number): boolean => {
    return favorites.some((item) => item.id === characterId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
