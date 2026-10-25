// ApprovalQueue — submitted milestones awaiting client approval (links to contracts)
import { Link } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { money } from "@/components/globals/job/job-detail";

export function ApprovalQueue() {
  const { data, isLoading } = useMyContracts();
  const items = (data?.data ?? []).flatMap((c) =>
    c.milestones.filter((m) => m.status === "submitted").map((m) => ({ contract: c, milestone: m })),
  );

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Awaiting approval</h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{isLoading ? "—" : items.length}</span>
      </div>
      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-50" />
          ))}
        </div>
      ) : items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map(({ contract, milestone }) => (
            <li key={milestone.id} className="rounded-xl border border-zinc-100 px-3 py-2.5">
              <p className="truncate text-sm font-medium">{milestone.title}</p>
              <p className="truncate text-xs text-zinc-500">{contract.job.title} • {contract.freelancer.name ?? "freelancer"} • {money(milestone.amount)}</p>
              <Link to="/dashboard/client/contracts" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <CheckCircle2 className="h-3.5 w-3.5" /> Review work
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-6 text-center text-xs leading-5 text-zinc-500">Nothing awaiting approval — submitted work will appear here for review.</p>
      )}
    </div>
  );
}
