import { Link, Outlet } from "react-router-dom";
import Icon from "../components/ui/Icon";
import AuthShowcase from "../features/auth/components/AuthShowcase";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <div className="flex w-full flex-col px-6 py-10 sm:px-12 lg:w-[480px] lg:shrink-0 lg:px-16 lg:py-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-neutral-950">
            <Icon name="wallet" size={20} />
          </div>
          <span className="text-lg font-bold text-white">Mind Money</span>
        </Link>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <AuthShowcase />
      </div>
    </div>
  );
}
