// useReviews — post-completion ratings (summaries cached per user, lists per contract)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { RatingSummary } from "@/types";

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  authorId: string;
  targetId: string;
  contractId: string;
  author: { id: string; name: string | null; image: string | null };
  contract?: { job: { title: string } };
};

export function useRatingSummary(userId: string | undefined) {
  return useQuery<{ data: RatingSummary }>({
    queryKey: ["rating", "summary", userId],
    queryFn: async () => {
      const { data } = await api.get<{ data: RatingSummary }>(`/api/users/${userId}/rating`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useUserReviews(userId: string | undefined, limit = 3) {
  return useQuery<{ data: Review[] }>({
    queryKey: ["rating", "reviews", userId, limit],
    queryFn: async () => {
      const { data } = await api.get<{ data: Review[] }>(`/api/users/${userId}/reviews?limit=${limit}`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useContractReviews(contractId: string, enabled = true) {
  return useQuery<{ data: Review[] }>({
    queryKey: ["contract-reviews", contractId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Review[] }>(`/api/contracts/${contractId}/reviews`);
      return data;
    },
    enabled: !!contractId && enabled,
  });
}

export function useCreateReview(contractId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Review }, string, { rating: number; comment?: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: Review }>(`/api/contracts/${contractId}/reviews`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contract-reviews", contractId] });
      qc.invalidateQueries({ queryKey: ["rating"] });
      toast.success("Review submitted");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useCompleteContract() {
  const qc = useQueryClient();
  return useMutation<{ data: { id: string; isCompleted: boolean } }, string, string>({
    mutationFn: async (id) => {
      const { data } = await api.post<{ data: { id: string; isCompleted: boolean } }>(`/api/contracts/${id}/complete`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-contracts"] });
      toast.success("Contract completed — now rate each other");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
