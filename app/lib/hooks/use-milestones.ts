// useMilestones — job milestone CRUD + Stripe escrow funding (client)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { Milestone, MilestoneDraft, EscrowQuote } from "@/types";

export function useJobMilestones(jobId: string) {
  return useQuery<{ data: Milestone[] }>({
    queryKey: ["job-milestones", jobId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Milestone[] }>(`/api/job-postings/${jobId}/milestones`);
      return data;
    },
    enabled: !!jobId,
  });
}

export function useCreateMilestone(jobId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Milestone }, string, MilestoneDraft>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: Milestone }>(`/api/job-postings/${jobId}/milestones`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-milestones", jobId] });
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
      toast.success("Milestone added — fund it to lock escrow");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useDeleteMilestone(jobId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Milestone }, string, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete<{ data: Milestone }>(`/api/milestones/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-milestones", jobId] });
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
      toast.success("Milestone removed");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

// Fund a whole fixed job — redirect to Stripe Checkout, webhook confirms escrow
export function useFundJob() {
  return useMutation<{ data: { url: string; jobId: string; quote: EscrowQuote } }, string, string>({
    mutationFn: async (jobId) => {
      const { data } = await api.post<{ data: { url: string; jobId: string; quote: EscrowQuote } }>(`/api/job-postings/${jobId}/fund`);
      return data;
    },
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

// Fund via Stripe Checkout — redirect to hosted payment, webhook confirms escrow
export function useFundMilestone() {
  return useMutation<{ data: { url: string; milestoneId: string; quote: EscrowQuote } }, string, string>({
    mutationFn: async (milestoneId) => {
      const { data } = await api.post<{ data: { url: string; milestoneId: string; quote: EscrowQuote } }>(`/api/milestones/${milestoneId}/fund`);
      return data;
    },
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

// Client creates the next milestone mid-contract — fund it to unlock submission
export function useCreateContractMilestone(contractId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Milestone }, string, MilestoneDraft>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: Milestone }>(`/api/contracts/${contractId}/milestones`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-contracts"] });
      toast.success("Milestone added — fund it to lock escrow");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
