import api from "./api";

export interface FavoriteLocation {
  _id: string;
  name: string;
  city?: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface SaveFavoriteData {
  name: string;
  city?: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface SearchHistoryItem {
  _id: string;
  query: {
    city: string;
    coordinates: [number, number];
  };
  searchedAt: string;
}

export async function getFavorites() {
  const response = await api.get<FavoriteLocation[]>("/locations/favorites");
  return response.data;
}

export async function saveFavorite(data: SaveFavoriteData) {
  const response = await api.post<FavoriteLocation>(
    "/locations/favorites",
    data
  );
  return response.data;
}

export async function getHistory() {
  const response = await api.get<SearchHistoryItem[]>("/locations/history");
  return response.data;
}
