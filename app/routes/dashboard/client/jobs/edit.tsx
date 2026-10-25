// Edit Job — pre-filled form + availability toggle (light-only)
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useJob, useUpdateJob } from "@/lib/hooks/use-jobs";
import { useCategories } from "@/lib/hooks/use-categories";
import { useState, useEffect } from "react";
import { X, DollarSign, Sparkles } from "lucide-react";
import type { Route } from "./+types/edit";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Edit Job — TalentHive" }];
}

export default function EditJob() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useJob(id ?? "");
  const { data: cats } = useCategories();
  const m = useUpdateJob();
  const job = data?.data;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [budget, setBudget] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setBudgetType(job.budgetType);
      setBudget(String(job.budget / 100));
      setCategoryId(job.categoryId ?? "");
      setSkills(job.skills ?? []);
      setIsOpen(job.isOpen);
    }
  }, [job]);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    m.mutate({ id, payload: { title, description, budgetType, budget: Number(budget), skills, categoryId: categoryId || undefined, isOpen } }, { onSuccess: () => nav("/dashboard/client/jobs") });
  };

  if (isLoading) return <div className="grid place-items-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  if (!job) return <div className="p-6 text-center text-sm text-zinc-500">Job not found</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/dashboard/client/jobs" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 bg-white px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight">Edit job</h1>
          <p className="mt-1 text-sm text-zinc-500">Update details or change availability — freelancers see changes instantly.</p>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Availability</p>
              <p className="text-xs text-zinc-500">{isOpen ? "Open — freelancers can propose" : "Closed — no new proposals"}</p>
            </div>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition ${isOpen ? "bg-primary" : "bg-zinc-300"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isOpen ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">JOB TITLE</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">CATEGORY</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Select category (optional)</option>
              {cats?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">DESCRIPTION</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
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
              <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">BUDGET (USD)</label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input value={budget} onChange={(e) => setBudget(e.target.value)} required type="number" className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">SKILLS ({skills.length}/10)</label>
            <div className="flex gap-2">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="React, Node.js" className="flex-1 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <button type="button" onClick={addSkill} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 text-sm font-medium hover:bg-zinc-50">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                  {s} <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="h-3 w-3 cursor-pointer" /></button>
                </span>
              ))}
            </div>
          </div>

          <button disabled={m.isPending} className="cursor-pointer w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {m.isPending ? "Saving…" : "Save changes →"}
          </button>
        </form>
      </div>
    </div>
  );
}
