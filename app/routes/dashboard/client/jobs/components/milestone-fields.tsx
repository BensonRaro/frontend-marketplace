// MilestoneFields — client adds upfront milestones (title + USD amount) on job creation
import { Plus, X, DollarSign, Lock } from "lucide-react";
import { useState } from "react";
import type { MilestoneDraft } from "@/types";

export function MilestoneFields({ value, onChange }: { value: MilestoneDraft[]; onChange: (v: MilestoneDraft[]) => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const add = () => {
    const t = title.trim();
    const a = Number(amount);
    if (!t || t.length < 3 || !Number.isFinite(a) || a < 5 || a > 100000 || value.length >= 10) return;
    onChange([...value, { title: t, amount: a }]);
    setTitle("");
    setAmount("");
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">MILESTONES — FUNDED VIA ESCROW ({value.length}/10)</label>
      <div className="flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="e.g. Homepage design" maxLength={100} className="flex-1 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <div className="relative w-32">
          <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={5} max={100000} placeholder="500" className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-8 pr-2 text-sm outline-none focus:border-primary" />
        </div>
        <button type="button" onClick={add} className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-zinc-100 bg-white px-3 text-sm font-medium hover:bg-zinc-50">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      {value.length ? (
        <ul className="mt-2 space-y-1.5">
          {value.map((ms, i) => (
            <li key={`${ms.title}-${i}`} className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2 text-sm">
              <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="flex-1 truncate font-medium">{ms.title}</span>
              <span className="text-zinc-600">${ms.amount.toLocaleString()}</span>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="cursor-pointer"><X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700" /></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-xs text-zinc-400">Optional — split fixed work into milestones; you fund each via Stripe after posting.</p>
      )}
    </div>
  );
}
