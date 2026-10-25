// ChatView — contract threads sidebar + active conversation (shared client/freelancer)
import { useSearchParams } from "react-router";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { useSession } from "@/lib/hooks/use-session";
import { ThreadList } from "./thread-list";
import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";

export function ChatView() {
  const [params, setParams] = useSearchParams();
  const activeId = params.get("contractId");
  const { data: session } = useSession();
  const { data, isLoading } = useMyContracts();
  const contracts = data?.data ?? [];
  const active = contracts.find((c) => c.id === activeId) ?? null;
  const other = active ? (active.client.id === session?.user.id ? active.freelancer : active.client) : null;
  const select = (id: string) => setParams(id ? { contractId: id } : {}, { replace: true });

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {/* Threads — full view on mobile unless a conversation is open */}
      <div className={`overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm ${active ? "hidden lg:block" : ""}`}>
        <p className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold tracking-tight">Conversations</p>
        <ThreadList contracts={contracts} activeId={activeId} myId={session?.user.id} isLoading={isLoading} onSelect={select} />
      </div>
      {/* Active conversation — back to list on mobile */}
      <div className={`flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm ${active ? "" : "hidden lg:flex"}`}>
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
              <button onClick={() => select("")} aria-label="Back to conversations" className="grid h-8 w-8 cursor-pointer place-items-center rounded-xl hover:bg-zinc-50 lg:hidden">
                <ArrowLeft className="h-4 w-4" />
              </button>
              {other?.image ? (
                <img src={other.image} alt={other.name ?? "avatar"} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-white">{(other?.name ?? "?").slice(0, 2).toUpperCase()}</span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">{other?.name ?? "Unknown user"}</p>
                <p className="truncate text-xs text-zinc-500">{active.job.title}</p>
              </div>
            </div>
            <MessageList contractId={active.id} />
            <MessageComposer contractId={active.id} />
          </>
        ) : (
          <div className="grid flex-1 place-items-center px-6 py-16 text-center">
            <div>
              <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />
              <p className="mt-3 text-sm font-medium">Select a conversation</p>
              <p className="text-xs text-zinc-500">Pick a thread to start messaging in real time.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
