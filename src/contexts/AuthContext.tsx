import { useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { getToken, setToken, clearToken, getRefreshToken, setRefreshToken, clearRefreshToken } from "../utils/token";
import { setUnauthorizedHandler } from "../services/api";
import type { PublicUser } from "../types/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  // só precisa validar no carregamento se já existir um token salvo;
  // sem token, não há nada assíncrono a esperar.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    // Só dispara quando o refresh token também falhou (sessão de verdade
    // encerrada) — um access token vencido sozinho é renovado
    // silenciosamente por apiRequest, sem passar por aqui.
    setUnauthorizedHandler(() => setUser(null));

    const token = getToken();
    if (!token) return;

    authService
      .me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        clearToken();
        clearRefreshToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    setToken(result.token);
    setRefreshToken(result.refreshToken);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register({ name, email, password });
    setToken(result.token);
    setRefreshToken(result.refreshToken);
    setUser(result.user);
  };

  const logout = () => {
    const refreshToken = getRefreshToken();
    clearToken();
    clearRefreshToken();
    setUser(null);
    // Revogação real no servidor, em segundo plano -- não bloqueia a UI
    // (o usuário já está deslogado localmente) e não deveria falhar o
    // logout se o servidor estiver fora do ar.
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
