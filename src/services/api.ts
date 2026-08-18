import { getToken, clearToken } from "../utils/token";

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
 * Chamado sempre que qualquer requisição recebe 401 — token ausente,
 * inválido ou expirado. AuthContext registra um handler aqui para limpar
 * o usuário da sessão e deixar o ProtectedRoute redirecionar para o
 * login, mesmo quando o 401 acontece no meio do uso (não só ao carregar).
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

/** Serviço centralizado de API: base URL por env, token automático, erros normalizados em ApiError. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
    if (response.status === 401) {
      clearToken();
      unauthorizedHandler?.();
    }
    const message = data?.error?.message ?? "Erro inesperado. Tente novamente.";
    throw new ApiError(message, response.status, data?.error?.details);
  }

  return data as T;
}
