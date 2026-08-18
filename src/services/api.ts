import { getToken, setToken, clearToken, getRefreshToken, setRefreshToken, clearRefreshToken } from "../utils/token";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Chamado quando a sessão realmente não pode mais continuar (refresh
 * token ausente/expirado/revogado — não só um access token vencido, que
 * agora é renovado silenciosamente). AuthContext registra um handler
 * aqui para limpar o usuário e deixar o ProtectedRoute redirecionar.
 */
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

type QueryParams = object;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: QueryParams;
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(BASE_URL + path);
  if (query) {
    Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

// Rotas cujo 401 é uma resposta de negócio de verdade (credencial errada,
// token de renovação inválido) -- nunca deve disparar uma tentativa de
// renovação silenciosa nem o handler global de "sessão expirada".
const AUTH_ENTRY_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

function endSession() {
  clearToken();
  clearRefreshToken();
  unauthorizedHandler?.();
}

/**
 * Renova o access token usando o refresh token guardado. Compartilhada
 * entre chamadas simultâneas (uma única renovação em voo por vez) --
 * sem isso, várias requisições expirando ao mesmo tempo disparariam
 * várias renovações em paralelo e, como o refresh token rotaciona a
 * cada uso, todas menos a última acabariam invalidadas.
 */
let refreshInFlight: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("Sem refresh token salvo.");

      const response = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Falha ao renovar a sessão.");

      const data = await response.json();
      setToken(data.token);
      setRefreshToken(data.refreshToken);
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/** Serviço centralizado de API: base URL por env, token automático, renovação silenciosa em 401, erros normalizados em ApiError. */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
  _isRetry = false
): Promise<T> {
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const isRetryable =
      response.status === 401 &&
      !_isRetry &&
      !AUTH_ENTRY_PATHS.includes(path) &&
      Boolean(getRefreshToken());

    if (isRetryable) {
      try {
        await refreshSession();
        return apiRequest<T>(path, options, true);
      } catch {
        endSession();
        throw new ApiError("Sessão expirada. Faça login novamente.", 401);
      }
    }

    if (response.status === 401 && !AUTH_ENTRY_PATHS.includes(path)) {
      endSession();
    }

    const message = data?.error?.message ?? "Erro inesperado. Tente novamente.";
    throw new ApiError(message, response.status, data?.error?.details);
  }

  return data as T;
}
