import { useContext } from "react";
import { AppearanceContext } from "../contexts/appearance-context";

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance precisa estar dentro de um <AppearanceProvider>.");
  return context;
}
