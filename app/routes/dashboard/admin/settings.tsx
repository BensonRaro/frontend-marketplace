// AdminSettingsPage — admin account + read-only platform configuration
import { useAdminStats } from "@/lib/hooks/use-admin";
import { useSession } from "@/lib/hooks/use-session";
import { money } from "@/components/globals/job/job-detail";
import { AdminSettingsForm } from "./components/admin-settings-form";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings — Admin" }];
}

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useAdminStats();
  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500">Your admin account and the platform configuration it runs on.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Your account</h2>
          <AdminSettingsForm />
        </section>

        <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold tracking-tight">Platform</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-50" />
              ))}
            </div>
          ) : (
            <dl className="divide-y divide-zinc-50 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Signed in as</dt>
                <dd className="font-medium">{session?.user.email ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Role</dt>
                <dd className="font-medium capitalize">{session?.user.role ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Platform fee</dt>
                <dd className="font-medium">{stats?.escrow.feePercent ?? 0}% of escrow</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Escrow held</dt>
                <dd className="font-medium">{money(stats?.escrow.held ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Released to date</dt>
                <dd className="font-medium">{money(stats?.escrow.released ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-zinc-500">Accounts</dt>
                <dd className="font-medium">{stats?.users.total ?? 0}</dd>
              </div>
            </dl>
          )}
          <p className="mt-4 rounded-xl border border-dashed border-zinc-200 px-4 py-3 text-xs text-zinc-500">
            Fee and escrow rules are configured through environment variables — they can’t be edited from the dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
