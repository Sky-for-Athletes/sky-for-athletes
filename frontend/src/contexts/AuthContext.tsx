import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import * as authService from "../services/auth.service";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface RegisterOptions {
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
    uvMax: number;
  }>;
  favoriteLocations?: Array<{ name: string }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (opts: RegisterOptions) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("@skyrunner:token");
    const storedUser = localStorage.getItem("@skyrunner:user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    localStorage.setItem("@skyrunner:token", data.token);
    setToken(data.token);
    const decoded = JSON.parse(atob(data.token.split(".")[1]));
    const userData: User = {
      id: decoded.userId,
      email: data.email,
      username: "",
      role: "user",
    };
    localStorage.setItem("@skyrunner:user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(
    async (opts: RegisterOptions) => {
      const data = await authService.register(opts);
      localStorage.setItem("@skyrunner:token", data.token);
      setToken(data.token);
      localStorage.setItem("@skyrunner:user", JSON.stringify(data.user));
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("@skyrunner:token");
    localStorage.removeItem("@skyrunner:user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
