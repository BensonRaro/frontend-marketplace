// Client layout — wraps all /dashboard/client/* with sidebar + guards (light-only, Indigo)
import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router";
import { Menu, Search } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useOnboardingStatus } from "@/lib/hooks/use-onboarding";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { useSignout } from "@/lib/hooks/use-signout";
import { useLiveUpdates } from "@/lib/hooks/use-live-updates";
import { ClientSidebar } from "./components/sidebar";
import { VerifiedBadge } from "@/components/globals/feedback/verified-badge";
import { NotificationBell } from "@/components/globals/feedback/notification-bell";
import { SuspendedScreen } from "@/components/globals/feedback/suspended-screen";

export default function ClientLayout() {
  const nav = useNavigate();
  const { data: session, isLoading: sLoading } = useSession();
  const { data: status } = useOnboardingStatus();
  const { verified } = useIsVerified();
  const out = useSignout();
  const [open, setOpen] = useState(false);
  useLiveUpdates();

  const role = session?.user.role;
  const completed = status?.onboardingCompleted ?? (session?.user as unknown as { onboardingCompleted?: boolean })?.onboardingCompleted;
  const banned = !!session?.user.isBanned;

  useEffect(() => {
    if (!sLoading && !session?.user) nav("/login", { replace: true });
    else if (!sLoading && session?.user && role === "freelancer") nav("/dashboard/freelancer", { replace: true });
    else if (!sLoading && session?.user && role !== "client" && role !== "admin") nav("/", { replace: true });
    else if (session?.user && role === "client" && completed === false && !banned) nav("/onboarding", { replace: true });
  }, [sLoading, session, role, completed, banned, nav]);

  if (sLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
      </div>
    );
  }
  if (!session?.user) return null;
  if (role !== "client" && role !== "admin") return null;
  // Suspended accounts see the reason instead of the dashboard (writes are blocked server-side too)
  if (banned) return <SuspendedScreen reason={session.user.banReason ?? null} onSignOut={() => out.mutate()} />;
  if (completed === false && role === "client") return null;

  return (
    <div className="min-h-screen bg-surface">
      <ClientSidebar open={open} onClose={() => setOpen(false)} />

      {/* Header — lighter border + shadow, offset for floating sidebar */}
      <header className="sticky top-0 z-20 flex h-[64px] items-center gap-4 border-b border-zinc-100 bg-white/80 px-4 backdrop-blur lg:ml-[300px] lg:px-6">
        <button onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm lg:hidden">
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 shadow-sm lg:flex">
          <Search className="h-4 w-4 text-zinc-400" />
          <input placeholder="Search jobs, proposals…" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />

          <div className="hidden items-center gap-3 border-l border-zinc-100 pl-3 sm:flex">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-medium leading-none">
                {session.user.name ?? session.user.email} {verified ? <VerifiedBadge size={12} /> : null}
              </div>
              <div className="text-xs capitalize text-zinc-500">{session.user.role} {verified ? "• Verified" : "• Unverified"}</div>
            </div>
            <div className="relative">
              {session.user.image ? (
                <img src={session.user.image} alt="avatar" className="h-9 w-9 rounded-xl object-cover border border-zinc-100 shadow-sm" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-xs font-bold text-white">{(session.user.name ?? "C").slice(0, 2).toUpperCase()}</span>
              )}
              {verified ? <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-white ring-2 ring-white"><VerifiedBadge size={10} className="bg-primary" /></span> : null}
            </div>
          </div>

          <button onClick={() => out.mutate()} className="hidden rounded-xl border border-zinc-100 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-zinc-50 sm:block">
            Sign out
          </button>
        </div>
      </header>

      {/* Content — offset for floating sidebar */}
      <main className="px-4 py-6 lg:ml-[300px] lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
