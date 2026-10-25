// JobMilestones — escrow status per milestone + fund/remove actions (client, owner)
import { Lock, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useFundMilestone, useDeleteMilestone } from "@/lib/hooks/use-milestones";
import type { Milestone } from "@/types";

function cents(n: number) {
  return `$${(n / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function JobMilestones({ jobId, milestones, jobFunded = false }: { jobId: string; milestones?: Milestone[]; jobFunded?: boolean }) {
  const fund = useFundMilestone();
  const del = useDeleteMilestone(jobId);

  if (!milestones?.length) return null;
  const funded = milestones.filter((ms) => ms.status !== "unfunded").length;

  return (
    <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
      <p className="text-xs font-semibold tracking-wide text-zinc-500">ESCROW — {funded}/{milestones.length} FUNDED</p>
      <ul className="mt-2 space-y-1.5">
        {milestones.map((ms) => (
          <li key={ms.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-100 bg-white px-3 py-2 text-sm">
            {ms.status === "unfunded" ? <Lock className="h-3.5 w-3.5 text-amber-500" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
            <span className="min-w-0 flex-1 truncate font-medium">{ms.title}</span>
            <span className="font-semibold">{cents(ms.amount)}</span>
            {ms.status === "unfunded" ? (
              <>
                {!jobFunded ? (
                  <button onClick={() => fund.mutate(ms.id)} disabled={fund.isPending} className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
                    {fund.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Fund
                  </button>
                ) : null}
                <button onClick={() => del.mutate(ms.id)} disabled={del.isPending} aria-label={`Remove ${ms.title}`} className="cursor-pointer rounded-lg p-1 hover:bg-zinc-100 disabled:opacity-60">
                  <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-red-600" />
                </button>
              </>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-700">{ms.status}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11px] text-zinc-400">Funds are held by Stripe until work is approved. 10% platform fee applies on release.</p>
    </div>
  );
}
