import { useState, useCallback, type ReactNode } from "react";
import * as authService from "../services/auth.service";
import { AuthContext, type User, type RegisterOptions } from "./auth-context";

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem("@skyrunner:user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("@skyrunner:token"));
  const [user, setUser] = useState<User | null>(readStoredUser);

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
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
