// Client Jobs — paginated, searchable, filterable (light-only, Indigo)
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { CreateJobDialog } from "./jobs/components/create-job-dialog";
import { JobsToolbar } from "@/components/globals/table/jobs-toolbar";
import { JobsList } from "./jobs/components/jobs-list";
import { Pagination } from "@/components/globals/table/pagination";
import { useClientJobs } from "@/lib/hooks/use-jobs";
import type { Route } from "./+types/jobs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Your Jobs — TalentHive" }];
}

export default function ClientJobs() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");
  const [budgetType, setBudgetType] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => setPage(1), [debounced, category, skill, budgetType]);

  const { data, isLoading, isError, error } = useClientJobs({ search: debounced || undefined, category: category || undefined, skill: skill || undefined, budgetType: budgetType || undefined, page, limit: 6 });
  const jobs = data?.data ?? [];
  const pagination = data?.pagination;

  // Stripe Checkout return — webhook is source of truth; toast + refetch here
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get("funded") === "true") {
      toast.success(params.get("job") ? "Job funded — now visible to freelancers" : "Milestone funded — escrow locked");
      setParams({}, { replace: true });
    } else if (params.get("funding") === "cancelled") {
      toast("Funding cancelled — escrow stays unfunded");
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const clear = () => {
    setSearch("");
    setCategory("");
    setSkill("");
    setBudgetType("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-zinc-500">Manage your postings and track proposals — {pagination?.total ?? 0} total.</p>
        </div>
        <CreateJobDialog triggerLabel="New Job" />
      </div>

      <JobsToolbar search={search} onSearch={setSearch} category={category} onCategory={setCategory} skill={skill} onSkill={setSkill} budgetType={budgetType} onBudgetType={setBudgetType} onClear={clear} />

      <JobsList jobs={jobs} isLoading={isLoading} isError={isError} error={error} />

      {pagination ? <div className="overflow-hidden rounded-2xl border border-zinc-100 shadow-sm"><Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} /></div> : null}
    </div>
  );
}
