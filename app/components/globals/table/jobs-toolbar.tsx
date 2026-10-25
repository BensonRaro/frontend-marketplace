// Shared job search/filter toolbar — used by client Jobs and freelancer Find Work
import { Search, Filter, X } from "lucide-react";
import { useCategories } from "@/lib/hooks/use-categories";

type Props = {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  skill: string;
  onSkill: (v: string) => void;
  budgetType: string;
  onBudgetType: (v: string) => void;
  onClear: () => void;
  minBudget?: string;
  onMinBudget?: (v: string) => void;
  maxBudget?: string;
  onMaxBudget?: (v: string) => void;
};

export function JobsToolbar({ search, onSearch, category, onCategory, skill, onSkill, budgetType, onBudgetType, onClear, minBudget, onMinBudget, maxBudget, onMaxBudget }: Props) {
  const { data: cats } = useCategories();
  const hasFilter = !!(search || category || skill || budgetType || minBudget || maxBudget);
  const showPrice = !!onMinBudget && !!onMaxBudget;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-zinc-400" />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search by title or description…" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400" />
          {search ? (
            <button onClick={() => onSearch("")} className="cursor-pointer text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={budgetType} onChange={(e) => onBudgetType(e.target.value)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none">
            <option value="">All budgets</option>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
          </select>

          <select value={category} onChange={(e) => onCategory(e.target.value)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none">
            <option value="">All categories</option>
            {cats?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 shadow-sm">
          <Filter className="h-4 w-4 text-zinc-400" />
          <input value={skill} onChange={(e) => onSkill(e.target.value)} placeholder="Filter by skill (e.g. React)" className="w-40 bg-transparent text-sm outline-none placeholder:text-zinc-400 sm:w-48" />
        </div>

        {showPrice ? (
          <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-medium text-zinc-400">$</span>
            <input value={minBudget ?? ""} onChange={(e) => onMinBudget?.(e.target.value)} inputMode="numeric" placeholder="Min" className="w-16 bg-transparent text-sm outline-none placeholder:text-zinc-400" />
            <span className="text-zinc-300">–</span>
            <input value={maxBudget ?? ""} onChange={(e) => onMaxBudget?.(e.target.value)} inputMode="numeric" placeholder="Max" className="w-16 bg-transparent text-sm outline-none placeholder:text-zinc-400" />
          </div>
        ) : null}

        {hasFilter ? (
          <button onClick={onClear} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 py-2 text-xs font-medium shadow-sm hover:bg-zinc-50">
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
