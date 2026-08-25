import { createContext } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";
export type FontSize = "small" | "medium" | "large";

export interface AppearanceContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  /** "sistema" já resolvido pro booleano de fato aplicado na tela. */
  resolvedDark: boolean;

  density: Density;
  setDensity: (density: Density) => void;

  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;

  achievementEffectsEnabled: boolean;
  setAchievementEffectsEnabled: (enabled: boolean) => void;

  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const AppearanceContext = createContext<AppearanceContextValue | null>(null);
