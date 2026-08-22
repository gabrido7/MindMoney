import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Icon from "../components/ui/Icon";
import NotificationBell from "../features/notifications/components/NotificationBell";
import LevelPill from "../features/gamification/components/LevelPill";
import SearchDropdown from "../features/search/components/SearchDropdown";
import { useDarkMode } from "../hooks/useDarkMode";

export default function AppLayout() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-2 border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 md:px-8">
          <SearchDropdown />
          <LevelPill />
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            title={darkMode ? "Modo claro" : "Modo escuro"}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Icon name={darkMode ? "sun" : "moon"} size={18} />
          </button>
          <NotificationBell />
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
