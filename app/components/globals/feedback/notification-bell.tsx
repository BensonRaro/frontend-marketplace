// NotificationBell — header bell with real unread badge + inbox dropdown (client + freelancer)
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCheck } from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { chatThreadPath } from "@/lib/hooks/use-messages";
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/hooks/use-notifications";
import type { Notification } from "@/types";

// Compact relative time for the dropdown rows
function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const { data: session } = useSession();
  const { data, isLoading, isError } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const count = unread?.data.count ?? 0;
  const items = data?.data ?? [];

  // Message notifications open the chat thread; everything else just marks read
  const openItem = (n: Notification) => {
    if (!n.read) markRead.mutate(n.id);
    setOpen(false);
    const id = (n.data as { contractId?: string } | null)?.contractId;
    if (n.type === "message.created" && id) nav(chatThreadPath(session?.user.role, id));
  };

  // Close on Escape / outside click while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open ]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Notifications" aria-expanded={open} className="cursor-pointer relative grid h-9 w-9 place-items-center rounded-xl border border-zinc-100 bg-white shadow-sm">
        <Bell className="h-4 w-4 text-zinc-600" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>
      {open && (
        <div role="menu" aria-label="Notifications" className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <p className="text-sm font-semibold tracking-tight">Notifications</p>
            <button onClick={() => markAll.mutate()} disabled={count === 0} className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary disabled:opacity-40">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {isLoading && <li className="px-4 py-8 text-center text-xs text-zinc-500">Loading…</li>}
            {isError && <li className="px-4 py-8 text-center text-xs text-red-500">Couldn't load notifications.</li>}
            {!isLoading && !isError && items.length === 0 && <li className="px-4 py-8 text-center text-xs text-zinc-500">You're all caught up.</li>}
            {items.map((n) => (
              <li key={n.id}>
                <button onClick={() => openItem(n)} className={`flex w-full cursor-pointer items-start gap-2.5 px-4 py-3 text-left hover:bg-zinc-50 ${n.read ? "" : "bg-primary/5"}`}>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{n.title}</span>
                    <span className="block truncate text-xs text-zinc-500">{n.message}</span>
                    <span className="mt-0.5 block text-[11px] text-zinc-400">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
