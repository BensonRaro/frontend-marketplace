// ConfirmInline — compact two-step destructive confirm for inline list actions (reviews)
import { useState } from "react";

type Props = { onConfirm: () => void; pending?: boolean; label?: string; question?: string };

export function ConfirmInline({ onConfirm, pending = false, label = "Delete", question = "Delete this review?" }: Props) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className="cursor-pointer text-[11px] font-medium text-zinc-400 hover:text-red-600">
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-zinc-500">{question}</span>
      <button type="button" onClick={onConfirm} disabled={pending} className="cursor-pointer rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-700 disabled:opacity-60">
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="cursor-pointer text-[11px] font-medium text-zinc-500 hover:text-zinc-800">
        Cancel
      </button>
    </span>
  );
}
