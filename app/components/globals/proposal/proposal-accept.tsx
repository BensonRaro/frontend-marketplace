// ProposalAccept — hire confirm flow (creates contract, rejects other bids)
import { useState } from "react";
import { Handshake } from "lucide-react";
import { money } from "@/components/globals/job/job-detail";
import { useAcceptProposal } from "@/lib/hooks/use-contracts";

export function ProposalAccept({ proposalId, jobId, bidAmount, freelancerName, onAccepted }: { proposalId: string; jobId: string; bidAmount: number; freelancerName: string; onAccepted?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const accept = useAcceptProposal(jobId);

  if (!confirming) {
    return (
      <div className="flex justify-end">
        <button onClick={() => setConfirming(true)} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          <Handshake className="h-4 w-4" /> Accept proposal
        </button>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
      <p className="font-medium text-emerald-900">Hire {freelancerName} for {money(bidAmount)}?</p>
      <p className="mt-1 text-xs text-emerald-700">Creates the contract, rejects other bids and moves milestones + escrow to it.</p>
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={() => setConfirming(false)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">Back</button>
        <button onClick={() => accept.mutate(proposalId, { onSuccess: () => { setConfirming(false); onAccepted?.(); } })} disabled={accept.isPending} className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {accept.isPending ? "Creating…" : "Confirm hire"}
        </button>
      </div>
    </div>
  );
}
