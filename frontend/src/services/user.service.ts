import api from "./api";

export interface UserProfile {
  _id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  lastLogin?: string;
}

export interface SportPreference {
  name: string;
  temperatureMin: number;
  temperatureMax: number;
  humidityMax: number;
  windMax: number;
  uvMax: number;
}

export interface UserPreferences {
  sports: SportPreference[];
}

export async function getProfile() {
  const response = await api.get<UserProfile>("/users/profile");
  return response.data;
}

export async function updatePreferences(preferences: UserPreferences) {
  const response = await api.put<UserPreferences>(
    "/users/preferences",
    preferences
  );
  return response.data;
}
