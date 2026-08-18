import { Outlet } from "react-router-dom";
import Icon from "../components/ui/Icon";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
          <Icon name="wallet" size={20} />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">Mind Money</span>
      </div>

      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
