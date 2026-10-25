// Submit Work — freelancer attaches deliverables (files/links) + note for a funded milestone
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Link2, X, FileText } from "lucide-react";
import { useMyContracts } from "@/lib/hooks/use-contracts";
import { useSubmitMilestone } from "@/lib/hooks/use-milestone-lifecycle";
import { useSession } from "@/lib/hooks/use-session";
import { UploadField } from "@/components/globals/upload/upload-field";
import { money } from "@/components/globals/job/job-detail";
import type { Route } from "./+types/submit";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Submit Work — TalentHive" }];
}

export default function SubmitWork() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const contractId = params.get("contractId") ?? "";
  const milestoneId = params.get("milestoneId") ?? "";
  const { data: session } = useSession();
  const { data, isLoading } = useMyContracts();
  const m = useSubmitMilestone();

  const [files, setFiles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [note, setNote] = useState("");

  const contract = data?.data.find((c) => c.id === contractId) ?? null;
  const milestone = contract?.milestones.find((ms) => ms.id === milestoneId) ?? null;
  const mine = contract && session?.user ? contract.freelancer.id === session.user.id : false;

  const addLink = () => {
    const v = linkInput.trim();
    if (!v || links.includes(v) || links.length + files.length >= 5) return;
    setLinks([...links, v.startsWith("http") ? v : `https://${v}`]);
    setLinkInput("");
  };
  const deliverables = [...files, ...links];
  const ready = deliverables.length > 0 || note.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    m.mutate({ id: milestoneId, deliverables, note: note.trim() || undefined }, { onSuccess: () => nav("/dashboard/freelancer/contracts") });
  };

  if (isLoading) return <div className="grid place-items-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" /></div>;
  if (!contract || !milestone || !mine) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <BackLink />
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center text-sm text-zinc-500">Work not found or not assigned to you.</div>
      </div>
    );
  }
  if (milestone.status !== "funded") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <BackLink />
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center text-sm text-zinc-500">
          Already <span className="font-medium capitalize">{milestone.status}</span> — only funded milestones accept submissions.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink />
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight">Submit work</h1>
        <p className="mt-1 text-sm text-zinc-500">{milestone.title} • {money(milestone.amount)} • {contract.job.title} for {contract.client.name ?? "client"}</p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">FILES ({files.length}/5 total with links)</label>
          <UploadField endpoint="deliverableUploader" accept=".zip,.pdf,.png,.jpg,.jpeg,.webp,.gif" hint="ZIP, PDF or images up to 32MB — auto-upload" onFilesComplete={(f) => setFiles((prev) => [...prev, ...f.map((x) => x.url)].slice(0, 5))} />
          {files.length ? (
            <ul className="mt-2 space-y-1.5">
              {files.map((u) => (
                <li key={u} className="flex items-center gap-2 rounded-xl border border-zinc-100 px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a href={u} target="_blank" rel="noreferrer" className="flex-1 truncate font-medium text-primary hover:underline">{u.split("/").pop() ?? u}</a>
                  <button type="button" onClick={() => setFiles(files.filter((x) => x !== u))} className="cursor-pointer"><X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700" /></button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">LINKS</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())} placeholder="https://docs.google.com/… or live URL" className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <button type="button" onClick={addLink} className="cursor-pointer rounded-xl border border-zinc-100 bg-white px-4 text-sm font-medium hover:bg-zinc-50">Add</button>
          </div>
          {links.length ? (
            <ul className="mt-2 space-y-1.5">
              {links.map((u) => (
                <li key={u} className="flex items-center gap-2 rounded-xl border border-zinc-100 px-3 py-2 text-sm">
                  <Link2 className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a href={u} target="_blank" rel="noreferrer" className="flex-1 truncate font-medium text-primary hover:underline">{u}</a>
                  <button type="button" onClick={() => setLinks(links.filter((x) => x !== u))} className="cursor-pointer"><X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-700" /></button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">NOTE FOR CLIENT (OPTIONAL)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={2000} placeholder="What you delivered, how to review it, credentials if needed…" className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {!ready ? <p className="text-xs text-zinc-400">Attach a file, add a link, or write a note to enable submit.</p> : <span />}
          <button disabled={m.isPending || !ready} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {m.isPending ? "Submitting…" : "Submit work →"}
          </button>
        </div>
      </form>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/dashboard/freelancer/contracts" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
      <ArrowLeft className="h-4 w-4" /> Back to Contracts
    </Link>
  );
}
