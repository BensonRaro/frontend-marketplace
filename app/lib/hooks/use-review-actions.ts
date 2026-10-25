// useReviewActions — authors edit/delete their ratings (contract page + client sheet)
import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { Review } from "@/lib/hooks/use-reviews";

// Ratings feed summaries, contract lists, client sheet status and public profiles
function invalidateReviewData(qc: QueryClient) {
  for (const key of [["rating"], ["contract-reviews"], ["client-review-status"], ["user-profile"]]) {
    qc.invalidateQueries({ queryKey: key });
  }
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation<{ data: Review }, unknown, { reviewId: string; rating: number; comment?: string }>({
    mutationFn: async ({ reviewId, ...body }) => {
      const { data } = await api.patch<{ data: Review }>(`/api/reviews/${reviewId}`, body);
      return data;
    },
    onSuccess: () => {
      invalidateReviewData(qc);
      toast.success("Review updated");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation<{ data: { id: string } }, unknown, string>({
    mutationFn: async (reviewId) => {
      const { data } = await api.delete<{ data: { id: string } }>(`/api/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      invalidateReviewData(qc);
      toast.success("Review deleted");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
