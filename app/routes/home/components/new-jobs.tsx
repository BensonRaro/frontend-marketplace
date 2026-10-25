// NewJobs — latest funded + open postings (teaser for the full jobs page)
import { Link } from "react-router";
import { ArrowRight, Briefcase } from "lucide-react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { JobCard } from "@/components/globals/job/job-card";

export function NewJobs() {
  const { data, isLoading, isError } = useJobs({ limit: 6 });
  const jobs = data?.data ?? [];

  return (
    <section id="new-jobs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Fresh jobs</h2>
          <p className="mt-1 text-sm text-zinc-500">Every listing is funded in escrow and open for proposals right now.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{isLoading ? "…" : `${data?.pagination.total ?? 0} open`}</span>
          <Link to="/jobs" className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-6 rounded-2xl border border-zinc-100 bg-white px-4 py-10 text-center text-sm text-red-500 shadow-sm">Couldn't load jobs — please refresh.</p>
      ) : jobs.length ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid place-items-center rounded-2xl border border-dashed bg-white px-6 py-14 text-center shadow-sm">
          <Briefcase className="h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium">No open jobs right now</p>
          <p className="mt-1 text-xs text-zinc-500">New funded postings will appear here.</p>
        </div>
      )}
    </section>
  );
}
