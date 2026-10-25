// Admin layout — wraps all /dashboard/admin/* with sidebar + admin-only guard
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router";
import { Menu, Search } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useSignout } from "@/lib/hooks/use-signout";
import { useLiveUpdates } from "@/lib/hooks/use-live-updates";
import { AdminSidebar } from "./components/sidebar";
import { NotificationBell } from "@/components/globals/feedback/notification-bell";

export default function AdminLayout() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { data: session, isLoading: sLoading } = useSession();
  const out = useSignout();
  const [open, setOpen] = useState(false);
  useLiveUpdates();

  const role = session?.user.role;
  const [term, setTerm] = useState(params.get("q") ?? "");

  useEffect(() => {
    setTerm(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    if (!sLoading && !session?.user) nav("/login", { replace: true });
    else if (!sLoading && session?.user && role !== "admin") nav("/", { replace: true });
  }, [sLoading, session, role, nav]);

  if (sLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }
  if (!session?.user) return null;
  if (role !== "admin") return null;

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      {/* Header — offset for the floating sidebar */}
      <header className="sticky top-0 z-20 flex h-[64px] items-center gap-4 border-b border-zinc-100 bg-white/80 px-4 backdrop-blur lg:ml-[300px] lg:px-6">
        <button onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm lg:hidden">
          <Menu className="h-4 w-4" />
        </button>

        {/* Search jumps into the user directory (no dead inputs) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav(`/dashboard/admin/users?q=${encodeURIComponent(term)}`);
          }}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 shadow-sm lg:flex"
        >
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search users by name, email or company…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />

          <div className="hidden items-center gap-3 border-l border-zinc-100 pl-3 sm:flex">
            <div className="text-right">
              <div className="text-sm font-medium leading-none">{session.user.name ?? session.user.email}</div>
              <div className="text-xs capitalize text-zinc-500">Platform admin</div>
            </div>
            {session.user.image ? (
              <img src={session.user.image} alt="avatar" className="h-9 w-9 rounded-xl border border-zinc-100 object-cover shadow-sm" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-xs font-bold text-white">{(session.user.name ?? "A").slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <button onClick={() => out.mutate()} className="hidden rounded-xl border border-zinc-100 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-zinc-50 sm:block">
            Sign out
          </button>
        </div>
      </header>

      {/* Content — offset for the floating sidebar */}
      <main className="px-4 py-6 lg:ml-[300px] lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
