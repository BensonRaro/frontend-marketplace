// SiteHeader — public top bar (logo, browse jobs, session-aware auth actions)
import { Link } from "react-router";
import { useSession } from "@/lib/hooks/use-session";
import { useSignout } from "@/lib/hooks/use-signout";
import { VerifiedBadge } from "@/components/globals/feedback/verified-badge";

export function SiteHeader() {
  const { data: session, isLoading } = useSession();
  const out = useSignout();
  const u = session?.user as unknown as { role?: string; stripeVerified?: boolean; stripePaymentVerified?: boolean } | undefined;
  const verified = u?.role === "client" ? !!u.stripePaymentVerified : u?.role === "freelancer" ? !!u.stripeVerified : false;
  const dashboard = u?.role === "admin" ? "/dashboard/admin" : u?.role === "client" ? "/dashboard/client" : u?.role === "freelancer" ? "/dashboard/freelancer" : "/";

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white">
              <span className="grid grid-cols-2 gap-0.5">
                <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-white/70" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
              </span>
            </span>
            <span className="text-sm font-semibold tracking-tight">TalentHive</span>
          </Link>
          {!session?.user ? (
            <Link to="/jobs" className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:block">
              Browse jobs
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          ) : session?.user ? (
            <>
              <Link to={dashboard} className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:block">
                Dashboard
              </Link>
              <div className="hidden text-right sm:block">
                <div className="flex items-center justify-end gap-1 text-sm font-medium leading-none">{session.user.name ?? session.user.email} {verified ? <VerifiedBadge size={12} /> : null}</div>
                <div className="text-xs capitalize text-zinc-500">{session.user.role} {verified ? "• Verified" : ""} • {session.user.email}</div>
              </div>
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name ?? "avatar"} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
                  {(session.user.name ?? session.user.email ?? "U").slice(0, 2).toUpperCase()}
                </span>
              )}
              <button onClick={() => out.mutate()} disabled={out.isPending} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-zinc-50 disabled:opacity-60">
                {out.isPending ? "..." : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Sign in
              </Link>
              <Link to="/signup" className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
