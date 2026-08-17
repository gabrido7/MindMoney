import { useState, type ReactNode } from "react";
import Icon from "./Icon";
import Button from "./Button";

export default function Sidebar({
  darkMode,
  onToggleDarkMode,
  monthControl,
  actions,
}: {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  monthControl: ReactNode;
  actions: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="wallet" size={20} />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Mind Money
        </span>
      </div>

      {monthControl}

      <div className="flex flex-col gap-2">{actions}</div>

      <div className="mt-auto">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onToggleDarkMode}
        >
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
          {darkMode ? "Modo Claro" : "Modo Escuro"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Mind Money
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="p-2 text-gray-600 dark:text-gray-300"
        >
          <Icon name="menu" size={22} />
        </button>
      </div>

      <aside className="hidden md:block md:w-72 md:shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
        {content}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-72 bg-white dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="p-2 text-gray-500"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
