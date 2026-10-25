// AdminBanDialog — suspend an account with a required reason (states every consequence upfront)
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { AdminUser } from "@/lib/hooks/use-admin";

type Props = {
  user: AdminUser | null;
  open: boolean;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function AdminBanDialog({ user, open, pending = false, onOpenChange, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  // Reset the reason whenever a different account is targeted
  useEffect(() => {
    if (open) setReason("");
  }, [open, user?.id]);

  if (!user) return null;
  const valid = reason.trim().length >= 5;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Suspend ${user.name ?? user.email ?? "this account"}?`}
      description="The reason below is shown to the account owner and recorded in the audit log."
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> What happens when you suspend
          </p>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-700">
            <li>• Every write action on the account is refused (jobs, bids, messages, reviews, payments).</li>
            <li>• Pending proposals are rejected and open job postings are closed.</li>
            <li>• The account’s postings, proposals and reviews disappear from public pages.</li>
            <li>• The owner sees the reason on their dashboard and is notified.</li>
          </ul>
        </div>

        {user.activeContracts > 0 ? (
          <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700">
            {user.activeContracts} active contract{user.activeContracts === 1 ? "" : "s"} involve this account. Escrow stays locked and the other
            party is notified — existing milestones are not released automatically.
          </p>
        ) : null}

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Reason</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Explain what happened and what needs to change…"
            className="mt-2 w-full resize-none rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
          <span className="mt-1 block text-[11px] text-zinc-400">At least 5 characters — the account owner sees this text.</span>
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50">
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid || pending}
            onClick={() => onConfirm(reason.trim())}
            className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Suspending…" : "Suspend account"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
