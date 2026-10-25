// Freelancer Find Work — browse open jobs with search + filters (light-only, Indigo)
import { useState, useEffect } from "react";
import { JobsToolbar } from "@/components/globals/table/jobs-toolbar";
import { Pagination } from "@/components/globals/table/pagination";
import { useJobs } from "@/lib/hooks/use-jobs";
import { BrowseList } from "./jobs/components/browse-list";
import type { Route } from "./+types/jobs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Find Work — TalentHive" }];
}

export default function FreelancerJobs() {
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

  const { data, isLoading, isError, error } = useJobs({ search: debounced || undefined, category: category || undefined, skill: skill || undefined, budgetType: budgetType || undefined, page, limit: 6 });
  const jobs = data?.data ?? [];
  const pagination = data?.pagination;

  const clear = () => {
    setSearch("");
    setCategory("");
    setSkill("");
    setBudgetType("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Find Work</h1>
        <p className="text-sm text-zinc-500">Open jobs with escrow-protected milestones — {pagination?.total ?? 0} total.</p>
      </div>

      <JobsToolbar search={search} onSearch={setSearch} category={category} onCategory={setCategory} skill={skill} onSkill={setSkill} budgetType={budgetType} onBudgetType={setBudgetType} onClear={clear} />

      <BrowseList jobs={jobs} isLoading={isLoading} isError={isError} error={error} />

      {pagination ? <div className="overflow-hidden rounded-2xl border border-zinc-100 shadow-sm"><Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} /></div> : null}
    </div>
  );
}
