import { useCallback, useEffect, useState, type ReactNode } from "react";
import Icon from "./Icon";
import { ToastContext, type ToastVariant } from "../../contexts/toast-context";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const DURATION_MS: Record<ToastVariant, number> = {
  success: 3500,
  celebration: 5000,
};

let nextToastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = ++nextToastId;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), DURATION_MS[variant]);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2 max-w-sm w-[calc(100%-3rem)] sm:w-auto">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const isCelebration = toast.variant === "celebration";

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="status"
      className={`transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
      }`}
    >
      <div
        className={`flex items-start gap-3 rounded-2xl border shadow-card-lg p-4 bg-surface ${
          isCelebration ? "border-warning" : "border-brand"
        }`}
      >
        {!isCelebration && (
          <span className="mt-0.5 shrink-0 text-brand">
            <Icon name="check" size={16} />
          </span>
        )}
        <p className="text-sm font-medium text-ink flex-1">{toast.message}</p>
        <button
          onClick={close}
          aria-label="Fechar"
          className="text-ink-soft hover:text-ink shrink-0"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
