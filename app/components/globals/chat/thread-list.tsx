// ThreadList — contract conversations for the chat sidebar (other party + job)
import { MessageSquare } from "lucide-react";
import type { Contract } from "@/lib/hooks/use-contracts";

type Props = {
  contracts: Contract[];
  activeId: string | null;
  myId?: string;
  isLoading: boolean;
  onSelect: (id: string) => void;
};

export function ThreadList({ contracts, activeId, myId, isLoading, onSelect }: Props) {
  if (isLoading) {
    return <div className="grid place-items-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  }
  if (!contracts.length) {
    return (
      <div className="grid place-items-center px-6 py-12 text-center">
        <MessageSquare className="h-7 w-7 text-zinc-300" />
        <p className="mt-2 text-sm font-medium">No conversations</p>
        <p className="text-xs text-zinc-500">Threads appear here once you have a contract.</p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-zinc-100">
      {contracts.map((c) => {
        const other = c.client.id === myId ? c.freelancer : c.client;
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <button onClick={() => onSelect(c.id)} className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 ${active ? "bg-primary/5" : ""}`}>
              {other.image ? (
                <img src={other.image} alt={other.name ?? "avatar"} className="h-9 w-9 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">{(other.name ?? "?").slice(0, 2).toUpperCase()}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{other.name ?? "Unknown user"}</span>
                <span className="block truncate text-xs text-zinc-500">{c.job.title}</span>
              </span>
              {active && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
