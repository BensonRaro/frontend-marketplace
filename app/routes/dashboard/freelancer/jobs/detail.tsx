// Freelancer Job Detail — posting hero + funded-escrow summary + propose CTA (light-only)
import { Link, useParams } from "react-router";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { useJob, isJobFunded } from "@/lib/hooks/use-jobs";
import { JobDetailView, money } from "@/components/globals/job/job-detail";
import { ProposalSection } from "./components/proposal-section";
import type { Route } from "./+types/detail";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Job Details — TalentHive" }];
}

export default function FreelancerJobDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useJob(id ?? "");
  const job = data?.data;

  if (isLoading) return <div className="grid place-items-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  if (isError || !job) return <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center text-sm text-zinc-500">{isError ? "Failed to load job." : "Job not found."}</div>;

  const milestones = job.milestones ?? [];
  const funded = milestones.filter((m) => m.status !== "unfunded");
  const fundedTotal = funded.reduce((s, m) => s + m.amount, 0);
  const escrowTotal = milestones.reduce((s, m) => s + m.amount, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/dashboard/freelancer/jobs" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Back to Find Work
      </Link>

      <JobDetailView
        job={job}
        actions={
          <a href="#propose" className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            <FileText className="h-3.5 w-3.5" /> Submit Proposal
          </a>
        }
        footer={
          <>
          <ProposalSection jobId={job.id} isOpen={job.isOpen} funded={isJobFunded(job)} />
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="font-semibold">Escrow protection</h2>
            </div>
            {job.escrowStatus === "funded" ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <ShieldCheck className="h-4 w-4" /> Fully funded — {money(job.budget)} held in escrow until approval.
              </p>
            ) : null}
            {milestones.length ? (
              <>
                <p className="mt-2 text-sm text-zinc-600">
                  {money(fundedTotal)} of {money(escrowTotal)} funded across {milestones.length} milestone{milestones.length === 1 ? "" : "s"} ({funded.length} locked).
                </p>
                <ul className="mt-3 space-y-1.5">
                  {milestones.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 text-sm">
                      <span className="flex-1 truncate font-medium">{m.title}</span>
                      <span className="font-semibold">{money(m.amount)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${m.status === "unfunded" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{m.status}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : job.escrowStatus !== "funded" ? (
              <p className="mt-2 text-sm text-zinc-500">No milestones defined yet — the client funds escrow before work starts.</p>
            ) : null}
          </div>
          </>
        }
      />
    </div>
  );
}
