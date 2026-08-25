import { useAppearance } from "./useAppearance";

/**
 * Atalho binário, usado pelo botão de sol/lua no cabeçalho (AppLayout).
 * Alternar aqui sempre define um tema explícito (claro/escuro), nunca
 * "sistema" -- pra voltar em "acompanhar o sistema" o controle fica na
 * aba Aparência do Perfil (useAppearance().setTheme("system")).
 */
export function useDarkMode() {
  const { resolvedDark, setTheme } = useAppearance();
  const setDarkMode = (updater: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof updater === "function" ? updater(resolvedDark) : updater;
    setTheme(next ? "dark" : "light");
  };
  return [resolvedDark, setDarkMode] as const;
}
