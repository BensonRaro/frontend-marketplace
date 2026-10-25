// AdminActivityPage — audit trail with action filter + pagination
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ScrollText } from "lucide-react";
import { useAdminActivityLogs } from "@/lib/hooks/use-admin-activity";
import { AdminActivityTable } from "./components/admin-activity-table";
import { AdminPaginationFooter } from "./components/admin-pagination-footer";
import type { Route } from "./+types/activity-logs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Activity Logs — Admin" }];
}

export default function AdminActivityPage() {
  const [params, setParams] = useSearchParams();
  const action = params.get("action") ?? "";
  const page = Math.max(Number(params.get("page") ?? 1) || 1, 1);

  const { data, isLoading, isError } = useAdminActivityLogs({ action: action || undefined, page });
  const pagination = data?.pagination;
  const actions = data?.actions ?? [];

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  // Keep the filter list populated even when a filter narrows the results
  const [knownActions, setKnownActions] = useState<string[]>([]);
  useEffect(() => {
    if (actions.length) setKnownActions((prev) => [...new Set([...prev, ...actions])]);
  }, [actions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity logs</h1>
        <p className="text-sm text-zinc-500">Every sensitive action recorded with actor and context.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={action}
          onChange={(e) => setParam("action", e.target.value)}
          className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900"
        >
          <option value="">All actions</option>
          {knownActions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {pagination ? <span className="text-xs text-zinc-500">{pagination.total} entr{pagination.total === 1 ? "y" : "ies"}</span> : null}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl border border-zinc-100 bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Failed to load activity logs</p>
          <p className="text-xs text-red-500">Please try again later.</p>
        </div>
      ) : data?.data.length ? (
        <>
          <AdminActivityTable logs={data.data} />
          {pagination && pagination.totalPages > 1 ? (
            <AdminPaginationFooter page={pagination.page} totalPages={pagination.totalPages} onPage={(p) => setParam("page", String(p))} />
          ) : null}
        </>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
          <ScrollText className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium">No activity recorded</p>
          <p className="mt-1 text-xs text-zinc-500">Sensitive actions will appear here as they happen.</p>
        </div>
      )}
    </div>
  );
}
