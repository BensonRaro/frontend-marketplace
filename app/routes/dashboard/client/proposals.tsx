// Client Proposals — every bid across owned jobs, newest first (light-only)
import { useState } from "react";
import { Link } from "react-router";
import { FileText } from "lucide-react";
import { useClientProposals } from "@/lib/hooks/use-proposals";
import { money } from "@/components/globals/job/job-detail";
import { Stars } from "@/components/globals/feedback/star-rating";
import { Sheet } from "@/components/ui/sheet";
import { ProposalDetail } from "@/components/globals/proposal/proposal-detail";
import type { Route } from "./+types/proposals";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Proposals — TalentHive" }];
}

export default function ClientProposals() {
  const { data, isLoading, isError } = useClientProposals();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const proposals = data?.data ?? [];
  const selected = proposals.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Proposals</h1>
        <p className="text-sm text-zinc-500">Review freelancers who want to work with you.</p>
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
          <p className="mt-1 max-w-md text-sm text-zinc-500">Once you post a job, proposals will appear here with cover letters, bids and estimated delivery.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {proposals.map((p) => (
            <li key={p.id}>
              <button onClick={() => setSelectedId(p.id)} className="cursor-pointer block w-full rounded-2xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {p.freelancer?.image ? (
                    <img src={p.freelancer.image} alt={p.freelancer.name ?? "freelancer"} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{(p.freelancer?.name ?? "F").slice(0, 2).toUpperCase()}</span>
                  )}
                  <span className="font-medium">{p.freelancer?.name ?? "Freelancer"}</span>
                  <Stars value={p.freelancerRating?.average} count={p.freelancerRating?.count} />
                  <span className="text-zinc-400">bid</span>
                  <span className="font-semibold">{money(p.bidAmount)}</span>
                  {p.duration ? <span className="text-zinc-500">• {p.duration}d delivery</span> : null}
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 font-medium capitalize ${p.status === "pending" ? "bg-amber-50 text-amber-700" : p.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{p.status}</span>
                </div>
                <span className="mt-1 block truncate text-sm font-medium text-zinc-400">{p.job.title}</span>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{p.coverLetter}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)} title={selected.freelancer?.name ?? "Proposal"} description={`Bid on “${selected.job.title}”`}>
          <ProposalDetail proposal={selected} jobTitle={selected.job.title} jobId={selected.job.id} onAccepted={() => setSelectedId(null)} />
          <Link to={`/dashboard/client/jobs/${selected.job.id}`} className="mt-6 block rounded-xl border border-zinc-100 bg-white px-4 py-2.5 text-center text-sm font-medium hover:bg-zinc-50">
            Open job details
          </Link>
        </Sheet>
      ) : null}
    </div>
  );
}
