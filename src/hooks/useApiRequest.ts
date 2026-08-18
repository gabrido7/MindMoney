import { useEffect, useState } from "react";
import { ApiError } from "../services/api";

/** Padrão reutilizável de loading/erro/dados para telas que buscam algo da API ao montar. */
export function useApiRequest<T>(request: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await request();
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : "Erro inesperado.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
