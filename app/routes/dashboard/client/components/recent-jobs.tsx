// RecentJobs — client's latest postings with live status (empty state prompts first post)
import { Link } from "react-router";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { useClientJobs } from "@/lib/hooks/use-jobs";
import { money } from "@/components/globals/job/job-detail";
import { CreateJobDialog } from "../jobs/components/create-job-dialog";

export function RecentJobs() {
  const { data, isLoading } = useClientJobs({ limit: 4 });
  const jobs = data?.data ?? [];

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Recent Jobs</h2>
        <Link to="/dashboard/client/jobs" className="text-sm font-medium text-primary hover:underline">
          View all
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
            <li key={j.id}>
              <Link to={`/dashboard/client/jobs/${j.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-zinc-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-zinc-500">{money(j.budget)} • {j.budgetType} • {j.isOpen ? "Open" : "Closed"}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-300" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 grid place-items-center rounded-xl border border-dashed bg-zinc-50 px-6 py-12 text-center">
          <Briefcase className="h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-sm font-medium text-zinc-900">No jobs yet</p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">Post your first job and get proposals from vetted freelancers within hours. Escrow protects every milestone.</p>
          <div className="mt-4">
            <CreateJobDialog triggerLabel="Create Job" />
          </div>
        </div>
      )}
    </div>
  );
}
