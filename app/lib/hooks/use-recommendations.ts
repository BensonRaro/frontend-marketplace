// useRecommendations — AI shortlist for one client job, polled while a run is in flight
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { RecommendationBoard } from "@/types";
import { getJobError } from "./use-jobs";

const POLL_MS = 4000;
const MAX_POLLS = 15; // ~1 minute — stop polling when the background run failed

export function useRecommendations(jobId: string) {
  const polls = useRef(0);
  return useQuery<RecommendationBoard>({
    queryKey: ["recommendations", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const { data } = await api.get<{ data: RecommendationBoard }>(`/api/job-postings/${jobId}/recommendations`);
      return data.data;
    },
    // Poll only while bids remain unscored, and only for a bounded time
    refetchInterval: (query) => {
      const board = query.state.data;
      if (!board || board.total === 0 || board.analyzed >= board.total) {
        polls.current = 0;
        return false;
      }
      return polls.current++ < MAX_POLLS ? POLL_MS : false;
    },
  });
}

type QueueResult = { data: { jobId: string; queued: boolean; total: number } };

// Ask the backend to re-run the analysis (Inngest picks it up and scores in the background)
export function useRequestRecommendations(jobId: string) {
  const qc = useQueryClient();
  return useMutation<QueueResult, unknown, void>({
    mutationFn: async () => {
      const { data } = await api.post<QueueResult>(`/api/job-postings/${jobId}/recommendations`);
      return data;
    },
    onSuccess: () => {
      toast.success("Analysing proposals — the shortlist updates in a moment");
      qc.invalidateQueries({ queryKey: ["recommendations", jobId] });
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
