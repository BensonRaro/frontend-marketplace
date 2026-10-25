// useLiveUpdates — SSE pushes → Query invalidation + toast + sound (polling stays as fallback)
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { API_BASE } from "@/lib/api";
import { useNotificationSound } from "@/lib/hooks/use-notification-sound";
import { chatThreadPath } from "@/lib/hooks/use-messages";
import type { SessionData } from "@/lib/hooks/use-session";

// Server event → stale query keys (prefix-matched, so ["job"] covers ["job", id])
const MAP: Record<string, string[][]> = {
  "milestone.funded": [["job-milestones"], ["client-jobs"], ["job"]],
  "job.funded": [["client-jobs"], ["job"], ["jobs"]],
  "proposal.submitted": [["client-proposals"], ["job"]],
  "proposal.accepted": [["my-proposals"], ["job"]],
  "contract.created": [["my-contracts"], ["client-proposals"], ["my-proposals"], ["job"], ["client-jobs"]],
  "milestone.submitted": [["my-contracts"]],
  "milestone.disputed": [["my-contracts"]],
  "milestone.released": [["my-contracts"]],
  "client.verified": [["client-payment-status"], ["session"]],
  "freelancer.verified": [["stripe-status"], ["session"]],
  "contract.completed": [["my-contracts"]],
  "review.received": [["rating"], ["contract-reviews"]],
  "message.created": [["messages"]],
};

// Toast copy per event (mirrors backend notify titles)
const LABELS: Record<string, string> = {
  "proposal.submitted": "New proposal received",
  "proposal.accepted": "Proposal accepted",
  "contract.created": "New contract started",
  "job.funded": "Job funded",
  "milestone.funded": "Milestone funded",
  "milestone.submitted": "Work submitted for review",
  "milestone.disputed": "Milestone disputed",
  "milestone.released": "Funds released",
  "client.verified": "Payment method verified",
  "freelancer.verified": "Payouts verified",
  "contract.completed": "Contract completed",
  "review.received": "New review received",
  "message.created": "New message",
};

export function useLiveUpdates() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { play } = useNotificationSound();
  useEffect(() => {
    const src = new EventSource(`${API_BASE}/api/events/stream`, { withCredentials: true });
    const offs = Object.entries(MAP).map(([type, keys]) => {
      const fn = (e: Event) => {
        keys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
        qc.invalidateQueries({ queryKey: ["notifications"] });
        qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        // New messages get a View action into the thread; own sends stay silent
        if (type === "message.created") {
          const target = messageTarget(qc, e);
          if (!target.own) {
            play();
            toast.success((t) => (
              <span className="flex items-center gap-3 text-sm">
                <span className="font-medium">New message</span>
                {target.link && (
                  <button onClick={() => { toast.dismiss(t.id); nav(target.link as string); }} className="cursor-pointer rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                    View
                  </button>
                )}
              </span>
            ));
          }
          return;
        }
        play();
        toast.success(LABELS[type] ?? "New update");
      };
      src.addEventListener(type, fn);
      return () => src.removeEventListener(type, fn);
    });
    // Native auto-reconnect on drop; no handler needed
    return () => {
      offs.forEach((off) => off());
      src.close();
    };
  }, [qc, play, nav]);
}

// Deep-link target for an incoming message.created event (null when unlinkable)
function messageTarget(qc: ReturnType<typeof useQueryClient>, e: Event) {
  try {
    const d = JSON.parse((e as MessageEvent).data ?? "{}") as { senderId?: string; contractId?: string };
    const me = (qc.getQueryData(["session"]) as SessionData | null)?.user;
    const own = !!d.senderId && !!me?.id && d.senderId === me.id;
    const link = d.contractId ? chatThreadPath(me?.role, d.contractId) : null;
    return { own, link };
  } catch {
    return { own: false, link: null };
  }
}
