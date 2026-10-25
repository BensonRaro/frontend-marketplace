// useClientReviews — freelancer → client review status + submit (client details sheet)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { Review } from "@/lib/hooks/use-reviews";

export type ClientReviewStatus = { canReview: boolean; hasReviewed: boolean };

// Eligibility is server-derived: completed contract required, one review per contract
export function useClientReviewStatus(clientId: string, enabled = true) {
  return useQuery<{ data: ClientReviewStatus }>({
    queryKey: ["client-review-status", clientId],
    queryFn: async () => {
      const { data } = await api.get<{ data: ClientReviewStatus }>(`/api/users/${clientId}/review-status`);
      return data;
    },
    enabled: !!clientId && enabled,
    retry: false,
  });
}

export function useCreateClientReview(clientId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Review }, string, { rating: number; comment?: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: Review }>(`/api/users/${clientId}/reviews`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rating"] });
      qc.invalidateQueries({ queryKey: ["user-profile", clientId] });
      qc.invalidateQueries({ queryKey: ["client-review-status", clientId] });
      toast.success("Client review posted");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
