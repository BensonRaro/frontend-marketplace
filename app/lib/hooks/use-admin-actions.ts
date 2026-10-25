// Admin mutations — suspend / restore accounts + admin's own profile update
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";

// Suspend an account — the reason is shown to the user and logged for audit
export function useBanUser() {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, { id: string; reason: string }>({
    mutationFn: async ({ id, reason }) => {
      await api.patch(`/api/admin/users/${id}/ban`, { reason });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Account suspended");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

// Restore an account — all write access returns immediately
export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: async (id) => {
      await api.patch(`/api/admin/users/${id}/unban`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Account restored");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

// Admin account basics — name + avatar
export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation<{ data: { id: string; name: string | null; image: string | null } }, unknown, { name?: string; image?: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.patch<{ data: { id: string; name: string | null; image: string | null } }>("/api/users/me", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session"] });
      toast.success("Profile updated");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
