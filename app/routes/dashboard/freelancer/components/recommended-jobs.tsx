// RecommendedJobs — latest funded postings for the freelancer dashboard
import { Link } from "react-router";
import { Briefcase } from "lucide-react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { money } from "@/components/globals/job/job-detail";

export function RecommendedJobs() {
  const { data, isLoading } = useJobs({ limit: 3 });
  const jobs = data?.data.slice(0, 3) ?? [];

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Recommended jobs</h2>
        <Link to="/dashboard/freelancer/jobs" className="text-sm font-medium text-primary hover:underline">
          Browse all
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-50" />
          ))}
        </div>
      ) : jobs.length ? (
        <ul className="mt-4 divide-y divide-zinc-100">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{j.title}</p>
                <p className="text-xs text-zinc-500">{money(j.budget)} • {j.budgetType} • {j._count?.proposals ?? 0} proposals</p>
              </div>
              <Link to={`/dashboard/freelancer/jobs/${j.id}`} className="shrink-0 rounded-xl border border-zinc-100 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">
                View
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid place-items-center rounded-xl border border-dashed bg-zinc-50 px-6 py-12 text-center">
          <Briefcase className="h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium text-zinc-900">No open jobs right now</p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">Check back soon — new client postings with funded escrow appear here.</p>
        </div>
      )}
    </div>
  );
}
