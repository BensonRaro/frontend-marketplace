// MessageList — thread bubbles with auto-scroll (images thumbnailed, files as chips)
import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { useMessages } from "@/lib/hooks/use-messages";
import { useSession } from "@/lib/hooks/use-session";

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?|$)/i.test(url);
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageList({ contractId }: { contractId: string }) {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useMessages(contractId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = data?.data ?? [];
  const myId = session?.user.id;

  // Stick to latest on new arrivals
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoading) {
    return <div className="grid flex-1 place-items-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  }
  if (isError) {
    return <div className="grid flex-1 place-items-center px-6 py-12 text-center text-sm text-red-500">Couldn't load messages.</div>;
  }
  if (!messages.length) {
    return <div className="grid flex-1 place-items-center px-6 py-12 text-center text-sm text-zinc-500">No messages yet — say hello to start the conversation.</div>;
  }
  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.map((m) => {
        const mine = m.senderId === myId;
        return (
          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md border border-zinc-100 bg-white"}`}>
              {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
              {m.attachments.length > 0 && (
                <div className={`flex flex-wrap gap-2 ${m.body ? "mt-2" : ""}`}>
                  {m.attachments.map((u) => (
                    isImage(u) ? (
                      <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="attachment" className="h-20 w-20 rounded-xl object-cover" /></a>
                    ) : (
                      <a key={u} href={u} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium ${mine ? "bg-white/15 text-white" : "border border-zinc-100 bg-zinc-50 text-zinc-700"}`}>
                        <FileText className="h-3.5 w-3.5 shrink-0" /><span className="max-w-[140px] truncate">{u.split("/").pop() ?? "file"}</span>
                      </a>
                    )
                  ))}
                </div>
              )}
              <p className={`mt-1 text-[11px] ${mine ? "text-white/70" : "text-zinc-400"}`}>{timeOf(m.createdAt)}</p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
