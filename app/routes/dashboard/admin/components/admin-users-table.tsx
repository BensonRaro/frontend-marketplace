// AdminUsersTable — directory table (identity, role, verification, activity, status, actions)
import type { AdminUser } from "@/lib/hooks/use-admin";
import { AdminUserRow } from "./admin-user-row";

type Props = {
  users: AdminUser[];
  onBan: (user: AdminUser) => void;
  onUnban: (user: AdminUser) => void;
};

export function AdminUsersTable({ users, onBan, onUnban }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3">Activity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {users.map((u) => (
            <AdminUserRow key={u.id} user={u} onBan={onBan} onUnban={onUnban} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
