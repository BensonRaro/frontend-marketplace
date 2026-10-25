// AdminRecentActivity — latest audit entries on the admin dashboard
import { Link } from "react-router";
import { useAdminActivityLogs } from "@/lib/hooks/use-admin-activity";

export function AdminRecentActivity() {
  const { data, isLoading, isError } = useAdminActivityLogs({ page: 1, limit: 8 });
  const logs = data?.data ?? [];

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
        <Link to="/dashboard/admin/activity-logs" className="cursor-pointer text-xs font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-zinc-50" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-6 text-center text-sm text-red-500">Couldn't load activity.</p>
      ) : logs.length ? (
        <ul className="divide-y divide-zinc-50">
          {logs.map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-900 text-[10px] font-bold text-white">
                {(l.actor?.name ?? "S").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <span className="font-medium">{l.actor?.name ?? "System"}</span>
                  <span className="text-zinc-500"> · {l.action}</span>
                </p>
                <p className="truncate text-[11px] text-zinc-400">{l.entity}</p>
              </div>
              <span className="shrink-0 text-[11px] text-zinc-400">{new Date(l.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-zinc-500">No activity recorded yet.</p>
      )}
    </section>
  );
}
