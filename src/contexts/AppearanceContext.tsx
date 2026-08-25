import { useEffect, useState, type ReactNode } from "react";
import {
  AppearanceContext,
  type Density,
  type FontSize,
  type ThemePreference,
} from "./appearance-context";

const KEYS = {
  theme: "theme",
  density: "appearance-density",
  animations: "appearance-animations",
  achievementEffects: "appearance-achievement-effects",
  fontSize: "appearance-font-size",
};

const systemPrefersDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

function readBoolean(key: string, fallback: boolean): boolean {
  const saved = localStorage.getItem(key);
  return saved === null ? fallback : saved === "true";
}

/**
 * Preferências de aparência/acessibilidade -- device-específicas de
 * propósito (localStorage, não sincronizadas com o servidor), mesmo
 * raciocínio que já valia pro dark mode antes desta tela existir: são
 * ajustes de como ESTA tela é exibida neste dispositivo, não dado
 * financeiro do usuário. Um Provider só, no topo do app, pra qualquer
 * componente (o botão rápido no cabeçalho E a aba Aparência do Perfil)
 * ler/escrever o mesmo estado, em vez de cada um ter sua própria cópia
 * desincronizada.
 */
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem(KEYS.theme);
    return saved === "dark" || saved === "light" || saved === "system" ? saved : "system";
  });
  const [resolvedDark, setResolvedDark] = useState(() => (theme === "system" ? systemPrefersDark() : theme === "dark"));
  const [density, setDensity] = useState<Density>(() => (localStorage.getItem(KEYS.density) === "compact" ? "compact" : "comfortable"));
  const [animationsEnabled, setAnimationsEnabled] = useState(() => readBoolean(KEYS.animations, true));
  const [achievementEffectsEnabled, setAchievementEffectsEnabled] = useState(() =>
    readBoolean(KEYS.achievementEffects, true)
  );
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem(KEYS.fontSize);
    return saved === "small" || saved === "large" ? saved : "medium";
  });

  useEffect(() => {
    localStorage.setItem(KEYS.theme, theme);

    (() => {
      if (theme !== "system") {
        setResolvedDark(theme === "dark");
        return;
      }
      setResolvedDark(systemPrefersDark());
    })();

    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedDark);
  }, [resolvedDark]);

  useEffect(() => {
    localStorage.setItem(KEYS.density, density);
    document.documentElement.classList.toggle("density-compact", density === "compact");
  }, [density]);

  useEffect(() => {
    localStorage.setItem(KEYS.animations, String(animationsEnabled));
    document.documentElement.classList.toggle("motion-reduced", !animationsEnabled);
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem(KEYS.achievementEffects, String(achievementEffectsEnabled));
    document.documentElement.classList.toggle("achievements-effects-off", !achievementEffectsEnabled);
  }, [achievementEffectsEnabled]);

  useEffect(() => {
    localStorage.setItem(KEYS.fontSize, fontSize);
    document.documentElement.classList.remove("text-size-small", "text-size-large");
    if (fontSize !== "medium") document.documentElement.classList.add(`text-size-${fontSize}`);
  }, [fontSize]);

  return (
    <AppearanceContext.Provider
      value={{
        theme,
        setTheme,
        resolvedDark,
        density,
        setDensity,
        animationsEnabled,
        setAnimationsEnabled,
        achievementEffectsEnabled,
        setAchievementEffectsEnabled,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}
