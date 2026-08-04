import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const api = axios.create({ baseURL: BASE_URL });

// --- Types ---
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
  episode: string; // e.g. "S01E01"
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

// --- Karakterler ---
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

// --- Bölümler ---
export const getEpisodes = async (page: number = 1) => {
  const { data } = await api.get<ApiResponse<Episode>>('/episode', { params: { page } });
  return data;
};

export const getEpisodesByIds = async (ids: number[]) => {
  const { data } = await api.get<Episode[]>(`/episode/${ids.join(',')}`);
  return Array.isArray(data) ? data : [data];
};

// --- Lokasyonlar ---
export const getLocations = async (page: number = 1) => {
  const { data } = await api.get<ApiResponse<Location>>('/location', { params: { page } });
  return data;
};
// --- Yardımcı: URL'lerden ID çıkarma ---
export const extractIdsFromUrls = (urls: string[]): number[] => {
  return urls.map(url => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 1], 10);
  });
};
export const getCharactersByIds = async (ids: number[]) => {
  const { data } = await api.get<Character[]>(`/character/${ids.join(',')}`);
  return Array.isArray(data) ? data : [data];
};

export const getEpisodeById = async (id: number) => {
  const { data } = await api.get<Episode>(`/episode/${id}`);
  return data;
};