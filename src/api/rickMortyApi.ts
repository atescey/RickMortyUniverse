import axios from 'axios';
import { ApiResponse, Character, Episode, Location } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const rickMortyApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getCharacters = async (
  page: number = 1,
  name?: string,
  status?: string
): Promise<ApiResponse<Character>> => {
  try {
    const params: Record<string, string | number> = { page };
    if (name && name.trim().length > 0) {
      params.name = name.trim();
    }
    if (status && status !== 'All') {
      params.status = status.toLowerCase();
    }
    const response = await rickMortyApi.get<ApiResponse<Character>>('/character', { params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
};

export const getCharacterById = async (id: number): Promise<Character> => {
  const response = await rickMortyApi.get<Character>(`/character/${id}`);
  return response.data;
};

export const getMultipleCharacters = async (ids: number[]): Promise<Character[]> => {
  if (ids.length === 0) return [];
  if (ids.length === 1) {
    const single = await getCharacterById(ids[0]);
    return [single];
  }
  const response = await rickMortyApi.get<Character[]>(`/character/${ids.join(',')}`);
  return response.data;
};

export const getLocations = async (
  page: number = 1,
  name?: string
): Promise<ApiResponse<Location>> => {
  try {
    const params: Record<string, string | number> = { page };
    if (name && name.trim().length > 0) {
      params.name = name.trim();
    }
    const response = await rickMortyApi.get<ApiResponse<Location>>('/location', { params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
};

export const getEpisodes = async (
  page: number = 1,
  name?: string
): Promise<ApiResponse<Episode>> => {
  try {
    const params: Record<string, string | number> = { page };
    if (name && name.trim().length > 0) {
      params.name = name.trim();
    }
    const response = await rickMortyApi.get<ApiResponse<Episode>>('/episode', { params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
};
