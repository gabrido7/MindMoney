import { createContext } from "react";
import type { PublicUser } from "../types/api";

export interface AuthContextValue {
  user: PublicUser | null;
  /** true enquanto a sessão salva (token no localStorage) ainda está sendo validada no carregamento */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
