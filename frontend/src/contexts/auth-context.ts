import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface RegisterOptions {
  email: string;
  username: string;
  password: string;
  sports?: string[];
  preferencesMode?: "default" | "custom";
  customThresholds?: Array<{
    name: string;
    temperatureMin: number;
    temperatureMax: number;
    humidityMax: number;
    windMax: number;
  }>;
  favoriteLocations?: Array<{ name: string; coordinates?: { lat: number; lon: number } }>;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (opts: RegisterOptions) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
