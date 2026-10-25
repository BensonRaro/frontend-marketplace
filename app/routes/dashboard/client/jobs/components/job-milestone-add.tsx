// JobMilestoneAdd — owner adds a milestone to an open job (title + USD)
import { useState } from "react";
import { Plus, DollarSign, Loader2 } from "lucide-react";
import { useCreateMilestone } from "@/lib/hooks/use-milestones";

export function JobMilestoneAdd({ jobId }: { jobId: string }) {
  const m = useCreateMilestone(jobId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ title, amount: Number(amount) }, { onSuccess: () => { setTitle(""); setAmount(""); setOpen(false); } });
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="cursor-pointer mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50">
        <Plus className="h-3.5 w-3.5" /> Add milestone
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 flex gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} maxLength={100} placeholder="Milestone title" className="min-w-0 flex-1 rounded-lg border border-zinc-100 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
      <div className="relative w-28 shrink-0">
        <DollarSign className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} required type="number" min={5} max={100000} placeholder="500" className="w-full rounded-lg border border-zinc-100 bg-white py-1.5 pl-7 pr-2 text-xs outline-none focus:border-primary" />
      </div>
      <button disabled={m.isPending} className="cursor-pointer shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="cursor-pointer shrink-0 rounded-lg border border-zinc-100 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">Cancel</button>
    </form>
  );
}
