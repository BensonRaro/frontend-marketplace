// AdminUsersPage — user directory: search, role/status filters, moderation actions
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Users } from "lucide-react";
import { useAdminUsers, type AdminUser } from "@/lib/hooks/use-admin";
import { useBanUser, useUnbanUser } from "@/lib/hooks/use-admin-actions";
import { AdminUsersTable } from "./components/admin-users-table";
import { AdminUsersToolbar } from "./components/admin-users-toolbar";
import { AdminBanDialog } from "./components/admin-ban-dialog";
import { AdminPaginationFooter } from "./components/admin-pagination-footer";
import type { Route } from "./+types/users";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Users — Admin" }];
}

export default function AdminUsersPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const role = params.get("role") ?? "";
  const status = params.get("status") ?? "";
  const page = Math.max(Number(params.get("page") ?? 1) || 1, 1);

  const { data, isLoading, isError } = useAdminUsers({ search: q, role: role || undefined, status: status || undefined, page });
  const pagination = data?.pagination;

  const ban = useBanUser();
  const unban = useUnbanUser();
  const [target, setTarget] = useState<AdminUser | null>(null);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  const closeDialog = () => {
    setTarget(null);
    ban.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-zinc-500">Every account on the platform — clients, freelancers and admins.</p>
      </div>

      <AdminUsersToolbar
        search={q}
        role={role}
        status={status}
        total={pagination?.total}
        onSearch={(v) => setParam("q", v)}
        onRole={(v) => setParam("role", v)}
        onStatus={(v) => setParam("status", v)}
      />

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl border border-zinc-100 bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Failed to load users</p>
          <p className="text-xs text-red-500">Please try again later.</p>
        </div>
      ) : data?.data.length ? (
        <>
          <AdminUsersTable users={data.data} onBan={setTarget} onUnban={(u) => unban.mutate(u.id)} />
          {pagination && pagination.totalPages > 1 ? (
            <AdminPaginationFooter page={pagination.page} totalPages={pagination.totalPages} onPage={(p) => setParam("page", String(p))} />
          ) : null}
        </>
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium">No users found</p>
          <p className="mt-1 text-xs text-zinc-500">Try a different search, role or status filter.</p>
        </div>
      )}

      <AdminBanDialog
        user={target}
        open={!!target}
        pending={ban.isPending}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={(reason) => {
          if (!target) return;
          ban.mutate(
            { id: target.id, reason },
            { onSuccess: closeDialog },
          );
        }}
      />
    </div>
  );
}
