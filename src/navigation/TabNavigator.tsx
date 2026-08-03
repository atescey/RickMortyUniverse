import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import { CharacterListScreen } from '../screens/CharacterListScreen';
import { LocationsScreen } from '../screens/LocationsScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Characters') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Locations') {
            iconName = focused ? 'planet' : 'planet-outline';
          } else if (route.name === 'Episodes') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Characters"
        component={CharacterListScreen}
        options={{ tabBarLabel: 'Characters' }}
      />
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{ tabBarLabel: 'Locations' }}
      />
      <Tab.Screen
        name="Episodes"
        component={EpisodesScreen}
        options={{ tabBarLabel: 'Episodes' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favorites' }}
      />
    </Tab.Navigator>
  );
};
