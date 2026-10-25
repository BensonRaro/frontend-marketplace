// useContracts — accept bids + role-aware inbox (client hires, freelancer gigs)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { getJobError } from "@/lib/hooks/use-jobs";
import type { Milestone } from "@/types";

export type ContractParty = { id: string; name: string | null; image: string | null; isBanned?: boolean };

export type Contract = {
  id: string;
  isCompleted: boolean;
  createdAt: string;
  job: { id: string; title: string; escrowStatus?: string };
  client: ContractParty;
  freelancer: ContractParty;
  milestones: Milestone[];
};

export function useMyContracts() {
  return useQuery<{ data: Contract[] }>({
    queryKey: ["my-contracts"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Contract[] }>("/api/contracts/mine");
      return data;
    },
  });
}

// Accepting creates the contract, rejects the rest, moves milestones, closes the job
export function useAcceptProposal(jobId: string) {
  const qc = useQueryClient();
  return useMutation<{ data: Contract }, string, string>({
    mutationFn: async (proposalId) => {
      const { data } = await api.post<{ data: Contract }>(`/api/proposals/${proposalId}/accept`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job", jobId] });
      qc.invalidateQueries({ queryKey: ["client-jobs"] });
      qc.invalidateQueries({ queryKey: ["client-proposals"] });
      qc.invalidateQueries({ queryKey: ["my-proposals"] });
      qc.invalidateQueries({ queryKey: ["my-contracts"] });
      toast.success("Proposal accepted — contract created");
    },
    onError: (e) => toast.error(getJobError(e)),
  });
}
