import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { CharacterDetailScreen } from '../screens/CharacterDetailScreen';
import { EpisodeDetailScreen } from '../screens/EpisodeDetailScreen';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
      <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
    </Stack.Navigator>
  );
};
