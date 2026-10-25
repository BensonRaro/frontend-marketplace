// BrowseList — open job cards for freelancers (read-only until proposals backend lands)
import { Link } from "react-router";
import { Briefcase, Clock, DollarSign, Tag, Users } from "lucide-react";
import { ClientNameButton } from "@/components/globals/client/client-name-button";
import type { PaginatedJobs } from "@/lib/hooks/use-jobs";

export function BrowseList({ jobs, isLoading, isError, error }: { jobs: PaginatedJobs["data"]; isLoading: boolean; isError: boolean; error?: unknown }) {
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
        <h3 className="mt-4 font-semibold">No open jobs found</h3>
        <p className="mt-1 max-w-md text-sm text-zinc-500">Try adjusting search or filters — new client postings appear here daily.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="truncate text-sm font-semibold tracking-tight hover:text-primary">
            <Link to={`/dashboard/freelancer/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{job.description}</p>

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
              <Users className="h-3 w-3" /> {job._count?.proposals ?? 0} proposals
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
            <span className="text-xs text-zinc-400">Open for proposals • escrow-protected milestones</span>
            {job.client?.name ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                by <ClientNameButton clientId={job.client.id} name={job.client.name} />
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
