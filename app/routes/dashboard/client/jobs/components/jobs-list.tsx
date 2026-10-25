// JobsList — card list with edit + availability toggle + delete (client only)
import { useState } from "react";
import { Briefcase, Clock, DollarSign, Tag, Eye, EyeOff, Pencil, Power, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useUpdateJob, useDeleteJob, isJobFunded } from "@/lib/hooks/use-jobs";
import { Dialog } from "@/components/ui/dialog";
import { JobMilestones } from "./job-milestones";

type Job = {
  id: string;
  title: string;
  description: string;
  budgetType: "fixed" | "hourly";
  budget: number;
  skills: string[];
  category?: { name: string } | null;
  isOpen?: boolean;
  createdAt: string;
  _count?: { proposals: number };
  milestones?: import("@/types").Milestone[];
  escrowStatus?: string;
};

export function JobsList({ jobs, isLoading, isError, error }: { jobs: Job[]; isLoading: boolean; isError: boolean; error?: unknown }) {
  const update = useUpdateJob();
  const del = useDeleteJob();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const toDelete = jobs.find((j) => j.id === confirmId);
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <div className="h-4 w-2/3 rounded bg-zinc-100" />
            <div className="mt-3 h-3 w-full rounded bg-zinc-50" />
            <div className="mt-2 h-3 w-5/6 rounded bg-zinc-50" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    const msg = error ? (error as { message?: string })?.message ?? String(error) : "Please try again later.";
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">Failed to load jobs</p>
        <p className="text-xs text-red-500">{(msg as string).slice(0, 200)}</p>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="grid place-items-center rounded-2xl border border-zinc-100 bg-white px-6 py-16 text-center shadow-sm">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-50">
          <Briefcase className="h-6 w-6 text-zinc-400" />
        </span>
        <h3 className="mt-4 font-semibold">No jobs found</h3>
        <p className="mt-1 max-w-md text-sm text-zinc-500">Try adjusting search or filters, or create a new job.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold tracking-tight hover:text-primary">
                <Link to={`/dashboard/client/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{job.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${job.isOpen === false ? "bg-zinc-100 text-zinc-600" : "bg-emerald-50 text-emerald-700"}`}>{job.isOpen === false ? "Closed" : "Open"}</span>
              {job.escrowStatus === "funded" ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Funded</span>
              ) : null}
              <button onClick={() => update.mutate({ id: job.id, payload: { isOpen: !job.isOpen } })} disabled={update.isPending} className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${job.isOpen === false ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
                <Power className="h-3 w-3" /> {job.isOpen === false ? "Open" : "Close"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {job.category?.name ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-zinc-50 px-2.5 py-1">
                <Tag className="h-3 w-3" /> {job.category.name}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1">
              <DollarSign className="h-3 w-3" /> {job.budgetType === "hourly" ? `$${(job.budget / 100).toFixed(0)}/hr` : `$${(job.budget / 100).toLocaleString()}`} • {job.budgetType}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1">
              <Eye className="h-3 w-3" /> {job._count?.proposals ?? 0} proposals
            </span>
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 5).map((s) => (
              <span key={s} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                {s}
              </span>
            ))}
            {job.skills.length > 5 ? <span className="px-2 py-1 text-xs text-zinc-500">+{job.skills.length - 5} more</span> : null}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
            <Link to={`/dashboard/client/jobs/${job.id}/edit`} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-zinc-100 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
            <button onClick={() => setConfirmId(job.id)} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
            <span className="text-xs text-zinc-400">• {job.isOpen ? (isJobFunded(job) ? "Visible to freelancers" : "Hidden until funded") : "Hidden"}</span>
          </div>

          {job.isOpen !== false && !isJobFunded(job) ? (
            <p className="mt-3 flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <EyeOff className="h-3.5 w-3.5 shrink-0" /> Hidden from freelancers — fund escrow on the job page to make it visible.
            </p>
          ) : null}

          <JobMilestones jobId={job.id} milestones={job.milestones} jobFunded={job.escrowStatus === "funded"} />
        </div>
      ))}

      <Dialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)} title="Delete job?" description={toDelete ? `“${toDelete.title}” will be permanently deleted. Proposals will be removed. This cannot be undone.` : ""}>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmId(null)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirmId) del.mutate(confirmId, { onSuccess: () => setConfirmId(null) });
            }}
            disabled={del.isPending}
            className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {del.isPending ? "Deleting…" : "Delete job"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
