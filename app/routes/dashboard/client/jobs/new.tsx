// Create Job — dedicated page /dashboard/client/jobs/new, displays card (sidebar heads here)
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "./components/job-form";
import type { Route } from "./+types/new";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Job — TalentHive" }];
}

export default function NewJob() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/dashboard/client/jobs" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 bg-white px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight">Create a new job</h1>
          <p className="mt-1 text-sm leading-5 text-zinc-500">Title, category, description, budget and skills — freelancers will start proposing with escrow protection.</p>
        </div>
        <div className="p-6">
          <JobForm />
        </div>
      </div>
    </div>
  );
}
