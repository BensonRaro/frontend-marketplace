// Freelancer Contracts — gigs with milestone escrow
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { ContractList } from "@/components/globals/contract/contract-list";
import type { Route } from "./+types/contracts";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contracts — TalentHive" }];
}

export default function FreelancerContracts() {
  const { data, isLoading, isError } = useMyContracts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
        <p className="text-sm text-zinc-500">Track milestones, submissions and escrow releases.</p>
      </div>
      <ContractList contracts={data?.data ?? []} isLoading={isLoading} isError={isError} viewerRole="freelancer" emptyHint="When a client accepts your proposal, the contract and its milestones appear here." />
    </div>
  );
}
