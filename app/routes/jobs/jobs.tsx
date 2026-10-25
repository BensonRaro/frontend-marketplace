// Public Jobs — browse funded openings with search, price, type, category, skill + pages
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { SiteHeader } from "@/components/globals/layout/site-header";
import { JobsToolbar } from "@/components/globals/table/jobs-toolbar";
import { Pagination } from "@/components/globals/table/pagination";
import { JobCard } from "@/components/globals/job/job-card";
import { useJobs } from "@/lib/hooks/use-jobs";
import type { Route } from "./+types/jobs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Browse Jobs — TalentHive" }, { name: "description", content: "Open freelance jobs with escrow protection" }];
}

const toNum = (v: string) => (v.trim() === "" || Number.isNaN(Number(v)) ? undefined : Number(v));

export default function PublicJobs() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");
  const [budgetType, setBudgetType] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => setPage(1), [debounced, category, skill, budgetType, minBudget, maxBudget]);

  const { data, isLoading, isError } = useJobs({
    search: debounced || undefined,
    category: category || undefined,
    skill: skill || undefined,
    budgetType: budgetType || undefined,
    minBudget: toNum(minBudget),
    maxBudget: toNum(maxBudget),
    page,
    limit: 9,
  });
  const jobs = data?.data ?? [];
  const pagination = data?.pagination;

  const clear = () => {
    setSearch("");
    setCategory("");
    setSkill("");
    setBudgetType("");
    setMinBudget("");
    setMaxBudget("");
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Browse jobs</h1>
          <p className="mt-1 text-sm text-zinc-500">Funded in escrow and open for proposals — {pagination?.total ?? 0} total.</p>
        </div>

        <JobsToolbar search={search} onSearch={setSearch} category={category} onCategory={setCategory} skill={skill} onSkill={setSkill} budgetType={budgetType} onBudgetType={setBudgetType} minBudget={minBudget} onMinBudget={setMinBudget} maxBudget={maxBudget} onMaxBudget={setMaxBudget} onClear={clear} />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-2xl border border-zinc-100 bg-white px-4 py-10 text-center text-sm text-red-500 shadow-sm">Couldn't load jobs — please refresh.</p>
        ) : jobs.length ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </ul>
            {pagination ? <div className="overflow-hidden rounded-2xl border border-zinc-100 shadow-sm"><Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} /></div> : null}
          </>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed bg-white px-6 py-14 text-center shadow-sm">
            <Briefcase className="h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm font-medium">No jobs match these filters</p>
            <p className="mt-1 text-xs text-zinc-500">Try widening the price range or clearing a filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}
