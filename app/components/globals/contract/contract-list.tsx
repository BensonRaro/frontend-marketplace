// Shared contract list — other party + milestone escrow, used by both dashboards
import { Link } from "react-router";
import { Handshake } from "lucide-react";
import { money } from "@/components/globals/job/job-detail";
import { ContractMilestones } from "./contract-milestones";
import { ContractReviews } from "./contract-reviews";
import type { Contract } from "@/lib/hooks/use-contracts";

type Props = {
  contracts: Contract[];
  isLoading: boolean;
  isError: boolean;
  viewerRole: "client" | "freelancer";
  emptyHint: string;
};

export function ContractList({ contracts, isLoading, isError, viewerRole, emptyHint }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-zinc-100 bg-white" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">Failed to load contracts</p>
        <p className="text-xs text-red-500">Please try again later.</p>
      </div>
    );
  }
  if (!contracts.length) {
    return (
      <div className="grid place-items-center rounded-2xl border border-zinc-100 bg-white px-6 py-16 text-center shadow-sm">
        <Handshake className="mx-auto h-8 w-8 text-zinc-300" />
        <p className="mt-3 text-sm font-medium">No contracts yet</p>
        <p className="mt-1 text-xs text-zinc-500">{emptyHint}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {contracts.map((c) => {
        const other = viewerRole === "client" ? c.freelancer : c.client;
        const funded = c.milestones.filter((m) => m.status !== "unfunded");
        const total = c.milestones.reduce((s, m) => s + m.amount, 0);
        return (
          <li key={c.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {other.image ? (
                <img src={other.image} alt={other.name ?? "user"} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{(other.name ?? "U").slice(0, 2).toUpperCase()}</span>
              )}
              <span className="font-medium">{other.name ?? (viewerRole === "client" ? "Freelancer" : "Client")}</span>
              {c.isCompleted ? <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">Completed</span> : <span className="ml-auto rounded-full bg-sky-50 px-2.5 py-0.5 font-medium text-sky-700">Active</span>}
            </div>
            <Link to={`/dashboard/${viewerRole}/jobs/${c.job.id}`} className="mt-1 block truncate text-sm font-semibold hover:text-primary">
              {c.job.title}
            </Link>
            <p className="mt-1 text-xs text-zinc-500">
              {money(funded.reduce((s, m) => s + m.amount, 0))} of {money(total)} escrow locked • {c.milestones.length} milestone{c.milestones.length === 1 ? "" : "s"} • since {new Date(c.createdAt).toLocaleDateString()}
            </p>
            {other.isBanned ? (
              <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
                The other party on this contract is suspended, so they cannot act on it. Escrow stays locked — contact support if the work needs a hand-off.
              </p>
            ) : null}
            <ContractMilestones contractId={c.id} milestones={c.milestones} viewerRole={viewerRole} jobFunded={c.job.escrowStatus === "funded"} isCompleted={c.isCompleted} />
            <ContractReviews contractId={c.id} milestones={c.milestones} isCompleted={c.isCompleted} viewerRole={viewerRole} />
          </li>
        );
      })}
    </ul>
  );
}
