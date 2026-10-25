// useProposals — freelancer submit/withdraw + own list + client inbox
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError, type JobProposal } from "@/lib/hooks/use-jobs";

export type MyProposal = JobProposal & {
  createdAt: string;
  job: { id: string; title: string; budget: number; budgetType: "fixed" | "hourly"; isOpen: boolean; client: { name: string | null } };
};

export type ClientProposal = JobProposal & {
  createdAt: string;
  job: { id: string; title: string; isOpen: boolean };
};

export type CreateProposalPayload = { jobId: string; coverLetter: string; bidAmount: number; duration?: number };

export function useMyProposals() {
  return useQuery<{ data: MyProposal[] }>({
    queryKey: ["my-proposals"],
    queryFn: async () => {
      const { data } = await api.get<{ data: MyProposal[] }>("/api/proposals/mine");
      return data;
    },
  });
}

export function useCreateProposal(jobId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: JobProposal }, string, Omit<CreateProposalPayload, "jobId">>({
    mutationFn: async (payload) => {
      const { data } = await api.post<{ data: JobProposal }>("/api/proposals", { ...payload, jobId });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-proposals"] });
      qc.invalidateQueries({ queryKey: ["job", jobId] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Proposal sent — the client has been notified");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useWithdrawProposal() {
  const qc = useQueryClient();
  return useMutation<{ data: { id: string } }, string, string>({
    mutationFn: async (id) => {
      const { data } = await api.delete<{ data: { id: string } }>(`/api/proposals/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-proposals"] });
      toast.success("Proposal withdrawn");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}

export function useClientProposals() {
  return useQuery<{ data: ClientProposal[] }>({
    queryKey: ["client-proposals"],
    queryFn: async () => {
      const { data } = await api.get<{ data: ClientProposal[] }>("/api/proposals/client/mine");
      return data;
    },
  });
}
