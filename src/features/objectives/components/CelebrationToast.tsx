import { useEffect, useState } from "react";
import Icon from "../../../components/ui/Icon";

const AUTO_DISMISS_MS = 5000;
const EXIT_TRANSITION_MS = 300;

export default function CelebrationToast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, EXIT_TRANSITION_MS);
  };

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setVisible(true));
    const dismissTimer = setTimeout(close, AUTO_DISMISS_MS);
    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 shadow-lg p-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">{message}</p>
        <button
          onClick={close}
          aria-label="Fechar"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}
