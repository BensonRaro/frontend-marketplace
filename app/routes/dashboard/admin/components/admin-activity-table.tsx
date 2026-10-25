// AdminActivityTable — audit trail rows (actor, action, entity, before → after)
import type { AdminActivity } from "@/lib/hooks/use-admin-activity";

// Compact before → after summary: only keys present in both snapshots
function context(before: unknown, after: unknown) {
  if (!after || typeof after !== "object") return null;
  const a = after as Record<string, unknown>;
  const b = (before && typeof before === "object" ? before : {}) as Record<string, unknown>;
  const parts = Object.keys(a)
    .filter((k) => k in b && JSON.stringify(b[k]) !== JSON.stringify(a[k]))
    .slice(0, 3)
    .map((k) => `${k}: ${JSON.stringify(b[k])} → ${JSON.stringify(a[k])}`);
  return parts.length ? parts.join(" • ") : null;
}

export function AdminActivityTable({ logs }: { logs: AdminActivity[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
            <th className="px-4 py-3">Changes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {logs.map((l) => {
            const change = context(l.before, l.after);
            return (
              <tr key={l.id} className="transition hover:bg-zinc-50/60">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {l.actor?.image ? (
                      <img src={l.actor.image} alt={l.actor.name ?? "actor"} className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">{(l.actor?.name ?? "S").slice(0, 2).toUpperCase()}</span>
                    )}
                    <span className="truncate text-xs font-medium">{l.actor?.name ?? "System"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <code className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">{l.action}</code>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {l.entity}
                  <span className="ml-1 text-zinc-400">#{l.entityId.slice(-6)}</span>
                </td>
                <td className="max-w-[260px] px-4 py-3 text-[11px] text-zinc-500">
                  {change ? <span className="line-clamp-2">{change}</span> : <span className="text-zinc-300">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
