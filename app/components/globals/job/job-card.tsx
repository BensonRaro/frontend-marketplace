// JobCard — clickable public job posting card; client name opens the client details sheet
import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { money } from "@/components/globals/job/job-detail";
import { ClientProfileSheet } from "@/components/globals/client/client-profile-sheet";
import type { PaginatedJobs } from "@/lib/hooks/use-jobs";

export function JobCard({ job }: { job: PaginatedJobs["data"][number] }) {
  const { data: session } = useSession();
  const role = session?.user.role;
  const [clientOpen, setClientOpen] = useState(false);
  // Guests sign in; clients and freelancers each land on their own details page
  const to = !role ? "/login" : role === "client" ? `/dashboard/client/jobs/${job.id}` : `/dashboard/freelancer/jobs/${job.id}`;

  return (
    <li className="group relative rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md">
      {/* Stretched link keeps the whole card clickable without nesting interactive elements */}
      <Link to={to} aria-label={`View ${job.title}`} className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />

      {/* pointer-events-none lets clicks fall through to the link; the client button re-enables them */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col p-5">
        <div className="flex items-center gap-2 text-xs">
          {job.category?.name ? <span className="rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary">{job.category.name}</span> : null}
          <span className="ml-auto font-semibold text-zinc-900">{money(job.budget)} <span className="font-normal text-zinc-500">• {job.budgetType}</span></span>
        </div>
        <p className="mt-3 line-clamp-2 font-semibold leading-6">{job.title}</p>
        <p className="mt-1 truncate text-xs text-zinc-500">
          by{" "}
          {job.client?.id ? (
            <button
              type="button"
              onClick={() => setClientOpen(true)}
              aria-label={`View ${job.client.name ?? "client"} details`}
              className="pointer-events-auto cursor-pointer font-medium text-primary hover:underline"
            >
              {job.client.name ?? "client"}
            </button>
          ) : (
            (job.client?.name ?? "client")
          )}{" "}
          • {job._count?.proposals ?? 0} proposals
        </p>
        {job.skills.length ? (
          <p className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((s) => (
              <span key={s} className="rounded-lg bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-600">{s}</span>
            ))}
          </p>
        ) : null}
        <div className="mt-auto border-t border-zinc-100 pt-3">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
            {!role ? "Sign in to view" : role === "client" ? "View details" : "View & propose"} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {job.client?.id ? <ClientProfileSheet clientId={job.client.id} open={clientOpen} onOpenChange={setClientOpen} /> : null}
    </li>
  );
}
