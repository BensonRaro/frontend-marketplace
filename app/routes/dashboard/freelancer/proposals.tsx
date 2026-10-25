// Freelancer Proposals — real bid list with status + withdraw (light-only)
import { useState } from "react";
import { Link } from "react-router";
import { FileText, Clock, ShieldCheck } from "lucide-react";
import { useMyProposals, useWithdrawProposal } from "@/lib/hooks/use-proposals";
import { money } from "@/components/globals/job/job-detail";
import type { Route } from "./+types/proposals";

export function meta({}: Route.MetaArgs) {
  return [{ title: "My Proposals — TalentHive" }];
}

export default function FreelancerProposals() {
  const { data, isLoading, isError } = useMyProposals();
  const withdraw = useWithdrawProposal();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const proposals = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Proposals</h1>
        <p className="text-sm text-zinc-500">Track the bids you’ve sent to clients.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-zinc-100 bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Failed to load proposals</p>
          <p className="text-xs text-red-500">Please try again later.</p>
        </div>
      ) : !proposals.length ? (
        <div className="grid place-items-center rounded-2xl border border-zinc-100 bg-white px-6 py-16 text-center shadow-sm">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <FileText className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-semibold">No proposals yet</h3>
          <p className="mt-1 max-w-md text-sm text-zinc-500">Browse open jobs and send your first bid with a cover letter, price and delivery estimate.</p>
          <div className="mt-6">
            <Link to="/dashboard/freelancer/jobs" className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
              Find Work
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-3 py-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5" /> Clients reply in ~2h
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-3 py-1.5 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Escrow-protected
            </span>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {proposals.map((p) => (
            <li key={p.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link to={`/dashboard/freelancer/jobs/${p.job.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold hover:text-primary">
                  {p.job.title}
                </Link>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${p.status === "pending" ? "bg-amber-50 text-amber-700" : p.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{p.status}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {p.job.client.name ?? "Client"} • Your bid {money(p.bidAmount)}{p.duration ? ` • ${p.duration}d delivery` : ""} • Sent {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{p.coverLetter}</p>
              {p.status === "pending" ? (
                <div className="mt-3 border-t border-zinc-100 pt-3">
                  {confirmId === p.id ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-zinc-600">Withdraw this bid?</span>
                      <button onClick={() => withdraw.mutate(p.id, { onSuccess: () => setConfirmId(null) })} disabled={withdraw.isPending} className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                        {withdraw.isPending ? "…" : "Confirm"}
                      </button>
                      <button onClick={() => setConfirmId(null)} className="cursor-pointer rounded-lg border border-zinc-100 px-3 py-1.5 font-medium hover:bg-zinc-50">Keep</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(p.id)} className="cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-600">Withdraw bid</button>
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
