import { useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { getToken, setToken, clearToken } from "../utils/token";
import { setUnauthorizedHandler } from "../services/api";
import type { PublicUser } from "../types/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  // só precisa validar no carregamento se já existir um token salvo;
  // sem token, não há nada assíncrono a esperar.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    // qualquer 401 (token ausente, inválido, expirado) em qualquer chamada
    // da API derruba a sessão local — o ProtectedRoute cuida do redirect.
    setUnauthorizedHandler(() => setUser(null));

    const token = getToken();
    if (!token) return;

    authService
      .me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register({ name, email, password });
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
