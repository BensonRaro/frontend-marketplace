// Contract milestone rows — status pills + deliverables + role actions (submit page, approve/dispute)
import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, Flag, FileText, Link2 } from "lucide-react";
import { money } from "@/components/globals/job/job-detail";
import { useDisputeMilestone, useApproveMilestone } from "@/lib/hooks/use-milestone-lifecycle";
import { useFundMilestone } from "@/lib/hooks/use-milestones";
import { ContractMilestoneAdd } from "./contract-milestone-add";
import type { Milestone } from "@/types";

export function ContractMilestones({ contractId, milestones, viewerRole, jobFunded = false, isCompleted = false }: { contractId: string; milestones: Milestone[]; viewerRole: "client" | "freelancer"; jobFunded?: boolean; isCompleted?: boolean }) {
  const fund = useFundMilestone();
  const dispute = useDisputeMilestone();
  const approve = useApproveMilestone();
  const [confirm, setConfirm] = useState<{ id: string; action: "approve" | "dispute" } | null>(null);
  // Empty contracts still offer creation to the client — except once completed (closed books)
  // (whole-funded work needs nothing more, so the form stays hidden there)
  if (!milestones.length) return viewerRole === "client" && !jobFunded && !isCompleted ? <ContractMilestoneAdd contractId={contractId} /> : null;

  const run = (id: string, action: "approve" | "dispute") => {
    const opts = { onSuccess: () => setConfirm(null) };
    if (action === "approve") approve.mutate({ id }, opts);
    else dispute.mutate({ id }, opts);
  };

  return (
    <ul className="mt-3 space-y-1.5">
      {milestones.map((m) => (
        <li key={m.id} className="rounded-lg border border-zinc-100 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex-1 truncate font-medium">{m.title}</span>
            <span className="font-semibold">{money(m.amount)}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${m.status === "unfunded" ? "bg-zinc-100 text-zinc-600" : m.status === "funded" ? "bg-amber-50 text-amber-700" : m.status === "released" ? "bg-emerald-50 text-emerald-700" : m.status === "disputed" ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-700"}`}>{m.status}</span>
          </div>
          {viewerRole === "freelancer" && m.status === "funded" ? (
            <div className="mt-2 flex justify-end">
              <Link to={`/dashboard/freelancer/contracts/submit?contractId=${contractId}&milestoneId=${m.id}`} className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                Submit work
              </Link>
            </div>
          ) : null}
          {viewerRole === "client" && m.status === "unfunded" && !jobFunded ? (
            <div className="mt-2 flex justify-end">
              <button onClick={() => fund.mutate(m.id)} disabled={fund.isPending} className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
                {fund.isPending ? "Redirecting…" : `Fund — ${money(m.amount)}`}
              </button>
            </div>
          ) : null}
          {m.status !== "unfunded" && m.status !== "funded" && (m.deliverables?.length || m.submissionNote) ? (
            <div className="mt-2 rounded-lg bg-zinc-50 px-3 py-2">
              {m.deliverables?.length ? (
                <ul className="space-y-1">
                  {m.deliverables.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 text-xs font-medium text-primary hover:underline">
                        {/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(u) ? <FileText className="h-3 w-3 shrink-0" /> : <Link2 className="h-3 w-3 shrink-0" />}
                        <span className="truncate">{u.split("/").pop() ?? u}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              {m.submissionNote ? <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-zinc-600">{m.submissionNote}</p> : null}
            </div>
          ) : null}
          {viewerRole === "client" && m.status === "submitted" ? (
            confirm?.id === m.id ? (
              <div className="mt-2 flex items-center justify-end gap-2 text-xs">
                <span className="font-medium text-zinc-600">{confirm.action === "approve" ? `Release ${money(m.amount)} to freelancer?` : "Freeze escrow and flag a dispute?"}</span>
                <button onClick={() => setConfirm(null)} className="cursor-pointer rounded-lg border border-zinc-100 px-3 py-1.5 font-medium hover:bg-zinc-50">Back</button>
                <button onClick={() => run(m.id, confirm.action)} disabled={approve.isPending || dispute.isPending} className={`cursor-pointer rounded-lg px-4 py-1.5 font-semibold text-white disabled:opacity-60 ${confirm.action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}>Confirm</button>
              </div>
            ) : (
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={() => setConfirm({ id: m.id, action: "dispute" })} className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  <Flag className="h-3.5 w-3.5" /> Dispute
                </button>
                <button onClick={() => setConfirm({ id: m.id, action: "approve" })} className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve & release
                </button>
              </div>
            )
          ) : null}
          {m.status === "disputed" ? <p className="mt-1.5 text-xs text-red-600">Under review — release frozen until resolved.</p> : null}
          {m.status === "released" ? <p className="mt-1.5 text-xs text-emerald-600">Released to freelancer (minus 10% platform fee).</p> : null}
        </li>
      ))}
      {viewerRole === "client" && !jobFunded && !isCompleted ? <ContractMilestoneAdd contractId={contractId} /> : null}
      {jobFunded ? <p className="mt-2 text-[11px] text-zinc-400">Job fully funded — no further funding rounds.</p> : null}
    </ul>
  );
}
