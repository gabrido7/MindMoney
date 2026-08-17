import { useEffect, useState } from "react";

/**
 * Lê/escreve um valor em localStorage com segurança: JSON corrompido ou em formato
 * inesperado cai no valor padrão em vez de quebrar a aplicação no carregamento.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  isValid?: (value: unknown) => value is T
) {
  const [state, setState] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    try {
      const parsed = JSON.parse(raw);
      if (isValid && !isValid(parsed)) return defaultValue;
      return parsed as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage indisponível/cheio: falha silenciosa, estado em memória continua válido
    }
  }, [key, state]);

  return [state, setState] as const;
}
