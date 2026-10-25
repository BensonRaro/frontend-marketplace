// useAdmin — admin dashboard data (platform stats + user directory)
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Pagination = { page: number; limit: number; total: number; totalPages: number };

export type AdminStats = {
  users: { total: number; clients: number; freelancers: number; banned: number };
  jobs: { total: number; open: number };
  proposals: { total: number; pending: number };
  contracts: { total: number; completed: number };
  reviews: { total: number };
  escrow: { released: number; held: number; disputed: number; feePercent: number };
  activity: { last24h: number };
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "client" | "freelancer" | "admin";
  onboardingCompleted: boolean;
  stripeVerified: boolean;
  stripePaymentVerified: boolean;
  isBanned: boolean;
  banReason: string | null;
  bannedAt: string | null;
  createdAt: string;
  clientProfile: { company: string | null } | null;
  freelancerProfile: { title: string | null } | null;
  _count: { jobPostings: number; contractsAsClient: number; contractsAsFreelancer: number };
  activeContracts: number;
};

export function useAdminStats() {
  return useQuery<{ data: AdminStats }>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<{ data: AdminStats }>("/api/admin/stats");
      return data;
    },
  });
}

// User directory — search + role/status filter + pagination
export function useAdminUsers(params: { search?: string; role?: string; status?: string; page: number; limit?: number }) {
  const { search, role, status, page, limit = 20 } = params;
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (role) qs.set("role", role);
  if (status) qs.set("status", status);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  return useQuery<{ data: AdminUser[]; pagination: Pagination }>({
    queryKey: ["admin", "users", { search: search ?? "", role: role ?? "", status: status ?? "", page }],
    queryFn: async () => {
      const { data } = await api.get<{ data: AdminUser[]; pagination: Pagination }>(`/api/admin/users?${qs.toString()}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}
