import { NavLink, Outlet } from "react-router-dom";
import Icon from "../components/ui/Icon";
import LogoMark from "../components/ui/LogoMark";
import { useAuth } from "../hooks/useAuth";
import NotificationBell from "../features/notifications/components/NotificationBell";
import LevelPill from "../features/gamification/components/LevelPill";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/metas", label: "Metas" },
  { to: "/relatorios", label: "Relatórios" },
  { to: "/educacao-financeira", label: "Educação Financeira" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 md:px-8 py-3">
        <div className="flex items-center gap-2">
          <LogoMark size={32} />
          <span className="font-bold text-gray-900 dark:text-white">Mind Money</span>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LevelPill />
          <NotificationBell />
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-green-700 dark:text-green-300" : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            {user?.name}
          </NavLink>
          <button
            onClick={logout}
            aria-label="Sair"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
