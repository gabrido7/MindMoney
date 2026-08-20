import { useContext } from "react";
import { ToastContext, type ToastContextValue } from "../contexts/toast-context";

/** Dispara toasts a partir de qualquer componente dentro de <ToastProvider>. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast precisa estar dentro de um <ToastProvider>.");
  return context;
}
