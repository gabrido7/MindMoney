import { Link, Outlet } from "react-router-dom";
import LogoMark from "../components/ui/LogoMark";
import AuthShowcase from "../features/auth/components/AuthShowcase";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <div className="flex w-full flex-col px-6 py-10 sm:px-12 lg:w-[480px] lg:shrink-0 lg:px-16 lg:py-14">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={40} />
          <span className="font-display text-lg font-semibold text-white">Mind Money</span>
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
