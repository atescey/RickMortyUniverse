import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const api = axios.create({ baseURL: BASE_URL });

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

interface ApiResponse<T> {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: T[];
}

export const getCharacters = async (page: number = 1, filters?: {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}) => {
  const { data } = await api.get<ApiResponse<Character>>('/character', {
    params: { page, ...filters },
  });
  return data;
};

export const getCharacterById = async (id: number) => {
  const { data } = await api.get<Character>(`/character/${id}`);
  return data;
};

export const getEpisodes = async (page: number = 1) => {
  const { data } = await api.get<ApiResponse<Episode>>('/episode', { params: { page } });
  return data;
};

export const getEpisodesByIds = async (ids: number[]): Promise<Episode[]> => {
  const validIds = (ids || []).filter((id) => typeof id === 'number' && !isNaN(id));
  if (validIds.length === 0) return [];
  const { data } = await api.get<Episode | Episode[]>(`/episode/${validIds.join(',')}`);
  return Array.isArray(data) ? data : [data];
};

export const getLocations = async (page: number = 1) => {
  const { data } = await api.get<ApiResponse<Location>>('/location', { params: { page } });
  return data;
};

export const extractIdsFromUrls = (urls: string[]): number[] => {
  if (!urls || !Array.isArray(urls)) return [];
  return urls
    .map((url) => {
      if (!url) return NaN;
      const cleanUrl = url.trim().replace(/\/+$/, '');
      const parts = cleanUrl.split('/');
      return parseInt(parts[parts.length - 1], 10);
    })
    .filter((id) => typeof id === 'number' && !isNaN(id));
};

export const getCharactersByIds = async (ids: number[]): Promise<Character[]> => {
  const validIds = (ids || []).filter((id) => typeof id === 'number' && !isNaN(id));
  if (validIds.length === 0) return [];
  const { data } = await api.get<Character | Character[]>(`/character/${validIds.join(',')}`);
  return Array.isArray(data) ? data : [data];
};

export const getEpisodeById = async (id: number) => {
  const { data } = await api.get<Episode>(`/episode/${id}`);
  return data;
};