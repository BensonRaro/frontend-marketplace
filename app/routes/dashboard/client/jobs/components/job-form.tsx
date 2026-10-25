// JobForm — all relevant job posting fields + verified-card check for payments
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Sparkles, DollarSign, X, ShieldAlert } from "lucide-react";
import { useCreateJob } from "@/lib/hooks/use-jobs";
import { useCategories } from "@/lib/hooks/use-categories";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { MilestoneFields } from "./milestone-fields";
import type { MilestoneDraft } from "@/types";

export function JobForm({ onSuccess }: { onSuccess?: () => void }) {
  const nav = useNavigate();
  const { data: cats } = useCategories();
  const { verified } = useIsVerified();
  const m = useCreateJob();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [budget, setBudget] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      nav("/verify-stripe");
      return;
    }
    m.mutate(
      { title, description, budgetType, budget: Number(budget), skills, categoryId: categoryId || undefined, milestones: milestones.length ? milestones : undefined },
      {
        onSuccess: () => {
          onSuccess?.();
          if (!onSuccess) nav("/dashboard/client/jobs");
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {!verified ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ShieldAlert className="h-4 w-4" /> Verify a card to post jobs — <Link to="/verify-stripe" className="font-semibold underline">Verify now</Link>
        </div>
      ) : null}

      <div className="flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
        <Sparkles className="h-4 w-4" /> Great jobs get 3× more proposals — be specific.
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">JOB TITLE</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Build a React dashboard with Stripe escrow" maxLength={100} className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">CATEGORY</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary">
          <option value="">Select category (optional)</option>
          {cats?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">DESCRIPTION</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} placeholder="Describe deliverables, timeline, must-haves, nice-to-haves…" maxLength={5000} className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <p className="mt-1 text-right text-xs text-zinc-400">{description.length}/5000</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">BUDGET TYPE</label>
          <div className="grid grid-cols-2 gap-2">
            {(["fixed", "hourly"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setBudgetType(t)} className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-medium capitalize ${budgetType === t ? "border-primary bg-primary text-white" : "border-zinc-100 bg-white hover:bg-zinc-50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">{budgetType === "fixed" ? "TOTAL BUDGET (USD)" : "HOURLY RATE (USD)"}</label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={budget} onChange={(e) => setBudget(e.target.value)} required type="number" min={5} max={100000} placeholder={budgetType === "fixed" ? "1200" : "45"} className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">REQUIRED SKILLS ({skills.length}/10)</label>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="React, Node.js, Stripe" className="flex-1 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
          <button type="button" onClick={addSkill} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 text-sm font-medium hover:bg-zinc-50">
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {s} <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="cursor-pointer"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>

      <MilestoneFields value={milestones} onChange={setMilestones} />

      <button disabled={m.isPending || !verified} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
        {m.isPending ? "Publishing…" : !verified ? "Verify card to Publish →" : "Publish Job →"}
      </button>
      <p className="text-center text-xs text-zinc-400">Fund each milestone via Stripe escrow after posting.</p>
    </form>
  );
}
