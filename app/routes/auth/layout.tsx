// Auth layout — blocks logged-in users from /login, /signup, /register (but not /auth/error)
import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "@/lib/hooks/use-session";

export default function AuthLayout() {
  const { data: session, isLoading } = useSession();
  const loc = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f0f2f3]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }

  // Allow error page even when logged in
  if (loc.pathname === "/auth/error") return <Outlet />;

  if (session?.user) return <Navigate to="/" replace />;

  return <Outlet />;
}
