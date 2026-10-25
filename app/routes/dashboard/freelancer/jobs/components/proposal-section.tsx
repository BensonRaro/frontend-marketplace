// ProposalSection — existing bid status, funded/closed gating, or submit form for this job
import { Link } from "react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { useMyProposals } from "@/lib/hooks/use-proposals";
import { money } from "@/components/globals/job/job-detail";
import { ProposalForm } from "./proposal-form";

export function ProposalSection({ jobId, isOpen, funded }: { jobId: string; isOpen: boolean; funded: boolean }) {
  const { data, isLoading } = useMyProposals();
  const existing = data?.data.find((p) => p.job.id === jobId);

  return (
    <div id="propose" className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Your proposal</h2>
      {isLoading ? (
        <div className="mt-3 h-24 animate-pulse rounded-xl bg-zinc-50" />
      ) : existing ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-emerald-900">Proposal submitted — {money(existing.bidAmount)}{existing.duration ? ` • ${existing.duration}d delivery` : ""}</p>
            <p className="text-xs capitalize text-emerald-700">Status: {existing.status}</p>
          </div>
          <Link to="/dashboard/freelancer/proposals" className="rounded-xl border border-zinc-100 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">
            Manage
          </Link>
        </div>
      ) : !isOpen ? (
        <p className="mt-2 text-sm text-zinc-500">This job is closed to new proposals.</p>
      ) : !funded ? (
        <p className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Lock className="h-4 w-4 shrink-0" /> The client hasn’t funded escrow yet — proposals open once they do.
        </p>
      ) : (
        <ProposalForm jobId={jobId} />
      )}
    </div>
  );
}
