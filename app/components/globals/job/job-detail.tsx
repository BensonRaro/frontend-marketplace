// Shared job detail hero — title, meta, description, skills; role pages inject actions/footer
import type { ReactNode } from "react";
import { Briefcase, Clock, DollarSign, Tag, Users } from "lucide-react";
import type { JobDetail } from "@/lib/hooks/use-jobs";

export function money(cents: number, suffix = "") {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
}

export function JobDetailView({ job, actions, footer }: { job: JobDetail; actions?: ReactNode; footer?: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{job.title}</h1>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${job.isOpen === false ? "bg-zinc-100 text-zinc-600" : "bg-emerald-50 text-emerald-700"}`}>
                {job.isOpen === false ? "Closed" : "Open"}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3" /> Posted {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {job.category?.name ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-zinc-50 px-2.5 py-1">
              <Tag className="h-3 w-3" /> {job.category.name}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1">
            <DollarSign className="h-3 w-3" /> {job.budgetType === "hourly" ? money(job.budget, "/hr") : money(job.budget)} • {job.budgetType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1">
            <Users className="h-3 w-3" /> {job.proposals?.length ?? 0} proposals
          </span>
          {job.client?.name ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1">
              <Briefcase className="h-3 w-3" /> {job.client.name}
            </span>
          ) : null}
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{job.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((s) => (
            <span key={s} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              {s}
            </span>
          ))}
        </div>
      </div>

      {footer}
    </div>
  );
}
