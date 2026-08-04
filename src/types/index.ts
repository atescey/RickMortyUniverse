export type { Character, Episode, Location } from '../api/rickMortyApi';

export type RootStackParamList = {
  MainTabs: undefined;
  CharacterDetail: { characterId: number };
  EpisodeDetail: { episodeId: number };
};

export type TabParamList = {
  Characters: undefined;
  Locations: undefined;
  Episodes: undefined;
  Favorites: undefined;
};