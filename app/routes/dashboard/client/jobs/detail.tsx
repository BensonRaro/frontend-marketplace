// Client Job Detail — posting hero + escrow milestones + received proposals (light-only)
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Pencil, Power, Handshake, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useJob, useUpdateJob, isJobFunded } from "@/lib/hooks/use-jobs";
import { useFundJob } from "@/lib/hooks/use-milestones";
import { JobDetailView, money } from "@/components/globals/job/job-detail";
import { Sheet } from "@/components/ui/sheet";
import { ProposalDetail } from "@/components/globals/proposal/proposal-detail";
import { JobMilestones } from "./components/job-milestones";
import { JobMilestoneAdd } from "./components/job-milestone-add";
import { ProposalRecommendations } from "./components/proposal-recommendations";
import type { Route } from "./+types/detail";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Job Details — TalentHive" }];
}

export default function ClientJobDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useJob(id ?? "");
  const update = useUpdateJob();
  const fundJob = useFundJob();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const job = data?.data;
  const funded = job ? isJobFunded(job) : false;

  if (isLoading) return <div className="grid place-items-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  if (isError || !job) return <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center text-sm text-zinc-500">{isError ? "Failed to load job." : "Job not found."}</div>;

  const proposals = job.proposals ?? [];
  const selected = proposals.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/dashboard/client/jobs" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      {job.contract ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <Handshake className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="flex-1 text-sm text-emerald-800">This job is contracted — milestones and escrow moved to the contract.</p>
          <Link to="/dashboard/client/contracts" className="cursor-pointer shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            View contract
          </Link>
        </div>
      ) : null}

      <JobDetailView
        job={job}
        actions={
          <>
            <Link to={`/dashboard/client/jobs/${job.id}/edit`} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-zinc-100 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
            <button onClick={() => update.mutate({ id: job.id, payload: { isOpen: !job.isOpen } })} disabled={update.isPending} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-zinc-100 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 disabled:opacity-60">
              <Power className="h-3 w-3" /> {job.isOpen === false ? "Reopen" : "Close"}
            </button>
          </>
        }
        footer={
          <>
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="font-semibold">Milestone escrow</h2>
              {job.escrowStatus === "funded" ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div className="text-sm">
                    <p className="font-medium text-emerald-900">Escrow funded — {money(job.budget)} locked</p>
                    <p className="text-xs text-emerald-700">
                      {job.fundedAt ? `Funded ${new Date(job.fundedAt).toLocaleDateString()}. ` : ""}Visible to freelancers; released only on your approval.
                    </p>
                  </div>
                </div>
              ) : null}
              {!funded && job.isOpen !== false ? (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-amber-900">
                    <EyeOff className="h-4 w-4" /> Hidden from freelancers until funded
                  </p>
                  {job.budgetType === "fixed" ? (
                    <>
                      <p className="mt-1 text-xs text-amber-700">Fund the whole {money(job.budget)} budget at once, or fund milestones below one by one.</p>
                      <button onClick={() => fundJob.mutate(job.id)} disabled={fundJob.isPending} className="cursor-pointer mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
                        {fundJob.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Fund entire job — {money(job.budget)}
                      </button>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-amber-700">Hourly jobs can’t be funded as a whole — fund milestones below one by one to become visible.</p>
                  )}
                </div>
              ) : null}
              <JobMilestones jobId={job.id} milestones={job.milestones} jobFunded={job.escrowStatus === "funded"} />
              {!job.contract && job.escrowStatus !== "funded" ? <JobMilestoneAdd jobId={job.id} /> : null}
              {!job.milestones?.length && job.escrowStatus !== "funded" ? <p className="mt-2 text-xs text-zinc-400">No milestones yet — add them when posting or fund the budget directly.</p> : null}
            </div>

            <ProposalRecommendations jobId={job.id} proposals={proposals} onSelect={setSelectedId} />

            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Proposals ({proposals.length})</h2>
                <Link to="/dashboard/client/proposals" className="text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
              {proposals.length ? (
                <ul className="mt-4 space-y-3">
                  {proposals.map((p) => (
                    <li key={p.id}>
                      <button onClick={() => setSelectedId(p.id)} className="cursor-pointer block w-full rounded-xl border border-zinc-100 p-4 text-left transition hover:shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {p.freelancer?.image ? (
                            <img src={p.freelancer.image} alt={p.freelancer.name ?? "freelancer"} className="h-6 w-6 rounded-full object-cover" />
                          ) : (
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{(p.freelancer?.name ?? "F").slice(0, 2).toUpperCase()}</span>
                          )}
                          <span className="font-medium">{p.freelancer?.name ?? "Freelancer"}</span>
                          <span className="font-semibold">• {money(p.bidAmount)}</span>
                          {p.duration ? <span className="text-zinc-500">• {p.duration}d delivery</span> : null}
                          <span className="ml-auto rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium capitalize text-zinc-600">{p.status}</span>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">{p.coverLetter}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">No proposals yet — share your posting to attract freelancers.</p>
              )}
            </div>
          </>
        }
      />

      {selected ? (
        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)} title={selected.freelancer?.name ?? "Proposal"} description={`Bid on “${job.title}”`}>
          <ProposalDetail proposal={selected} jobTitle={job.title} jobId={job.id} onAccepted={() => setSelectedId(null)} />
        </Sheet>
      ) : null}
    </div>
  );
}
