// ProposalForm — freelancer bid: cover letter (with AI draft) + USD bid + delivery estimate
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { DollarSign, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateProposal } from "@/lib/hooks/use-proposals";
import { useIsVerified } from "@/lib/hooks/use-verification";
import { DraftButton } from "./draft-button";

export function ProposalForm({ jobId }: { jobId: string }) {
  const nav = useNavigate();
  const { verified } = useIsVerified();
  const m = useCreateProposal(jobId);
  const [coverLetter, setCoverLetter] = useState("");
  const [bid, setBid] = useState("");
  const [duration, setDuration] = useState("");
  // Kept so a bad AI draft never destroys words the freelancer already wrote
  const [previousDraft, setPreviousDraft] = useState<string | null>(null);

  // Drop the AI letter into the box, but leave the last edit one click away
  const applyDraft = (text: string) => {
    setPreviousDraft(coverLetter.trim() ? coverLetter : null);
    setCoverLetter(text);
    toast.success("Draft ready — make it yours before sending");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      nav("/verify-stripe");
      return;
    }
    m.mutate(
      { coverLetter, bidAmount: Number(bid), duration: duration ? Number(duration) : undefined },
      { onSuccess: () => nav("/dashboard/freelancer/proposals") },
    );
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-4">
      {!verified ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ShieldAlert className="h-4 w-4" /> Verify payouts to propose — <Link to="/verify-stripe" className="font-semibold underline">Verify now</Link>
        </div>
      ) : null}
      <div>
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold tracking-widest text-zinc-500">COVER LETTER</label>
          <DraftButton jobId={jobId} onDraft={applyDraft} />
        </div>
        <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required rows={7} minLength={20} maxLength={2000} placeholder="Why you're the right fit, relevant wins, how you'll deliver…" className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <div className="mt-1 flex items-center justify-between gap-3">
          {previousDraft !== null ? (
            <button type="button" onClick={() => { setCoverLetter(previousDraft); setPreviousDraft(null); }} className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-900">
              Restore my previous draft
            </button>
          ) : (
            <span />
          )}
          <p className="text-xs text-zinc-400">{coverLetter.length}/2000</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">YOUR BID (USD)</label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={bid} onChange={(e) => setBid(e.target.value)} required type="number" min={5} max={100000} placeholder="900" className="w-full rounded-xl border border-zinc-100 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold tracking-widest text-zinc-500">DELIVERY (DAYS)</label>
          <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" min={1} max={365} placeholder="14" className="w-full rounded-xl border border-zinc-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
      </div>
      <div className="flex justify-end">
        <button disabled={m.isPending || !verified} className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {m.isPending ? "Sending…" : !verified ? "Verify to Propose →" : "Send Proposal →"}
        </button>
      </div>
    </form>
  );
}
