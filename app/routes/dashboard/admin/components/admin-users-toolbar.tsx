// AdminUsersToolbar — search + role/status filters for the user directory
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const roles = ["", "client", "freelancer", "admin"] as const;
const statuses = ["", "active", "banned"] as const;

type Props = {
  search: string;
  role: string;
  status: string;
  total?: number;
  onSearch: (value: string) => void;
  onRole: (value: string) => void;
  onStatus: (value: string) => void;
};

export function AdminUsersToolbar({ search, role, status, total, onSearch, onRole, onStatus }: Props) {
  const [term, setTerm] = useState(search);
  useEffect(() => setTerm(search), [search]);

  // Debounce typing so the URL (and the query) stay shareable
  useEffect(() => {
    if (term === search) return;
    const t = setTimeout(() => onSearch(term), 400);
    return () => clearTimeout(t);
  }, [term, search, onSearch]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-zinc-100 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search name, email or company…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>
      <select
        value={role}
        onChange={(e) => onRole(e.target.value)}
        className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900"
      >
        {roles.map((r) => (
          <option key={r || "all"} value={r}>{r ? r[0].toUpperCase() + r.slice(1) : "All roles"}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900"
      >
        {statuses.map((s) => (
          <option key={s || "all"} value={s}>{s === "banned" ? "Suspended" : s === "active" ? "Active" : "Any status"}</option>
        ))}
      </select>
      {total != null ? <span className="text-xs text-zinc-500">{total} account{total === 1 ? "" : "s"}</span> : null}
    </div>
  );
}
