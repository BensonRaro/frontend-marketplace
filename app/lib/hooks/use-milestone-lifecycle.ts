// useMilestoneLifecycle — submit (freelancer), dispute + approve-release (client)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";

function useLifecycle(path: "submit" | "dispute" | "approve", success: string) {
  const qc = useQueryClient();
  // Approve returns { milestone, transferId, fee } — payload unused, only status matters
  return useMutation<{ data: unknown }, string, { id: string; reason?: string }>({
    mutationFn: async ({ id, reason }) => {
      const { data } = await api.post<{ data: unknown }>(`/api/milestones/${id}/${path}`, reason ? { reason } : {});
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-contracts"] });
      toast.success(success);
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useDisputeMilestone() {
  return useLifecycle("dispute", "Milestone disputed — release frozen");
}

// Submit carries deliverables (file URLs +/or links) + optional note
export function useSubmitMilestone() {
  const qc = useQueryClient();
  return useMutation<{ data: unknown }, string, { id: string; deliverables: string[]; note?: string }>({
    mutationFn: async ({ id, deliverables, note }) => {
      const { data } = await api.post<{ data: unknown }>(`/api/milestones/${id}/submit`, { deliverables, note: note || undefined });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-contracts"] });
      toast.success("Work submitted — client will review");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useApproveMilestone() {
  return useLifecycle("approve", "Approved — funds released to freelancer");
}
