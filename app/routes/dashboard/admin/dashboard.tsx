// Admin dashboard — platform overview (stats + recent activity)
import { useAdminStats } from "@/lib/hooks/use-admin";
import { AdminStatsGrid } from "./components/admin-stats-grid";
import { AdminRecentActivity } from "./components/admin-recent-activity";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Admin Dashboard — TalentHive" }];
}

export default function AdminDashboard() {
  const { data, isLoading, isError } = useAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
        <p className="text-sm text-zinc-500">Users, marketplace activity and escrow at a glance.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-zinc-100 bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Failed to load platform stats</p>
          <p className="text-xs text-red-500">Please try again later.</p>
        </div>
      ) : data ? (
        <>
          <AdminStatsGrid stats={data.data} />
          <AdminRecentActivity />
        </>
      ) : null}
    </div>
  );
}
