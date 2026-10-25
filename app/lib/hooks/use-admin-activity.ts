// useAdminActivity — audit trail for the admin activity log page
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Pagination } from "@/lib/hooks/use-admin";

export type AdminActivity = {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string;
  before: unknown;
  after: unknown;
  createdAt: string;
  actor: { id: string; name: string | null; image: string | null; role: string } | null;
};

// Audit trail — action filter + pagination
export function useAdminActivityLogs(params: { action?: string; page: number; limit?: number }) {
  const { action, page, limit = 20 } = params;
  const qs = new URLSearchParams();
  if (action) qs.set("action", action);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  return useQuery<{ data: AdminActivity[]; pagination: Pagination; actions: string[] }>({
    queryKey: ["admin", "activity", { action: action ?? "", page }],
    queryFn: async () => {
      const { data } = await api.get<{ data: AdminActivity[]; pagination: Pagination; actions: string[] }>(`/api/admin/activity-logs?${qs.toString()}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}
