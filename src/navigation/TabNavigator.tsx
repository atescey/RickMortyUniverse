import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CharacterListScreen } from '../screens/CharacterListScreen';
import { LocationsScreen } from '../screens/LocationsScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { colors } from '../theme/colors';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 10 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Characters: 'people',
            Locations: 'planet',
            Episodes: 'film',
            Favorites: 'star',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Characters" component={CharacterListScreen} options={{ title: 'Karakterler' }} />
      <Tab.Screen name="Locations" component={LocationsScreen} options={{ title: 'Lokasyon' }} />
      <Tab.Screen name="Episodes" component={EpisodesScreen} options={{ title: 'Bölümler' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoriler' }} />
    </Tab.Navigator>
  );
};
